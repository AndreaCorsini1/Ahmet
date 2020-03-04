
import random


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