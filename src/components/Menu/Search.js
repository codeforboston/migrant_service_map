import React, { Component } from "react";

export default class Search extends Component {

  render() {
    let {providers, SearchProvider, providerValue} = this.props;
    return (
      <div>
      <form>
        <input type="text" id='organization' placeholder="Organization" defaultValue="" ref={providerValue}/>
        <input type="button" onClick={() => SearchProvider(providers)} value="Search"/>

      </form>
      </div>

  );
  }
}
