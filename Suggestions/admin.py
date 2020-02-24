from django.contrib import admin
from .models import Study, Trial, Algorithm, TrialMetric

# Register your models here.
admin.register(Study, Trial, TrialMetric, Algorithm)
