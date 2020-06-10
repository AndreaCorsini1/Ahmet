/*Example of Navigation Drawer with Sectioned Menu*/
/*import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';
import {Card, Button} from 'react-native-elements';

export default class Screen3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Study', 'Algorithm', 'Model', 'Action'],
      tableData: [
        ['1', 'knn', '3', '4'],
        ['2', 'random', 'c', 'd'],
        ['3', 'greed', '3', '4'],
        ['4', 'svm', 'c', 'd'],
      ],
    };
  }

  _alertIndex(index) {
    Alert.alert(`This is row ${index + 1}`);
  }

  render() {
    const state = this.state;
    const element = (data, index) => (
      <TouchableOpacity onPress={() => this._alertIndex(index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>button</Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <ScrollView style={styles.container}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row
            data={state.tableHead}
            style={styles.head}
            textStyle={styles.text}
          />
          {state.tableData.map((rowData, index) => (
            <TableWrapper key={index} style={styles.row}>
              {rowData.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={cellIndex === 3 ? element(cellData, index) : cellData}
                  textStyle={styles.text}
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#808B97'},
  text: {margin: 6},
  row: {flexDirection: 'row', backgroundColor: '#FFF1C1'},
  btn: {width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2},
  btnText: {textAlign: 'center', color: '#fff'},
});*/

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Table,
  Row,
  Rows,
  Cell,
  TableWrapper,
} from 'react-native-table-component';
import {Button} from 'react-native-elements';

import {APIDelete, APIGet, APIPost, getToken} from './Fetcher';
import {token_real} from './Fetcher';
import FlashMessage, {showMessage} from 'react-native-flash-message';

// Base url for the view
const baseUrl = 'http://10.0.2.2:8080/api/v0.1/studies/';

export default class Screen3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: [
        'ALGORITHM ID',
        'CREATED TIME',
        'DATASET_ID',
        'ID',
        'METRIC ID',
        'NAME',
        'NUM SUGGESTIONS',
        'OWNER',
        'RUNS',
        'STATUS',
        'UPDATED TIME',
      ],
      widthArr: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
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
    //this.handleDelete = this.handleDelete.bind(this);
    //this.handleRowClick = this.handleRowClick.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleStudies = this.handleStudies.bind(this);
    //this.handleStart = this.handleStart.bind(this);
  }

  //Handling error
  handleError() {
    this.setState({
      isLoaded: true,
      error: 'error',
    });
    console.log('error');
    /*showMessage({
      message: 'Error: You need to log in before!!',
      type: 'danger',
    });*/
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
      token: token_real,
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
      token: token_real,
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
      token: token_real,
    });
  }

  handleStudies() {
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
      token: token_real,
    });
  }

  render() {
    const state = this.state;
    const tableData = [];
    var finalArray = [];
    this.state.studies.map(function (obj) {
      finalArray.push(
        obj.algorithm_id,
        obj.created_time,
        obj.dataset_id,
        obj.id,
        obj.metric_id,
        obj.name,
        obj.num_suggestions,
        obj.owner,
        obj.runs,
        obj.status,
        obj.updated_time,
      );
    });

    let k = 0;
    for (let i = 0; i < this.state.studies.length; i += 1) {
      const rowData = [];
      for (let j = 0; j < 11; j += 1, k += 1) {
        rowData.push(finalArray[k]);
      }
      tableData.push(rowData);
    }

    return (
      <View style={styles.container}>
        <Button
          title={'Update data'}
          style={styles.input}
          onPress={() => {
            this.handleStudies();
          }}
        />
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <Row
                data={state.tableHead}
                widthArr={state.widthArr}
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
                    widthArr={state.widthArr}
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
        {/*<FlashMessage position="top" />*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  header: {height: 50, backgroundColor: '#66bdf3'},
  text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#E7E6E1'},
});
