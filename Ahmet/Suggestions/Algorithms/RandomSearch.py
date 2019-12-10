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

    @staticmethod
    def get_suggestion(space):
        """
           Get the new suggested trials with random search.
        """

        # study = Study.objects.get(name=study_name)
        # study_configuration_json = json.loads(study.study_configuration)
        # params = study_configuration_json["params"]
        # trial = Trial.create(study.name, "RandomSearchTrial")
        trial = {}

        for key, param in space.items():

            if param["type"] == "DOUBLE":
                suggest_value = get_random_value(
                        param["minValue"], param["maxValue"])

            elif param["type"] == "INTEGER":
                suggest_value = get_random_int_value(
                        param["minValue"], param["maxValue"])

            elif param["type"] == "DISCRETE":
                suggest_value = get_random_item_from_list(param["values"])

            elif param["type"] == "CATEGORICAL":
                suggest_value = get_random_item_from_list(param["values"])

            else:
                raise Exception("Unsupported type of hyper-parameter")

            trial[key] = suggest_value

        # trial.parameter_values = json.dumps(trial)
        # trial.save()

        return trial