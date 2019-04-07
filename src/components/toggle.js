import React from "react";

class Toggle extends React.Component {
  render() {
    const cxDistance = this.props.toggleOn ? 45 : 15;
    const bgColor = this.props.toggleOn ? "#8c45cf" : "white";
    const fgColor = this.props.toggleOn ? "white" : "#8c45cf";
    const rectStyle = {
      height: 20,
      width: 50,
      x: 5,
      y: 5,
      rx: 10,
      ry: 30,
      fill: bgColor,
      stroke: "#8c45cf",
      strokeWidth: "1px",
      transition: "all .2s"
    };
    const circleStyle = {
      cx: cxDistance,
      cy: 15,
      r: 8,
      fill: fgColor,
      transition: "all .2s"
    };
    const svgStyle = {
      overflow: "visible",
      margin: "0 0 8px 0"
    };

    return (
      <div style={{ flex: 1 }} onClick={this.props.handleClick}>
        <svg
          viewport="150 150"
          height={20}
          width={60}
          className="toggle svg"
          style={svgStyle}
        >
          <rect style={rectStyle} className="toggle toggle-well" />
          <circle
            id="toggle"
            style={circleStyle}
            className="toggle toggle-off"
          />
        </svg>
      </div>
    );
  }
}

export default Toggle;
