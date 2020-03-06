import abc


class AbstractAlgorithm(object):
    """
        Abstract class used to define the algorithm template
    """
    __metaclass__ = abc.ABCMeta

    # List of parameter types supported
    supported_params = []

    @abc.abstractmethod
    def get_suggestions(self, space, old_trials, num_suggestions=10, budget=20):
        """
        Get a list of parameter configurations sampled from the input space.

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
        raise NotImplementedError
