from rest_framework.permissions import IsAuthenticatedOrReadOnly, \
    IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins, generics
from rest_framework.decorators import api_view, permission_classes

from API.permissions import *
from API.serializers import *
from API.Algorithms.GridSearch import GridSearch
from API.Algorithms.RandomSearch import RandomSearch
from API.Algorithms.ScatterSearch import ScatterSearch

from API.utils import *


class StudyList(mixins.CreateModelMixin,
                mixins.ListModelMixin,
                generics.GenericAPIView):
    """
    Function for work on generic studies. The operation permitted are:
        - POST: create a brand new study
        - GET: list all the available studies
    """
    queryset = Study.objects.all().order_by('-updated_time', '-owner')
    serializer_class = StudySerializer

    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,
                          IsAdminUser]

    def perform_create(self, serializer):
        """
        There'd be no way of associating the user that created the object,
        with the object instance. The user isn't sent as part of the serialized
        representation. Overriding a .perform_create() method on our views
        allows us to modify how the instance save is managed.

        Args:
            :param serializer:
        :return:
        """
        # Save the study
        serializer.save(owner=self.request.user)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class StudyDetail(mixins.RetrieveModelMixin,
                  mixins.DestroyModelMixin,
                  mixins.UpdateModelMixin,
                  generics.GenericAPIView):
    """
    Function to work on a single study. The allowed operations are:
        - GET: get the information about a study by its name
        - PUT: update the status of a study
        - DELETE: delete a study by its name
    """
    queryset = Study.objects.all()
    serializer_class = StudySerializer
    # Field used for performing object lookup of individual model instances
    lookup_field = 'name'
    # URL argument used for object lookup
    lookup_url_kwarg = 'study_name'

    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,
                          IsAdminUser]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class AlgorithmList(mixins.CreateModelMixin,
                    mixins.ListModelMixin,
                    generics.GenericAPIView):
    """
    Function for work on generic algorithms. The operation permitted are:
        - POST: create a new algorithms
        - GET: list all the available algorithms
    Note: this function should be call by a post method only if a new algorithm
    file has been uploaded.
    """
    queryset = Algorithm.objects.all().order_by('-name')
    serializer_class = AlgorithmSerializer

    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsAdminUser]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class AlgorithmDetail(mixins.RetrieveModelMixin,
                  mixins.DestroyModelMixin,
                  generics.GenericAPIView):
    """
    Function to work on a single study. The allowed operations are:
        - GET: get the information about a study by its name
        - PUT: update the status of a study
        - DELETE: delete a study by its name
    """
    queryset = Study.objects.all()
    serializer_class = StudySerializer
    # Field used for performing object lookup of individual model instances
    lookup_field = 'name'
    # URL argument used for object lookup
    lookup_url_kwarg = 'alg_name'

    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsAdminUser]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class MetricList(mixins.CreateModelMixin,
                 mixins.ListModelMixin,
                 generics.GenericAPIView):
    """
    Function for work on generic algorithms. The operation permitted are:
        - POST: create a new algorithms
        - GET: list all the available algorithms
    Note: this function should be call by a post method only if a new algorithm
    file has been uploaded.
    """
    queryset = Metric.objects.all().order_by('-name')
    serializer_class = MetricSerializer

    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsAdminUser]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class MetricDetail(mixins.RetrieveModelMixin,
                  mixins.DestroyModelMixin,
                  mixins.UpdateModelMixin,
                  generics.GenericAPIView):
    """
    Function to work on a single study. The allowed operations are:
        - GET: get the information about a study by its name
        - PUT: update the status of a study
        - DELETE: delete a study by its name
    """
    queryset = Metric.objects.all()
    serializer_class = MetricSerializer
    # Field used for performing object lookup of individual model instances
    lookup_field = 'name'
    # URL argument used for object lookup
    lookup_url_kwarg = 'metric_name'

    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsAdminUser]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class TrialList(mixins.ListModelMixin, generics.GenericAPIView):
    """
    Function for work on generic algorithms. The operation permitted are:
        - GET: list all the available algorithms
    Note: this function should be call by a post method only if a new algorithm
    file has been uploaded.
    """
    queryset = Trial.objects.all().order_by('-study_name', '-status')
    serializer_class = TrialSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class TrialDetail(mixins.RetrieveModelMixin,
                  mixins.DestroyModelMixin,
                  mixins.UpdateModelMixin,
                  generics.GenericAPIView):
    """
    Function to work on a single study. The allowed operations are:
        - GET: get the information about a study by its name
        - PUT: update the status of a study
        - DELETE: delete a study by its name
    """
    queryset = Trial.objects.all()
    serializer_class = TrialSerializer

    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsAdminUser]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    # TODO: is it really necessary?
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class ParameterList(mixins.CreateModelMixin,
                    mixins.ListModelMixin,
                    generics.GenericAPIView):
        """
        Function for work on generic algorithms. The operation permitted are:
            - POST: create a new algorithms
            - GET: list all the available algorithms
        Note: this function should be call by a post method only if a new algorithm
        file has been uploaded.
        """
        queryset = Parameter.objects.all().order_by('-name', '-study')
        serializer_class = ParameterSerializer

        # Set the permissions for this view
        permission_classes = [IsAuthenticatedOrReadOnly,
                              IsAdminUser]

        def get(self, request, *args, **kwargs):
            return self.list(request, *args, **kwargs)

        def post(self, request, *args, **kwargs):
            return self.create(request, *args, **kwargs)


class ParameterDetail(mixins.RetrieveModelMixin,
                      mixins.DestroyModelMixin,
                      generics.GenericAPIView):
    """
    Function to work on a single study. The allowed operations are:
        - GET: get the information about a study by its name
        - PUT: update the status of a study
        - DELETE: delete a study by its name
    """
    queryset = Parameter.objects.all()
    serializer_class = ParameterSerializer

    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsAdminUser]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def suggestions(request, study_name):
    """
    # TODO
    :param request:
    :param study_name:
    :return:
    """
    # Create the trial
    trials_number = 1

    study = Study.objects.get(name=study_name)
    trials = Trial.objects.filter(study_name=study_name)

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
    else:
        return Response(request.data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    new_trials = algorithm.run(study.name, trials_number)
    serializer = TrialSerializer(new_trials, many=True)

    return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


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
    #if request.method == "POST":
    #    data = json.loads(request.body)
    #    name = data["name"]

    #    trial = Trial.create(study_name, name)
    #    return JsonResponse({"data": trial.to_json()})

    # List the studies
    #elif request.method == "GET":
    #    trial_list = Trial.objects.filter(study_name=study_name)
    #    response_data = [trial.to_json() for trial in trial_list]
    #    return JsonResponse({"data": response_data})
    #else:
    #    return JsonResponse({"error": "Unsupported http method"})


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
    #if request.method == "POST":
    #    data = json.loads(request.body)
    #    training_step = data["training_step"]
    #    objective_value = data["objective_value"]

    #    trial_metric = TrialMetric.create(trial_id, training_step, objective_value)
    #    return JsonResponse({"data": trial_metric.to_json()})

    # List the trial metrics
    #elif request.method == "GET":
    #    trial_metrics = TrialMetric.objects.filter(trial_id=trial_id)
    #    response_data = [trial_metric.to_json() for trial_metric in trial_metrics]
    #    return JsonResponse({"data": response_data})
    #else:
    #    return JsonResponse({"error": "Unsupported http method"})


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
    #if request.method == "GET":
    #    trial_metric = TrialMetric.objects.get(id=metric_id)
    #    return JsonResponse({"data": trial_metric.to_json()})

    # Update the trial metric
    #elif request.method == "PATCH":
    #    trial_metric = TrialMetric.objects.get(id=metric_id)
    #    data = json.loads(request.body)
    #    if "training_step" in data:
    #        trial_metric.training_step = data["training_step"]
    #    if "objective_value" in data:
    #        trial_metric.objective_value = data["objective_value"]
    #    trial_metric.save()
    #    return JsonResponse({"data": trial_metric.to_json()})

    # Delete the trial metric
    #elif request.method == "DELETE":
    #    trial_metric = TrialMetric.objects.get(id=metric_id)
    #    trial_metric.delete()
    #    return JsonResponse({"message": "Success to delete"})
    #else:
    #    return JsonResponse({"error": "Unsupported http method"})
