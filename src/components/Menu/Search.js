import React, { Component } from "react";

export default class Search extends Component {

  render() {
    let {providers, SearchProvider, providerValue} = this.props;
    return (
      <div>
      <form>
        <input type="text" id="input_org" className='organization'  placeholder="Organization, City, State" defaultValue="" ref={providerValue}/>
        <input type="button" id="button_org" className='organization' onClick={() => SearchProvider(providers)} value="Search"/>

      </form>
      </div>

  );
  }
}
