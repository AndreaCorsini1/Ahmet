# -*- coding: utf-8 -*-
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.metrics import accuracy_score
from sklearn.neighbors import KNeighborsRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, max_error

from API.Metrics.AbstractMetric import Metric
from API.choices import TYPE, PROBLEM


class KNeighbors(Metric):
    """
    Parameter accepted:
        - n_neighbors: integer number of nearest neighbors (K).
        - algorithm: algorithm used to compute the neighbors ('auto',
                     'ball_tree', 'kd_tree' and 'brute')
        - dist_power: power parameter for the minkowski metric (p=1 -> L1,
                      P=2 -> L2)
    """
    __info__ = {
        "name": 'K Nearest Neighbors',
        "enabled": True,
        "description": 'Instance-based learning or non-generalizing learning: '
                       'it does not attempt to construct a general internal '
                       'model, but simply stores instances of the training '
                       'data. Classification is computed from a simple majority'
                       ' vote of the nearest neighbors of each point.',
        "space": {
            "Num neighbors": TYPE.INTEGER.name,
            'Algorithm': ['auto', 'ball_tree', 'kd_tree', 'brute'],
            'Minkowski power': TYPE.INTEGER.name
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
            model = KNeighborsClassifier(
                n_neighbors=int(params["Num neighbors"]),
                algorithm=params['Algorithm'],
                p=int(params["Minkowski power"]))
        else:
            model = KNeighborsRegressor(
                n_neighbors=int(params["Num neighbors"]),
                algorithm=params['Algorithm'],
                p=int(params["Minkowski power"]))

        # train
        model.fit(self.X_train, self.Y_train)
        return model

    def evaluate(self, params):
        """
        Classify the test set of the chosen dataset and produce the result
        corresponding to the hyper-parameters given as input.

        Predict the test set of the chosen dataset and produce the result
        corresponding to the hyper-parameters given as input.

        Args:
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
