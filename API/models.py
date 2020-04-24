
from __future__ import unicode_literals
from django.db import models
from API.choices import *


class Algorithm(models.Model):
    """
    Model used to keep the supported algorithms. I could allow in future to
    upload a new file containing an algorithm. Such upload should add an entry
    to this table for extending the support to entire framework.
    This class defines:
        - Name: unique name of the algorithm
        - Status: always available (for the moment)
        - Creation time
        - Update time
    """
    # Contain only letters, numbers, underscores or hyphens
    name = models.SlugField(max_length=128, blank=False, unique=True)

    status = models.CharField(max_length=128, default="AVAILABLE")
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}".format(self.name)


class Dataset(models.Model):
    """
    Dataset supported by the framework. Each dataset should be used for a
    regression 'r' or classification 'c' problem. Such distinction impacts also
    the metric.
    """
    # Contain only letters, numbers, underscores or hyphens
    name = models.SlugField(max_length=128, blank=False, unique=True)
    type = models.SlugField(max_length=128, blank=False)

    status = models.CharField(max_length=128, default="AVAILABLE")

    def __str__(self):
        return "{}".format(self.name)


class Metric(models.Model):
    """
    Model used to keep the models supported. As for the algorithm class,
    I could allow in future to upload a new file containing an algorithm.
    Such upload should add an entry to this table for extending the support
    to entire framework.
    This class defines:
        - Name: unique name of the algorithm
        - Status: always available (for the moment)
        - Creation time
        - Update time
    """
    # Contain only letters, numbers, underscores or hyphens
    name = models.SlugField(max_length=128, blank=False, unique=True)
    # Supported dataset
    datasets = models.ManyToManyField(Dataset, blank=True,
                                      related_name='datasets')

    status = models.CharField(max_length=128, blank=False, default="AVAILABLE")
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}".format(self.name)


class Study(models.Model):
    """
    The study is the core of the DB. A study defines which algorithm should
    be tested on which metric.
    A complete study is defined by:
        - name: unique name of the study.
        - algorithm: name of the algorithm used by the study (FK constraint).
        - runs: number of times the algorithm is queried for suggestions
                within the study.
        - num_suggestions: number of suggestions generated at each run by the
                           algorithm.
        - metric: model to used for evaluating the suggestions produced by
                  the algorithm (FK constraint).
        - dataset: name of the dataset to used within the model, the model type
                   (regression or classification) is derived from the dataset.
        - owner: person to which the study belongs, only him and the admin can
                 act on the study.
        - status: current status of the study (pending, completed, ...)
    """
    # Contain only letters, numbers, underscores or hyphens
    name = models.SlugField(max_length=128, blank=False, unique=True)

    # Algorithm and relative settings (runs of the algorithm and number of
    # suggestions generated for each run)
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE,
                                  to_field='name', default='RandomSearch')
    runs = models.IntegerField(blank=False, default=10)
    num_suggestions = models.IntegerField(blank=False, default=10)

    # Metric and relative settings (dataset)
    metric = models.ForeignKey(Metric, on_delete=models.CASCADE,
                               to_field='name', default='SimpleFunction')
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE,
                                to_field='name', default='iris')

    # Other info
    owner = models.ForeignKey('auth.User', related_name='studies',
                              to_field='username', on_delete=models.CASCADE)
    status = models.CharField(max_length=128, blank=False, default='PENDING')
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}".format(self.name)


class Parameter(models.Model):
    """
    Define the hyper-parameters building the search space of a study.
    The algorithms will pick values from these parameters to make suggestions.
    Parameter types:
        - Double: decimal values selected from an interval define as [a, b]
        - Integer: integer values selected from the interval [a, b]
        - Discrete: sequence of integer values
        - Categorical: sequence of values
    """
    # Contain only letters, numbers, underscores or hyphens
    name = models.SlugField(max_length=128, blank=False, null=False)
    type = models.CharField(max_length=128, choices=TYPE.choices())
    study = models.ForeignKey(Study, on_delete=models.CASCADE, to_field='name')

    # Values is used to store discrete and categorical params
    values = models.TextField(blank=True, null=True)
    # Min and max for define interval for integer and float params
    min = models.FloatField(blank=True, null=True)
    max = models.FloatField(blank=True, null=True)

    def __str__(self):
        return "{}".format(self.name)


class Trial(models.Model):
    """
    This model defines the parameter values for a study. In particular,
    it defines:
        - study: foreign key of the study to which the trial belongs
        - parameters: json dump containing the parameter values in form of str
        - training step: always zero for the moment
        - score: final score value produced by the trial on the model
        - score_info: other information about the trial result.
        - status: status of the trial (pending, started, completed, ...)
    """
    study = models.ForeignKey(Study, on_delete=models.CASCADE, to_field='name')
    parameters = models.TextField(blank=True, null=True)
    # Not used for the moment
    training_step = models.IntegerField(blank=True, null=True, default=0)
    score = models.FloatField(blank=True, null=True, default=0)
    score_info = models.TextField(blank=True, null=True)

    status = models.CharField(max_length=128, choices=STATUS.choices())
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "id: {}, study_name: {}, status: {}".format(
            self.id, self.study.name, self.status)
