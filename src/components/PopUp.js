import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import ReactDOM from "react-dom";

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
    let { name, website, bio, telephone, address } = this.props.provider;

    return (
      <div className="popup">
        <div className="popup-title">{name}</div>
        <div>
          <span className="popup-info">
            <img alt="phone icon" src="https://icon.now.sh/perm_phone_msg" />
            {telephone}
          </span>
          <span className="popup-info">
            <img alt="web icon" src="https://icon.now.sh/language" />
            {website}
          </span>
          <span className="popup-info">
            <img alt="home icon" src="https://icon.now.sh/home" />
            {address || "address"}
          </span>
        </div>
        <div className="popup-text">{bio}</div>
        <div className="bottom-button-bar">
          <AcceptingNewClients />
          <SaveButton />
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
  constructor(props) {
    super(props);
    this.state = {
      isSaved: false
    };
  }

  handleClick = () => {
    let { isSaved } = this.state;
    isSaved = !isSaved;
    this.setState({ isSaved });
  };

  render() {
    let { isSaved } = this.state;
    let text = isSaved ? "saved" : "save";
    return (
      <IndicatorCheck
        shouldBeOn={isSaved}
        text={text}
        onClick={this.handleClick}
      />
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

export const IndicatorCheck = props => {
  let { shouldBeOn, text, onClick, colorOn, colorOff } = props;

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
    <div className="statusToggles" onClick={onClick}>
      <div alt="check" height="18px" width="18px">
        {shouldBeOn && checkMark}
      </div>
      {text}
    </div>
  );
};