# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from API.choices import *


class Algorithm(models.Model):
    """
    Model used to keep the algorithms supported. I could allow in future to
    upload a new file containing an algorithm. Such upload should add an entry
    to this table for extending the support to entire framework.
    This class defines:
        - Name: unique name of the algorithm
        - Status: always available (for the moment)
        - Creation time
        - Update time
    """
    name = models.CharField(max_length=128, blank=False, unique=True)

    status = models.CharField(max_length=128, blank=True, default="AVAILABLE")
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

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
    name = models.CharField(max_length=128, blank=False, unique=True)

    status = models.CharField(max_length=128, blank=False, default="AVAILABLE")
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}".format(self.name)


class Study(models.Model):
    """
    A complete study is defined by:
        - Name: unique name of the study
        - Study configuration: sequence of parameters to apply to the model
        - Algorithm selected (FK constraint)
        - Status of the study
        - Created time
        - Update time
    """
    name = models.CharField(max_length=128, blank=False, unique=True)
    objective = models.CharField(max_length=128, choices=OBJECTIVE.choices())
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE,
                                  to_field='name', default='RandomSearch')
    metric = models.ForeignKey(Metric, on_delete=models.CASCADE,
                               to_field='name', default='SimpleFunction')

    owner = models.ForeignKey('auth.User', related_name='studies',
                              to_field='username', on_delete=models.CASCADE)
    status = models.CharField(max_length=128, blank=False, default='PENDING')
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}".format(self.name)


class Parameter(models.Model):
    """
    Define the four types of parameters defining the search space of a study.
    The algorithms will pick values from this parameter to make suggestions.
    Parameter types:
        - Double: decimal values selected from an interval define as [a, b]
        - Integer: integer values selected from the interval [a, b]
        - Discrete: sequence of integer values
        - Categorical: sequence of values
    """
    name = models.CharField(max_length=128, blank=False, null=False)
    type = models.CharField(max_length=128, choices=TYPE.choices())
    study_name = models.ForeignKey(Study, on_delete=models.CASCADE,
                                   to_field='name')

    # Values used for storing discrete and categorical params
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
        - Study name: foreign key of the study to which the trial belongs
        - Parameters: json text containing the parameter values
        - Training step:
        - Score:
        - Status of the trial
        - Created time
        - Update time
    """
    study_name = models.ForeignKey(Study, on_delete=models.CASCADE,
                                   to_field='name')
    parameters = models.TextField(blank=True, null=True)
    training_step = models.IntegerField(blank=True, null=True, default=0)
    score = models.FloatField(blank=True, null=True, default=0)
    score_info = models.TextField(blank=True, null=True)

    status = models.CharField(max_length=128, choices=STATUS.choices())
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "id: {}, study_name: {}, status: {}".format(
            self.id, self.study_name, self.status)
