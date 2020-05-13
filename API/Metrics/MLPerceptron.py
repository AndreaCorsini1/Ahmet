# -*- coding: utf-8 -*-
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.metrics import accuracy_score

from API.Metrics.AbstractMetric import Metric
from API.choices import TYPE, PROBLEM


class MLPerceptron(Metric):
    """


    """
    __info__ = {
        "name": 'Multi-layer Perceptron',
        "enabled": True,
        "description": 'Multi-layer Perceptron is a supervised learning '
                       'algorithm that learns a function f(): R_m -> R_o by '
                       'training on a dataset, where m is the number of '
                       'dimensions for input and o is the number of '
                       'dimensions for output.',
        "space": {
            "Activation": ['identity', 'logistic', 'tanh', 'relu'],
            "Solver": ['lbfgs', 'sgd', 'adam'],
            "Alpha": TYPE.FLOAT.name,
            "Batch size": TYPE.INTEGER.name,
            "Learning rate": TYPE.FLOAT.name,
            "Hidden1": TYPE.INTEGER.name,
            "Hidden2": TYPE.INTEGER.name,
            "Hidden3": TYPE.INTEGER.name,
            "Hidden4": TYPE.INTEGER.name,
        },
        "supported_dataset": [PROBLEM.CLASSIFICATION.name]
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
            layers = (params['Hidden1'], params['Hidden2'],
                      params['Hidden3'], params['Hidden4'])
            model = MLPClassifier(hidden_layer_sizes=layers,
                                  activation=params['Activation'],
                                  solver=params['Solver'],
                                  alpha=params['Alpha'],
                                  batch_size=params['Batch size'],
                                  learning_rate_init=params['Learning rate'])
        else:
            raise ValueError("Unsupported dataset type {}"
                             .format(self.dataset_type))

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

        return {
            'score': accuracy_score(self.Y_test, Y_pred),
            'matrix': confusion_matrix(self.Y_test, Y_pred).tolist(),
            'report': classification_report(self.Y_test, Y_pred,
                                            target_names=self.labels,
                                            zero_division=1)
        }
