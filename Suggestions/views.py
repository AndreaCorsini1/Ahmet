from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from Suggestions.models import Study, TrialMetric, Trial, Algorithm
from Suggestions.Algorithms.GridSearch import GridSearch
from Suggestions.Algorithms.RandomSearch import RandomSearch
from Suggestions.Algorithms.ScatterSearch import ScatterSearch

import json


@csrf_exempt
def studies(request):
    """
    Function for work on generic studies. The operation permitted are:
        - POST: create a brand new study
        - GET: list all the available studies

    Args:
        :param request: http request
    :return: the result of the operation requested
    """

    # Create a new study
    if request.method == "POST":
        data = json.loads(request.body)
        name = data["name"]

        try:
            study = Study.objects.get(name=name)
            return JsonResponse({"error": "The study {} exists".format(name)})

        except Study.DoesNotExist:
            print("HERE")
            study_configuration = json.dumps(data["study_configuration"])
            algorithm = data.get("algorithm", "RandomSearchAlgorithm")
            study = Study.create(name, study_configuration, algorithm)

            return JsonResponse({"data": study.to_json()})

    # List the studies
    elif request.method == "GET":
        studies = Study.objects.all()
        response_data = [study.to_json() for study in studies]
        return JsonResponse({"data": response_data})
    else:
        return JsonResponse({"error": "Unsupported http method"})


@csrf_exempt
def algorithms(request):
    """
    Function for work on generic algorithms. The operation permitted are:
        - POST: create a new algorithms
        - GET: list all the available algorithms

    Args:
        :param request: http request
    :return: the result of the operation requested
    """

    # Create a new algorithm
    if request.method == "POST":
        data = json.loads(request.body)
        name = data["name"]

        try:
          algorithm = Algorithm.objects.get(name=name)
          return JsonResponse({"error": "The algorithm {} exists".format(name)})

        except Algorithm.DoesNotExist:
          algorithm = Algorithm.create(name)
          return JsonResponse({"data": study.to_json()})

    # List the algorithms
    elif request.method == "GET":
        algorithms = Algorithm.objects.all()
        response_data = [alg.to_json() for alg in algorithms]
        return JsonResponse({"data": response_data})
    else:
        return JsonResponse({"error": "Unsupported http method"})


@csrf_exempt
def trials(requests):
    """
    Function for getting all the trials.

    Args:
        :param requests: http request
    :return: the list of all trials
    """

    # Return all the trials
    if requests.method == "GET":
        trials = [trial.to_json() for trial in Trial.objects.all()]
        return JsonResponse({"data": trials})
    else:
        return JsonResponse({"error": "Unsupported http method"})

@csrf_exempt
def study(request, study_name):
    """
    Function to work on a single study. The allowed operations are:
        - GET: get the information about a study by its name
        - PUT: update the status of a study
        - DELETE: delete a study by its name

    Args:
        :param request: http requests
        :param study_name: name of the study to work on
    :return: the result of the operation as a json
    """

    # Describe the study
    if request.method == "GET":
        study = Study.objects.get(name=study_name)
        return JsonResponse({"data": study.to_json()})

    # Update the study status
    elif request.method == "PUT":
        study = Study.objects.get(name=study_name)
        data = json.loads(request.body)
        if "status" in data:
          study.status = data["status"]
        study.save()
        return JsonResponse({"data": study.to_json()})

    # Delete the study
    elif request.method == "DELETE":
        study = Study.objects.get(name=study_name)
        study.delete()
        return JsonResponse({"message": "Success to delete"})
    else:
        return JsonResponse({"error": "Unsupported http method"})


@csrf_exempt
def study_exist(request, study_name):
    """
    Check if the study exists.

    Args:
        :param request:
        :param study_name:
    :return:
    """

    # Check if the study exist or not
    if request.method == "GET":
        response_dict = {"exist": False}

        try:
          study = Study.objects.get(name=study_name)
          response_dict["exist"] = True
        except Study.DoesNotExist:
          response_dict["exist"] = False

        return JsonResponse(response_dict)

    else:
        return JsonResponse({"error": "Unsupported http method"})


@csrf_exempt
def study_suggestions(request, study_name):
    """

    :param request:
    :param study_name:
    :return:
    """
    # Create the trial
    if request.method == "POST":
        data = json.loads(request.body)
        trials_number = 1

        # TODO: Use the trial name to create trial object
        trial_name = "Trial"
        if "trials_number" in data:
          trials_number = data["trials_number"]
        if "trial_name" in data:
          trial_name = data["trial_name"]

        study = Study.objects.get(name=study_name)
        trials = Trial.objects.filter(study_name=study_name)
        trials = [trial for trial in trials]

        if study.algorithm == "RandomSearch":
          algorithm = RandomSearch()
        elif study.algorithm == "GridSearch":
          algorithm = GridSearch()
        #elif study.algorithm == "ScatterSearch":
        #  algorithm = ScatterSearch()
        #elif study.algorithm == "BayesianOptimization":
        #  algorithm = BayesianOptimization()
        #elif study.algorithm == "TPE":
        #  algorithm = TpeAlgorithm()
        #elif study.algorithm == "SkoptBayesianOptimization":
        #  algorithm = SkoptBayesianOptimization()
        else:
          return JsonResponse({
              "error":
              "Unknown algorithm: {}".format(study.algorithm)
          })

        new_trials = algorithm.run(study.name, trials_number)

        return JsonResponse({"data": [trial.to_json() for trial in new_trials]})
    else:
        return JsonResponse({"error": "Unsupported http method"})


@csrf_exempt
def study_trials(request, study_name):
    """
    Function to work on generic trials. It is able to:
        - POST: create a new trial for a specific study
        - GET: list all the trials for a study

    Args:
        :param request:
        :param study_name:
    :return:
    """

    # Create the trial
    if request.method == "POST":
        data = json.loads(request.body)
        name = data["name"]

        trial = Trial.create(study_name, name)
        return JsonResponse({"data": trial.to_json()})

    # List the studies
    elif request.method == "GET":
        trials = Trial.objects.filter(study_name=study_name)
        response_data = [trial.to_json() for trial in trials]

        return JsonResponse({"data": response_data})
    else:
        return JsonResponse({"error": "Unsupported http method"})


@csrf_exempt
def study_trial(request, study_name, trial_id):
    """
    Function for manipulating a specific trial. It allows on a trial to:
        - GET: find information on a trial of a study
        - PUT: update a trial of a study
        - DELETE: remove a trial from a study

    Args:
        :param request: http request
        :param study_name: study name as identifier
        :param trial_id: trial id
    :return:
    """

    # Describe the trial
    if request.method == "GET":
        trial = Trial.objects.get(study_name=study_name, id=trial_id)
        return JsonResponse({"data": trial.to_json()})

    # Update the trial
    elif request.method == "PUT":

        trial = Trial.objects.get(study_name=study_name, id=trial_id)
        data = json.loads(request.body)
        if "status" in data:
          trial.status = data["status"]
        if "objective_value" in data:
          trial.objective_value = data["objective_value"]
        trial.save()
        return JsonResponse({"data": trial.to_json()})

    # Delete the trial
    elif request.method == "DELETE":
        trial = Trial.objects.get(study_name=study_name, id=trial_id)
        trial.delete()
        return JsonResponse({"message": "Success to delete"})
    else:
        return JsonResponse({"error": "Unsupported http method"})


@csrf_exempt
def study_trial_metrics(request, study_name, trial_id):
    """
    Function working on generic metrics. The function can:
        - POST: create a new metric
        - GET: list all the available metrics

    Args:
        :param request: http request
        :param study_name:
        :param trial_id:
    :return:
    """

    # Create the trial metric
    if request.method == "POST":
        data = json.loads(request.body)
        training_step = data["training_step"]
        objective_value = data["objective_value"]

        trial_metric = TrialMetric.create(trial_id, training_step, objective_value)
        return JsonResponse({"data": trial_metric.to_json()})

    # List the trial metrics
    elif request.method == "GET":
        trial_metrics = TrialMetric.objects.filter(trial_id=trial_id)
        response_data = [trial_metric.to_json() for trial_metric in trial_metrics]
        return JsonResponse({"data": response_data})
    else:
        return JsonResponse({"error": "Unsupported http method"})


@csrf_exempt
def study_trial_metric(request, study_name, trial_id, metric_id):
    """
    Function for manipulating a metric. Supported operations:
        - GET: return information on the metric
        - PATCH:
        - DELETE:

    Args:
        :param request:
        :param study_name:
        :param trial_id:
        :param metric_id:
    :return:
    """

    # Describe the trial metric
    if request.method == "GET":
        trial_metric = TrialMetric.objects.get(id=metric_id)
        return JsonResponse({"data": trial_metric.to_json()})

    # Update the trial metric
    elif request.method == "PATCH":
        trial_metric = TrialMetric.objects.get(id=metric_id)
        data = json.loads(request.body)
        if "training_step" in data:
            trial_metric.training_step = data["training_step"]
        if "objective_value" in data:
            trial_metric.objective_value = data["objective_value"]
        trial_metric.save()
        return JsonResponse({"data": trial_metric.to_json()})

    # Delete the trial metric
    elif request.method == "DELETE":
        trial_metric = TrialMetric.objects.get(id=metric_id)
        trial_metric.delete()
        return JsonResponse({"message": "Success to delete"})
    else:
        return JsonResponse({"error": "Unsupported http method"})
