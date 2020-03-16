# -*- coding: utf-8 -*-
from enum import Enum, unique


@unique
class TYPE(Enum):
    """
    Define the Parameter types supported by the algorithms and models.
    Each parameter given in the input space must have one of the defined
    types.
    """
    DISCRETE = 'Discrete'          # Discrete integer or float value [1, 2, ...]
    CATEGORICAL = 'Categorical'    # String
    FLOAT = 'Float'                # Float continuous values, interval [1, 2.5]
    INTEGER = 'Integer'            # Integer values in interval [1, 10]

    def __str__(self):
        return self.value

    def __eq__(self, other):
        """Override for comparing string and enum. Django stores the name."""
        return self.name == other

    @classmethod
    def choices(cls):
        return [(field.name, field.value) for field in cls]


@unique
class STATUS(Enum):
    """
    Trial status.
    """
    PENDING = 'Pending'
    STARTED = 'Started'
    COMPLETED = 'Completed'
    STOPPED = 'Stopped'

    def __str__(self):
        return self.value

    def __eq__(self, other):
        """Override for comparing string and enum. Django stores the name."""
        return self.name == other

    @classmethod
    def choices(cls):
        return [(field.name, field.value) for field in cls]
