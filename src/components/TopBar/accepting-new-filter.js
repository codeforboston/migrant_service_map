import React from "react";

export default class AcceptingNewFilter extends React.Component {
  render() {
    const { className, onChange = () => {} } = this.props;
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