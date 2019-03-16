import React from "react";
import { DetailsPane, SaveButton } from '../PopUp';

export default class DropdownMenuItem extends React.Component {
  constructor(props){
    super(props);
    this.state = { expanded: false }
  }

  onItemClick = (event) => {
    event.preventDefault(); // Keeps the browser from reloading
    this.setState({ expanded: !this.state.expanded })
    // setPopUp(item.properties);
  };

  render() {
    let { text, item, children } = this.props;
    
    return (
      <div className="list-item">
        <a href="#target" onClick={this.onItemClick}>{text}</a>
        { this.state.expanded ? (<>
          <DetailsPane provider={item}/>
          {children}
        </>) : null }
      </div>
    );
  }
}
