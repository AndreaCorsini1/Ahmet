import React, { Component } from "react";
import CustomCheckbox from "../CustomCheckbox/CustomCheckbox";
import {value} from "variables/Variables.jsx";

/*https://appdividend.com/2018/09/25/how-to-save-multiple-checkboxes-values-in-react-js/*/

export const onParameterChoose = (param) =>{

  value.id_param = param;
/*
  if(param == -1 || value.id_model == -1 || value.id_model == undefined){
    value.id_model = -1;
    alert("inserire un parametro o un modello"); }*/

  if (value.id_param === 1){
    value.name_param = 'lambda = 1'
  }
  if (value.id_param === 2){
    value.name_param = 'lambda = 2'
  }
  if (value.id_param === 3){
    value.name_param = 'lambda = 3'
  }
  if (value.id_param === 4){
    value.name_param = 'lambda = 4'
  }
  //alert("dentro array = " + value.id + " nome : " + value.name);
  //alert("id_param = " + value.id_param + " nome_param : " + value.name_param + " name_model : " + value.name_model + " id_model: " + value.id_model);
};

export const onModelChoose = (model) => {

  value.id_model = model;

  if (model === 1){
    value.name_model = 'KNN';
  }
  if (model === 2){
    value.name_model = 'Random Forest';
  }
  if (model === 3){
    value.name_model = 'Bayes';
  }
  if (model === 4){
    value.name_model = 'Bernulli';
  }
};

class Checkboxparameter extends Component {
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
        id={`checkbox_${listwebsites.id}`}
        value={listwebsites.checked}
        onChange={e => this.click(e.target.checked)}
        name="record"/>
      <td>{listwebsites.name}</td>

    </tr>
    )
  }
}

export default Checkboxparameter;