import random
from API.EarlyStoppings.AbstractEarlyStopping import \
    AbstractEarlyStopAlgorithm


class RandomEarlyStopping(AbstractEarlyStopAlgorithm):

    def get_trials_to_stop(self, trials):
        return [random.choice[trials]]