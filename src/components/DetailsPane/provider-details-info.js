import React from "react";

export default class ProviderDetailsInfo extends React.Component {
  render() {
    const { label, icon } = this.props;
    return (
      <span className="provider-details-info">
        <img alt={icon + " icon"} src={"https://icon.now.sh/" + icon} />
        <div>
          <div>{label.toUpperCase()}</div>
          <div>{this.props.children}</div>
        </div>
      </span>
    );
  }
}
