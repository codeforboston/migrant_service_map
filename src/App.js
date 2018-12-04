import React, { Component } from 'react';
import { TopNav, Menu, FlexContainer } from './components';
import Map from './map';

class App extends Component {
	constructor(props){
		super(props);
	}

  render() {
    return (
      <div >
        <TopNav />
        <FlexContainer 
        	children={[<Menu />,
        	<Map />]} />
     
      </div>
    );
  }
}

export default App;

       // <FlexContainer children={[Menu(this.mapRef), <Map ref={this.mapRef} />]} />
