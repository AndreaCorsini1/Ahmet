from sklearn import datasets
from sklearn.model_selection import train_test_split
from API.Dataset.AbstractDataset import Dataset


class Boston(Dataset):
    __info__ = {
        "name": 'Boston dataset',
        "description": 'The Boston house-price data is a simple regression '
                       'dataset composed of 506 instances each having 13 '
                       'attributes.',
        "type": 'regression'
    }

    def preProcessing(self, data):
        """
        No need for pre-processing.

        Args:
            :param data:
        :return:
        """
        return data

    def get(self, test_size=0.33, seed=None, shuffle=True):
        """
        Load and prepare the Boston dataset.

        Args:
            :param test_size: (optional) size of the test set, must be within (0, 1)
            :param seed: (optional) integer seed for reproducibility
            :param shuffle: (optional) bool value used to decide if shuffling
                            should be done before train-test split
        :return:
            A dictionary containing the train, test and labels for the selected
            dataset.
        """
        data = datasets.load_boston()
        data = self.preProcessing(data)

        # Get the features (X) and the labels (Y)
        X = data['data']
        Y = data['target']
        labels = data['target_names']

        # Split after shuffling the dataset
        X_train, X_test, Y_train, Y_test = train_test_split(X, Y,
                                                            test_size=test_size,
                                                            random_state=seed,
                                                            shuffle=shuffle)
        return {
            'train': (X_train, Y_train),
            'test': (X_test, Y_test),
            'labels': labels
        }