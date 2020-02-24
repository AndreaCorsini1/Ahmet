import os
import json
import requests

from Suggestions.models import Study, Trial, TrialMetric


class AhmetClient(object):

    def __init__(self, endpoint=None):
        """

        :param endpoint:
        """
        # TODO: Read endpoint from configuration file
        if endpoint != None:
            self.endpoint = endpoint

        elif "ADVISOR_ENDPOINT" in os.environ:
            self.endpoint = os.environ.get("ADVISOR_ENDPOINT")

        else:
            self.endpoint = "http://0.0.0.0:8000"

    def create_study(self, study_name, study_configuration,
                     algorithm="RandomSearch"):
        """

        Args:
            :param study_name:
            :param study_configuration:
            :param algorithm:
        :return:
        """
        study = None
        url = "{}/suggestions/v1/studies".format(self.endpoint)
        request_data = {
            "name": study_name,
            "study_configuration": study_configuration,
            "algorithm": algorithm
        }

        response = requests.post(url, json=request_data)
        if response.ok:
            study = Study.from_dict(response.json()["data"])

        return study

    def get_or_create_study(self, study_name, study_configuration,
                            algorithm="RandomSearch"):
        """

        Args:
            :param study_name:
            :param study_configuration:
            :param algorithm:
        :return:
        """
        url = "{}/suggestion/v1/{}/exist".format(self.endpoint, study_name)
        response = requests.get(url)
        study_exist = response.json()["exist"]

        if study_exist:
            study = self.get_study_by_name(study_name)
        else:
            study = self.create_study(study_name, study_configuration, algorithm)

        return study

    def list_studies(self):
        """

        :return:
        """
        url = "{}/suggestions/v1/studies".format(self.endpoint)
        response = requests.get(url)
        studies = []

        if response.ok:
            dicts = response.json()["data"]
            for dic in dicts:
                study = Study.from_dict(dic)
                studies.append(study)

        return studies

    def get_study_by_name(self, study_name):
        """
        TODO: Support load study by configuration and name

        Args:
          :param study_name:
        :return:
        """
        study = None
        url = "{}/suggestions/v1/studies/{}".format(self.endpoint, study_name)
        response = requests.get(url)

        if response.ok:
            study = Study.from_dict(response.json()["data"])

        return study

    def get_suggestions(self, study_name, trials_number=1):
        """

        Args:
          :param study_name:
          :param trials_number:
        :return:
        """
        url = "{}/suggestions/v1/studies/{}/suggestions".format(self.endpoint,
                                                                study_name)
        request_data = { "trials_number": trials_number }
        response = requests.post(url, json=request_data)
        trials = []

        if response.ok:
            dicts = response.json()["data"]
            for dic in dicts:
                trial = Trial.from_dict(dic)
                trials.append(trial)

        return trials

    def is_study_done(self, study_name):
        """
        TODO: some problems here

        Args:
          :param study_name:
        :return:
        """
        study = self.get_study_by_name(study_name)
        is_completed = True

        if study.status == "Completed":
            return True

        trials = self.list_trials(study_name)

        if len(trials) == 0:
            return False

        for trial in trials:
            if trial.status != "Completed":
                return False

        url = "{}/suggestions/v1/studies/{}".format(self.endpoint,
                                                    trial.study_name)
        request_data = { "status": "Completed" }
        response = requests.put(url, json=request_data)

        return is_completed

    def list_trials(self, study_name):
        """

        Args:
          :param study_name:
        :return:
        """
        url = "{}/suggestions/v1/{}/trials".format(self.endpoint, study_name)
        response = requests.get(url)
        trials = []

        if response.ok:
            dicts = response.json()["data"]
            for dic in dicts:
                trial = Trial.from_dict(dic)
                trials.append(trial)

        return trials

    def list_trial_metrics(self, study_name, trial_id):
        """

        Args:
          :param study_name:
          :param trial_id:
        :return:
        """
        url = "{}/suggestions/v1/{}/{}/metrics".format(self.endpoint,
                                                       study_name, trial_id)
        response = requests.get(url)
        trial_metrics = []

        if response.ok:
            dicts = response.json()["data"]
            for dic in dicts:
                trial_metric = TrialMetric.from_dict(dic)
                trial_metrics.append(trial_metric)

        return trial_metrics

    def get_best_trial(self, study_name):
        """

        Args:
          :param study_name:
        :return:
        """
        if not self.is_study_done:
            return None

        study = self.get_study_by_name(study_name)
        study_configuration_dict = json.loads(study.study_configuration)
        study_goal = study_configuration_dict["goal"]
        trials = self.list_trials(study_name)

        best_trial = None
        best_objective_value = None

        # Get the first not null trial
        for trial in trials:
            if trial.objective_value:
                best_objective_value = trial.objective_value
                best_trial = trial
                break

        if best_trial is None:
            return None

        for trial in trials:
            if study_goal == "MAXIMIZE":
                if trial.objective_value and trial.objective_value > best_objective_value:
                    best_trial = trial
                    best_objective_value = trial.objective_value
            elif study_goal == "MINIMIZE":
                if trial.objective_value and trial.objective_value < best_objective_value:
                    best_trial = trial
                    best_objective_value = trial.objective_value
            else:
                return None

        return best_trial

    def get_trial(self, study_name, trial_id):
        """

        Args:
          :param study_name:
          :param trial_id:
        :return:
        """
        url = "{}/suggestions/v1/{}/{}".format(self.endpoint, study_name,
                                               trial_id)
        response = requests.get(url)

        trial = None
        if response.ok:
            trial = Trial.from_dict(response.json()["data"])

        return trial

    def create_trial_metric(self, study_name, trial_id, training_step,
                            objective_value):
        """

        Args:
          :param study_name:
          :param trial_id:
          :param training_step:
          :param objective_value:
        :return:
        """
        url = "{}/suggestions/v1/{}/{}/metrics".format(self.endpoint,
                                                       study_name, trial_id)
        request_data = {
            "training_step": training_step,
            "objective_value": objective_value
        }
        response = requests.post(url, json=request_data)

        trial_metric = None
        if response.ok:
            trial_metric = TrialMetric.from_dict(response.json()["data"])

        return trial_metric

    def complete_trial_with_one_metric(self, trial, metric):
        """

        Args:
          :param trial:
          :param metric:
        :return:
        """
        self.create_trial_metric(trial.study_name, trial.id, None, metric)

        url = "{}/suggestions/v1/{}/{}".format(self.endpoint, trial.study_name,
                                               trial.id)
        objective_value = metric
        request_data = {
            "status": "Completed",
            "objective_value": objective_value
        }

        response = requests.put(url, json=request_data)

        if response.ok:
            trial = Trial.from_dict(response.json()["data"])

        return trial
