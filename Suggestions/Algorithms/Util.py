
import random
from enum import Enum


class TYPE(Enum):
    """
    Define the hyper-parameter types supported by the algorithm.
    Each hyper-parameter given in the input space must have one of the defined
    types.
    """

    # Integer or float value
    DISCRETE = 1
    # String
    CATEGORICAL = 2
    # Double continuous values
    DOUBLE = 3
    # Integer continuous values
    INTEGER = 4

    def __str__(self):
        return self.name

def get_random_value(min_value, max_value):
    """
        Get the random value from given min and max values.

        Args:
          min_value: The min value.
          max_value: The max value.

        Return:
          The random value between min and max values.
        """
    return random.uniform(min_value, max_value)


def get_random_int_value(min_value, max_value):
    """
        Get the random int value from given min and max values.

        Args:
          min_value: The min value.
          max_value: The max value.

        Return:
          The random value between min and max values.
        """
    return int(random.uniform(min_value, max_value))

def get_random_item_from_list(input_list):
    """
        Get the random item from given list.

        Args:
          input_list: The list.

        Return:
          The random item.
        """
    return random.choice(input_list)