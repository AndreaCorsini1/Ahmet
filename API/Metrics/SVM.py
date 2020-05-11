from sklearn.svm import SVC
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.metrics import accuracy_score

from sklearn.svm import SVR
from sklearn.metrics import mean_absolute_error, mean_squared_error, max_error

from API.Metrics.AbstractMetric import Metric
from API.choices import TYPE

class SVM(Metric):
    """
    Parameter accepted:
        - C: strength of regularization (it is inversely proportional to C).
             Must be strictly positive.
        - kernel: kernel type to be used in the algorithm. It must be one of
                  'linear', 'poly', 'rbf', 'sigmoid'
        - gamma: kernel coefficient for ‘rbf’, ‘poly’ and ‘sigmoid’.
        - coef0: independent term in kernel function. It is only significant
                 in ‘poly’ and ‘sigmoid’.

    Example:

    """
    __info__ = {
        "name": 'Support Vector Machine',
        "enabled": True,
        "description": 'Support-vector machine constructs a hyperplane or set '
                       'of hyperplanes in a high- or infinite-dimensional '
                       'space, which can be used for classification, '
                       'regression, or other tasks like outliers detection.',
        "space": {
            "C": TYPE.INTEGER.name,
            "Kernel": ['linear', 'poly', 'rbf', 'sigmoid'],
            "Gamma": ['rbf', 'poly', 'sigmoid'],
            "Coef0": TYPE.FLOAT.name
        },
        "supported_dataset": ['classification', 'regression']
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

        if self.dataset_type == 'classification':
            model = SVC(C=float(params["C"]),
                        kernel=params["Kernel"],
                        gamma=params["Gamma"],
                        coef0=float(params["Coef0"]))
        else:
            model = SVR(C=float(params["C"]),
                        kernel=params['Kernel'],
                        gamma=params["Gamma"],
                        coef0=float(params["Coef0"]))

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

        if self.dataset_type == 'classification':
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
