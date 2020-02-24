from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),

    #
    path('studies', views.studies, name='studies'),

    #
    path('<slug:study_name>', views.study, name='study'),

    #
    path('<slug:study_name>/suggestions',
         views.study_suggestions, name='study_suggestions'),

    #
    path('trials', views.trials, name='trials'),

    #
    path('<slug:study_name>/<slug:trial_id>', views.trial, name='trial'),

    #
    path('<slug:study_name>/<slug:trial_id>/metrics',
         views.study_trial_metrics, name='study_trial_metrics'),

    #
    path('<slug:study_name>/<slug:trial_id>/<slug:metric_id>',
         views.study_trial_metric, name='study_trial_metric'),
]