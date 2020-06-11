/**
 * Statistics.
 *
 * The type attribute set the type and color of your flash message,
 * default options are "success" (green), "warning" (orange), "danger" (red),
 * "info" (blue) and "default" (gray).
 */
import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import {Card} from 'react-native-elements';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {APIGet} from '../Components/Fetcher/Fetcher';
import RNPickerSelect from 'react-native-picker-select';
import {Text} from 'react-native-svg';
import ChartPieMod from '../Components/Charts/ChartPieMod';
import BinnedHistogram from '../Components/Charts/BinnedHistogram';

// Timer for fetching timeout
// TODO: add timer
const timeout = 3000;
//
const {width} = Dimensions.get('window');

export default class Screen3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      selected_item: null,
      selectedStudy: 'General analytics',
      studies: null,
      trials: null,
      algorithms: null,
      metrics: null,
      studyParameters: null,
      studyTrials: null,
      error: null,
      content_dataset: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleError = this.handleError.bind(this);
    //this.Populate = this.Populate.bind(this);
    this.generalStats = this.generalStats.bind(this);
    this.studyStats = this.studyStats.bind(this);
  }

  //Handling error
  handleError() {
    this.setState({
      isLoaded: true,
      error: 'error',
    });
    showMessage({
      message: 'Error: You need to log in before!!',
      type: 'danger',
    });
  }

  handleChange(event) {
    if (event === 'General analytics') {
      this.setState(
        {
          selectedStudy: event,
          studies: null,
          trials: null,
          studyParameters: null,
          studyTrials: null,
          isLoaded: false,
        },
        () => {
          this.Populate();
        },
      );
    } else {
      this.setState(
        {
          selectedStudy: event,
          isLoaded: false,
        },
        APIGet({
          onSuccess: (parameters) => {
            this.setState({
              studyParameters: parameters,
              isLoaded: this.state.studyTrials ? true : false,
            });
          },
          onError: this.handleError,
          uri:
            'http://10.0.2.2:8080/api/v0.1/studies/' + event + '/parameters/',
        }),
      );
      this.studyStats(event);
    }
  }

  componentDidMount() {
    APIGet({
      onSuccess: (algorithms) => {
        this.setState({
          algorithms: algorithms.map((algorithm) => ({
            id: algorithm.id,
            name: algorithm.name,
          })),
          isLoaded:
            this.state.metrics !== null &&
            this.state.studies !== null &&
            this.state.trials !== null,
        });
      },
      onError: this.handleError,
      uri: 'http://10.0.2.2:8080/api/v0.1/algorithms/',
    });
    APIGet({
      onSuccess: (metrics) => {
        this.setState({
          metrics: metrics.map((metric) => ({
            id: metric.id,
            name: metric.name,
          })),
          isLoaded:
            this.state.algorithms !== null &&
            this.state.studies !== null &&
            this.state.trials !== null,
        });
      },
      onError: this.handleError,
      uri: 'http://10.0.2.2:8080/api/v0.1/metrics/',
    });

    this.Populate();
  }

  Populate() {
    APIGet({
      onSuccess: (studies) => {
        this.setState({
          isLoaded:
            this.state.metrics !== null &&
            this.state.algorithms !== null &&
            this.state.trials !== null,
          studies: studies,
        });
      },
      onError: this.handleError,
      uri: 'http://10.0.2.2:8080/api/v0.1/studies/',
    });
    APIGet({
      onSuccess: (trials) => {
        this.setState({
          trials: trials,
          isLoaded:
            this.state.metrics !== null &&
            this.state.algorithms !== null &&
            this.state.studies !== null,
        });
      },
      onError: this.handleError,
      uri: 'http://10.0.2.2:8080/api/v0.1/trials/',
    });
  }

  generalStats() {
    APIGet({
      onSuccess: (studies) => {
        this.setState({
          isLoaded:
            this.state.metrics !== null &&
            this.state.algorithms !== null &&
            this.state.trials !== null,
          studies: studies,
        });
      },
      onError: this.handleError,
      uri: 'http://10.0.2.2:8080/api/v0.1/studies/',
    });
    APIGet({
      onSuccess: (trials) => {
        this.setState({
          trials: trials,
          isLoaded:
            this.state.metrics !== null &&
            this.state.algorithms !== null &&
            this.state.studies !== null,
        });
      },
      onError: this.handleError,
      uri: 'http://10.0.2.2:8080/api/v0.1/trials/',
    });
    this.generalCharts();
  }

  studyStats(study) {
    let url = 'http://10.0.2.2:8080/api/v0.1/studies/' + study;
    APIGet({
      onSuccess: (trials) => {
        this.setState({
          studyTrials: trials,
          isLoaded: !!this.state.studyParameters,
        });
      },
      onError: this.handleError,
      uri: url + '/trials/',
    });
  }

  generalCharts() {
    let algOccurrences = Array(this.state.algorithms.length).fill(0);
    let metricOccurrences = Array(this.state.metrics.length).fill(0);

    for (let i = 0; i < this.state.studies.length; i++) {
      for (let a = 0; a < this.state.algorithms.length; a++) {
        if (
          this.state.studies[i].algorithm_id === this.state.algorithms[a].id
        ) {
          algOccurrences[a] += 1;
        }
      }
      for (let m = 0; m < this.state.metrics.length; m++) {
        if (this.state.studies[i].metric_id === this.state.metrics[m].id) {
          metricOccurrences[m] += 1;
        }
      }
    }
    return [
      <ChartPieMod
        title="Algorithms usage"
        occurrences={algOccurrences}
        labels={this.state.algorithms.map((alg) => alg.name)}
      />,
      <ChartPieMod
        title="Metrics usage"
        occurrences={metricOccurrences}
        labels={this.state.metrics.map((metric) => metric.name)}
      />,
    ];
  }

  select_static() {
    let studies = this.state.studies;

    const placeholder = {
      label: this.state.selectedStudy,
      value: this.state.selectedStudy,
    };

    let options =
      this.state.selectedStudy !== 'General analytics'
        ? [{value: 'General analytics', label: 'General analytics'}]
        : [];

    for (let idx = 0; idx < studies.length; idx++) {
      if (studies[idx].name !== this.state.selectedStudy) {
        options.push({value: studies[idx].name, label: studies[idx].name});
      }
    }

    return (
      <ScrollView style={styles.container}>
        <RNPickerSelect
          placeholder={placeholder}
          onValueChange={(value) => this.handleChange(value)}
          items={options}
        />
      </ScrollView>
    );
  }

  studyCharts() {
    let trials = this.state.studyTrials;
    if (trials === null) {
      return (
        <View>
          <Text>No trials to show</Text>
        </View>
      );
    } else {
      return this.state.studyParameters.map((param, idx) => {
        if (param.type === 'INTEGER' || param.type === 'FLOAT') {
          let values = Array();
          for (let i = 0; i < trials.length; i += 1) {
            values.push(trials[i].parameters[param.name]);
          }
          return (
            <BinnedHistogram
              title={`${param.name}`}
              min={param.min}
              max={param.max}
              values={values}
            />
          );
        } else {
          let occurrences = Array(param.values.length).fill(0);
          for (let i = 0; i < trials.length; i += 1) {
            for (let j = 0; j < occurrences.length; j += 1) {
              if (trials[i].parameters[param.name] === param.values[j]) {
                occurrences[j] += 1;
              }
            }
          }
          return (
            <ChartPieMod
              title={`${param.name}`}
              occurrences={occurrences}
              labels={param.values}
            />
          );
        }
      });
    }
  }

  infoGeneral() {
    let numPending = 0;
    this.state.studies.map((study) => {
      if (study.status === 'PENDING') {
        numPending += 1;
      }
    });
    return (
      <View>
        <Card>
          <Text>CIAO</Text>
        </Card>
      </View>
    );
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <ScrollView style={styles.container}>
          <Text>"Fetching data..."</Text>
        </ScrollView>
      );
    } else {
      return (
        <ScrollView style={styles.container}>
          {this.select_static()}
          {this.state.selectedStudy !== 'General analytics'
            ? this.studyCharts()
            : this.infoGeneral()}
          {this.state.selectedStudy === 'General analytics'
            ? this.generalCharts()
            : this.studyCharts()}
          <FlashMessage position="top" />
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    marginTop: 50,
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  view: {
    marginTop: 100,
    backgroundColor: 'blue',
    width: width - 80,
    margin: 10,
    height: 200,
    borderRadius: 10,
    //paddingHorizontal : 30
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Set your own custom Color #0010ff, #b5ceee
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  chart: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

const chartConfig = {
  backgroundGradientFrom: '#58a9d4',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: 'rgba(45,59,187,0.68)',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0,
  //useShadowColorFromDataset: false, // optional
};
