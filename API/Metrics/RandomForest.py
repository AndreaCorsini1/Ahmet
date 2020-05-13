# -*- coding: utf-8 -*-
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.metrics import accuracy_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, max_error

from API.Metrics.AbstractMetric import Metric
from API.choices import TYPE, PROBLEM


class RandomForest(Metric):
    """
    Parameter accepted:
        - n_estimators: number of trees in the forest.
        - max_depth: maximum depth of the trees
        - max_features: number of features to consider when looking for a split
        - min_split: the minimum number of samples to split an internal node
    """
    __info__ = {
        "name": 'Random forest',
        "enabled": True,
        "description": 'Random forest is an ensemble algorithm, where each '
                       'tree in the ensemble is built from a sample drawn with'
                       ' replacement (i.e. a bootstrap sample) from the '
                       'training set.',
        "space": {
            "Num estimators": TYPE.INTEGER.name,
            "Max depth": TYPE.INTEGER.name,
            "Max features": TYPE.INTEGER.name,
            "Min samples split": TYPE.INTEGER.name
        },
        "supported_dataset": PROBLEM.names()
    }

    def train(self, params):
        """
        Train the model with the given hyper-parameters.

        Args:
            :param params: dictionary of hyper-parameters.
        :return:
            trained model.
        """
        for param in params:
            if param not in self.__info__['space']:
                print("Error: not supported parameters {}".format(param))

        if self.dataset_type == PROBLEM.CLASSIFICATION:
            model = RandomForestClassifier(
                n_estimators=int(params["Num estimators"]),
                max_depth=int(params['Max depth']),
                max_features=int(params["Max features"]),
                min_samples_split=int(params["Min samples split"]))
        else:
            model = RandomForestRegressor(
                n_estimators=int(params["Num estimators"]),
                max_depth=int(params['Max depth']),
                max_features=int(params["Max features"]),
                min_samples_split=int(params["Min samples split"]))

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

        if self.dataset_type == PROBLEM.CLASSIFICATION:
            return {
                'score': accuracy_score(self.Y_test, Y_pred),
                'matrix': confusion_matrix(self.Y_test, Y_pred).tolist(),
                'report': classification_report(self.Y_test, Y_pred,
                                                target_names=self.labels,
                                                zero_division=1)
            }
        else:
            return {
                'max_error': max_error(self.Y_test, Y_pred),
                'mae': mean_absolute_error(self.Y_test, Y_pred),
                'mse': mean_squared_error(self.Y_test, Y_pred)
            }
