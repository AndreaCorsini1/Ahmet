"""
    Test the suggestion algorithm module
"""
from Suggestions.Algorithms.RandomSearch import RandomSearch
from Suggestions.Algorithms.ScatterSearch import ScatterSearch, TYPE
from Suggestions.Algorithms.GridSearch import GridSearch

def model1(config):
    """
    Function to optimize

    f(x,y,z,w) = 12x + 45y + 100z + 27w
    """

    f = 0
    params = [12, 45, 100, 27]

    for id, (_, value) in enumerate(config.items()):
        f += params[id] * value

    return {'loss': f}

space1 = { 'par1': {'type': TYPE.DISCRETE,
                   'values': [0, 10, 25, 32, 41, 52, 60]},
          'par2': {'type': TYPE.DISCRETE,
                   'values': [100, 20, 32, 124, 0, 35, 26]},
          'par3': {'type': TYPE.DISCRETE,
                   'values': [1, 2, 3, 4, 5, 6, 0]},
          'par4': {'type': TYPE.DISCRETE,
                   'values': [1223, 4322, 0, 2344, 12333]}
          }

def model2(config):
    """
    Function to optimize

    f(x,y,z,w) = -12x + 45y -100z + 27w
    """

    f = 0
    params = [-12, 45, -100, 27]

    for id, (_, value) in enumerate(config.items()):
        f += params[id] * value

    return {'loss': f}

space2 = { 'par1': {'type': TYPE.DISCRETE,
                   'values': [10, 25, 32, 41, 52, 60]},
          'par2': {'type': TYPE.DISCRETE,
                   'values': [-100, -20, 32, -124, 35, 26]},
          'par3': {'type': TYPE.DISCRETE,
                   'values': [1, 2, 3, 4, 5, 6]},
          'par4': {'type': TYPE.DISCRETE,
                   'values': [1223, 4322, 2344, 12333]}
          }

if __name__ == "__main__":
    # TODO: fix tests

    print("****************** RANDOM SEARCH *********************")
    rs = RandomSearch()
    rs.test(model1, space1)

    result, config = rs.run_test()
    print("Best configuration: ", config,
          " loss value: ", result['loss'])

    print("****************** GRID SEARCH *********************")
    rs = GridSearch()
    #rs.test(model1, space1)

    #result, config = rs.run_test()
    print("Best configuration: ", config,
          " loss value: ", result['loss'])

    print("****************** SCATTER SEARCH *********************")
    ss = ScatterSearch(model1, space1)

    result, config = ss.run()
    print("Best configuration: ", config,
          " loss value: ", result['loss'])