""" -*- Encoding: UTF-8 -*-
Algorithm structure:

   1. Generate an initial population (p) of trials to guarantee a critical
      level of diversity and apply heuristic processes designed for the problem
      as an attempt to improving and evaluating these trials.
      (Function: population())

   2. Designate an initial subset of P to be referenced as ref_set.
      A trial may be added in future to the reference set if the diversity of
      the set improves even when the objective value of the trial is
      inferior others.
      (Functions: elite_population() and diverse_population())

   3. Create new trials consisting of structured combinations of subsets of
      the current ref_set.
      (Function: mix_population())

   4. Apply the heuristic processes used in Step 1 to evaluate the solutions
      created in Step 3.
      These heuristic processes must be able to operate on infeasible trials
      and may or may not yield feasible results.

   5. Extract a collection of the “best” improved trials from Step 4 and add
      them to the ref_set.
      The notion of “best” is once again broad; making the objective value one
      among several criteria for evaluating the merit of newly created points.
      (Function: elite_update() and diverse_update())
      Repeat Steps 3, 4 and 5 until the reference set does not change.

   6. Diversify the reference set, by re-starting from Step 1.
      Stop when reaching a specified iteration limit.

Variation of original algorithm.
Cold start with Random Search.
"""
import random
from API.choices import TYPE
from API.Algorithms.AbstractAlgorithm import Algorithm
from API.Algorithms.RandomSearch import RandomSearch


class ScatterSearch(Algorithm):
    """

    """
    __info__ = {
        "name": "Scatter search",
        "enabled": True,
        "description": 'Scatter Search is an evolutionary algorithm that '
                       'systematically explores the solution space by '
                       'selecting and updating a set of points, de-nominated'
                       ' the reference set. The main mechanism to generate new '
                       'trial points is a weighted linear combination of the'
                       ' points followed by a possible improvement method.',
        "supported_params": TYPE.names()
    }

    def setUp(self, space, elite_population=5, diverse_population=5):
        """
        Class constructor.

        Params:
        :param space: hyper-parameter space from which the trials are
                            sampled
        :param elite_population: number of good trials kept in each population
        :param diverse_population: number of diverse trials kept in each
                                   population
        """
        # Hyper-parameter space
        self.space = {axis['name']: axis for axis in space}
        # Number of dimensions in space
        self.N_dim = len(space)

        # Number of good trial to keep in population
        self.num_elite = elite_population
        # Number of diverse trial to keep in population
        self.num_diverse = diverse_population

        self.prepare()

    def prepare(self):
        """
        Prepare some internal structure for speeding up the algorithm.

        :return: None
        """
        # Seed the random module for reproducibility
        # random.seed(1337)

        # Prepare the keys structures
        self.keys = list(self.space)

        self.cat_keys = []          # categorical keys
        self.min_max_delta = {}       # discrete min and max values

        # Create the cardinality of dimension combinations for hashing
        self.combination = {}
        self.seen_trials = set()    # Set of seen trials (it stores trial hash)

        m = 1
        for key, axis in self.space.items():
            self.combination[key] = m

            if axis['type'] == TYPE.DISCRETE:
                self.min_max_delta[key] = {
                    'min': min(axis['values']),
                    'max': max(axis['values']),
                    'delta': max(axis['values']) - min(axis['values'])
                }
                m *= len(axis['values'])

            elif axis['type'] == TYPE.CATEGORICAL:
                self.cat_keys.append(key)
                m *= len(axis['values'])

            else:
                self.min_max_delta[key] = {
                    'min': axis['min'],
                    'max': axis['max'],
                    'delta': axis['max'] - axis['min']
                }

                if TYPE[axis['type']] == TYPE.INTEGER:
                    m *= abs(axis['max'] - axis['min'])
                else:
                    # Hack for hashing float values
                    m *= 200

        self.max_hash = m

    def is_trial_unvisited(self, trial):
        """
        Check if a trial has already been visited in the past.

        This function uses an additive memory mechanism based on a hash
        function. The hash function that gives an integer value for a trial t
        is:
                hash(t) = Sum(Vi * Product(Mj))    i = 0, 1, ..., N_dim
                                                   j = i + 1, i + 2, ..., N_dim

        Vi is the index of the trial value in the dimension i and Mj is the
        cardinality of the dimension j.

        :param trial: a dictionary of dimension name - value
        :return: True if the trial has not previously seen, False otherwise
        """
        hash_trial = 0

        # Compute the hash value for additive memory storage
        for key in self.keys:
            axis = self.space[key]

            if axis['type'] == TYPE.CATEGORICAL or axis['type'] == TYPE.DISCRETE:
                value = axis['values'].index(trial[key])
            else:
                value = trial[key] - self.min_max_delta[key]['min']

            hash_trial += value * self.combination[key]

        # Check that hash value is correct
        assert 0 <= hash_trial <= self.max_hash

        # Verify if the trial has already been explored
        if hash_trial in self.seen_trials:
            # print("duplicated")
            return False
        else:
            self.seen_trials.add(hash_trial)
            return True

    def elite_population(self, studies):
        """
        Select the best 'num_elite' studies.
        The comparison between studies is done on the mandatory 'loss' value
        produced by the model

        Params:
        :param studies: list of study

        :return: list of remaining studies and elite studies
            The elite studies (a.k.a. best studies) are token away from the
            studies list.
        """
        # Sort ascending the studies on the loss value
        studies = sorted(studies, key=lambda study: study['score'],
                         reverse=True)

        # Take the best 'elite_population' studies
        elite_studies = studies[:self.num_elite]

        # Remove the chosen elite studies
        studies = studies[self.num_elite:]

        return studies, elite_studies

    def diversity(self, trial, elite_studies):
        """
        The diversification function measures the average distance between
        a referenced trial and the elite trials. Since such distance is
        normalized, it has a magnitude between 0 and N-dim.
        Where 0 means all hyper-parameters equal, while N-dim means all
        hyper-parameters different.

        A sort of one-hot encoding distance (L0) is used for the categorical
        hyper-parameters while a normalized L1 distance is used for numeric
        hyper-parameters.

        Params:
        :param trial: referenced trial
        :param elite_studies: list of elite studies

        :return: the distance of the referenced trial with respects to the
            elite_studies
        """
        distance = 0

        for elite_study in elite_studies:
            # find one-hot distance among categorical hyper-parameters
            for key in self.cat_keys:
                if trial[key] != elite_study['parameters'][key]:
                    distance += 1

            # find distance among the numeric parameters (dis_keys)
            for key, min_max in self.min_max_delta.items():
                distance += abs((trial[key] - elite_study['parameters'][key])
                                / min_max['delta'])

        # final distance not normalized (it goes from 0 to number of space dims)
        distance /= len(elite_studies)

        # final distance should averagely tell how many dimensions differ
        assert 0 < distance < len(self.space)
        return distance

    def diverse_population(self, studies, elite_studies):
        """
        Create the set of most diverse studies w.r.t. the elite studies.
        Each trial in the studies list is compared with the elite_trials for
        finding the trials with the highest diversity in terms of
        hyper-parameters

        Params:
        :param studies: list of studies
        :param elite_studies: list of best studies

        :return: the list of most diverse studies
        """
        # Find the diversity for each study
        for study in studies:
            study['diversity'] = self.diversity(study['parameters'],
                                                elite_studies)

        # Sort the study on the diversity
        studies = sorted(studies, key=lambda x: x['diversity'], reverse=True)

        return studies[:self.num_diverse]

    def mix_population(self, studies):
        """
        Mix together different study trials for obtaining new unseen trials.
        The new population of trials is obtained by randomly taking two
        studies and by randomly combining the hyper-parameters of the two
        trials.

        Params:
        :param studies: the list of studies (elite studies + diverse studies)
        :return: a list of new trials to be evaluated on the model
        """
        new_trials = []
        half_dims = int(self.N_dim / 2 + 0.5)

        # Get the trial from the already carried out studies
        trials = [study['parameters'] for study in studies]
        random.shuffle(trials)

        # make couple of consecutive trial
        for one, two in zip(trials, trials[1:] + trials[:1]):

            new_one = {**one}
            new_two = {**two}

            # Sample random keys for swapping corresponding values
            for key in random.sample(self.keys, half_dims):
                new_one[key], new_two[key] = new_two[key], new_one[key]

            # Add the newly created trials if they are not already visited
            if self.is_trial_unvisited(new_one):
                new_trials.append(new_one)
            if self.is_trial_unvisited(new_two):
                new_trials.append(new_two)

        return new_trials

    def run(self, population, num_suggestions, budget):
        """
        Run the scatter search algorithm for 'num_iteration' times each one
        with a budget of 'budget' iterations.

        Args:
            :param population: initial population already evaluated
            :param num_suggestions: number of new trials to be generated
            :param budget: budget available to fulfill the generation ofd trials
        :return:
            list of new trials
        """
        trials = []
        population, elite_studies = self.elite_population(population)
        diverse_studies = self.diverse_population(population, elite_studies)

        for i in range(budget):

            new_trials = self.mix_population(elite_studies + diverse_studies)

            if len(new_trials) + len(trials) >= num_suggestions:
                trials += new_trials[:num_suggestions - len(trials)]
                break
            else:
                trials += new_trials

        return trials

    def get_suggestions(self, space, old_trials, num_suggestions=10, budget=50):
        """
        Scatter search generation.

        Args:
            :param space: hyper-parameters space
            :param old_trials: old evaluated trials
            :param num_suggestions: number of new trials to generate
            :param budget: budget for generation of trials
        :return:
            list of trials
        """
        if not old_trials:
            rs = RandomSearch()
            return rs.get_suggestions(space, old_trials,
                                      num_suggestions, budget)
        else:
            self.setUp(space)
            for trial in old_trials:
                self.is_trial_unvisited(trial['parameters'])
            return self.run(old_trials, num_suggestions, budget)
