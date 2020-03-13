from API.EarlyStoppings.AbstractEarlyStopping import AbstractEarlyStopAlgorithm
from API.models import Study, Trial

class DescendingEarlyStopping(AbstractEarlyStopAlgorithm):

    def get_trials_to_stop(self, trials, old_trials):
        """
        Sort the pending trials based on the score and stop the worst.

        TODO: Not implemented

        Args:
            :param trials:
        :return:
        """
        result = []

        for trial in trials:
            study = Study.objects.get(name=trial.study_name)
            study_goal = study.objective

            metrics = Trial.objects.filter(study_name=trial.study_name).order_by("training_step")
            metrics = [metric for metric in metrics]

            if len(metrics) >= 2:
                if study_goal == "MAXIMIZE":
                    if metrics[0].objective_value < metrics[1].objective_value:
                        result.append(trial)
                elif study_goal == "MINIMIZE":
                    if metrics[0].objective_value > metrics[1].objective_value:
                        result.append(trial)

        return []