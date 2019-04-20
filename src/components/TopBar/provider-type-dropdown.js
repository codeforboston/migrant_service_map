import React from "react";
import CheckBoxDropdown from "./checkbox-dropdown";

export default class ProviderTypeDropdown extends React.Component {
  render() {
    const { className, onChange = () => {} } = this.props;
    return (
      <CheckBoxDropdown
        className={className}
        options={[{ label: <icon type={"cat"} />, value: "item1" }, {}]}
        header={
          <>
            <h2>PROVIDER TYPE</h2>
            <p>Not Selected</p>
          </>
        }
      />
    );
  }
}