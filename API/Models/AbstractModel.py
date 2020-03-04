import abc

class Model(object):
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def evaluate(self, params):
        """
        Evaluate the parameters configuration against the model function.

        Args:
          :param params: configuration of hyper-parameters
        :return Dictionary of metrics evaluated on the model
        """
        raise NotImplementedError