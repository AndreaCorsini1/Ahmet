from django.urls import path
from django.views.generic.base import TemplateView
from . import views

urlpatterns = [
    #
    path('', views.index, name='index'),

    #
    path('studies', views.studies, name='studies'),

    #
    path('openapi', views.openapi_yaml, name='openapi'),
    path('apidocs', TemplateView.as_view(template_name='dashboard/api.html')),

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