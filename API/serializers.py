from django.contrib.auth.models import User
from rest_framework import serializers

from API.models import *
import json


class UserSerializer(serializers.ModelSerializer):
    """

    """
    studies = serializers.PrimaryKeyRelatedField(many=True,
                                                 queryset=Study.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'studies']


class AlgorithmSerializer(serializers.ModelSerializer):
    """

    """
    class Meta:
        model = Algorithm
        fields = '__all__'
        read_only_fields = ['id', 'created_time']


class MetricSerializer(serializers.ModelSerializer):
    """

    """
    class Meta:
        model = Metric
        fields = '__all__'
        read_only_fields = ['id', 'created_time']


class StudySerializer(serializers.ModelSerializer):
    """

    """
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
    """

    """

    def validate(self, attrs):
        """
        Additional validation for checking that the right fields are pass
        for each type of parameter. In particular:
            - CATEGORICAL and DISCRETE need values field
            - INTEGER and DOUBLE need min and max fields

        Args:
            :param attrs:
        :return:
        """
        if TYPE[attrs['type']] is TYPE.FLOAT or \
                TYPE[attrs['type']] is TYPE.INTEGER:

            if 'min' not in attrs or 'max' not in attrs:
                msg = 'Fields \'min\' and \'max\' must be given for INTEGER ' \
                      'or DOUBLE parameters'
                raise serializers.ValidationError(msg)

            if attrs['min'] >= attrs['max']:
                msg = 'Field min must be lower than max'
                raise serializers.ValidationError(msg)

        elif TYPE[attrs['type']] is TYPE.DISCRETE or \
                TYPE[attrs['type']] is TYPE.CATEGORICAL:

            if 'values' not in attrs:
                msg = 'Field \'values\' must be given for DISCRETE or ' \
                      'CATEGORICAL parameters'
                raise serializers.ValidationError(msg)

        else:
            raise serializers.ValidationError()

        return attrs

    class Meta:
        model = Parameter
        fields = '__all__'
        read_only_fields = ['id', 'created_time']


class TrialSerializer(serializers.ModelSerializer):
    """
    Serialize and deserialized trial instances.
    Ensure to pass from the serializer for adjusting the parameters for backend.
    """
    class Meta:
        model = Trial
        fields = '__all__'
        read_only_fields = ['id', 'created_time']

    def to_representation(self, instance):
        """
        Convert the serialized parameters dict to a real dictionary.

        Args:
            :param instance: instance to be deserialized
        :return: deserialized instance
        """
        ret = super().to_representation(instance)

        if ret.get('parameters', False):
            ret['parameters'] = json.loads(ret['parameters'])

        return ret

    def to_internal_value(self, data):
        """
        Convert the input parameter dictionary to a serialized string.

        Args:
            :param data: unvalidated data that may contain the parameters field
        :return: the serialized data
        """
        if data.get('parameters', False):
            data['parameters'] = json.dumps(data['parameters'])

        if data.get('score_info', False):
            data['score_info'] = json.dumps(data['score_info'])

        return super().to_internal_value(data)

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
