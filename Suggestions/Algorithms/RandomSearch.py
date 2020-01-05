"""
    Random search algorithm.

    It is able to manage:
        - Double continuous values
        - Integer continuous values
        - Discrete values
        - Categorical values
"""
from Suggestions.Algorithms.Util import *

class RandomSearch :

    def __init__(self, function, configspace):
        """

        """
        self.model = function
        self.space = configspace


    def get_suggestion(self):
        """
           Get the new suggested trials with random search.
        """

        # study = Study.objects.get(name=study_name)
        # study_configuration_json = json.loads(study.study_configuration)
        # params = study_configuration_json["params"]
        # trial = Trial.create(study.name, "RandomSearchTrial")
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

        # trial.parameter_values = json.dumps(trial)
        # trial.save()

        return trial


    def run(self, budget=10):
        """

        """

        best_trial = {}
        best_value = None

        for i in range(budget):
            trial = self.get_suggestion()
            result = self.model(trial)

            # Minimize
            if not best_value or best_value > result['loss']:
                best_trial = trial
                best_value = result['loss']

            msg = "Suggestion {}: ".format(i)
            print(msg, result['loss'], trial)

        return ({'loss':best_value}, best_trial)