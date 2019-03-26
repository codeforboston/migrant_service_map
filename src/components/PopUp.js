import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import ReactDOM from "react-dom";
import { DetailsPane } from "../components/";
import "./popup.css";

export const insertPopup = (map, coordinates, props) => {
  const DOMInsert = document.createElement("div");

  new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setDOMContent(DOMInsert)
    .addTo(map);

  ReactDOM.render(<Popup provider={props} />, DOMInsert);
};

export class Popup extends Component {
  componentDidMount() {
    console.log("popup mounted");
  }

  render() {
    return (
      <div className="popup">
        <div className="popup-title">
          {this.props.provider.name} (id: {this.props.provider.id})
        </div>
        <DetailsPane provider={this.props.provider} />
        <div className="bottom-button-bar">
          {/* <AcceptingNewClients /> */}
          <SaveButton isSaved={true} handleClick={this.props.handleClick} />
        </div>
      </div>
    );
  }
}

export class AcceptingNewClients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAccepting: true
    };
  }

  handleClick = () => {
    let { isAccepting } = this.state;
    isAccepting = !isAccepting;
    this.setState({ isAccepting });
  };

  render() {
    return (
      <IndicatorLight
        shouldBeOn={this.state.isAccepting}
        text={"accepting clients"}
        onClick={this.handleClick}
      />
    );
  }
}

export class SaveButton extends Component {
  render() {
    let { isSaved } = this.props;
    let text = isSaved ? "saved" : "save";
    return (
      <div className="bottom-button-bar">
        <IndicatorCheck
          shouldBeOn={isSaved}
          text={text}
          toggleSavedStatus={this.props.toggleSavedStatus}
        />
      </div>
    );
  }
}

export const IndicatorLight = props => {
  let { shouldBeOn, text, onClick, colorOn, colorOff } = props;

  //user can choose other colors, but setting default colors here
  const thisColorOn = colorOn ? colorOn : "green";
  const thisColorOff = colorOff ? colorOff : "#BCBCBC";

  const fillCircle = (
    <svg height="22px" width="22px">
      <circle r="7px" cx="7px" cy="50%" fill={thisColorOn} />
    </svg>
  );

  const strokeCircle = (
    <svg height="22px" width="22px">
      <circle r="7px" cx="50%" cy="50%" stroke={thisColorOff} fill="none" />
    </svg>
  );

  const icon = shouldBeOn ? fillCircle : strokeCircle;
  const style = shouldBeOn ? {} : { color: thisColorOff };

  return (
    <div className="statusToggles" onClick={onClick}>
      <div alt="circle icon" height="18px" width="18px">
        {icon}
      </div>
      <div className="indicator-text" style={style}>
        {text}
      </div>
    </div>
  );
};

const IndicatorCheck = props => {
  let { shouldBeOn, text, toggleSavedStatus, colorOn, colorOff } = props;

  //user can choose other colors, but setting default colors here
  const thisColorOn = colorOn ? colorOn : "#2699FB";
  const thisColorOff = colorOff ? colorOff : "none";

  const color = shouldBeOn ? thisColorOn : thisColorOff;

  const checkMark = (
    <svg height="16px" width="16px">
      <path
        d="M0,10 L7,14 L14,0"
        stroke={color}
        strokeWidth="3px"
        fill="none"
      />
    </svg>
  );

  return (
    <div className="statusToggles" onClick={toggleSavedStatus}>
      <div alt="check" height="18px" width="18px">
        {shouldBeOn && checkMark}
      </div>
      {text}
    </div>
  );
};
