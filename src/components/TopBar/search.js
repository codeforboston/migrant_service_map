import React from "react";
import { Column } from "simple-flexbox";
import "./mapbox-gl-geocoder.css";
import { Geocoder } from "components/Map";

export default class Search extends React.Component {
  render() {
    const { className } = this.props;
    return (
      <>
        <div className={className}>
          <div style={{ padding: "0 0 0 0" }}>
            <Column flexGrow={1}>
              <h2
                style={{
                  flex: 1,
                  padding: "3.2px 0px 0px 16px",
                  marginTop: "2px"
                }}
              >
                NEAR
              </h2>
              <Geocoder/>
            </Column>
          </div>
        </div>
      </>
    );
  }
}
