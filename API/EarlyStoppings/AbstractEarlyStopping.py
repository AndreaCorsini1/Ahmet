import abc


class AbstractEarlyStopAlgorithm(object):
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def get_trials_to_stop(self, trials, old_trials):
        """
        The method takes the trials of a study and returns a list of trials
        to stop early.

        Args:
          :param trials: list of pending trials.
          :param old_trials: list of completed trials.
        :return The array of trial objects.
        """
        raise NotImplementedError