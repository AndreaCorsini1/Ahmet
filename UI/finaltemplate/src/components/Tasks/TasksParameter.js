import React, { Component } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import Checkboxparameter from "../Checkboxmodel/Checkboxmodel";
import {onParameterChoose} from "../Checkboxparameter/Checkboxparameter";


const listwebsitesData = [
  { id: 1, name: 'lambda = 1', active: false },
  { id: 2, name: 'lambda = 2', active: true },
  { id: 3, name: 'lambda = 3', active : true },
  { id: 4, name: 'lambda = 4', active : true }
]

//questo per mandare roba, subito -1
let passparameter = -1;

export class TasksParameter extends Component {

constructor(props){
    super(props);
    this.state = {
      selectedId: null,
    }
    this.handleChangess = this.handleChangess.bind(this);
  }

  handleChangess(id, value) {
    this.setState({selectedId: value===true?id:null});
    passparameter = id;
    if (value == false){
        //alert(value);
        passparameter = -1;
    }
    onParameterChoose(passparameter);
  }

  render(){
  return (

    <div className="Tasks">
      {
        listwebsitesData.map((data)=>{
          return <Checkboxparameter selectedId={this.state.selectedId} listwebsites={data} handleChangess={this.handleChangess} />
        })
      }
    </div>
  );
  }
}