from API.Algorithms.AbstractAlgorithm import Algorithm
from API.choices import TYPE

import random


class GridSearch(Algorithm):
    """
    Grid Search is the most basic algorithmic method for hyper-parameter
    optimisation. It’s like running nested loops on all possible values of
    your inbuilt features making combinations of them.
    The result of the algorithm is a grid, where each node is a combinations
    of the hyper-parameter values.

    In this version, I added an initial shuffle for starting to generate
    configurations from a different initial point each time the algorithm is
    called.
    """
    __info__ = {
        "name": 'Grid search',
        "enabled": True,
        "description": 'The grid search exhaustively generates candidate trials'
                       ' from a grid of parameter values. After generation, it'
                       ' randomly picks trials until its budget is exhausted',
        "supported_params": [TYPE.CATEGORICAL.name, TYPE.DISCRETE.name]
    }

    def setUp(self, space, shuffle=True):
        """
        Set up the space for making the parameter configurations with grid
        search algorithm.
        This function can shuffle the values for each parameter for fairly
        sampling (default behaviour).

        Args:
            :param space: list of parameters (id, name, type, values, ...)
            :param shuffle: shuffle the list of values for each parameter before
                            making configuration
        :return: list of names and list of values
        """
        values = []
        names = []

        if space:
            for param in space:
                # Check param type
                if param["type"] == TYPE.FLOAT or param["type"] == TYPE.INTEGER:
                    msg = "Unsupported parameter {}".format(param['type'])
                    raise Exception(msg)

                # Shuffle the list of values before making the grid
                if shuffle:
                    vls = random.sample(param['values'], len(param['values']))
                else:
                    vls = param['values']

                values.append(vls)
                names.append(param['name'])

        return names, values

    def suggestion_generator(self, names, param_values):
        """
        Generator for making combinations of values.
        Note: a parameter name in a specific place, for instance index j,
        has the corresponding values in position j of param_values.

        Args:
            :param names: list of name for each parameter
            :param param_values: list of values for each parameter
        :return dictionary of pair ('param_name': param_value)
        """
        combinations = [[]]

        # Generate all possible combinations
        for values in param_values:
            combinations = [x+[y] for x in combinations for y in values]

        # Return sequentially the combinations
        for values in combinations:
            yield dict(zip(names, values))

    def get_suggestions(self, space, old_trials, num_suggestions=10, budget=50):
        """
        Make all combinations of the parameter values and return
        num_suggestions configurations.
        NB: the function initially shuffles the values for each parameters.

        Args:
            :param space: the space from which the parameter configurations
                          are sampled
            :param old_trials: list of previously generated configurations
            :param num_suggestions: maximum number of configurations
                                    produced, it might be lower
            :param budget: number of attempts for generating a single parameter
                           configuration
        :return: a list of sampled configurations
        """
        trials = []
        names, values = self.setUp(space)
        old_trials_params = [trial['parameters'] for trial in old_trials]

        if values:
            # Create the suggestions generator
            suggestions = self.suggestion_generator(names, values)

            for _ in range(num_suggestions):

                # Attempts for generating a single new configuration
                for _ in range(budget):
                    trial = next(suggestions)

                    if trial not in old_trials_params:
                        trials.append(trial)
                        break

        return trials
