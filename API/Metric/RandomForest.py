from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.metrics import accuracy_score
from API.Metric.datasets import classification_dataset

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, max_error
from API.Metric.datasets import regression_dataset

from API.Metric.AbstractModel import Model


class RandomForest(Model):
    """
    Parameter accepted:
        - n_estimators: number of trees in the forest.
        - max_depth: maximum depth of the trees
        - max_features: number of features to consider when looking for a split
        - min_split: the minimum number of samples to split an internal node

    Example:

    """

    def __init__(self, type='c', dataset_name='iris'):
        """
        Model initialization.

        Args:
            :param type: problem type (c = classification, r = regression)
            :param dataset_name: name of dataset; classification: (iris,
                digits, wine, breast_cancer), regression: (boston, diabetes,
                linnerud)
        """

        if type.lower() == 'c':
            data = classification_dataset(name=dataset_name)
            self.type = 'clf'
        else:
            data = regression_dataset(name=dataset_name)
            self.type = 'reg'

        self.X_train, self.Y_train = data['train']
        self.X_test, self.Y_test = data['test']
        self.labels = [str(label) for label in  data['labels']]

    def train(self, params):
        """
        Train the model with the given hyper-parameters.

        Args:
            :param params: dictionary of hyper-parameters.
        :return:
            trained model.
        """
        # TODO: add check on params

        if self.type == 'clf':
            model = RandomForestClassifier(
                n_estimators=int(params["n_estimators"]),
                max_depth=int(params['max_depth']),
                max_features=int(params["max_features"]),
                min_samples_split=int(params["min_split"]))
        else:
            model = RandomForestRegressor(
                n_estimators=int(params["n_estimators"]),
                max_depth=int(params['max_depth']),
                max_features=int(params["max_features"]),
                min_samples_split=int(params["min_split"]))

        # train
        model.fit(self.X_train, self.Y_train)
        return model

    def evaluate(self, params):
        """
        Classify the test set of the chosen dataset and produce the result
        corresponding to the hyper-parameters given as input.

        Predict the test set of the chosen dataset and produce the result
        corresponding to the hyper-parameters given as input.

        :param params:
        :return:
        """
        model = self.train(params)
        Y_pred = model.predict(self.X_test)

        if self.type == 'clf':
            result = {
                'score': accuracy_score(self.Y_test, Y_pred),
                'matrix': confusion_matrix(self.Y_test, Y_pred).tolist(),
                'report': classification_report(self.Y_test, Y_pred,
                                                target_names=self.labels,
                                                zero_division=1)
            }
        else:
            result = {
                'max_error': max_error(self.Y_test, Y_pred),
                'mae': mean_absolute_error(self.Y_test, Y_pred),
                'mse': mean_squared_error(self.Y_test, Y_pred)
            }

        return result
