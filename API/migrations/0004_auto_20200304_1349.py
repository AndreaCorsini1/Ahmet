# Generated by Django 3.0.2 on 2020-03-04 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0003_auto_20200304_1144'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parameter',
            name='type',
            field=models.CharField(choices=[('DISCRETE', 'discrete'), ('CATEGORICAL', 'categorical'), ('DOUBLE', 'double'), ('INTEGER', 'integer')], default='categorical', max_length=128),
        ),
    ]
