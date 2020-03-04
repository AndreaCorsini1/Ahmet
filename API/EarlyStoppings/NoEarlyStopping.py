from API.EarlyStoppings.AbstractEarlyStopping import AbstractEarlyStopAlgorithm


class NoEarlyStopping(AbstractEarlyStopAlgorithm):

    def get_trials_to_stop(self, trials):
        return []