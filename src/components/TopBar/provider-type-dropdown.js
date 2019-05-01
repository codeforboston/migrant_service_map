import React from "react";
import CheckBoxDropdown from "./checkbox-dropdown";

export default class ProviderTypeDropdown extends React.Component {
  render() {
    const { className, providerTypes, handleChange = () => {} } = this.props;
    return (
      <CheckBoxDropdown
        className={className}
        options={ providerTypes.allIds } 
        handleChange={ handleChange }
        visibleTypes={providerTypes.visible}
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