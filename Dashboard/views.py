from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

import json
import requests
import six

@login_required
def home(request):
  if request.user and request.user.is_authenticated:
    print(request.user.username)
  return render(request, "dashboard/home.html")

# View for organizing
def index(request):
    return HttpResponse(render(request, 'dashboard/index.html'))


@csrf_exempt
def studies(request):
    """

    :param request:
    :return:
    """
    if request.method == "POST":
        name = request.POST.get("name", "")
        study_configuration = request.POST.get("study_configuration", "")
        algorighm = request.POST.get("algorithm", "RandomSearchAlgorithm")

        # Remove the charactors like \t and \"
        study_configuration_json = json.loads(study_configuration)
        data = {
            "name": name,
            "study_configuration": study_configuration_json,
            "algorithm": algorighm
        }

        url = "http://127.0.0.1:{}/suggestions/v1/studies".format(
                                            request.META.get("SERVER_PORT"))
        response = requests.post(url, json=data)
        messages.info(request, response.content)
        return redirect("index")
    else:
        response = {
            "error": True,
            "message": "{} method not allowed".format(request.method)
        }
        return JsonResponse(response, status=405)


@csrf_exempt
def study(request, study_name):
    """

    :param request:
    :param study_name:
    :return:
    """
    url = "http://127.0.0.1:{}/suggestions/v1/{}".format(
                                    request.META.get("SERVER_PORT"), study_name)

    if request.method == "GET":
        response = requests.get(url)

        trials_url = "http://127.0.0.1:{}/suggestions/v1/{}/trials".format(
            request.META.get("SERVER_PORT"), study_name)
        trials_response = requests.get(trials_url)

        if response.ok and trials_response.ok:
          if six.PY2:
            study = json.loads(response.content.decode("utf-8"))["data"]
            trials = json.loads(trials_response.content.decode("utf-8"))["data"]
          else:
            study = json.loads(response.text)["data"]
            trials = json.loads(trials_response.text)["data"]
          context = {"success": True, "study": study, "trials": trials}
          return render(request, "dashboard/study_detail.html", context)
        else:
          response = {
              "error": True,
              "message": "Fail to request the url: {}".format(url)
          }
          return JsonResponse(response, status=405)
    elif request.method == "DELETE" or request.method == "POST":
        response = requests.delete(url)
        messages.info(request, response.content)
        return redirect("index")
    else:
        response = {
            "error": True,
            "message": "{} method not allowed".format(request.method)
        }
        return JsonResponse(response, status=405)


@csrf_exempt
def study_suggestions(request, study_name):
    """

    :param request:
    :param study_name:
    :return:
    """
    if request.method == "POST":
        trials_number_string = request.POST.get("trials_number", "1")
        trials_number = int(trials_number_string)

        data = {"trials_number": trials_number}
        url = "http://127.0.0.1:{}/suggestions/v1/{}/suggestions".format(
                                request.META.get("SERVER_PORT"), study_name)
        response = requests.post(url, json=data)
        messages.info(request, response.content)
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
    else:
        return JsonResponse({"error": "Unsupported http method"})


@csrf_exempt
def trials(request):
    """

    :param request:
    :return:
    """
    if request.method == "POST":
        study_name = request.POST.get("study_name", "")
        name = request.POST.get("name", "")

        data = {"name": name}

        url = "http://127.0.0.1:{}/suggestions/v1/{}/trials".format(
                                request.META.get("SERVER_PORT"), study_name)
        response = requests.post(url, json=data)
        messages.info(request, response.content)
        return redirect("index")
    else:
        return JsonResponse({"error": "Unsupported http method"})


@csrf_exempt
def trial(request, study_name, trial_id):
    """

    :param request:
    :param study_name:
    :param trial_id:
    :return:
    """
    url = "http://127.0.0.1:{}/suggestions/v1/{}/{}".format(
            request.META.get("SERVER_PORT"), study_name, trial_id)

    if request.method == "GET":
        response = requests.get(url)

        tiral_metrics_url = "http://127.0.0.1:{}/suggestions/v1/{}/{}/metrics" \
                            "".format(request.META.get("SERVER_PORT"),
                                      study_name, trial_id)
        tiral_metrics_response = requests.get(tiral_metrics_url)

        if response.ok and tiral_metrics_response.ok:
            if six.PY2:
                trial = json.loads(response.content.decode("utf-8"))["data"]
                trial_metrics = json.loads(
                         tiral_metrics_response.content.decode("utf-8"))["data"]
            else:
                trial = json.loads(response.text)["data"]
                trial_metrics = json.loads(tiral_metrics_response.text)["data"]
            context = {
                "success": True,
                "trial": trial,
                "trial_metrics": trial_metrics
            }
            return render(request, "dashboard/trial_detail.html", context)
        else:
            response = {
                "error": True,
                "message": "Fail to request the url: {}".format(url)
            }
            return JsonResponse(response, status=405)
    elif request.method == "DELETE":
        response = requests.delete(url)
        messages.info(request, response.content)
        return redirect("index")
    elif request.method == "PUT" or request.method == "POST":
        objective_value_string = request.POST.get("objective_value", "1.0")
        objective_value = float(objective_value_string)
        status = request.POST.get("status", "Completed")
        data = {"objective_value": objective_value, "status": status}
        response = requests.put(url, json=data)
        messages.info(request, response.content)

        if six.PY2:
            trial = json.loads(response.content.decode("utf-8"))["data"]
        else:
            trial = json.loads(response.text)["data"]
        context = {"success": True, "trial": trial, "trial_metrics": []}
        return render(request, "dashboard/trial_detail.html", context)
    else:
        response = {
            "error": True,
            "message": "{} method not allowed".format(request.method)
        }
        return JsonResponse(response, status=405)


@csrf_exempt
def study_trial_metrics(request, study_name, trial_id):
    """

    :param request:
    :param study_name:
    :param trial_id:
    :return:
    """
    if request.method == "POST":
        training_step_string = request.POST.get("training_step", "1")
        training_step = int(training_step_string)
        objective_value_string = request.POST.get("objective_value", "1.0")
        objective_value = float(objective_value_string)

        data = {"training_step": training_step, "objective_value": objective_value}
        url = "http://127.0.0.1:{}/suggestions/v1/{}/{}/metrics".format(
            request.META.get("SERVER_PORT"), study_name, trial_id)
        response = requests.post(url, json=data)
        messages.info(request, response.content)
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
    else:
        return JsonResponse({"error": "Unsupported http method"})


@csrf_exempt
def study_trial_metric(request, study_name, trial_id, metric_id):
    """

    :param request:
    :param study_name:
    :param trial_id:
    :param metric_id:
    :return:
    """
    url = "http://127.0.0.1:{}/suggestions/v1/{}{}/{}".format(
      request.META.get("SERVER_PORT"), study_name, trial_id, metric_id)

    if request.method == "GET":
        response = requests.get(url)

        if response.ok:
            if six.PY2:
                trial_metric = json.loads(response.content.decode("utf-8"))[
                    "data"]
            else:
                trial_metric = json.loads(response.text)["data"]
            context = {"success": True, "trial_metric": trial_metric}
            # TODO: Add the detail page of trial metric
            return render(request, "dashboard/trial_detail.html", context)
        else:
            response = {
                "error": True,
                "message": "Fail to request the url: {}".format(url)
            }
            return JsonResponse(response, status=405)
    elif request.method == "DELETE" or request.method == "POST":
        response = requests.delete(url)
        messages.info(request, response.content)
        return redirect("index")
    else:
        response = {
            "error": True,
            "message": "{} method not allowed".format(request.method)
        }
        return JsonResponse(response, status=405)
