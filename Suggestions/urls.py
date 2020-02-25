from django.urls import path
from . import views

urlpatterns = [

    # Ex: localhost:8080/Suggestion/v1/studies
    path('v1/studies', views.studies, name="studies"),

    # EX: localhost:8080/Suggestion/v1/algorithms
    path('v1/algorithms', views.algorithms, name="algorithms"),

    # EX: localhost:8080/Suggestion/v1/trials
    path('v1/trials', views.trials, name="trials"),

    # Ex: localhost:8080/Suggestions/v1/random001
    path('v1/<slug:study_name>', views.study, name="study"),

    # Ex: localhost:8080/Suggestions/v1/grid001/exist
    path('v1/<slug:study_name>/exist', views.study_exist, name="study_exist"),

    # Ex: localhost:8080/Suggestions/v1/random001/suggestions
    path('v1/<slug:study_name>/suggestions',
         views.study_suggestions, name="study_suggestions"),

    # Ex: localhost:8080/Suggestions/v1/scatter001/trials
    path('v1/<slug:study_name>/trials',
         views.study_trials, name="study_trials"),

    # Ex: localhost:8080/Suggestions/v1/grid001/101
    path('v1/<slug:study_name>/<slug:trial_id>',
         views.study_trial, name="study_trial"),

    # Ex: localhost:8080/Suggestions/v1/random001/001/metrics
    path('v1/<slug:study_name>/<slug:trial_id>/metrics',
         views.study_trial_metrics, name="study_trial_metrics"),

    # Ex: localhost:8080/Suggestions/v1/scatter001/trial01/metric02
    path('v1/<slug:study_name>/<slug:trial_id>/<slug:metric_id>',
         views.study_trial_metric, name="study_trial_metric")
]