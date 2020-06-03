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
    |  
    |--> UI
    |     |--> Webapp: folder containing the web application (front-end).
    |     |--> Mobileapp: folder containing the mobile application (.apk).
    |
    |--> requirements.txt

### Installation
How to install the overall application and its single modules.

### Startup
How we start the application, specifically for the API and Webapp.

### General description
What the application does.

![Home](https://octodex.github.com/images/yaktocat.png)

Inspired by: https://research.google/pubs/pub46180/