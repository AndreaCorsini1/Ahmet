from sklearn import datasets
from sklearn.model_selection import train_test_split


def classification_dataset(name='iris', test_size=0.33, seed=12345,
                           shuffle=True):
    """
    Load and prepare a classification dataset. The available dataset are the
    ones provided by the sklearn package (iris, digits, wine and breast cancer).

    Iris:
        - 150 samples
        - 3 labels/classes (0 = setosa, 1 = virginica and 2 = versicolor)
        - 4 features per sample
    Digits:
        - 1797 samples
        - 10 labels/classes
        - 64 features per sample (flattened 8x8 images)
    Wine:
        - 178 samples
        - 3 labels/classes
        - 13 features per sample
    Breast cancer:
        - 569 samples
        - 2 labels/classes
        - 30 features per sample

    Args:
        :param name: name of the dataset (iris, digits, wine and breast cancer)
        :param test_size: (optional) size of the test set, must be within (0, 1)
        :param seed: (optional) integer seed for reproducibility
        :param shuffle: (optional) bool value used to decide if shuffling
        should be done
            before train-test split
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
    if name.lower() == 'iris':
        data = datasets.load_iris()
    elif name.lower() == 'digits':
        data = datasets.load_digits()
    elif name.lower() == 'wine':
        data = datasets.load_wine()
    else:
        data = datasets.load_breast_cancer()

    # Get the features (X) and the labels (Y)
    X = data['data']
    Y = data['target']
    labels = data['target_names']

    # TODO: Add pre-processing for classification

    # Split after shuffling the dataset
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y,
                                                        test_size=test_size,
                                                        random_state=seed,
                                                        shuffle=shuffle)

    dataset = {
        'train': (X_train, Y_train),
        'test': (X_test, Y_test),
        'labels': labels
    }
    return dataset


def regression_dataset(name='boston', test_size=0.33, seed=12345, shuffle=True):
    """
    Load and prepare a regression dataset. The available dataset are the ones
    provided by the sklearn package (boston, diabetes and linnerud).

    Args:
        :param name: name of the dataset (boston, diabetes and linnerud)
        :param test_size: (optional) size of the test set, must be within (0, 1)
        :param seed: (optional) integer seed for reproducibility
        :param shuffle: (optional) bool value used to decide if shuffling
        should be done
            before train-test split
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
    if name.lower() == 'boston':
        data = datasets.load_boston()
    elif name.lower() == 'diabetes':
        data = datasets.load_diabetes()
    else:
        data = datasets.load_linnerud()

    # Get the features (X) and the labels (Y)
    X = data['data']
    Y = data['target']
    labels = data['target_names']

    # TODO: Add pre-processing for regression

    # Split after shuffling the dataset
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y,
                                                        test_size=test_size,
                                                        random_state=seed,
                                                        shuffle=shuffle)

    dataset = {
        'train': (X_train, Y_train),
        'test': (X_test, Y_test),
        'labels': labels
    }
    return dataset
