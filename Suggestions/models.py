# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models


class Algorithm(models.Model):
    """
    Wrapper around algorithms hardcoded. This model defines:
        - Name: unique name of the algorithm
        - Status: always available (for the moment)
        - Creation time
        - Update time
    """
    name = models.CharField(max_length=128, blank=False, unique=True)

    status = models.CharField(max_length=128, blank=False)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}-{}".format(self.id, self.name)

    @classmethod
    def create(cls, name):
        algorithm = cls()
        algorithm.name = name
        algorithm.status = "AVAILABLE"
        algorithm.save()
        return algorithm

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
    study_configuration = models.TextField(blank=False)
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE,
                                  to_field='name')

    status = models.CharField(max_length=128, blank=False)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}-{}".format(self.id, self.name)

    @classmethod
    def create( cls,
                name,
                study_configuration,
                algorithm="RandomSearch",
                status="Pending"):
        study = cls()
        study.name = name
        study.study_configuration = study_configuration
        study.algorithm = Algorithm.objects.get(name=algorithm)
        study.status = status
        study.save()
        return study

    @classmethod
    def from_dict(self, dict):
        return Study(dict["name"],
                     dict["study_configuration"],
                     dict["algorithm"],
                     dict["id"],
                     dict["status"],
                     dict["created_time"],
                     dict["updated_time"])

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "study_configuration": self.study_configuration,
            "algorithm": self.algorithm.name,
            "status": self.status,
            "created_time": self.created_time,
            "updated_time": self.updated_time
        }

    def to_dict(self):
        return {
            "name": self.name,
            "study_configuration": self.study_configuration,
            "algorithm": self.algorithm.name
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

    TODO: Split the parameters in 4 atomic types
    """
    name = models.CharField(max_length=128, blank=False)
    study_name = models.ForeignKey(Study, on_delete=models.CASCADE,
                                   to_field='name')
    parameter_values = models.TextField(blank=True, null=True)
    objective_value = models.FloatField(blank=True, null=True)

    status = models.CharField(max_length=128, blank=False)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}-{}".format(self.id, self.name)

    @classmethod
    def create(cls, study_name, name):
        trial = cls()
        trial.study_name = Study.objects.get(name=study_name)
        trial.name = name
        trial.status = "Pending"
        trial.save()
        return trial

    @classmethod
    def from_dict(self, dict):
        return Trial(dict["study_name"],
                     dict["name"],
                     dict["parameter_values"],
                     dict["objective_value"],
                     dict["status"],
                     dict["created_time"],
                     dict["updated_time"])

    def to_json(self):
        return {
            "id": self.id,
            "study_name": self.study_name,
            "name": self.name,
            "parameter_values": self.parameter_values,
            "objective_value": self.objective_value,
            "status": self.status,
            "created_time": self.created_time,
            "updated_time": self.updated_time
        }

    def to_dict(self):
        return {"study_name": self.study_name, "name": self.name}


class TrialMetric(models.Model):
    """

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
    def from_dict(self, dict):
        return TrialMetric(dict["trial_id"],
                           dict["training_step"],
                           dict["objective_value"],
                           dict["id"],
                           dict["created_time"],
                           dict["updated_time"])

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
