from  API.Algorithms.AbstractAlgorithm import Algorithm


class Tpe(Algorithm):
    """
    TODO
    """
    __info__ = {
        "name": 'TPE',
        "enabled": False,
        "description": 'TPE description',
        "supported_params": []
    }

    def get_suggestions(self, space, old_trials, num_suggestions=10, budget=20):
        return []