"""
All the algorithms supported must inherit from the abstract algorithm.
The entry-point of each algorithm is the get_suggestions method that must
be implemented by the subclass. The output of such algorithm is a list of
trials that should be evaluated against the metric chosen in the current study.

--> NOTE: each new algorithm must be imported in the __init__.py file, so the
    abstract class could find them with introspection.
"""
import abc


class Algorithm(object):
    """
    Abstract class used to define the algorithm template.
    Override the __info__ dictionary in subclasses for providing information
    about the algorithm in the web app (front-end). Note that the allowed keys
    (the keys that will be displayed) are the ones reported below.
    The __sort__ option points out the way in which the algorithms will be
    sorted when the information is displayed (default ordering is by name).
    """
    __metaclass__ = abc.ABCMeta
    __info__ = {
        "name": 'No name',                  # name of the algorithm
        "enabled": True,                    # whether or not enabled
        "description": 'No description',    # brief algorithm description
        "supported_params": []              # list of parameter types supported
    }
    __sort__ = "name"

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

    @classmethod
    def func(cls, item):
        """ Sorting function """
        return item.__info__[cls.__sort__]

    @classmethod
    def instance(cls, alg_id):
        """
        Introspection for getting an algorithm instance.
        The name of the algorithm must be the same of the class one.

        Args:
            :param alg_id: id of the algorithm
        :return:
        """
        subclasses = cls.__subclasses__()
        for idx, algorithm in enumerate(sorted(subclasses, key=cls.func)):
            if idx == alg_id:
                return algorithm()

        raise ValueError("Not existing algorithm with id {}".format(alg_id))

    @classmethod
    def algorithms(cls, ):
        """
        Find the list of algorithms and relative information.

        :return: dict of algorithm name and relative information
        """
        subclasses = cls.__subclasses__()
        return [{"id": idx, **alg.__info__}
                for idx, alg in enumerate(sorted(subclasses, key=cls.func))]
