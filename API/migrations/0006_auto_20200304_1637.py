# Generated by Django 3.0.2 on 2020-03-04 16:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0005_auto_20200304_1352'),
    ]

    operations = [
        migrations.AlterField(
            model_name='study',
            name='objective',
            field=models.CharField(choices=[('MAXIMIZE', 'maximize'), ('MINIMIZE', 'minimize')], default='MINIMIZE', max_length=128),
        ),
    ]