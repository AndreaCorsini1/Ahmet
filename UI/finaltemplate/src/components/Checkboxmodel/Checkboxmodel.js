import React, { Component } from "react";
import CustomCheckbox from "../CustomCheckbox/CustomCheckbox";

//stringa che rappresenta il modello scelto

class Checkboxmodel extends Component {
  constructor(props) {
    super(props);
    let { listwebsites } = this.props;
    listwebsites.checked = false;
    this.state = {
      fields: {
        id: listwebsites.id
      }
    }

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
        disabled={selectedId && selectedId!==listwebsites.id} id={`checkbox_${listwebsites.id}`} value={listwebsites.checked} onChange={e => this.click(e.target.checked)} type="checkbox" name="record"/>
      <td>{listwebsites.name}</td>

    </tr>
    )
  }
}

export default Checkboxmodel;