# Generated by Django 3.0.2 on 2020-03-04 11:44

import API.choices
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0002_auto_20200302_1154'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parameter',
            name='type',
            field=models.CharField(choices=[('DISCRETE', 'Discrete'), ('CATEGORICAL', 'Categorical'), ('DOUBLE', 'Double'), ('INTEGER', 'Integer')], default=API.choices.TYPE['CATEGORICAL'], max_length=128),
        ),
        migrations.AlterField(
            model_name='study',
            name='objective',
            field=models.IntegerField(choices=[('MAXIMIZE', 1), ('MINIMIZE', 2)], default=2),
        ),
    ]
