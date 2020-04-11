import React, { Component } from "react";
import {value, recap} from "variables/Variables.jsx";

export const onDatasetChoose = (dataset) => {

  value.id_dataset = dataset;

  if (dataset === 1){
    value.name_dataset = 'Dataset 1';
  }
  if (dataset === 2){
    value.name_dataset = 'Dataset 2';
  }
  if (dataset === 3){
    value.name_dataset = 'Dataset 3';
  }
  if (dataset === 4){
    value.name_dataset = 'Dataset 4';
  }

  recap.dataset = value.name_dataset;

};

class CheckBoxDataset extends Component {
  constructor(props) {
    super(props);
    let { listwebsites } = this.props;
    listwebsites.checked = false;
    this.state = {
      fields: {
        id: listwebsites.id
      }
    };

    this.click = this.click.bind(this);
    this.selectOnlyThis = this.selectOnlyThis.bind(this);
  }
  click(value) {
    this.props.handleChangess(this.state.fields.id, value);
  };

  selectOnlyThis(){
  }

  render() {
    const { listwebsites, selectedId } = this.props;

    return (
     <tr>
       <input
         type="checkbox"
         disabled={selectedId && selectedId!==listwebsites.id}
         id={`checkbox_${listwebsites.id}`} value={listwebsites.checked}
         onChange={e => this.click(e.target.checked)}
         name="record"/>
       <td>{listwebsites.name}</td>
     </tr>
    );
  }
}

export default Checkboxdataset;