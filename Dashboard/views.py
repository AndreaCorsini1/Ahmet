from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.urls import reverse

from Ahmet.settings import BASE_URL

import os
import json
import requests
import platform


@login_required
def home(request):
    if request.user and request.user.is_authenticated:
        print(request.user.username)

    return render(request, "registration/home.html")


@login_required
def index(request):
    """

    Args:
        :param request:
    :return:
    """
    # Studies
    studies_resp = requests.get(BASE_URL + reverse('api:studies'))

    # Trials
    trials_resp = requests.get(BASE_URL + reverse('api:trials'))

    studies = json.loads(studies_resp.text)
    trials = json.loads(trials_resp.text)
    context = {
        "success": True,
        "studies": studies,
        "trials": trials,
        "platform": platform
    }

    return render(request, "dashboard/index.html", context)


def openapi_yaml(request):
    """
    Get the api description file.

    Args:
        :param request:
    :return:
    """
    openapi = open(os.path.join(settings.BASE_DIR,
                       "API/swagger_editor/openapi.yml"), 'rb')

    return HttpResponse(openapi.read())


@csrf_exempt
@login_required
def studies(request):
    """
    TODO:

    :param request:
    :return:
    """
    if request.method == "POST":
        name = request.POST.get("name", "")
        study_configuration = request.POST.get("study_configuration", "")
        algorithm = request.POST.get("algorithm", "RandomSearch")

        # Remove the characters like \t and \"
        study_configuration_json = json.loads(study_configuration)
        data = {
            "name": name,
            "study_configuration": study_configuration_json,
            "algorithm": algorithm
        }

        response = requests.post(BASE_URL + reverse('api:studies'), json=data)
        messages.info(request, response.content)
        return redirect("index")
    else:
        response = {
            "error": True,
            "message": "{} method not allowed".format(request.method)
        }
        return JsonResponse(response, status=405)


@login_required
def study(request, study_name):
    """

    :param request:
    :param study_name:
    :return:
    """
    url = BASE_URL + reverse('api:study_info', {'study_name': study_name})

    if request.method == "GET":
        study_info = requests.get(url)
        study_trials = requests.get(BASE_URL + reverse('api:study_trials',
                                                    {'study_name': study_name}))

        if study_info.ok and study_trials.ok:
            study = json.loads(study_info.text)["data"]
            trials = json.loads(study_trials.text)["data"]
            context = {
                "success": True,
                "study": study,
                "trials": trials
            }
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


@login_required
def study_suggestions(request, study_name):
    """

    :param request:
    :param study_name:
    :return:
    """
    if request.method == "GET":
        trials_number = request.POST.get("trials_number", "1")
        response = requests.get(BASE_URL + reverse('api:study_start',
                                                   {'study_name': study_name}))
        messages.info(request, response.content)
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
    else:
        return JsonResponse({"error": "Unsupported http method"})


@login_required
def trial(request, study_name, trial_id):
    """

    :param request:
    :param study_name:
    :param trial_id:
    :return:
    """
    url = reverse('api:trial_info', {'pk': trial_id})

    if request.method == "GET":
        response = requests.get(url)
        trial_metrics = requests.get(BASE_URL + reverse('metric_info',
                                                    {'study_name': study_name}))

        if response.ok and trial_metrics.ok:
            trial = json.loads(response.text)["data"]
            trial_metrics = json.loads(trial_metrics.text)["data"]
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

        trial = json.loads(response.text)
        context = {"success": True, "trial": trial, "trial_metrics": []}
        return render(request, "dashboard/trial_detail.html", context)
    else:
        response = {
            "error": True,
            "message": "{} method not allowed".format(request.method)
        }
        return JsonResponse(response, status=405)
