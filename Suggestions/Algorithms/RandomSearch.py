"""
    Random search algorithm.

    It is able to manage:
        - Double continuous values
        - Integer continuous values
        - Discrete values
        - Categorical values
"""
from Suggestions.models import Study, Trial

from Suggestions.Algorithms.Util import *
from Suggestions.Algorithms.AbstractAlgorithm import AbstractAlgorithm

import json


class RandomSearch(AbstractAlgorithm) :

    def test(self, function, configspace):
        """

        """
        self.model = function
        self.space = configspace


    def get_suggestion_test(self):
        """
           Get the new suggested trials with random search.
        """
        trial = {}

        for key, param in self.space.items():

            if param["type"] == TYPE.DOUBLE:
                suggest_value = get_random_value(
                        param["minValue"], param["maxValue"])

            elif param["type"] == TYPE.INTEGER:
                suggest_value = get_random_int_value(
                        param["minValue"], param["maxValue"])

            elif param["type"] == TYPE.DISCRETE:
                suggest_value = get_random_item_from_list(param["values"])

            elif param["type"] == TYPE.CATEGORICAL:
                suggest_value = get_random_item_from_list(param["values"])

            else:
                raise Exception("Unsupported type of hyper-parameter")

            trial[key] = suggest_value

        return trial


    def run_test(self, budget=10):
        """
            Test function for the algorithm
        """

        best_trial = {}
        best_value = None

        for i in range(budget):
            trial = self.get_suggestion_test()
            result = self.model(trial)

            # Minimize
            if not best_value or best_value > result['loss']:
                best_trial = trial
                best_value = result['loss']

            msg = "Suggestion {}: ".format(i)
            print(msg, result['loss'], trial)

        return ({'loss':best_value}, best_trial)


    def get_suggestion(self, params):
        """

        :param params:
        :return:
        """
        trial = {}

        for param in params:

            if param["type"] == TYPE.DOUBLE:
                suggested_value = get_random_value(
                        param["minValue"], param["maxValue"])

            elif param["type"] == TYPE.INTEGER:
                suggested_value = get_random_int_value(
                        param["minValue"], param["maxValue"])

            elif param["type"] == TYPE.DISCRETE:
                suggested_value = get_random_item_from_list(param["values"])

            elif param["type"] == TYPE.CATEGORICAL:
                suggested_value = get_random_item_from_list(param["values"])

            else:
                raise Exception("Unsupported type of hyper-parameter")

            trial[param["Name"]] = suggested_value

        return trial


    def run(self, study_name, budget=10):
        """

        :param study_name:
        :param budget:
        :return:
        """
        trial_list = []

        study = Study.objects.get(name=study_name)
        study_configuration_json = json.loads(study.study_configuration)
        params = study_configuration_json["params"]

        for i in range(budget):
            trial = Trial.create(study.name, "RandomSearchTrial")
            trial_values = self.get_suggestion(params)

            trial.parameter_values = json.dumps(trial_values)
            trial.save()
            trial_list.append(trial)

        return trial_list