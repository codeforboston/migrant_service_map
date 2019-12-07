import React, { Component } from "react";
import iconImage from "../../assets/info-icon.svg";
import "./top-bar.css";

let helpWindowReference = {};

class Link extends Component {
  constructor(props) {
    super(props);
    let { href } = props;
    helpWindowReference[href] = null;
    this.handleClick = href => {
      if (
        helpWindowReference[href] == null ||
        helpWindowReference[href].closed
      ) {
        helpWindowReference[href] = window.open(href);
      } else {
        helpWindowReference[href].focus();
      }
    };
  }

  render() {
    return (
      <a
        href={this.props.href}
        onClick={e => {
          this.handleClick(this.props.href);
          e.preventDefault();
        }}
      >
        <h2>{this.props.title}</h2>
      </a>
    );
  }
}

class HelpMenu extends Component {
  helpLinks = [
    { title: "Help Guide", url: "/help/help-guide.html" },
    { title: "Send Feedback", url: "https://forms.gle/1eUKSKSRyi1xTaD6A" },
    {
      title: "Update Provider Info",
      url: "https://forms.gle/2Ro2nWhGzfHmnx3m9"
    }
  ];

  render() {
    return (
      <div className={this.props.className}>
        <img id="help-icon" src={iconImage} alt="help-menu" />
        <div className="help-links">
          {this.helpLinks.map((link, i) => (
            <Link key={i} href={link.url} title={link.title} />
          ))}
        </div>
      </div>
    );
  }
}
export default HelpMenu;
