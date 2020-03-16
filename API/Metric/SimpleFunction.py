from API.Metric.AbstractModel import Model


class SimpleFunction(Model):
    """

    Example:
        params = {
            'par1': {'type': TYPE.DISCRETE,
                     'values': [0, 10, 25, 32, 41, 52, 60]},
            'par2': {'type': TYPE.DISCRETE,
                     'values': [100, 20, 32, 124, 0, 35, 26]},
            'par3': {'type': TYPE.DISCRETE,
                     'values': [1, 2, 3, 4, 5, 6, 0]},
            'par4': {'type': TYPE.DISCRETE,
                     'values': [1223, 4322, 0, 2344, 12333]}
          }

    """

    def __init__(self, type=None, dataset_name=None):
        """
        Compatibility with other models.

        Args:
            :param type:
            :param dataset_name:
        """
        pass

    def evaluate(self, params):
        """
        Function to optimize

        f(x,y,z,w) = 12x + 45y + 100z + 27w
        """

        f = 0
        terms = [12, 45, 100, 27]

        for idx, (_, value) in enumerate(params.items()):
            f += terms[idx] * value

        return {'score': f}
