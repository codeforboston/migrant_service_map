import React, { Component } from "react";
import {Row} from 'simple-flexbox';
import MenuItem from "./MenuItem";

export default class MenuCategory extends Component {
  state = {
    expanded: false
  };

  toggleMenu = () => {
    let { expanded } = this.state;
    expanded = !expanded;
    this.setState({ expanded });
  };

  renderHeader() {
    let { props } = this;

    return (
      <Row className="menu-category" onClick={this.toggleMenu}>
        <div>{"•"}</div>
        <div style={{flexGrow: 1}}>
          <a href="#target">
            {props.category}
          </a>
        </div>
        <i>{"v"}</i>
      </Row>
    );
  }

  renderMenuItems() {
    let { items } = this.props;

    return items.map((item, index) => <MenuItem key={index} {...item} />)
  }

  render() {
    let { expanded } = this.state;

    return (
      <>
        {this.renderHeader()}
        {expanded && this.renderMenuItems()}
      </>
    );
  }
}
