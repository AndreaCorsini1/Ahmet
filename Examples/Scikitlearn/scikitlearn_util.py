#!/usr/bin/env python

import json
from Examples.client import AhmetClient

def main(train_function):
    """

    :param train_function:
    :return:
    """
    client = AhmetClient()

    # Get or create the study
    study_configuration = {
      "goal": "MINIMIZE",
      "randomInitTrials": 1,
      "maxTrials": 5,
      "maxParallelTrials": 1,
      "params": [
          {
              "Name": "gamma",
              "type": "DOUBLE",
              "minValue": 0.001,
              "maxValue": 0.01,
              "feasiblePoints": "",
              "scalingType": "LINEAR"
          },
          {
              "Name": "C",
              "type": "DOUBLE",
              "minValue": 0.5,
              "maxValue": 1.0,
              "feasiblePoints": "",
              "scalingType": "LINEAR"
          },
          {
              "Name": "kernel",
              "type": "CATEGORICAL",
              "minValue": 0,
              "maxValue": 0,
              "feasiblePoints": "linear, poly, rbf, sigmoid, precomputed",
              "scalingType": "LINEAR"
          },
          {
              "Name": "coef0",
              "type": "DOUBLE",
              "minValue": 0.0,
              "maxValue": 0.5,
              "feasiblePoints": "",
              "scalingType": "LINEAR"
          },
      ]
    }

    study = client.create_study("Study", study_configuration, "RandomSearch")

    # Get suggested trials
    trials = client.get_suggestions(study.id, 3)

    # Generate parameters
    parameter_value_dicts = []
    for trial in trials:
        parameter_value_dict = json.loads(trial.parameter_values)
        print("The suggested parameters: {}".format(parameter_value_dict))
        parameter_value_dicts.append(parameter_value_dict)

    # Run training
    metrics = []
    for i in range(len(trials)):
        metric = train_function(parameter_value_dicts[i])
        metrics.append(metric)

    # Complete the trial
    for i in range(len(trials)):
        trial = trials[i]
        client.complete_trial_with_one_metric(trial, metrics[i])
    is_done = client.is_study_done(study.id)
    best_trial = client.get_best_trial(study.id)
    print("The study: {}, best trial: {}".format(study, best_trial))

