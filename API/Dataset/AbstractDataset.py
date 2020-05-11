"""

--> NOTE: each new dataset must be imported in the __init__.py file, so the
    abstract class could find them with introspection.
"""
import abc


class Dataset(object):
    """
    Abstract class used to define the dataset template.
    Override the __info__ dictionary in subclasses for providing information
    about the dataset in the web app (front-end). Note that the allowed keys
    (the keys that will be displayed) are the ones reported below.
    The __sort__ option points out the way in which the dataset will be
    sorted when the information is displayed (default ordering is by name).
    """
    __metaclass__ = abc.ABCMeta
    __info__ = {
        "name": 'No name',                  # Name of the dataset
        "description": 'No description',    # Description of the dataset
        "type": 'no type'                   # Type of the dataset: regression or classification
    }
    __sort__ = "name"

    @abc.abstractmethod
    def get(self, test_size=0.33, seed=None, shuffle=True):
        """
        Load and prepare the dataset.

        Args:
            :param test_size: (optional) size of the test set, must be within (0, 1)
            :param seed: (optional) integer seed for reproducibility
            :param shuffle: (optional) bool value used to decide if shuffling
                            should be done before train-test split
        :return:
            A dictionary containing the train, test and labels for the selected
            dataset.

        Example:
            {
                'train': (X, Y),
                'test': (X, Y),
                'labels': {0: 'class1', 1: 'class2', ...}
            }
        Where labels dictionary is used to convert back the Y indices to the
        original classes.
        """
        raise NotImplementedError

    @classmethod
    def func(cls, item):
        """ Sorting function """
        return item.__info__[cls.__sort__]

    @classmethod
    def instance(cls, dataset_id):
        """
        Introspection for getting a dataset instance.

        Args:
            :param dataset_id: id of the dataset
        :return:
        """
        subclasses = cls.__subclasses__()
        for idx, dataset in enumerate(sorted(subclasses, key=cls.func)):
            if idx == dataset_id:
                return dataset()

        raise ValueError("Not existing dataset with id {}".format(dataset_id))

    @classmethod
    def dataset(cls):
        """
        Return the information about the dataset and add a unique identifier
        to each dataset.

        :return: list of __info__ dictionaries
        """
        subclasses = cls.__subclasses__()
        return [{"id": idx, **metric.__info__}
                for idx, metric in enumerate(sorted(subclasses, key=cls.func))]
