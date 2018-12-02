import React, { Component } from 'react';
import { TopNav, Menu, Map, FlexContainer } from './components';

class App extends Component {
  render() {
    return (
      <div >
        <TopNav />
       <FlexContainer children={[Menu(), <Map />]} />
      </div>
    );
  }
}

export default App;
