import json
import itertools

from Suggestions.models import Study, Trial
from Suggestions.Algorithms.AbstractAlgorithm import AbstractAlgorithm


class GridSearch(AbstractAlgorithm):
    """
     TODO: Clean and improve
    """

    def get_suggestion(self, params):
        """
            Get the new suggested trials with grid search.
        """
        # [['8', '16', '32', '64'], ['sgd', 'adagrad', 'adam', 'ftrl'], ['true', 'false']]
        param_values_list = []

        for param in params:
            # Check param type
            if param["type"] == "DOUBLE" or param["type"] == "INTEGER":
                raise Exception("Grid search does not support DOUBLE and INTEGER")

            feasible_point_list = [
                value.strip() for value in param["feasiblePoints"].split(",")
            ]
            param_values_list.append(feasible_point_list)

        # Example: [('8', 'sgd', 'true'), ('8', 'sgd', 'false'), ('8', 'adagrad', 'true'), ('8', 'adagrad', 'false'), ('8', 'adam', 'true'), ('8', 'adam', 'false'), ('8', 'ftrl', 'true'), ('8', 'ftrl', 'false'), ('16', 'sgd', 'true'), ('16', 'sgd', 'false'), ('16', 'adagrad', 'true'), ('16', 'adagrad', 'false'), ('16', 'adam', 'true'), ('16', 'adam', 'false'), ('16', 'ftrl', 'true'), ('16', 'ftrl', 'false'), ('32', 'sgd', 'true'), ('32', 'sgd', 'false'), ('32', 'adagrad', 'true'), ('32', 'adagrad', 'false'), ('32', 'adam', 'true'), ('32', 'adam', 'false'), ('32', 'ftrl', 'true'), ('32', 'ftrl', 'false'), ('64', 'sgd', 'true'), ('64', 'sgd', 'false'), ('64', 'adagrad', 'true'), ('64', 'adagrad', 'false'), ('64', 'adam', 'true'), ('64', 'adam', 'false'), ('64', 'ftrl', 'true'), ('64', 'ftrl', 'false')]
        combination_values_list = list(itertools.product(*param_values_list))

        combination_list = []
        param_number = len(params)

        for combination_values in combination_values_list:
            combination_values_json = {}

            # Example: (u'8', u'sgd', u'true')
            for i in range(param_number):
                # Example: "sgd"
                combination_values_json[params[i]["Name"]] = combination_values[i]

            combination_list.append(combination_values_json)

        return combination_list


    def run(self, study_name, budget=10):
        """

        :param study_name:
        :param budget:
        :return:
        """
        return_trial_list = []

        study = Study.objects.get(name=study_name)
        study_configuration_json = json.loads(study.study_configuration)
        params = study_configuration_json["params"]

        # Example: [{"hidden2": "8", "optimizer": "sgd", "batch_normalization": "true"}, ......]
        combination_values_json = self.get_suggestion(params)
        combination_number = len(combination_values_json)

        # Compute how many grid search params have been allocated
        allocated_trials = Trial.objects.filter(study_name=study_name)
        start_index = len(allocated_trials)

        if start_index > combination_number:
            start_index = 0
        elif start_index + budget > combination_number:
            start_index = combination_number - budget

        assert combination_number >= budget
        for i in range(budget):
            trial = Trial.create(study.name, "GridSearchTrial")
            trial.parameter_values = json.dumps(
                combination_values_json[start_index + i])
            trial.save()
            return_trial_list.append(trial)

        return return_trial_list

