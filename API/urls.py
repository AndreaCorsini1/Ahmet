from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    #
    path('users/', views.UserList.as_view()),
    #
    path('users/<int:pk>/', views.UserDetail.as_view()),

    # EX: localhost:8080/api/v1/algorithms
    path('algorithms/', views.AlgorithmList.as_view(), name="algorithms"),
    # EX: localhost:8080/api/v1/algorithm/RandomSearch
    path('algorithm/<slug:alg_name>', views.AlgorithmDetail.as_view(),
         name="algorithm"),

    # Ex: localhost:8080/api/v1/metrics
    path('metrics/', views.MetricList.as_view(), name="metrics"),
    # Ex: localhost:8080/api/v1/metric/svm
    path('metric/<slug:metric_name>/', views.MetricDetail.as_view(),
         name="metric"),

    # Ex: localhost:8080/api/v1/parameters
    path('parameters/', views.ParameterList.as_view(), name="parameters"),
    # Ex: localhost:8080/api/v1/parameter/1
    path('parameter/<int:pk>/', views.ParameterDetail.as_view(),
         name="parameter"),

    # EX: localhost:8080/api/v1/trials
    path('trials/', views.TrialList.as_view(), name="trials"),
    # Ex: localhost:8080/api/v1/studies
    path('studies/', views.StudyList.as_view(), name="studies"),

    # Ex: localhost:8080/api/v1/random001/suggestions
    path('<slug:study_name>/suggestions', views.suggestions,
         name="suggestions"),
    # Ex: localhost:8080/api/v1/scatter001/001
    path('<slug:study_name>/<int:pk>/', views.TrialDetail.as_view(),
         name="study_trial"),
    # Ex: localhost:8080/api/v1/random001
    path('<slug:study_name>/', views.StudyDetail.as_view(), name="study"),

    # Ex: localhost:8080/Suggestions/v1/random001/001/metrics
    #path('<slug:study_name>/<slug:trial_id>/metrics',
    #     views.study_trial_metrics, name="study_trial_metrics"),
    # Ex: localhost:8080/Suggestions/v1/scatter001/trial01/metric02
    #path('<slug:study_name>/<slug:trial_id>/<slug:metric_id>',
    #     views.study_trial_metric, name="study_trial_metric"),
]

# Enable different response type based on request 'Accept' tag (JSON, HTML, ...)
urlpatterns = format_suffix_patterns(urlpatterns)