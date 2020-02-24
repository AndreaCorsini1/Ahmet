import abc


class AbstractAlgorithm(object):
    """
        Abstract class used to define the algorithm template
    """
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def get_suggestion(self, params):
        """


        Args:
          :param params: The study name.

        :return: The array of trial objects.
        """
        raise NotImplementedError

    @abc.abstractmethod
    def run(self, study_name, budget=10):
        """
        Run the algorithm body.

        The study's study_configuration is like this.
        {
            "goal": "MAXIMIZE",
            "maxTrials": 5,
            "maxParallelTrials": 1,
            "params": [
                {
                    "parameterName": "hidden1",
                    "type": "INTEGER",
                    "minValue": 40,
                    "maxValue": 400,
                    "scalingType": "LINEAR"
                }
            ]
        }

        The trial's parameter_values_ should be like this.
        {
              "hidden1": 40
        }

        Args:
            :param study_name:
            :param budget:

        :return:
        """
        raise NotImplementedError
