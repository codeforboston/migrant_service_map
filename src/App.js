import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { TestPattern, ResourceListItem, ResourceSectionHeader, ResourceList, resourceObjects } from './main.js';
import { TopNav, Menu } from './components';

class App extends Component {
  render() {
    return (
      <div >
        <TopNav />
        <div id='map'></div>
        {Menu()}
      </div>
    );
  }
}

export default App;
