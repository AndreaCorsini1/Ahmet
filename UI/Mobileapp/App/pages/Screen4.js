/*Example of Navigation Drawer with Sectioned Menu*/
import React, {Component, useCallback} from 'react';
//import react in our code.
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
  ViewComponent,
} from 'react-native';
// import all basic components
//import {Card} from 'react-native-shadow-cards';
import {Card} from 'react-native-elements';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
/*The type attribute set the type and color of your flash message,
default options are "success" (green), "warning" (orange), "danger" (red),
"info" (blue) and "default" (gray).*/
import {
  LineChart,
  BarChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {APIDelete, APIGet, APIPost, getToken} from './Fetcher';

import BinnedHistogram from './Charts/BinnedHistogram';

import RNPickerSelect from 'react-native-picker-select';
import {token_real} from './Fetcher';

import {PieChart} from 'react-native-svg-charts';
import {Text} from 'react-native-svg';
import {
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLegend,
  VictoryPie,
  VictoryPolarAxis,
} from 'victory-native';
import {ChartPieMod} from './Charts/ChartPieMod';

// Refresh time in ms
//const refreshTime = 300000000000000000;
//const seed = 1234;
const {width} = Dimensions.get('window');
//let options = [{label: '', value: ''}];
//come pie usare il progresschart che ha solo label e data

export default class Screen4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      selected_item: null,
      selectedStudy: 'General analytics',
      studies: null, //null default
      trials: null, //null default
      token: null,
      algorithms: null, //null default
      metrics: null,
      studyParameters: null, //null default
      studyTrials: null, //null default
      error: null,
      change_grap: 1,
      content_dataset: null,
      access_api: 'free',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleError = this.handleError.bind(this);
    //this.Populate = this.Populate.bind(this);
    this.generalStats = this.generalStats.bind(this);
    this.studyStats = this.studyStats.bind(this);
  }

  //check login success
  checklogin() {
    console.log('prova_login');
    if (token_real === null) {
      showMessage({
        message: 'Error: You need to log in before!!',
        type: 'danger',
      });
    }
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
    console.log('event: ' + event);
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
          token: token_real,
        }),
      );
      this.studyStats(event);
    }
  }

  componentDidMount() {
    if (token_real !== null) {
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
        token: token_real,
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
        token: token_real,
      });

      this.Populate();
      //this.infoGeneral('General analitycs');
    }
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
      token: token_real,
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
      token: token_real,
    });
    //this.generalStats();
  }

  generalStats() {
    console.log('general stats');
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
      token: token_real,
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
      token: token_real,
    });
    this.generalCharts();
  }

  studyStats(event) {
    let study = event;
    let url = 'http://10.0.2.2:8080/api/v0.1/studies/' + study;
    APIGet({
      onSuccess: (trials) => {
        this.setState({
          studyTrials: trials,
          isLoaded: this.state.studyParameters ? true : false,
        });
      },
      onError: this.handleError,
      uri: url + '/trials/',
      token: token_real,
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
    let vista = this.state.studyParameters;

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
    if (token_real === null) {
      return showMessage({
        message: 'Error: You need to login before!!',
        type: 'danger',
      });
    } else if (!this.state.isLoaded) {
      console.log('isloaded: ' + this.state.isLoaded);
      return (
        <ScrollView style={styles.container}>
          <Text>"Fetching data..."</Text>
        </ScrollView>
      );
    } else {
      console.log('isloaded else: ' + this.state.isLoaded);
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

/* <Text style={{marginBottom: 10}}>Total number of studies </Text>
              <Button backgroundColor="#03A9F4" title="More details" />*/

//le richieste prima erano
/*http://localhost:8080/api/v0.1/metrics/*/

//uri: 'http://192.168.178.127/api/v0.1/studies/',
//192.168.137.1
