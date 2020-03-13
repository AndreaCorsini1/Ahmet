from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken.views import obtain_auth_token
from . import views

app_name = 'api'

urlpatterns = [
    #
    path('users/', views.UserList.as_view(), name="users"),
    #
    path('users/<int:pk>/', views.UserDetail.as_view(), name="user"),

    #
    path('token-auth/', obtain_auth_token, name='token-auth'),

    # EX: localhost:8080/api/v1/algorithms
    path('algorithms/', views.AlgorithmList.as_view(), name="algorithms"),
    # EX: localhost:8080/api/v1/algorithm/RandomSearch
    path('algorithms/<slug:alg_name>/', views.AlgorithmDetail.as_view(),
         name="algorithm_info"),

    # Ex: localhost:8080/api/v1/metrics
    path('metrics/', views.MetricList.as_view(), name="metrics"),
    # Ex: localhost:8080/api/v1/metric/svm
    path('metrics/<slug:metric_name>/', views.MetricDetail.as_view(),
         name="metric_info"),

    # Ex: localhost:8080/api/v1/parameters
    path('parameters/', views.ParameterList.as_view(), name="parameters"),
    # Ex: localhost:8080/api/v1/parameter/1
    path('parameters/<int:pk>/', views.ParameterDetail.as_view(),
         name="parameter_info"),

    # EX: localhost:8080/api/v1/trials
    path('trials/', views.TrialList.as_view(), name="trials"),
    # Ex: localhost:8080/api/v1/scatter001/001
    path('trials/<int:pk>/', views.TrialDetail.as_view(),
         name="trial_info"),

    # Ex: localhost:8080/api/v1/studies
    path('studies/', views.StudyList.as_view(), name="studies"),
    # Ex: localhost:8080/api/v1/random001
    path('studies/<slug:study_name>/', views.StudyDetail.as_view(),
         name="study_info"),
    # Ex: localhost:8080/api/v1/parameter/1
    path('studies/<slug:study_name>/parameters/', views.study_parameters,
         name="study_parameters"),
    # Ex: localhost:8080/api/v1/scatter001/001
    path('studies/<slug:study_name>/trials/', views.study_trials,
         name="study_trials"),
    # Ex: localhost:8080/api/v1/random001/suggestions
    path('studies/<slug:study_name>/start/', views.StartStudy.as_view(),
         name="study_start"),
]

# Enable different response type based on request 'Accept' tag (JSON, HTML, ...)
urlpatterns = format_suffix_patterns(urlpatterns)
