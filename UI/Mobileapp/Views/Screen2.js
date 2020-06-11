/**
 * Studies.
 */
import React, {Component} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import {Button} from 'react-native-elements';

import {APIDelete, APIGet} from '../Components/Fetcher/Fetcher';
import FlashMessage, {showMessage} from 'react-native-flash-message';

// Base url for the view
const baseUrl = 'http://10.0.2.2:8080/api/v0.1/studies/';
// Timer for fetching timeout
const timeout = 3000;

export default class Screen2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      renderDetails: false,
      token: null,
      studies: [],
      study_idx: null,
      trials: null,
      params: null,
      algorithms: null,
      metrics: null,
      dataset: null,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleStudies = this.handleStudies.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  /**
   * Handle error in fetching operations.
   *
   */
  handleError() {
    this.setState({
      isLoaded: true,
      error: 'error',
    });
    console.log('error');
    showMessage({
      message: 'Error: You need to log in before!!',
      type: 'danger',
    });
  }

  /**
   * Delete a study and force the going back to studies view.
   */
  handleDelete() {
    let studyName = this.state.studies[this.state.study_idx].name;
    APIDelete({
      onSuccess: () => {
        showMessage({
          message: `Successfully deleted study : ${studyName}`,
          type: 'info',
        });
        this.handleStudies();
      },
      onError: this.handleError,
      uri: baseUrl + studyName + '/',
    });
  }

  fetchStudy(url) {
    APIGet({
      onSuccess: (trials) =>
        this.setState({
          trials: trials,
          isLoaded: !!this.state.params,
        }),
      onError: this.handleError,
      uri: url + /trials/,
    });
    APIGet({
      onSuccess: (params) =>
        this.setState({
          params: params,
          isLoaded: !!this.state.trials,
        }),
      onError: this.handleError,
      uri: url + /parameters/,
    });

    // Periodically fetch the trials
    this.timerID = setInterval(
      () =>
        APIGet({
          onSuccess: (trials) => {
            this.setState({trials: trials});
          },
          onError: this.handleError,
          uri: url + /trials/,
        }),
      timeout,
    );
  }

  handleStart() {
    let studyName = this.state.studies[this.state.study_idx].name;
    let uri = baseUrl + studyName + '/start/';
    APIGet({
      onSuccess: () => {
        showMessage({
          message: `The study : ${studyName} has been started`,
          type: 'success',
        });
      },
      onError: this.handleError,
      uri: uri,
    });
  }

  componentDidMount() {
    this.handleStudies();
    APIGet({
      onSuccess: (algorithms) => {
        this.setState({
          algorithms: algorithms.reduce(
            (acc, alg) => ({
              ...acc,
              [alg.id]: alg.name,
            }),
            {},
          ),
          isLoaded:
            this.state.metrics !== null &&
            this.state.studies !== null &&
            this.state.dataset !== null,
        });
      },
      onError: this.handleError,
      uri: 'http://10.0.2.2:8080/api/v0.1/algorithms/',
    });
    APIGet({
      onSuccess: (metrics) => {
        this.setState({
          metrics: metrics.reduce(
            (acc, metric) => ({
              ...acc,
              [metric.id]: metric.name,
            }),
            {},
          ),
          isLoaded:
            this.state.algorithms !== null &&
            this.state.studies !== null &&
            this.state.dataset !== null,
        });
      },
      onError: this.handleError,
      uri: 'http://10.0.2.2:8080/api/v0.1/metrics/',
    });
    APIGet({
      onSuccess: (dataset) => {
        this.setState({
          dataset: dataset.reduce(
            (acc, data) => ({
              ...acc,
              [data.id]: data.name,
            }),
            {},
          ),
          isLoaded:
            this.state.algorithms !== null &&
            this.state.studies !== null &&
            this.state.metrics !== null,
        });
      },
      onError: this.handleError,
      uri: 'http://10.0.2.2:8080/api/v0.1/dataset/',
    });
  }

  componentWillUnmount() {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
  }

  handleStudies() {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
    APIGet({
      onSuccess: (studies) => {
        this.setState({
          isLoaded:
            this.state.algorithms !== null &&
            this.state.metrics !== null &&
            this.state.dataset !== null,
          studies: studies,
          renderDetails: false,
          trials: null,
          params: null,
        });
      },
      onError: this.handleError,
      uri: baseUrl,
    });
  }

  renderStudies() {
    const tableData = [];
    var finalArray = [];
    let tableHead = [
      'ALGORITHM ID',
      'DATASET_ID',
      'ID',
      'METRIC ID',
      'NAME',
      'NUM SUGGESTIONS',
      'OWNER',
      'RUNS',
      'STATUS',
    ];
    let widthArr = [120, 120, 120, 120, 200, 200, 200, 120, 150];
    this.state.studies.map(function (obj) {
      finalArray.push(
        obj.algorithm_id,
        obj.dataset_id,
        obj.id,
        obj.metric_id,
        obj.name,
        obj.num_suggestions,
        obj.owner,
        obj.runs,
        obj.status,
      );
    });

    let k = 0;
    for (let i = 0; i < this.state.studies.length; i += 1) {
      const rowData = [];
      for (let j = 0; j < tableHead.length; j += 1, k += 1) {
        rowData.push(finalArray[k]);
      }
      tableData.push(rowData);
    }

    return (
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.text}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              {tableData.map((rowData, index) => (
                <Row
                  key={index}
                  data={rowData}
                  onPress={() => {
                    let studyName = this.state.studies[index].name;
                    let url = baseUrl + studyName;

                    this.setState(
                      {
                        renderDetails: true,
                        isLoaded: false,
                        study_idx: index,
                      },
                      () => this.fetchStudy(url),
                    );
                  }}
                  widthArr={widthArr}
                  style={[
                    styles.row,
                    index % 2 && {backgroundColor: '#F7F6E7'},
                  ]}
                  textStyle={styles.text}
                />
              ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    );
  }

  renderStudy() {
    let name = this.state.studies[this.state.study_idx].name;
    // title={`Parameters of study: ${name}`}
    // title={`Trials of study: ${name}`}
    let headers_param = ['id', 'name', 'type', 'values', 'min', 'max'];
    let headers_trials = [
      'id',
      'score',
      'status',
      ...Object.keys(this.state.trials[0].parameters),
    ];
    let widthTrials = Array(headers_trials.length).fill(150);

    return (
      <View>
        <Button title={'Back'} onPress={this.handleStudies} />
        <Button title={'Start'} onPress={this.handleStart} />
        <Button title={'Delete'} onPress={this.handleDelete} />
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <Row
                data={headers_param}
                widthArr={[150, 150, 150, 150, 150, 150]}
                style={styles.header}
                textStyle={styles.text}
              />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                {this.state.params.map((param, index) => (
                  <Row
                    key={index}
                    data={headers_param.map(
                      (header) => param[header] || 'null',
                    )}
                    widthArr={[150, 150, 150, 150, 150, 150]}
                    style={[
                      styles.row,
                      index % 2 && {backgroundColor: '#F7F6E7'},
                    ]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <Row
                data={headers_trials}
                widthArr={widthTrials}
                style={styles.header}
                textStyle={styles.text}
              />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                {this.state.trials.map((trial, index) => (
                  <Row
                    key={index}
                    data={headers_trials.map((header, index) => {
                      if (index < 3) {
                        return trial[header] || 'null';
                      } else {
                        return trial.parameters[header];
                      }
                    })}
                    widthArr={widthTrials}
                    style={[
                      styles.row,
                      index % 2 && {backgroundColor: '#F7F6E7'},
                    ]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
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
        <View style={styles.container}>
          {this.state.renderDetails ? this.renderStudy() : this.renderStudies()}
          {<FlashMessage position="top" />}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  header: {height: 50, backgroundColor: '#66bdf3'},
  text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#E7E6E1'},
});
