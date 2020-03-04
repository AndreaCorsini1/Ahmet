import abc


class AbstractEarlyStopAlgorithm(object):
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def get_trials_to_stop(self, trials):
        """
        Pass the trials and return the list of trials to early stop.

        Args:
          :param trials: all trials of a study.
        :return The array of trial objects.
        """
        raise NotImplementedError