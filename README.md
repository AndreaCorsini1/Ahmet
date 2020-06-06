# Ahmet
Ahmet the last Vizier is a web framework for Black-Box Optimization (BBO). 
In general, a BBO problem consists in optimizing an expansive and complex
function f with a limited budget of resources. The domain of f is usually a 
high dimensional space where each dimension varies in N,R or a limited subset 
of them.

## Table of contents

1. [Project structure](#project-structure)
2. [Installation and startup](#installation-and-startup)
3. [General description](#general-description)
4. [Demos](#demos)
5. [References](#references)


## Project structure (#structure)
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


## Installation and startup

### API installation:
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
    
### Web App installation:

The Web Application is a Single Page Application leveraging React framework.
This means you need a valid Node.js runtime environment and the related
packet manager npm in order to build and test it. The Web App has been developed
using Node.js v14.3.0 and npm version 6.14.4, thus it is strongly recommended
to download the same versions.
Once everything is installed and set up, you just need to install the required
packages by simply invoking:
    
    npm install 

Note that the package.json file collecting all the necessary packages is
located at ./UI/Webapp/, therefore you have to call the previous command in
the same directory for letting npm finds everything the app needs.
If everything goes fine, you can start the Web App up by typing:

    npm run start


### Mobile app installation:

TODO

## General description

### Definitions

- **Trial**: a configuration (or tuple) of parameter values that will be
 evaluated
 against the BBO function f.
- **Metric**: a complex and computational heavy function f, such as a Machine
 Learning or a Neural Network model.
- **Optimization algorithm**: an algorithm that takes in a metric and a
 parameter space and generates trials. 
- **Study**: entity composed of an optimization algorithm, a metric and a set of
 trials.
- **Worker**: a process or a thread responsible of evaluating trials
 against a metric.
- **Run**: an iteration of the optimization algorithm that generated trials.

### The Framework

Ahmet has been primary designed to evaluate and point out the quality and
characteristics of different optimization algorithms. The metric used to test
the the algorithms are ML and NN models which constitute really tough BBO
problems.

The entire framework is extensible, meaning that new metrics, algorithms and
dataset can be added by end users. Currently, the extension process is not
automatic, but it needs a revision by a developer before the proposed metric,
algorithm or dataset can be used in new studies.
For instance, If an end user wants to develop its own optimization algorithm,
he can download the algorithm prototype and start to build it from there. The
prototype is an abstract class from which the newly created algorithm must
inherit. In this way Ahmet can rely on a well established interface and knows
how to call the algorithm. The same apply to the Metric and the Dataset.

The available BBO algorithms available in the framework are:

- Grid Search
- Random Search
- Scatter Search
- Bayesian Optimization

While the metrics are:

- Random Forest
- Support Vector Machine
- Simple Function (polynomial function)
- Nearest Neighbor
- Multi Layer Perceptron

And the dataset:

- Mnist/Digits
- Boston
- Breast Cancer
- Iris
- Diabetes



## Demos

#### Creation of studies
![NewStudy](Gifs/NewStudy.gif "New study demo")

#### Studies table
![Studies](Gifs/Studies.gif "Studies demo")

#### Statistics
![Statistics](Gifs/Statistics.gif "Statistics demo")


## References

Inspired by: https://research.google/pubs/pub46180/
