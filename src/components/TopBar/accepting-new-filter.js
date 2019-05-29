import React from "react";
import CheckBoxDropdown from '../Dropdowns/checkbox-dropdown.js'

export default class AcceptingNewFilter extends React.Component {
  render() {
    return (
      <CheckBoxDropdown
        options={[{ label: <icon type={"cat"} />, value: "item1" }, {}]}
        header={
          <>
            <div>header1</div>
            <div>subheader</div>
          </>
        }
      />
    );
  }
}
