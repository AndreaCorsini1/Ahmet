from django.contrib.auth.models import User
from rest_framework import serializers

from API.models import *


class UserSerializer(serializers.ModelSerializer):
    studies = serializers.PrimaryKeyRelatedField(many=True,
                                                 queryset=Study.objects.all())
    class Meta:
        model = User
        fields = ['id', 'username', 'studies']


class AlgorithmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Algorithm
        fields = '__all__'
        read_only_fields = ['id', 'created_time']


class MetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = Metric
        fields = '__all__'
        read_only_fields = ['id', 'created_time']


class StudySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Study
        fields = '__all__'
        read_only_fields = ['id', 'created_time']

    def update(self, instance, validated_data):
        """
        Update the status and the update time only.

        Args:
            :param instance:
            :param validated_data:
        :return:
        """
        # Get the status in the data, otherwise return the current status of the
        # instance
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        return instance


class ParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parameter
        fields = '__all__'
        read_only_fields = ['id', 'created_time']


class TrialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trial
        fields = '__all__'
        read_only_fields = ['id', 'created_time']

    def update(self, instance, validated_data):
        """
        Update the status and the update time only.

        Args:
            :param instance:
            :param validated_data:
        :return:
        """
        # Get the status in the data, otherwise return the current status of the
        # instance
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        return instance
