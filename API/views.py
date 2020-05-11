from rest_framework.permissions import IsAuthenticatedOrReadOnly, \
    IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, views
from rest_framework import mixins, generics, decorators

from API.Dataset import *
from API.Algorithms import *
from API.Metrics import *
from API.permissions import *
from API.serializers import *
from API.tasks import Suggestion

from Ahmet.settings import BASE_DIR
import os.path
import yaml


class UserList(generics.ListAPIView):
    """
    View for getting the studies associated to each user. This is a reverse
    relation on the study table that is able to filter and return the list of
    studies associated to a specific user.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    """
    Return studies for a specific user
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class StudyList(mixins.CreateModelMixin,
                mixins.ListModelMixin,
                generics.GenericAPIView):

    queryset = Study.objects.order_by('name', 'algorithm_id', 'owner')
    serializer_class = StudySerializer

    # Set the permissions for this view
    permission_classes = [IsOwnerOrReadOnly, IsAdminUser]

    def perform_create(self, serializer):
        """
        There'd be no way of associating the user that created the object,
        with the object instance. The user isn't sent as part of the serialized
        representation. Overriding a .perform_create() method on our views
        allows us to modify how the instance save is managed.

        Args:
            :param serializer: study serializer
        :return:
        """
        # Save the study
        serializer.save(owner=self.request.user)

    def post(self, request, *args, **kwargs):
        """
        Create and save a new study in the database. A study must have a unique
        name that can be used in future for retrieve information.
        Furthermore, a study needs an input algorithm and a metric against
        which the algorithm will be evaluated. Both the algorithm and metric
        must be present in the databased and if the post request does not
        specify such information, default value will be assigned.
        Additionally, the request can set other (optional) parameters of the
        study:

          - runs: the number of times tha algorithm will be used to produce
          evaluating new trials.

          - num_suggestions: the number of trials generate within a run.

          - dataset: the dataset used by the metric, we are using artificial
          intelligence metrics.

          Compliant with the RESTful API, the response contains a copy of the
          received data.
        """
        print(request.data)
        return self.create(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        """
        Get the list of all available studies in the database. The response
        is a list of studies, each containing the current information of the
        study.
        """
        return self.list(request, *args, **kwargs)


class StudyDetail(mixins.RetrieveModelMixin,
                  mixins.DestroyModelMixin,
                  mixins.UpdateModelMixin,
                  generics.GenericAPIView):

    queryset = Study.objects.all()
    serializer_class = StudySerializer
    # Field used for performing object lookup of individual model instances
    lookup_field = 'name'
    # URL argument used for object lookup
    lookup_url_kwarg = 'study_name'

    # Set the permissions for this view
    permission_classes = [IsOwnerOrReadOnly, IsAdminUser]

    def get(self, request, *args, **kwargs):
        """
        Get information about a specific study. The request must contain (in
        the URI) the unique name of the study you want to query. The response
        is composed by the current data about a study.
        """
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Delete a study by name. The view deletes a study (whether is running or
        completed) by filtering it on the name.
        """
        return self.destroy(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Update the study. Here, I abuse of the HTTP PUT method for both
        partially and completely update filed of a study. This is motivated
        by the unknown willing of the user a-priori.
        """
        return self.update(request, *args, **kwargs)


@decorators.api_view(['GET'])
@decorators.permission_classes([IsAuthenticated])
def study_trials(request, study_name):
    """
    Get the trials associated to a study name. The URI expects an input study
    name that is used to filter the generated study trials. Without the study
    name it is not possible to retrieve the trials. If the study is still
    pending, the list of trials may be empty. The response consists of a list
    containing all the trials, completed and pending.

    Args:
        :param request: http request.
        :param study_name: name of the study for getting the trials.
    """
    trials = Trial.objects.filter(study=study_name)
    serializer = TrialSerializer(trials, many=True)
    return Response(serializer.data)


@decorators.api_view(['GET'])
@decorators.permission_classes([IsAuthenticated])
def study_parameters(request, study_name):
    """
    Get the parameters associated to a study name. Each study define a space
    of hyperparameters (recall we are testing against AI models) as a list of
    parameter. Each parameter specifies the type of values sampled, INTEGER,
    FLOAT, ..., and the range from which the value will be sampled. A study
    must contain a set of parameters otherwise it would be useless. Thus,
    if the study name exists, we can supposed that the list of parameters
    returned is not empty. The response is a list of parameters with the
    associated data.

    Args:
        :param request: http request.
        :param study_name: name of the study for getting the trials.
    """
    params = Parameter.objects.filter(study=study_name)
    serializer = ParameterSerializer(params, many=True)
    return Response(serializer.data)


class AlgorithmList(views.APIView):
    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminUser]
    # Information about algorithms
    algorithms_info = Algorithm.algorithms()

    def get(self, request):
        """
        Return the list of available algorithms. Each entry of the list
        contains the information associated to the algorithm.
        """
        return Response(self.algorithms_info)

    def post(self, request):
        """
        Create a brand new study. This HTTP method should be invoked only
        after the algorithm code has already been submitted and checked by
        human supervisor. The method has been inserted for future development
        on Algorithm submission topic.
        """
        # TODO: in future I will allow to upload a file for new algorithm
        raise NotImplementedError("Functionality not yet implemented")


class AlgorithmDetail(views.APIView):
    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminUser]
    # Information about algorithms
    algorithms_info = Algorithm.algorithms()

    def get(self, request, id):
        """
        Get the details of a specific algorithm. The URI must include the
        algorithm name that should be queried. The response contains the
        algorithm information (name, status, create and update time).
        """
        if 0 <= id < len(self.algorithms_info):
            return Response(self.algorithms_info[id])

        return Response(request.data, status=status.HTTP_404_NOT_FOUND)


class DatasetList(views.APIView):
    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly, IsAdminUser]
    # Dataset information
    dataset_info = Dataset.dataset()

    def get(self, request):
        """
        Retrieve the list of all supported datasets. The datasets are
        agnostic from the metric but the opposite is not true. This
        dependency is modelled in the metric table.
        """
        return Response(self.dataset_info)

    def post(self, request):
        """
        Enable the support for a new dataset. The setup code of the dataset
        must be previously committed for verification, then the post can be
        called. Note the name of the dataset must be unique.
        """
        # TODO: in future I will allow to upload a file for new dataset
        raise NotImplementedError("Functionality not yet implemented")


class DatasetDetail(views.APIView):
    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsAdminUser]
    # Dataset information
    dataset_info = Dataset.dataset()

    def get(self, request, id):
        """
        Return the specific information about a dataset. The selection of the
        dataset is based on the input name in the URI requested.
        """
        if 0 <= id < len(self.dataset_info):
            return Response(self.dataset_info[id])

        return Response(request.data, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        """
        Remove the support of the dataset but not its setup code.
        """
        raise NotImplementedError("Functionality not yet implemented")


class MetricList(views.APIView):
    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsAdminUser]
    # Metric information (name, description, space, ...)
    metrics_info = Metric.metrics()

    def get(self, request):
        """
        The list of all available metrics. The metric is an AI model used to
        evaluate the algorithm behaviour.
        """
        return Response(self.metrics_info)

    def post(self, request):
        """
        Create a new metric. As for the algorithm post method, the metric
        should be properly checked by a human supervisor before using it.
        Therefore, this method should be call only after the correctly
        submission of the metric code for enabling its support. The metric
        expect the list of compliant datasets other than the metric name.
        The dataset must already be present in the database at the metric
        submission.
        """
        raise NotImplementedError("Functionality not yet implemented")


class MetricDetail(views.APIView):

    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsAdminUser]
    # Metric information (name, description, space, ...)
    metrics_info = Metric.metrics()

    def get(self, request, id):
        """
        Retrieve the metric details by name. The response is populated by all
        the store information about the metric.
        """
        if 0 <= id < len(self.metrics_info):
            return Response(self.metrics_info[id])

        return Response(request.data, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        """
        Delete the metric support from the application. Again, as for the
        algorithm the actual code corresponding to the metric will not be
        cancelled but it will not be possible to use such metric in further
        study.
        """
        raise NotImplementedError("Functionality not yet implemented")

    def put(self, request):
        """
        Update information about the metric.
        """
        raise NotImplementedError("Functionality not yet implemented")


class TrialList(mixins.ListModelMixin, generics.GenericAPIView):

    queryset = Trial.objects.order_by('study', 'status', 'training_step')
    serializer_class = TrialSerializer

    def get(self, request, *args, **kwargs):
        """
        Retrieve the list of all trials without filtering operations. The list
        of trials can be huge depending on the past activities, thus,
        this method can be harmful.

        TODO: better to return only study and id
        """
        return self.list(request, *args, **kwargs)


class TrialDetail(mixins.RetrieveModelMixin,
                  mixins.DestroyModelMixin,
                  generics.GenericAPIView):

    queryset = Trial.objects.all()
    serializer_class = TrialSerializer

    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsAdminUser]

    def get(self, request, *args, **kwargs):
        """
        Retrieve the information associated to an existing trial ID. The
        response contains all the information associated to a trail,
        study name, sampled parameter values, score (if yet),
        further score information, ...
        """
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Delete a trial by ID. This method is safe, the trial has no
        dependencies with other components for the time being.
        """
        return self.destroy(request, *args, **kwargs)


class ParameterList(mixins.CreateModelMixin,
                    mixins.ListModelMixin,
                    generics.GenericAPIView):

    queryset = Parameter.objects.order_by('study', 'type', 'name')
    serializer_class = ParameterSerializer

    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsAdminUser]

    def get(self, request, *args, **kwargs):
        """
        Retrieve the list of all parameters. In the response will be included
        all the parameters without further filtering operations.
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Create a new parameter associated to a study. The request must
        include the parameter name, type (FLOAT, INTEGER, DISCRETE and
        CATEGORICAL), the name of the associated study and either the values
        field or min-max fields. The FLOAT and INTEGER parameters expect the
        min-max fields pointing out the sampling range, while the
        remainings expect a list of values under the values filed. Note that
        the study name must be valid, i.e. an already created study must be
        present with such name.
        """
        print(request.data)
        return self.create(request, *args, **kwargs)


class ParameterDetail(mixins.RetrieveModelMixin,
                      mixins.DestroyModelMixin,
                      generics.GenericAPIView):

    queryset = Parameter.objects.all()
    serializer_class = ParameterSerializer

    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, *args, **kwargs):
        """
        Return the details of a specific parameter by id. The name of the
        parameter is not a unique field, two AI models might use the
        the same name for different parameters indeed. For getting the
        parameter id you can request the list of parameters by the study name
        or by getting the whole parameters list. The specific information
        associated to a parameter are: name, type, study, values, min and max.
        All this information are included in the GET response.
        """
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Delete a parameter from the database. Note that this operation may
        leave the study in an inconsistent state, it will miss a parameter.
        Instead, upon the deletion of a study also the related parameters
        will be deleted.
        """
        return self.destroy(request, *args, **kwargs)


class StartStudy(views.APIView):
    """
    Start a saved study.
    """
    # Set the permissions for this view
    permission_classes = [IsAuthenticated]

    def get(self, request, study_name):
        """
        Start a saved study.

        Args:
            :param request: http request
            :param study_name: name of the study to start
        :return:
            Errors or 200
        """
        study = Study.objects.get(name=study_name)
        if not study:
            return Response(request.data, status=status.HTTP_404_NOT_FOUND)

        if not Parameter.objects.filter(study=study_name).exists():
            return Response(request.data,
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        data = {
            'study_name': study_name,
            'alg_name': study.algorithm_id,
            'metric': study.metric_id,
            'dataset': study.dataset_id,
            'runs': study.runs,
            'num_suggestions': study.num_suggestions,
        }
        worker = Suggestion(**data)
        worker.start()

        return Response(request.data, status=status.HTTP_200_OK)

@decorators.api_view(['GET'])
@decorators.permission_classes([IsAuthenticated])
def openapi(request):
    """
    Get the api description file.

    Args:
        :param request:
    :return:
    """
    path = os.path.join(BASE_DIR, "API/static/openapi.yaml")
    with open(path, 'r') as stream:
        data_loaded = yaml.safe_load(stream)

    return Response(data_loaded)
