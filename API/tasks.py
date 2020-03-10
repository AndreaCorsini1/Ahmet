import multiprocessing as mp
from traceback import print_exc

from threading import Thread
from concurrent.futures import ThreadPoolExecutor, as_completed

from API.Models.SimpleFunction import SimpleFunction
from API.Models.KNeighbors import KNeighbors
from API.Models.RandomForest import RandomForest
from API.Models.SVM import SVM

from API.EarlyStoppings.NoEarlyStopping import NoEarlyStopping
from API.EarlyStoppings.RandomEarlyStopping import RandomEarlyStopping

from API.Algorithms.GridSearch import GridSearch
from API.Algorithms.RandomSearch import RandomSearch
from API.Algorithms.ScatterSearch import ScatterSearch
from API.Algorithms.BayesianOptimization import BayesianOptimization
from API.Algorithms.Tpe import Tpe

from API.choices import TYPE, STATUS
from API.models import Parameter, Trial
from API.serializers import TrialSerializer

import json


def early_stopping(study_name):
    """

    :param study_name:
    :return:
    """
    old_trial = []
    pending_trial = []

    trials = Trial.objects.filter(study_name=study_name)
    serializer = TrialSerializer(trials, many=True)

    for trial in serializer.data:
        # TODO: started?
        if STATUS[trial['status']] is STATUS.PENDING:
            pending_trial.append(trial)
        elif STATUS[trial['status']] is STATUS.COMPLETED:
            old_trial.append(trial)

    e_stopper = RandomEarlyStopping()
    trials_to_stop = e_stopper.get_trials_to_stop(pending_trial, old_trial)

    print(trials_to_stop)
    if trials_to_stop:
        for trial in trials_to_stop:
            obj = trials.get(id=trial['id'])
            obj.status = STATUS.STOPPED.name
            obj.save()


def worker(model_name, type='c', dataset='iris', **trial):
    """

    Args:
        :param model_name:
        :param type:
        :param dataset:
        :param trial:
    :return:
    """
    if model_name == 'Svm':
        model = SVM(type=type, dataset_name=dataset)
    elif model_name == 'SimpleFunction':
        model = SimpleFunction(type=type, dataset_name=dataset)
    elif model_name == 'KNeighbors':
        model = KNeighbors(type=type, dataset_name=dataset)
    elif model_name == 'RandomForest':
        model = RandomForest(type=type, dataset_name=dataset)
    else:
        raise ValueError("Not existing model {}".format(model_name))

    results = model.evaluate(trial)
    if 'score' not in results:
        msg = "Model {} does not return score".format(trial['model'])
        raise ValueError(msg)

    #self.early_stopping(study_name)
    return results


class Suggestion(Thread):

    def __init__(self, study_name, alg_name, model_name, model_type='c',
                 dataset='iris', runs=5, budget=30, num_suggestions=10,
                 name=None, daemon=True):
        """

        Args:
            :param name:
            :param daemon:
        """
        Thread.__init__(self, name=name, daemon=daemon)

        self.study_name = study_name
        self.model_name = model_name
        self.runs = runs
        self.budget = budget
        self.num_suggestions = num_suggestions
        self.model_type = model_type
        self.dataset = dataset

        self.algorithm = self.get_algorithm(alg_name)
        self.space = self.get_space(study_name)
        self.old_trials = [json.loads(trial.parameters) for trial
                           in Trial.objects.filter(study_name=study_name)]

    def get_algorithm(self, name):
        """

        Args:
            :param name:
        :return:
        """
        if name == "RandomSearch":
            algorithm = RandomSearch()
        elif name == "GridSearch":
            algorithm = GridSearch()
        elif name == "ScatterSearch":
            algorithm = ScatterSearch()
        elif name == "BayesianOptimization":
            algorithm = BayesianOptimization()
        elif name == "TPE":
            algorithm = Tpe()
        else:
            raise ValueError("Not existing algorithm {}".format(name))

        return algorithm

    def get_space(self, study_name):
        """
        Get a dictionary of parameter name and corresponding values for a
        specific study.

        Args:
            :param study_name: study name to use for filtering the parameters
        :return:
        """
        space = Parameter.objects.filter(study_name=study_name).values()

        for param in space:

            if TYPE[param['type']] is TYPE.INTEGER:
                param['min'] = int(param['min'])
                param['max'] = int(param['max'])

            elif TYPE[param['type']] is TYPE.DISCRETE:
                param['values'] = [float(val)
                                   for val in param['values'].split(',')]

            elif TYPE[param['type']] is TYPE.CATEGORICAL:
                param['values'] = [val.strip()
                                   for val in param['values'].split(',')]

        return space

    def run(self):
        """
        Run the body of the thread asynchronously.
        This method spawns some threads and generates a bunch of suggestion
        which are evenly divided among the threads.

        The tasks given to each thread are CPU-bound.
        TODO: try to switch to process pool, better for CPU-bound tasks
        """
        with ThreadPoolExecutor(max_workers=mp.cpu_count()) as pool:

            for _ in range(self.runs):
                trials = self.algorithm.get_suggestions(self.space,
                                                        self.old_trials)

                threads = {pool.submit(worker,
                                       model_name=self.model_name,
                                       type=self.model_type,
                                       dataset=self.dataset,
                                       **trial): trial for trial in trials}

                # The threads do not finish in order, here I collect the
                # unordered results
                for thread in as_completed(threads):
                    trial = threads[thread]

                    try:
                        result = thread.result()
                    except Exception as exc:
                        print_exc()
                        print("Trial: {} generated an exception: {}".format(
                                    threads[thread], exc))
                    else:
                        # Save the evaluated trial
                        serializer = TrialSerializer(data={
                            'study_name': self.study_name,
                            'parameters': json.dumps(trial),
                            'score': result.pop('score', 0),
                            'score_info': json.dumps(result),
                            'status': STATUS.COMPLETED.name
                        })

                        if serializer.is_valid():
                            serializer.save()
                        else:
                            msg = "Internal error: {}".format(serializer.errors)
                            raise ValueError(msg)
