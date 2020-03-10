from sklearn.svm import SVC
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.metrics import accuracy_score
from API.Models.datasets import classification_dataset

from sklearn.svm import SVR
from sklearn.metrics import mean_absolute_error, mean_squared_error, max_error
from API.Models.datasets import regression_dataset

from API.Models.AbstractModel import Model


class SVM(Model):
    """
    Parameter accepted:
        - C: strength of regularization (it is inversely proportional to C).
             Must be strictly positive.
        - kernel: kernel type to be used in the algorithm. It must be one of
                  'linear', 'poly', 'rbf', 'sigmoid' and 'precomputed'
        - gamma: kernel coefficient for ‘rbf’, ‘poly’ and ‘sigmoid’.
        - coef0: independent term in kernel function. It is only significant
                 in ‘poly’ and ‘sigmoid’.

    Example:

    """

    def __init__(self, type='c', dataset_name='iris'):
        """

        :param type:
        :param dataset_name:
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

        Args:
            :param params:
        :return:
        """
        # TODO: add check on params

        if self.type == 'clf':
            model = SVC(C=float(params["C"]),
                        kernel=params['kernel'],
                        gamma=params["gamma"],
                        coef0=float(params["coef0"]))
        else:
            model = SVR(C=float(params["C"]),
                        kernel=params['kernel'],
                        gamma=params["gamma"],
                        coef0=float(params["coef0"]))

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
                                                target_names=self.labels)
            }
        else:
            result = {
                'max_error': max_error(self.Y_test, Y_pred),
                'mae': mean_absolute_error(self.Y_test, Y_pred),
                'mse': mean_squared_error(self.Y_test, Y_pred)
            }

        return result
