"""

--> NOTE: each new metric must be imported in the __init__.py file, so the
    abstract class could find them with introspection.
"""
import abc
from API.Dataset import *

class Metric(object):
    """
    Abstract class used to define the metric template.
    Override the __info__ dictionary in subclasses for providing information
    about the metric in the web app (front-end). Note that the allowed keys
    (the keys that will be displayed) are the ones reported below.
    The __sort__ option points out the way in which the metric will be
    sorted when the information is displayed (default ordering is by name).
    """
    __metaclass__ = abc.ABCMeta
    __info__ = {
        "name": 'No name',                  # Name of the metric
        "enabled": True,                    # Is the metric available?
        "description": 'No description',    # Description of the metric
        "space": {},                        # Parameter space required by the metric
        "supported_dataset": []             # Type of supported dataset: regression and/or classification
    }
    __sort__ = "name"

    def __init__(self, dataset, test_size=0.33, seed=None, shuffle=True):
        """
        Load the dataset for the learning  models

        Args:
            :param dataset: dataset identifier
            :param test_size: (optional) size of the test set, must be within (0, 1)
            :param seed: (optional) integer seed for reproducibility
            :param shuffle: (optional) bool value used to decide if shuffling
                            should be done before train-test split
        :return:
        """
        if dataset:
            try:
                dataset = Dataset.instance(dataset)
                data = dataset.get(test_size, seed, shuffle)
            except ValueError as e:
                print(e)
                raise RuntimeError("Something wrong with dataset")

            self.dataset_type = dataset.__info__['type'].lower()
            if self.dataset_type in self.__info__['supported_dataset']:
                self.X_train, self.Y_train = data['train']
                self.X_test, self.Y_test = data['test']
                self.labels = [str(label) for label in  data['labels']]
            else:
                raise ValueError("Unsupported dataset type {}"
                                 .format(self.dataset_type))

    @abc.abstractmethod
    def evaluate(self, params):
        """
        Evaluate the parameters configuration against the model function.

        Args:
          :param params: configuration of hyper-parameters
        :return Dictionary of metrics evaluated on the model
        """
        raise NotImplementedError

    @classmethod
    def func(cls, item):
        """ Sorting function """
        return item.__info__[cls.__sort__]

    @classmethod
    def instance(cls, metric_id, dataset=None):
        """
        Introspection for getting a metric instance.

        Args:
            :param metric_id: id of the metric
        :return:
        """
        subclasses = cls.__subclasses__()
        for idx, metric in enumerate(sorted(subclasses, key=cls.func)):
            if idx == metric_id:
                return metric(dataset)

        raise ValueError("Not existing metric with id {}".format(metric_id))

    @classmethod
    def metrics(cls):
        """
        Return information about the metric and add to each one a unique
        identifier.

        :return: list of __info__ dictionaries
        """
        subclasses = cls.__subclasses__()
        return [{"id": idx, **metric.__info__}
                for idx, metric in enumerate(sorted(subclasses, key=cls.func))]
