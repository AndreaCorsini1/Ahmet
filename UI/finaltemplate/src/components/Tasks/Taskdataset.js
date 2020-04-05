import React, { Component } from "react";
import Checkboxdataset from "../Checkboxparameter/Checkboxdataset";
import {onDatasetChoose} from "../Checkboxparameter/Checkboxdataset";

const listwebsitesData = [
  { id: 1, name: 'Dataset 1', active: true },
  { id: 2, name: 'Dataset 2', active: true },
  { id: 3, name: 'Dataset 3', active : true },
  { id: 4, name: 'Dataset 4', active : true }
]

let passdataset = -1;

export class Taskdataset extends Component {

constructor(props){
    super(props);

    this.state = {
      selectedId: null,
    }
    this.handleChangess = this.handleChangess.bind(this);
  }

  handleChangess(id, value) {
    this.setState({selectedId: value===true?id:null});
    passdataset = id;
    if (value == false){
        //alert(value);
        passdataset = -1;
    }
    //quando cambia il modello scelto lo registro
    onDatasetChoose(passdataset);
  }

  render(){
  return (
    <div className="Tasks">
      {
        listwebsitesData.map((data)=>{
          return <Checkboxdataset selectedId={this.state.selectedId} listwebsites={data} handleChangess={this.handleChangess} />
        })
      }
    </div>
  )
  }
}