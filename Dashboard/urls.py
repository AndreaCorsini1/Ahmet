from django.urls import path
from django.views.generic.base import TemplateView
from . import views

app_name = 'dashboardOld'

urlpatterns = [
    #
    path('', views.index, name='index'),

    #
    path('studies/', views.studies, name='studies'),
    path('studies/<slug:study_name>/', views.study, name='study_info'),

    #
    path('openapi', views.openapi_yaml, name='openapi'),
    path('apidocs', TemplateView.as_view(template_name='dashboard/api.html')),

    #
    path('studies/<slug:study_name>/suggestions/',
         views.study_suggestions, name='study_suggestions'),

    #
    path('studies/<slug:study_name>/<slug:trial_id>', views.trial,
         name='trial'),
]
