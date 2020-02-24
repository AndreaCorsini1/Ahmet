#!/usr/bin/env python

from sklearn import datasets, svm, metrics

from Examples.Scikitlearn.scikitlearn_util import main


def model(params):
  """

  :param params:
  :return:
  """
  digits = datasets.load_digits()

  images_and_labels = list(zip(digits.images, digits.target))
  n_samples = len(digits.images)
  data = digits.images.reshape((n_samples, -1))

  classifier = svm.SVC(gamma=params["gamma"], C=params["C"],
                       kernel=params["kernel"], coef0=params["coef0"])

  classifier.fit(data[:n_samples // 2], digits.target[:n_samples // 2])

  expected = digits.target[n_samples // 2:]
  predicted = classifier.predict(data[n_samples // 2:])

  print("Classification report for classifier %s:\n%s\n" %
        (classifier, metrics.classification_report(expected, predicted)))

  accuracy = metrics.accuracy_score(expected, predicted)
  #print(accuracy)
  return accuracy

if __name__ == "__main__":
  main(model)
