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
import RNPickerSelect from 'react-native-picker-select';
import {APIDelete, APIGet, APIPost} from '../pages/Fetcher';

export default class Screen3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_item: null,
      tableHead: ['Study name', 'Algorithm', 'Metrics', 'Dataset'],
      tableData: [
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
        ['07/29/2016', 'JEFF', '$46.80', '123'],
        ['07/29/2016', 'JEFF', '$46.80', 'dfdfg'],
      ],
    };
  }

  render() {
    const state = this.state;
    return (
      <ScrollView style={styles.container}>
        <RNPickerSelect
          onValueChange={(value) =>
            console.log(value) && this.state.search(value)
          }
          items={[
            {label: 'Football', value: 'football'},
            {label: 'Baseball', value: 'baseball'},
            {label: 'Hockey', value: 'hockey'},
          ]}
        />
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row
            data={state.tableHead}
            style={styles.head}
            textStyle={styles.text}
          />
          <Rows
            data={state.tableData}
            textStyle={styles.text}
            onPress={(value) => console.log(value)}
          />
        </Table>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6},
  btn: {width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2},
  btnText: {textAlign: 'center', color: '#fff'},
});
