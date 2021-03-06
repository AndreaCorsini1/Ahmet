"""
    Random search algorithm.

    It is able to manage:
        - Double continuous values
        - Integer continuous values
        - Discrete values
        - Categorical values
"""
from API.choices import TYPE
from API.Algorithms.AbstractAlgorithm import Algorithm
import random


class RandomSearch(Algorithm):
    """


    """
    __info__ = {
        "name": 'Random search',
        "enabled": True,
        "description": 'Randomized search over parameters. Each trial is '
                       'sampled from a distribution over possible parameter '
                       'values. Continuous parameters are uniformly sampled, '
                       'while discrete ones are shuffled and picked up.',
        "supported_params": TYPE.names()
    }

    def get_suggestion(self, space):
        """
        Generate a single suggestion.

        Args:
            :param space: dictionary of parameters values from which the trials
                          are sampled
        :return:
        """
        trial = {}

        for param in space:

            if param["type"] == TYPE.FLOAT:
                value = random.uniform(param['min'], param['max'])
            elif param["type"] == TYPE.INTEGER:
                value = random.randint(param['min'], param['max'])
            elif param["type"] == TYPE.DISCRETE:
                value = random.choice(param["values"])
            elif param["type"] == TYPE.CATEGORICAL:
                value = random.choice(param["values"])
            else:
                msg = "Unsupported parameter {}".format(param['type'])
                raise Exception(msg)

            trial[param["name"]] = value

        return trial

    def get_suggestions(self, space, old_trials, num_suggestions=10, budget=50):
        """
        Generate a list of suggestions. Each suggestion is shaped as a
        dictionary of (key: value) pairs.

        Args:
            :param space: the space from which the parameter configurations
                          are sampled
            :param old_trials: list of previously generated configurations
            :param num_suggestions: maximum number of configurations
                                    produced, it might be lower
            :param budget: number of attempts for generating a single parameter
                           configuration
        :return:
            a list of sampled configurations
        """
        new_trials = []
        old_trials_params = [trial['parameters'] for trial in old_trials]

        if space:
            # Generate the parameter configurations
            for i in range(num_suggestions):

                # Attempts for generating a single tuple
                for _ in range(budget):
                    trial = self.get_suggestion(space)

                    # The new trial could have the same values of an old one or
                    # could be already generated during this run
                    if trial not in old_trials_params and trial not in new_trials:
                        new_trials.append(trial)
                        break

        return new_trials
