# -*- coding: utf-8 -*-
from API.Metrics.AbstractMetric import Metric
from API.choices import TYPE


class SimpleFunction(Metric):
    """
    Simple function shaping a four dimensional space.
                    f(x,y,z,w) = 12x + 45y + 100z + 27w
    Example:
        space = {
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
    __info__ = {
        "name": 'Simple function',
        "enabled": True,
        "description": 'Simple function: y = 12x + 45y + 100z + 27w.',
        "space": {
            "Param1": [0, 10, 25, 32, 41, 52, 60, 130, 149, 179],
            "Param2": [100, 20, 32, 124, 0, 35, 26],
            "Param3": [1, 2, 3, 4, 5, 6, 0],
            "Param4": [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 7],
        },
        "supported_dataset": []
    }

    def evaluate(self, params):
        """
        Function to optimize:
                    f(x,y,z,w) = 12x + 45y + 100z + 27w
        """
        f = 0
        terms = [12, 45, 100, 27]

        for idx, (_, value) in enumerate(params.items()):
            f += terms[idx] * float(value)

        return {'score': f}
