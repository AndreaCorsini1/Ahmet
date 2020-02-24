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

Taxonomy:
    - Trial: a configuration of hyperparameters sampled from the input space
    - Study: a couple of elements, the first one is the result produced by
             the model while the second element is trial that leads to that
             result
    - Population: list of studies
"""
import random
from time import time
from Suggestions.Algorithms.Util import TYPE
from Suggestions.Algorithms.AbstractAlgorithm import AbstractAlgorithm

class ScatterSearch:

    #TODO: Adapt to the abstarct class

    def __init__(self, function, configspace, init_population=80,
                 elite_population=5, diverse_population=5):
        """
        Class constructor.

        Params:
        :param function: function that evaluates a trial and returns a result
        :param configspace: hyper-parameter space from which the trials are
                            sampled
        :param init_population: number of initial trials for making the
                                algorithm population
        :param elite_population: number of good trials kept in each population
        :param diverse_population: number of diverse trials kept in each
                                   population
        """
        # Function to evaluate with the suggested trial
        self.model = function
        # Hyper-parameter space
        self.space = configspace
        # Number of dimensions in configspace
        self.N_dim = len(configspace)

        # Number of trials in initial population
        self.init_population = init_population
        # Number of good trial to keep in population
        self.num_elite = elite_population
        # Number of diverse trial to keep in population
        self.num_diverse = diverse_population

        self.check_input()
        self.prepare()

    def prepare(self):
        """
        Prepare some internal structure for speeding up the algorithm.

        :return: None
        """
        # Seed the random module for reproducibility
        random.seed(1337)

        # Prepare the keys structures
        self.keys = list(self.space)

        self.cat_keys = []          # categorical keys
        self.dis_min_max = {}       # discrete min and max values

        for key, axis in self.space.items():
            if axis['type'] == TYPE.DISCRETE:
                self.dis_min_max[key] = \
                    {'min': min(axis['values']),
                     'max': max(axis['values']),
                     'delta': max(axis['values']) - min(axis['values'])}
            else:
                self.cat_keys.append(key)

        # Create the cardinality of dimension combinations for hashing
        self.combination = {}
        self.seen_trials = set()    # Set of seen trials (it stores trial hash)
        m = 1
        for key in reversed(self.keys):
            self.combination[key] = m
            m *= len(self.space[key]['values'])
        self.max_hash = m

    def check_input(self):
        """
        Check the input data.

        :return: None
        """
        # The number of initial trials should be larger than the number of
        # elite and diverse trials
        assert self.init_population >= self.num_elite + self.num_diverse

        # At least one dimension in space
        assert len(self.space) >= 1

        for key, axis in self.space.items():
            # Check misspelled fields and missing ones
            assert 'type' in axis
            assert 'values' in axis

            # Check that the type field is correctly defined
            assert type(axis['type']) == TYPE

            # Check that the values are really provided
            assert len(axis['values']) > 0

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
            hash_trial += self.space[key]['values'].index(trial[key]) *  \
                          self.combination[key]

        # Check that hash value is correct
        assert 0 <= hash_trial <= self.max_hash

        # Verify if the trial has already been explored
        if hash_trial in self.seen_trials:
            return False
        else:
            self.seen_trials.add(hash_trial)
            return True

    def population(self):
        """
        Generate the initial population.
        The function samples trials from the hyper-parameter space and
        evaluates them against the proposed model.

        :return: list of studies
            A study is a couple of elements, the first one is the result
            produced by the model while the second element is the trial
        """
        # Keep trace of trials and corresponding results
        studies = []

        for _ in range(self.init_population):
            # generate random trial from hyper-parameter space
            trial = {key: random.choice(self.space[key]['values']) for key in
                     self.keys}

            if self.is_trial_unvisited(trial):
                # evaluate the trial against the model
                result = self.model(trial)

                studies.append({'result': result, 'trial': trial})

        # Check studies is not empty
        assert studies

        return studies

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
        studies = sorted(studies, key=lambda study: study['result']['loss'])

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
                if trial[key] != elite_study['trial'][key]:
                    distance += 1

            # find distance among the numeric parameters (dis_keys)
            for key, min_max in self.dis_min_max.items():
                norm_val = (trial[key] - min_max['min']) / min_max['delta']
                norm_elite_val = (elite_study['trial'][key] - min_max['min']) /\
                                 min_max['delta']

                distance += abs(norm_val - norm_elite_val)

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
            study['diversity'] = self.diversity(study['trial'], elite_studies)

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
        trials = [study['trial'] for study in studies]
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

    def elite_update(self, elite_studies, studies):
        """
        Update the elite studies with better ones.
        The comparison is done on the loss value that must be present in any
        result of a study.

        Params:
        :param elite_studies: the list of current best studies
        :param studies: the new studies
        :return: the new elite studies and the unselected studies
        """
        new_id = 0      # Id for traverse new studies
        id = -1         # Id for traverse backward elite studies

        studies = sorted(studies, key=lambda study: study['result']['loss'])

        # Traverse the list in reverse order for removing the bad studies first
        for study in reversed(elite_studies):
            if study['result']['loss'] > studies[new_id]['result']['loss']:
                elite_studies[id] = studies[new_id]
                new_id += 1
                id -= 1
            else:
                break

        # Sort the elite after modification
        if new_id:
            elite_studies = sorted(elite_studies,
                                   key=lambda s: s['result']['loss'])

        return elite_studies, studies[new_id:]

    def diverse_update(self, diverse_studies, studies, elite_studies):
        """
        Compute the diversity of the diverse studies (since the elite might have
        been changed) and the new studies w.r.t. the elite studies.
        The diversity is a measure of dissimilarity based on the trial
        hyper-parameter. Such dissimilarity is a one-to-many measure.

        Params:
        :param diverse_studies: the current list of most diverse studies
        :param studies: the new studies
        :param elite_studies: the referenced elite studies
        :return: the list of updated diverse studies
        """
        # Find the diversity of studies (the elite_studies may be changed)
        for study in diverse_studies:
            study['diversity'] = self.diversity(study['trial'], elite_studies)
        for study in studies:
            study['diversity'] = self.diversity(study['trial'], elite_studies)

        # Sort studies on diversity
        diverse_studies = sorted(diverse_studies, key=lambda s: s['diversity'])
        studies = sorted(studies, key=lambda s: s['diversity'], reverse=True)

        new_id = 0
        # Substitute the studies with more diverse ones
        for id, study in enumerate(diverse_studies):
            if study['diversity'] < studies[new_id]['diversity']:
                diverse_studies[id] = studies[new_id]
                new_id += 1
            else:
                break

        return diverse_studies

    def run(self, num_iterations=1, budget=10):
        """
        Run the scatter search algorithm for 'num_iteration' times each one
        with a budget of 'budget' iterations.

        Params:
        :param num_iterations: number of algorithm iterations
        :param budget: max population recombination within a single iteration
        :return: a tuple of two elements
            the first element contains the results coming back from the model.
            the second element contains the hyper-parameter configuration that
            leads to the above results.
        """
        best = {}

        for iter in range(num_iterations):
            print("Start iteration {}".format(iter))

            start = time()
            init_studies = self.population()

            init_studies, elite_studies = self.elite_population(init_studies)
            diverse_studies = self.diverse_population(init_studies, elite_studies)
            print("\tCreation of initial population took {:3f} sec"
                  .format(time()-start))

            start = time()
            for i in range(budget):

                new_trials = self.mix_population(elite_studies + diverse_studies)

                if new_trials:
                    studies = [{'result': self.model(trial), 'trial': trial}
                               for trial in new_trials]

                    elite_studies, studies = self.elite_update(elite_studies,
                                                               studies)
                    diverse_studies = self.diverse_update(diverse_studies,
                                                          studies,
                                                          elite_studies)

                print("\t\tRemaining budget {}".format(budget - i - 1))


            print("\tPopulation recombination took {:.3f} sec"
                  .format(time()-start))

            # Find the best study (Always minimize)
            if not best or \
               best['result']['loss'] < elite_studies[0]['result']['loss']:
                best['result'] = elite_studies[0]['result']
                best['trial'] = elite_studies[0]['trial']

        print("Number of visited trials {} over all possible"
              "trials {}".format(len(self.seen_trials), self.max_hash))

        return best['result'], best['trial']
