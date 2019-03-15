import React from "react";
import { DetailsPane } from '../PopUp';

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
    let { text, item, saved, toggleSaved } = this.props;
    let details = this.state.expanded ? <DetailsPane provider={item} isSaved={saved} toggleSaved={toggleSaved} /> : null;
    return (
      <div className="list-item">
        <a href="#target" onClick={this.onItemClick}>{text}</a>
        {details}
      </div>
    );
  }
}
