# Generated by Django 3.0.2 on 2020-03-05 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0007_auto_20200305_1518'),
    ]

    operations = [
        migrations.AlterField(
            model_name='parameter',
            name='type',
            field=models.CharField(choices=[('DISCRETE', 'discrete'), ('CATEGORICAL', 'categorical'), ('DOUBLE', 'double'), ('INTEGER', 'integer')], max_length=128),
        ),
    ]