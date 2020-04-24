# Ahmet
Ahmet the last Vizier is a web framework for Black-Box Optimization
(BBO). In general, a BBO problem consists in optimizing an expansive
function f with a limited budget of resources. The domain of f is usually a 
high dimensional space where each dimension varies in N,R or a limited subset 
of them.

### Definitions:
	- Trial: a list of parameter values that will be evaluated against f.
	- Metric: a machine learning model representing the function f.
	- Study: entity composed of a BBO algorithm, a metric and the trials.
	- Worker: a process or a thread responsible of evaluating a trial x.
	- Run: a complete optimization execution of the problem.

Inspired by: https://research.google/pubs/pub46180/