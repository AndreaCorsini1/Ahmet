# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from API.utils import TYPE, OBJECTIVE


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
        return "{}-{}".format(self.id, self.name)

    def to_json(self):
        return {"name": self.name}


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
        return "{}-{}".format(self.id, self.name)

    def to_json(self):
        return {"name": self.name}


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
    objective = models.IntegerField(choices=OBJECTIVE.choices(),
                                    default=2)
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE,
                                  to_field='name', default='RandomSearch')
    metric = models.ForeignKey(Metric, on_delete=models.CASCADE,
                               to_field='name', default='SimpleFunction')

    owner = models.ForeignKey('auth.User', related_name='studies',
                              to_field='username', on_delete=models.CASCADE)
    status = models.CharField(max_length=128, blank=False, default='Pending')
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}-{}".format(self.id, self.name)

    @classmethod
    def from_dict(cls, data):
        return Study(data["id"],
                     data["name"],
                     data["objective"],
                     data["algorithm"],
                     data["metric"],
                     data["status"],
                     data["created_time"],
                     data["updated_time"])

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "goal": self.objective,
            "algorithm": self.algorithm.name,
            "metric": self.metric.name,
            "status": self.status,
            "created_time": self.created_time,
            "updated_time": self.updated_time
        }

    def to_dict(self):
        return {
            "name": self.name,
            "goal": self.objective,
            "algorithm": self.algorithm.name,
            "metric": self.metric.name
        }


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
    type = models.CharField(max_length=128, choices=TYPE.choices(),
                            default=TYPE.CATEGORICAL.name)
    study = models.ForeignKey(Study, on_delete=models.CASCADE,
                              to_field='name')

    values = models.TextField(blank=False)

    def __str__(self):
        return "{}-{}".format(self.name, self.values)

    @classmethod
    def from_dict(cls, data):
        return Parameter(data["name"], data["type"], data["values"])

    def to_dict(self):
        return {
            "name": self.name,
            "type": self.type,
            "values": self.values,
        }

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "values": self.values
        }


class Trial(models.Model):
    """
    This model defines the parameter values for a study. In particular,
    it defines:
        - Name: name of the trial
        - Study name: foreign key of the study to which the trial belongs
        - Parameters values: json text containing the parameter values
        - Objective value
        - Status of the trial
        - Created time
        - Update time
    """
    name = models.CharField(max_length=128, blank=False)
    study_name = models.ForeignKey(Study, on_delete=models.CASCADE,
                                   to_field='name')
    parameter_values = models.TextField(blank=True, null=True)
    training_step = models.IntegerField(blank=True, null=True)
    score = models.FloatField(blank=True, null=True)

    status = models.CharField(max_length=128, blank=False, default='Pending')
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}-{}".format(self.id, self.name)

    @classmethod
    def from_dict(cls, data):
        return Trial(data["study_name"],
                     data["name"],
                     data["parameter_values"],
                     data["score"],
                     data["status"],
                     data["created_time"],
                     data["updated_time"])

    def to_json(self):
        return {
            "id": self.id,
            "study_name": self.study_name,
            "name": self.name,
            "parameter_values": self.parameter_values,
            "objective_value": self.score,
            "status": self.status,
            "created_time": self.created_time,
            "updated_time": self.updated_time
        }

    def to_dict(self):
        return {
            "study_name": self.study_name,
            "name": self.name,
            "parameter_values": self.parameter_values,
            "score": self.score
        }


class TrialMetric(models.Model):
    """
    Not used. Deprecated by Metric.
    """
    trial_id = models.IntegerField(blank=False)
    training_step = models.IntegerField(blank=True, null=True)
    objective_value = models.FloatField(blank=True, null=True)

    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Id: {}, trial id: {}, training_step: {}".format(
            self.id, self.trial_id, self.training_step)

    @classmethod
    def create(cls, trial_id, training_step, objective_value):
        trial_metric = cls()
        trial_metric.trial_id = trial_id
        trial_metric.training_step = training_step
        trial_metric.objective_value = objective_value
        trial_metric.save()
        return trial_metric

    @classmethod
    def from_dict(cls, data):
        return TrialMetric(data["trial_id"],
                           data["training_step"],
                           data["objective_value"],
                           data["id"],
                           data["created_time"],
                           data["updated_time"])

    def to_json(self):
        return {
            "id": self.id,
            "trial_id": self.trial_id,
            "training_step": self.training_step,
            "objective_value": self.objective_value,
            "created_time": self.created_time,
            "updated_time": self.updated_time
        }

    def to_dict(self):
        return {
            "trial_id": self.trial_id,
            "training_step": self.training_step,
            "objective_value": self.objective_value
        }
