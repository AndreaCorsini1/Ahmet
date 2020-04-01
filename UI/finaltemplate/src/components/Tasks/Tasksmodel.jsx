/*!

Ora task lo uso temporaneo per new study

https://stackoverflow.com/questions/50560615/how-to-select-only-one-checkbox-in-reactjs

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import Checkboxmodel from "../Checkboxmodel/Checkboxmodel";
import {onModelChoose} from "../Checkboxparameter/Checkboxparameter";

const listwebsitesData = [
  { id: 1, name: 'KNN', active: true },
  { id: 2, name: 'Random Forest', active: true },
  { id: 3, name: 'Bayes', active : true },
  { id: 4, name: 'Bernulli', active : true }
]

let passmodel = -1;

export class Tasksmodel extends Component {

constructor(props){
    super(props);

    this.state = {
      selectedId: null,
    }
    this.handleChangess = this.handleChangess.bind(this);
  }

  handleChangess(id, value) {
    this.setState({selectedId: value===true?id:null});
    passmodel = id;
    if (value == false){
        //alert(value);
        passmodel = -1;
    }
    //quando cambia il modello scelto lo registro
    onModelChoose(passmodel);
  }

  render(){
  return (
    <div className="Tasks">
      {
        listwebsitesData.map((data)=>{
          return <Checkboxmodel selectedId={this.state.selectedId} listwebsites={data} handleChangess={this.handleChangess} />
        })
      }
    </div>
  )
  }
}
