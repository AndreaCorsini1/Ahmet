from django.shortcuts import render
from django.http import HttpResponse

# View for organizing
def index(request):
    return HttpResponse("Hello Django, it's the suggestion view here!")
