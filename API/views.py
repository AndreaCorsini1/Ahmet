from rest_framework.permissions import IsAuthenticatedOrReadOnly, \
    IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, views
from rest_framework import mixins, generics, decorators

from API.permissions import *
from API.serializers import *

from API.Algorithms.GridSearch import GridSearch
from API.Algorithms.RandomSearch import RandomSearch
from API.Algorithms.ScatterSearch import ScatterSearch

from API.Models.SimpleFunction import SimpleFunction
from API.Models.KNeighbors import KNeighbors
from API.Models.RandomForest import RandomForest
from API.Models.SVM import SVM

from API.EarlyStoppings.NoEarlyStopping import NoEarlyStopping
from API.EarlyStoppings.RandomEarlyStopping import RandomEarlyStopping

import json


class UserList(generics.ListAPIView):
    """

    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    """

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
    queryset = Study.objects.order_by('-updated_time', 'owner')
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
    queryset = Algorithm.objects.all().order_by('name')
    serializer_class = AlgorithmSerializer

    # Set the permissions for this view
    permission_classes = [IsAuthenticatedOrReadOnly,
                          IsAdminUser]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


@decorators.api_view(['GET'])
@decorators.permission_classes([IsAuthenticated])
def study_trials(request, study_name):
    """

    Args:
        :param request:
        :param study_name:
    :return:
    """
    trials = Trial.objects.filter(study_name=study_name)
    serializer = TrialSerializer(trials, many=True)
    return Response(serializer.data)


@decorators.api_view(['GET'])
@decorators.permission_classes([IsAuthenticated])
def study_parameters(request, study_name):
    """

    Args:
        :param request:
        :param study_name:
    :return:
    """
    params = Parameter.objects.filter(study_name=study_name)
    serializer = ParameterSerializer(params, many=True)
    return Response(serializer.data)


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
    queryset = Metric.objects.order_by('name')
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
    queryset = Trial.objects.order_by('study_name', 'status')
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
    queryset = Parameter.objects.order_by('study_name', 'name')
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


class Worker(views.APIView):
    """
    TODO: implement hook for early stopping
    """
    # Set the permissions for this view
    permission_classes = [IsAuthenticated]

    def get_model(self, name):
        """
        TODO: add type and dataset

        :param name:
        :return:
        """
        if name == 'Svm':
            model = SVM()
        elif name == 'SimpleFunction':
            model = SimpleFunction()
        elif name == 'KNeighbors':
            model = KNeighbors()
        elif name == 'RandomForest':
            model = RandomForest()
        else:
            model = None

        return model

    def early_stopping(self, study_name):
        """

        :param study_name:
        :return:
        """
        old_trial = []
        pending_trial = []

        trials = Trial.objects.filter(study_name=study_name)
        serializer = TrialSerializer(trials, many=True)

        for trial in serializer.data:
            # TODO: started?
            if STATUS[trial['status']] is STATUS.PENDING:
                pending_trial.append(trial)
            elif STATUS[trial['status']] is STATUS.COMPLETED:
                old_trial.append(trial)

        e_stopper = RandomEarlyStopping()
        trials_to_stop = e_stopper.get_trials_to_stop(pending_trial, old_trial)

        print(trials_to_stop)
        if trials_to_stop:
            for trial in trials_to_stop:
                obj = trials.get(id=trial['id'])
                obj.status = STATUS.STOPPED.name
                obj.save()

    def get(self, request, study_name, pk, format=None):
        """

        Args:
            :param request:
            :param study_name:
            :param pk:
            :param format:
        :return:
        """
        trial = Trial.objects.get(id=pk, study_name=study_name)
        if not trial:
            return Response(request.data, status=status.HTTP_400_BAD_REQUEST)

        if STATUS[trial.status] is STATUS.PENDING:

            study = Study.objects.get(name=study_name)
            if not study:
                return Response(request.data, status=status.HTTP_400_BAD_REQUEST)

            model = self.get_model(study.metric.name)
            if not model:
                return Response(request.data,
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            params = json.loads(trial.parameters)
            trial.status = STATUS.STARTED.name
            trial.save(update_fields=['status'])

            print(params)
            results = model.evaluate(params)
            if 'score' not in results:
                return Response(results, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            trial.score = results.pop('score', 0)
            trial.status = STATUS.COMPLETED.name
            # TODO: trial.score_info = json.dumps(results)
            trial.save()

            self.early_stopping(study_name)

        return Response(request.data, status=status.HTTP_200_OK)


class Suggestion(views.APIView):
    """

    """
    # Set the permissions for this view
    permission_classes = [IsAuthenticated]

    def get_algorithm(self, name):
        """

        :param name:
        :return:
        """
        if name == "RandomSearch":
            algorithm = RandomSearch()
        elif name == "GridSearch":
            algorithm = GridSearch()
        # elif name == "ScatterSearch":
        #    algorithm = ScatterSearch()
        # elif study.algorithm == "BayesianOptimization":
        #  algorithm = BayesianOptimization()
        # elif study.algorithm == "TPE":
        #  algorithm = TpeAlgorithm()
        else:
            algorithm = None

        return algorithm

    def get_space(self, study_name):
        """

        :param study_name:
        :return:
        """
        space = Parameter.objects.filter(study_name=study_name).values()

        for param in space:

            if TYPE[param['type']] is TYPE.INTEGER:
                param['min'] = int(param['min'])
                param['max'] = int(param['max'])

            elif TYPE[param['type']] is TYPE.DISCRETE:
                param['values'] = [float(val)
                                   for val in param['values'].split(',')]

            elif TYPE[param['type']] is TYPE.CATEGORICAL:
                param['values'] = [val.strip()
                                   for val in param['values'].split(',')]

        return space

    def save_trials(self, study_name, new_trials):
        """

        Args:
            :param study_name:
            :param new_trials:
        :return:
        """
        if new_trials:

            trials = [{
                'study_name': study_name,
                'status': STATUS.PENDING.name,
                'parameters': json.dumps(values)
            } for values in new_trials]

            serializer = TrialSerializer(data=trials, many=True)
            if not serializer.is_valid():
                return Response(serializer.errors,
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response({}, status=status.HTTP_200_OK)

    def get(self, request, study_name, format=None):
        """
        TODO: expose num suggestions and budget (and runs)

        :param request:
        :param study_name:
        :return:
        """
        study = Study.objects.get(name=study_name)
        if not study:
            return Response(request.data, status=status.HTTP_400_BAD_REQUEST)

        algorithm = self.get_algorithm(study.algorithm.name)
        if not algorithm:
            return Response(request.data,
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        space = self.get_space(study_name)
        if not space:
            return Response(request.data, status=status.HTTP_404_NOT_FOUND)

        trials_obj = Trial.objects.filter(study_name=study_name)
        trials = [json.loads(trial.parameters) for trial in trials_obj]
        new_trials = algorithm.get_suggestions(space, trials)

        return self.save_trials(study_name, new_trials)
