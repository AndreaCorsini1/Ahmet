# Generated by Django 3.0.2 on 2020-03-05 15:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0006_auto_20200304_1637'),
    ]

    operations = [
        migrations.AddField(
            model_name='parameter',
            name='max',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='parameter',
            name='min',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='parameter',
            name='values',
            field=models.TextField(blank=True, null=True),
        ),
    ]
