/**
 * Homepage.
 */
import React, {Component} from "react";
import {Container, Row, Col, Button} from "react-bootstrap";
import Highlight from "react-highlight";

class Home extends Component {
  constructor(props) {
    super(props);
  }

  algorithmSection() {
    return (
      <Container>
        Each BBO algorithm supported by Ahmet must inherit from a common
        abstract class. This class is:
        <Col className="mt-2">
          <Highlight language="python">
{"class Algorithm(object):\n" +
"    \"\"\"\n" +
"    Abstract class used to define the algorithm template.\n" +
"    Override the __info__ dictionary in subclasses for providing information\n" +
"    about the algorithm in the web app (front-end). Note that the allowed keys\n" +
"    (the keys that will be displayed) are the ones reported below.\n" +
"    The __sort__ option points out the way in which the algorithms will be\n" +
"    sorted when the information is displayed (default ordering is by name).\n" +
"    \"\"\"\n" +
"    __metaclass__ = abc.ABCMeta\n" +
"    __info__ = {\n" +
"        \"name\": 'No name',                  # name of the algorithm\n" +
"        \"enabled\": True,                    # whether or not enabled\n" +
"        \"description\": 'No description',    # brief algorithm description\n" +
"        \"supported_params\": []              # list of parameter types supported\n" +
"    }\n" +
"    __sort__ = \"name\"\n" +
"\n" +
"    @abc.abstractmethod\n" +
"    def get_suggestions(self, space, old_trials, num_suggestions=10, budget=20):\n" +
"        \"\"\"\n" +
"        Get a list of parameter configurations sampled from the input space.\n" +
"\n" +
"        Args:\n" +
"            :param space: the space from which the parameter configurations\n" +
"                          are sampled\n" +
"            :param old_trials: list of previously generated configurations\n" +
"            :param num_suggestions: maximum number of configurations\n" +
"                                    produced, it might be lower\n" +
"            :param budget: number of attempts for generating a single parameter\n" +
"                           configuration\n" +
"        :return: a list of sampled configurations\n" +
"        \"\"\"\n" +
"        raise NotImplementedError"}
          </Highlight>
        </Col>
        <Row className="text-center">
          <Col>
            <Button href="http://localhost:8080/static/code/AbstractAlgorithm.py">
              Download template class
            </Button>
          </Col>
          <Col>
            <Button variant="success" className="justify-content-md-center">
              Upload algorithm
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  metricSection() {
    return (
      <Container>
        Every metric in Ahmet derives from a a common abstract class. This class is:
        <Col className="mt-2">
          <Highlight language="python">
{"class Metric(object):\n" +
"    \"\"\"\n" +
"    Abstract class used to define the metric template.\n" +
"    Override the __info__ dictionary in subclasses for providing information\n" +
"    about the metric in the web app (front-end). Note that the allowed keys\n" +
"    (the keys that will be displayed) are the ones reported below.\n" +
"    The __sort__ option points out the way in which the metric will be\n" +
"    sorted when the information is displayed (default ordering is by name).\n" +
"    \"\"\"\n" +
"    __metaclass__ = abc.ABCMeta\n" +
"    __info__ = {\n" +
"        \"name\": 'No name',                  # Name of the metric\n" +
"        \"enabled\": True,                    # Is the metric available?\n" +
"        \"description\": 'No description',    # Description of the metric\n" +
"        \"space\": {},                        # Parameter space required by the metric\n" +
"        \"supported_dataset\": []             # Type of supported dataset: regression and/or classification\n" +
"    }\n" +
"    __sort__ = \"name\"\n" +
"\n" +
"    def __init__(self, dataset, test_size=0.33, seed=None, shuffle=True):\n" +
"        \"\"\"\n" +
"        Load the dataset for the learning  models\n" +
"\n" +
"        Args:\n" +
"            :param dataset: dataset identifier\n" +
"            :param test_size: (optional) size of the test set, must be within (0, 1)\n" +
"            :param seed: (optional) integer seed for reproducibility\n" +
"            :param shuffle: (optional) bool value used to decide if shuffling\n" +
"                            should be done before train-test split\n" +
"        :return:\n" +
"        \"\"\"\n" +
"        if dataset:\n" +
"            try:\n" +
"                dataset = Dataset.instance(dataset)\n" +
"                data = dataset.get(test_size, seed, shuffle)\n" +
"            except ValueError as e:\n" +
"                raise RuntimeError(\"Something wrong with dataset\")\n" +
"\n" +
"            self.dataset_type = dataset.__info__['type'].lower()\n" +
"            if self.dataset_type in self.__info__['supported_dataset']:\n" +
"                self.X_train, self.Y_train = data['train']\n" +
"                self.X_test, self.Y_test = data['test']\n" +
"                self.labels = [str(label) for label in  data['labels']]\n" +
"            else:\n" +
"                raise ValueError(\"Unsupported dataset type {}\"\n" +
"                                 .format(self.dataset_type))\n" +
"\n" +
"    @abc.abstractmethod\n" +
"    def evaluate(self, params):\n" +
"        \"\"\"\n" +
"        Evaluate the parameters configuration against the model function.\n" +
"\n" +
"        Args:\n" +
"          :param params: configuration of hyper-parameters\n" +
"        :return Dictionary of metrics evaluated on the model\n" +
"        \"\"\"\n" +
"        raise NotImplementedError"}
          </Highlight>
        </Col>
        <Row className="text-center">
          <Col>
            <Button href="http://localhost:8080/static/code/AbstractMetric.py">
              Download template class
            </Button>
          </Col>
          <Col>
            <Button variant="success"> Upload metric </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  datasetSection() {
    return (
      <Container>
        A dataset in Ahmet derives from a common abstract class. This class is:
        <Col className="mt-2">
          <Highlight language="python">
{"class Dataset(object):\n" +
"    \"\"\"\n" +
"    Abstract class used to define the dataset template.\n" +
"    Override the __info__ dictionary in subclasses for providing information\n" +
"    about the dataset in the web app (front-end). Note that the allowed keys\n" +
"    (the keys that will be displayed) are the ones reported below.\n" +
"    The __sort__ option points out the way in which the dataset will be\n" +
"    sorted when the information is displayed (default ordering is by name).\n" +
"    \"\"\"\n" +
"    __metaclass__ = abc.ABCMeta\n" +
"    __info__ = {\n" +
"        \"name\": 'No name',                  # Name of the dataset\n" +
"        \"description\": 'No description',    # Description of the dataset\n" +
"        \"type\": 'no type'                   # Type of the dataset: regression or classification\n" +
"    }\n" +
"    __sort__ = \"name\"\n" +
"\n" +
"    @abc.abstractmethod\n" +
"    def get(self, test_size=0.33, seed=None, shuffle=True):\n" +
"        \"\"\"\n" +
"        Load and prepare the dataset.\n" +
"\n" +
"        Args:\n" +
"            :param test_size: (optional) size of the test set, must be within (0, 1)\n" +
"            :param seed: (optional) integer seed for reproducibility\n" +
"            :param shuffle: (optional) bool value used to decide if shuffling\n" +
"                            should be done before train-test split\n" +
"        :return:\n" +
"            A dictionary containing the train, test and labels for the selected\n" +
"            dataset.\n" +
"\n" +
"        Example:\n" +
"            {\n" +
"                'train': (X, Y),\n" +
"                'test': (X, Y),\n" +
"                'labels': {0: 'class1', 1: 'class2', ...}\n" +
"            }\n" +
"        Where labels dictionary is used to convert back the Y indices to the\n" +
"        original classes.\n" +
"        \"\"\"\n" +
"        raise NotImplementedError"}
          </Highlight>
        </Col>
        <Row className="text-center">
          <Col>
            <Button href="http://localhost:8080/static/code/AbstractDataset.py">
              Download template class
            </Button>
          </Col>
          <Col>
            <Button variant="success"> Upload dataset </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  render() {
    return (
      <div className="content">
        <Container fluid>
          <h3>What is Ahmet?</h3>
          Framework for black-box optimization.
          <hr/>
          <h3>Useful definitions</h3>
          <ul>
            <li>Trial: a list of parameters value that will be evaluated against the metric.</li>
            <li>Metric: a machine learning model representing the black box function.</li>
            <li>Study: entity composed of a BBO algorithm, a metric and the trials.</li>
            <li>Worker: a process or a thread responsible of evaluating a trial x.</li>
            <li>Run: a complete optimization execution of the problem.</li>
          </ul>
          <hr/>
          <h3>Algorithms prototype</h3>
          {this.algorithmSection()}
          <hr/>
          <h3>Metrics prototype</h3>
          {this.metricSection()}
          <hr/>
          <h3>Dataset prototype</h3>
          {this.datasetSection()}
        </Container>
      </div>
    );
  }
}

export default Home;