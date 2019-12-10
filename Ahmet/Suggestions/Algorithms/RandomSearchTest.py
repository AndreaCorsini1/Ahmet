"""
    Test the random module

"""
from Suggestions.Algorithms.RandomSearch import RandomSearch

if __name__ == "__main__":

    space = { 'par1': {'type': "DOUBLE",
                       'minValue': 1,
                       'maxValue': 10},
              'par2': {'type': "INTEGER",
                       'minValue': 0,
                       'maxValue': 20},
              'par3': {'type': "DISCRETE",
                       'values': [1, 2, 3, 4, 5, 6]},
              'par4': {'type': "CATEGORICAL",
                       'values': ['val1', 'val2', 'val3', 'val4']}
              }

    rs = RandomSearch()

    for i in range(10):
        msg = "Suggestion {}: ".format(i)
        print(msg, rs.get_suggestion(space))
