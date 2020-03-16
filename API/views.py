from rest_framework.permissions import IsAuthenticatedOrReadOnly, \
    IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, views
from rest_framework import mixins, generics, decorators

from API.permissions import *
from API.serializers import *

from API.tasks import Suggestion


class UserList(generics.ListAPIView):
    """
    View for getting the studies associated to each user
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
    """
    Function for work on generic studies. The operation permitted are:
        - POST: create a brand new study
        - GET: list all the available studies
    """
    queryset = Study.objects.order_by('name', 'algorithm', 'owner')
    serializer_class = StudySerializer

    # Set the permissions for this view
    permission_classes = [IsOwnerOrReadOnly,
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
    permission_classes = [IsOwnerOrReadOnly,
                          IsAdminUser]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


@decorators.api_view(['GET'])
@decorators.permission_classes([IsAuthenticated])
def study_trials(request, study_name):
    """
    Get the trials associated to a study name.

    Args:
        :param request: http request.
        :param study_name: name of the study for getting the trials.
    :return:
        Json list of the trials.
    """
    trials = Trial.objects.filter(study_name=study_name)
    serializer = TrialSerializer(trials, many=True)
    return Response(serializer.data)


@decorators.api_view(['GET'])
@decorators.permission_classes([IsAuthenticated])
def study_parameters(request, study_name):
    """
    Get the parameters associated to a study name.

    Args:
        :param request: http request.
        :param study_name: name of the study for getting the trials.
    :return:
        Json list of the parameters.
    """
    params = Parameter.objects.filter(study_name=study_name)
    serializer = ParameterSerializer(params, many=True)
    return Response(serializer.data)


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
    queryset = Algorithm.objects.all().order_by('status', 'name')
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


class DatasetList(mixins.CreateModelMixin,
                  mixins.ListModelMixin,
                  generics.GenericAPIView):
    """
    Function for work on datasets. The operation permitted are:
        - POST: create a new algorithms
        - GET: list all the available algorithms
    Note: this function should be call by a post method only if a new algorithm
    file has been uploaded.
    """
    queryset = Dataset.objects.order_by('type', 'status', 'name')
    serializer_class = DatasetSerializer

    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsAdminUser]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class DatasetDetail(mixins.RetrieveModelMixin,
                    mixins.DestroyModelMixin,
                    mixins.UpdateModelMixin,
                    generics.GenericAPIView):
    """
    Function to work on a single dataset. The allowed operations are:
        - GET: get the information about a study by its name
        - PUT: update the status of a study
        - DELETE: delete a study by its name
    """
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer
    # Field used for performing object lookup of individual model instances
    lookup_field = 'name'
    # URL argument used for object lookup
    lookup_url_kwarg = 'dataset_name'

    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsAdminUser]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


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
    queryset = Metric.objects.order_by('name', 'status')
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
    queryset = Trial.objects.order_by('study', 'status', 'training_step')
    serializer_class = TrialSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class TrialDetail(mixins.RetrieveModelMixin,
                  mixins.DestroyModelMixin,
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
    queryset = Parameter.objects.order_by('study', 'type', 'name')
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
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class StartStudy(views.APIView):
    """
    Start a saved study.
    """
    # Set the permissions for this view
    permission_classes = [IsAuthenticated]

    def get(self, request, study_name, format=None):
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

        if not Parameter.objects.filter(study_name=study_name).exists():
            return Response(request.data,
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not Algorithm.objects.filter(name=study.algorithm.name).exists():
            return Response(request.data,
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        data = {
            'study_name': study_name,
            'alg_name': study.algorithm.name,
            'runs': study.runs,
            'num_suggestions': study.num_suggestions,
            'model_name': study.metric.name,
            'dataset': study.dataset.name,
            'model_type': study.dataset.type
        }
        worker = Suggestion(**data)
        worker.start()
        print("Do not block API")

        return Response(request.data, status=status.HTTP_200_OK)
