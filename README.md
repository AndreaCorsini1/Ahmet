# Ahmet
Ahmet the last Vizier is a web framework for Black-Box Optimization (BBO). 
In general, a BBO problem consists in optimizing an expansive
function f with a limited budget of resources. The domain of f is usually a 
high dimensional space where each dimension varies in N,R or a limited subset 
of them.

### Definitions:
- Trial: a list of parameter values that will be evaluated against f.
- Metric: a machine learning model representing the function f.
- Study: entity composed of a BBO algorithm, a metric and the trials.
- Worker: a process or a thread responsible of evaluating a trial x.
- Run: a complete optimization execution of the problem.

### Structure
    /
    |--> Ahmet
    |     |--> urls: controllers of the API.
    |     |--> settings: settings of the API.
    |
    |--> API
    |     |--> Algorithms: folder containing the available BBO algorithms.
    |     |--> Dataset: folder containing the dataset used by the metric.
    |     |--> EarlyStoppings: folder containing the early stopping algorithms.
    |     |--> Metrics: folder containing the metrics.
    |     |--> Static: folder containing the pototypes and openapi specs.
    |  
    |--> UI
    |     |--> Webapp: folder containing the web application (front-end).
    |     |--> Mobileapp: folder containing the mobile application (.apk).
    |
    |--> requirements.txt

### Installation and startup

#### API installation:
The api needs only a valid Python 3 interpreter and can be easily installed
within a dedicated virtual environment:
For creating a new venv in Python 3:
    
    python3 -m venv /path/to/venv
    
Once the venv is installed, it must be activated before installing third-party libraries:
    
    source /path/to/venv/bin/activate
    
And then all the required libraries can be easily installed with:

    pip install -r /path/to/requirements.txt
    
Make sure to use the right path to the requirements.txt file.
The last step required before having correctly set up the API, is the
database migration step. Still in the venv, type the following two lines:

    python manage.py makemigrations
    python manage.py migrate
    
This should be enough for creating a local database that will be used by the
api. Finally, you can start the api with:

    python manage.py runserver localhost:8080
    
#### Web app installation:

TODO

#### Mobile app installation:

TODO

### General description

What the application does.

#### Creation of studies

![NewStudy](Gifs/NewStudy.gif "New study demo")

#### Studies table

![Studies](Gifs/Studies.gif "Studies demo")

#### Statistics

![Statistics](Gifs/Statistics.gif "Statistics demo")


### References

Inspired by: https://research.google/pubs/pub46180/
