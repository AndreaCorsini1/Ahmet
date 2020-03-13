from API.EarlyStoppings.AbstractEarlyStopping import AbstractEarlyStopAlgorithm


class SimilarityEarlyStopping(AbstractEarlyStopAlgorithm):

    def __jaccard(self, a, b):
        """
        Jaccard Similarity J(A,B) = |Intersection (A,B)| / |Union (A,B)|

        Problem: it does not take into account the position of the element.
        """
        A = set(a)
        B = set(b)

        intersection = A.intersection(B)
        union = A.union(B)

        return float(len(intersection)) / len(union)

    def __similarity(self, trial):
        """
        Positional similarity of a list with a list of lists.
        The normalization factor is not used since it is equal for each list we
        will see, furthermore the function is monotone.

        Args:
            :param trial:
        :return:
        """
        summation = 0

        for old_trial in self.old_trials:
            summation += sum([a == b for a, b in zip(trial, old_trial)])

        return summation

    def get_trials_to_stop(self, trials, old_trials):
        """
        Stop the trial more similar to the old ones.

        Args:
            :param trials:
        :return:
        """
        if trials and old_trials:

            self.old_trials = old_trials
            return [max(trials, key=self.__similarity)]

        return []
