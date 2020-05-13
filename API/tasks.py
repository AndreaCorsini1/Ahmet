# -*- coding: utf-8 -*-
import traceback
from multiprocessing import cpu_count
from threading import Thread
from concurrent.futures import ThreadPoolExecutor, as_completed

from API.EarlyStoppings.NoEarlyStopping import NoEarlyStopping
from API.EarlyStoppings.RandomEarlyStopping import RandomEarlyStopping
from API.EarlyStoppings.SimilarityEarlyStopping import SimilarityEarlyStopping

from API.Algorithms import *
from API.Metrics import *

from API.choices import TYPE, STATUS
from API.models import Parameter, Trial, Study
from API.serializers import TrialSerializer, ParameterSerializer, StudySerializer


def early_stopping(trials, old_trials):
    """
    Pipeline of early stopping algorithms for detecting similar trials already
    explored or worth to explore them.

    Args:
        :param trials:
        :param old_trials:
    :return:
    """
    stopper = NoEarlyStopping()
    _ = stopper.get_trials_to_stop(trials, old_trials)

    stopper = RandomEarlyStopping()
    for trial in stopper.get_trials_to_stop(trials, old_trials):
        trials.remove(trial)
        yield trial

    stopper = SimilarityEarlyStopping()
    for trial in stopper.get_trials_to_stop(trials, old_trials):
        trials.remove(trial)
        yield trial


def worker(metric, dataset, **trial):
    """
    Evaluation worker. Take a trial and a model and evaluates the trial
    against the model.

    Args:
        :param metric: name of the model to use as a metric
        :param dataset: name of the dataset to use with the model
        :param trial: dictionary of param names and values
    :return:
    """
    metric = Metric.instance(metric, dataset)
    results = metric.evaluate(trial)
    if 'score' not in results:
        msg = "Model {} does not return score".format(trial['model'])
        raise ValueError(msg)

    return results


class Suggestion(Thread):

    def __init__(self, study_name, alg_name, metric, dataset, runs=5,
                 budget=30, num_suggestions=10, name=None, daemon=True):
        """
        Initialize the suggestion worker.

        Args:
            :param study_name: name of the study
            :param alg_name: name of the algorithm
            :param metric: name of the model to use as a metric
            :param dataset: name of the dataset to use with the model
            :param runs: how many times the algorithm is launched
            :param budget: budget available for each suggestion generation
            :param num_suggestions: number of suggestions to generate
            :param name: thread name (default None)
            :param daemon: daemon thread (the thread is killed with the app)
        """
        Thread.__init__(self, name=name, daemon=daemon)

        self.study_name = study_name
        self.model_name = metric
        self.runs = runs
        self.budget = budget
        self.num_suggestions = num_suggestions
        self.dataset = dataset

        self.algorithm = Algorithm.instance(alg_name)
        self.space = self.__space(study_name)

    def __space(self, study_name):
        """
        Get a dictionary of parameter name and corresponding values for a
        specific study.

        Args:
            :param study_name: study name to use for filtering the parameters
        :return:
        """
        data = Parameter.objects.filter(study=study_name)
        serializer = ParameterSerializer(data=data, many=True)
        space = serializer.to_representation(data)

        for param in space:
            if param['type'] == TYPE.INTEGER:
                param['min'] = int(param['min'])
                param['max'] = int(param['max'])

            elif param['type'] == TYPE.DISCRETE:
                param['values'] = [float(val) for val in param['values']]

        return space

    def __save(self, trial, result, status):
        """
        Save a trial that has been completed of stopped.

        Args:
            :param trial: trial to save as a dict of param-name: value
            :param result: result after evaluation on model of empty dict
            :param status: trial status (stopped or completed)
        """
        data = {
            'study': self.study_name,
            'parameters': trial,
            'status': status.name
        }
        if result:
            data['score'] = result.pop('score', 0)
            data['score_info'] = result

        # Save the evaluated trial
        serializer = TrialSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()

    def run(self):
        """
        Run the body of the thread asynchronously.
        This method spawns some threads and generates a bunch of suggestion
        which are evenly divided among the threads.

        The tasks given to each thread are CPU-bound.
        TODO: try to switch to process pool, better for CPU-bound tasks
        """
        with ThreadPoolExecutor(max_workers=cpu_count()) as pool:

            for _ in range(self.runs):
                # Filter only completed trials
                queryset = Trial.objects.filter(study=self.study_name)
                old_trials = TrialSerializer(queryset, many=True).data

                trials = self.algorithm.get_suggestions(self.space, old_trials)

                # Remove and save the trials to be stopped
                for trial in early_stopping(trials, old_trials):
                    self.__save(trial, {}, STATUS.STOPPED)

                threads = {pool.submit(worker,
                                       metric=self.model_name,
                                       dataset=self.dataset,
                                       **trial): trial for trial in trials}

                # The threads do not finish in order, here I collect the
                # unordered results
                for thread in as_completed(threads):
                    try:
                        result = thread.result()
                    except Exception:
                        traceback.print_exc()
                    else:
                        self.__save(threads[thread], result, STATUS.COMPLETED)

        study = Study.objects.get(name=self.study_name)
        serializer = StudySerializer()
        serializer.update(study, {'status': STATUS.COMPLETED.name})
