# -*- coding: utf-8 -*-
from enum import Enum


class TYPE(Enum):
    """
    Define the hyper-parameter types supported by the algorithms and models.
    Each hyper-parameter given in the input space must have one of the defined
    types.
    """

    # Integer or float value
    DISCRETE = 'discrete'
    # String
    CATEGORICAL = 'categorical'
    # Double continuous values
    DOUBLE = 'double'
    # Integer continuous values
    INTEGER = 'integer'

    def __str__(self):
        return self.value

    @classmethod
    def choices(cls):
        return [(field.name, field.value) for field in cls]


class OBJECTIVE(Enum):
    """

    """
    MAXIMIZE = 1
    MINIMIZE = 2

    def __str__(self):
        return self.name

    @classmethod
    def choices(cls):
        return [(field.name, field.value) for field in cls]
