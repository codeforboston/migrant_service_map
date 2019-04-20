import React from "react";

export default class Search extends React.Component {
  render() {
    const { className } = this.props;
    return (
      <>
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v3.1.6/mapbox-gl-geocoder.css"
          type="text/css"
        />
        <div className={className} id="nav-search" style={{flex: 1}}/>
      </>
    );
  }
}
