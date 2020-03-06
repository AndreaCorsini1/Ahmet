import random
from API.EarlyStoppings.AbstractEarlyStopping import \
    AbstractEarlyStopAlgorithm


class RandomEarlyStopping(AbstractEarlyStopAlgorithm):

    def get_trials_to_stop(self, trials, old_trials):
        """

        Args:
            :param trials:
            :param old_trials:
        :return:
        """
        if len(trials) > 1:
            return [random.choice(trials)]
        else:
            return []