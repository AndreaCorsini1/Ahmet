from API.Algorithms.AbstractAlgorithm import AbstractAlgorithm
from API.Algorithms.RandomSearch import RandomSearch
from API.choices import TYPE

from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import Matern
from scipy import optimize
from scipy.stats import norm

import numpy as np


class Converter(object):

    def __init__(self, space):
        """
        Initialize the converter.
        Save the sequence of labels for keeping the same output and input order
        within the dict.
        Save the table used to convert the categorical and discrete parameters.

        Args:
            :param space: input space
        """
        self.mapper = {}
        self.names = []

        for param in space:
            # Set the order for the parameters
            if param['name'] in self.names:
                raise ValueError("Duplicated name {}".format(param['name']))
            self.names.append(param['name'])

            # Construct a mapper for conversion of discrete and categorical
            if TYPE[param["type"]] is TYPE.CATEGORICAL or \
                    TYPE[param["type"]] is TYPE.DISCRETE:

                self.mapper[param['name']] = sorted(set(param['values']))

    def encode(self, trial):
        """
        Convert the input trial (in form of a dict) in an output trial (in
        form of an array), where the categorical and discrete values and
        substituted by an index.

        Args:
            :param trial: dictionary containing the parameters of the trial
        :return:
            Array of parameter values converted
        """
        trial_array = np.zeros(len(trial))

        for idx, key in enumerate(self.names):
            if key not in trial:
                raise KeyError("Missing key {} in trial {}".format(key, trial))

            # Check if param needs conversion, otherwise copy its value
            if key in self.mapper:
                trial_array[idx] = self.mapper[key].index(trial[key])
            else:
                trial_array[idx] = trial[key]

        return trial_array

    def decode(self, trial_array):
        """
        Take an input trial (in form of array) and convert back to the
        dictionary form.

        Args:
            :param trial_array: array of parameters values
        :return:

        """
        trial = {}
        for key, idx in zip(self.names, trial_array):
            if key in self.mapper:
                trial[key] = self.mapper[key][int(idx)]
            else:
                trial[key] = idx[0]

        return trial


class BayesianOptimization(AbstractAlgorithm):
    """

    """
    def __init__(self, alpha=1e-4, beta=2.6, seed=None):
        """

        Args:
            :param alpha:
            :param beta:
            :param seed:
        :return

        """
        self.beta = beta
        self.gpr = GaussianProcessRegressor(
            kernel=Matern(nu=2.5),
            n_restarts_optimizer=20,
            normalize_y=True,
            alpha=alpha,
            random_state=seed)

    def upper_confidence(self, X):
        """
        Not used for now.

        Args:
            :param X:
        :return:

        """
        x = np.asarray(X).reshape(1, -1)
        mu, sigma = self.gpr.predict(x, return_std=True)

        return mu - self.beta * sigma

    def expected_improvement(self, X, Y_train, xi=0.01):
        '''
        Computes the EI at points X based on existing samples X_sample
        and Y_sample using a Gaussian process surrogate model.

        Expected improvement is defined as

            EI(x) = max(f(x) − f(x+), 0)                                    (1)

        where f(x+) is the value of the best sample so far and x+ is the
        location of that sample i.e. x+ = argmax f(xi). The expected
        improvement can be evaluated analytically under the GP model:

            EI(x) = (μ(x) − f(x+) − ξ)Φ(Z) + σ(x)ϕ(Z)   if σ(x) > 0
            EI(x) = 0                                   if σ(x) = 0         (2)

        where

            Z = (μ(x) − f(x+) − ξ) / σ(x)               if σ(x) > 0
            Z = 0                                       if σ(x) = 0

        where μ(x) and σ(x) are the mean and the standard deviation of the GP
        posterior predictive at x, respectively. Φ and ϕ are the CDF and PDF
        of the standard normal distribution, respectively. The first summation
        term in Equation (2) is the exploitation term and second summation
        term is the exploration term.

        Args:
            :param X: Points at which EI shall be computed (m x d).
            :param Y_train: Sample values (n x 1).
            :param xi: Exploitation-exploration trade-off parameter.
        :return
            Expected improvements at points X.
        '''
        mu, sigma = self.gpr.predict(X, return_std=True)

        sigma = sigma.reshape(-1, 1)
        best_y = np.max(Y_train)

        # Silence sigma = 0
        with np.errstate(divide='warn'):
            imp = mu - best_y - xi
            Z = imp / sigma

            ei = imp * norm.cdf(Z) + sigma * norm.pdf(Z)
            ei[sigma == 0.0] = 0.0

        # Minimization problem
        return -1 * ei

    def propose_location(self, X_sample, Y_sample, bounds, num_restarts=25):
        '''
        Proposes the next sampling point by optimizing the acquisition function.

        Args:
            :param X_sample: training features.
            :param Y_sample: training labels.
            :param bounds: parameters bounds (minimum and maximum)
            :param num_restarts: number of restart points for finding the
                                 optimum.
        :return
            Array containing the features of the best sample point.
        '''
        dim = X_sample.shape[1]
        min_val = 1
        min_x = None

        # Wrapper: minimization of the negative acquisition function (EI)
        def min_obj(X):
            return self.expected_improvement(X.reshape(-1, dim), Y_sample)

        # Find the best optimum by starting from n_restart different random points.
        for x0 in np.random.uniform(bounds[:, 0], bounds[:, 1],
                                    size=(num_restarts, dim)):

            res = optimize.minimize(min_obj, x0=x0, bounds=bounds,
                                    method='L-BFGS-B')

            if res.fun < min_val:
                min_val = res.fun[0]
                min_x = res.x

        return min_x.reshape(-1, 1)

    def compute_bounds(self, space):
        """
        Compute the bounds (min and max value) for each parameter in space.
        NB: this operation must be called after the categorical and discrete
        parameters conversion for being effective.

        Args:
            :param space: parameters space (make an example of space)
        :return:
            Numpy matrix of rank (len(space), 2), where the first column is the
            minimum bound and the second column contains the maximum bound
        """
        bounds = np.zeros((len(space), 2))

        for idx, param in enumerate(space):

            if TYPE[param["type"]] is TYPE.FLOAT or \
                            TYPE[param["type"]] is TYPE.INTEGER:
                bounds[idx] = (param["min"], param["max"])

            elif TYPE[param["type"]] is TYPE.DISCRETE or \
                            TYPE[param["type"]] is TYPE.DISCRETE:
                bounds[idx] = (0, len(param['values']))

        return bounds

    def get_suggestions(self, space, old_trials, num_suggestions=10, budget=50):
        """
        Generate a list of suggestions. Each suggestion is shaped as a
        dictionary of (key: value) pairs.

        Args:
            :param space: the space from which the parameter configurations
                          are sampled
            :param old_trials: list of previously generated configurations
            :param num_suggestions: maximum number of configurations
                                    produced, it might be lower
            :param budget: number of attempts for generating a single parameter
                           configuration
        :return:
            a list of sampled configurations
        """
        new_trials = []

        # Use 3 times the dimensionality of the space for training the GP.
        if len(old_trials) < len(space) * 3:
            opt = RandomSearch()
            return opt.get_suggestions(space, old_trials, num_suggestions, budget)

        converter = Converter(space)
        bounds = self.compute_bounds(space)

        old_trials_params = [trial['parameters'] for trial in old_trials]
        X = np.array([converter.encode(t) for t in old_trials_params])
        Y = np.array([trial['score'] for trial in old_trials])

        # Fit a GPR to the completed trials
        self.gpr.fit(X, Y)

        for i in range(num_suggestions):

            # Obtain next sampling point from the acquisition function
            x_trial = self.propose_location(X, Y, bounds, budget)

            new_trial = converter.decode(x_trial)
            if new_trial not in new_trials and \
                        new_trial not in old_trials_params:
                new_trials.append(new_trial)

        return new_trials
