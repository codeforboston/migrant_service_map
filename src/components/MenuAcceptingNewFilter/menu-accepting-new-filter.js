import React, { Component } from "react";
import "../ProviderList/provider-list.css";
import Toggle from "../toggle.js";
class MenuAcceptingNewFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleOn: false
    };
  }
  toggleToggle = () => {
    let toggleOn = this.state.toggleOn;
    toggleOn = !toggleOn;
    this.setState({ toggleOn });
  };

  render() {
    const backerColor = this.state.toggleOn ? "#8c45cf" : "white";
    const backerSecondaryColor = this.state.toggleOn ? "white" : "gray";
    return (
      <div
        onClick={this.toggleToggle}
        className={this.props.className}
        style={{
          flex: 1,
          padding: "4px 10px",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <p
          style={{
            flex: 1,
            color: backerSecondaryColor,
            backgroundColor: backerColor,
            borderRadius: "10%",
            padding: "6px",
            margin: "0 4px",
            textAlign: "center",
            border: "1px solid " + backerSecondaryColor
          }}
        >
          NEW
        </p>
        <h2 style={{ flex: 1 }}>Accepting&nbsp;New&nbsp;Clients</h2>
        <Toggle
          toggleOn={this.state.toggleOn}
          handleClick={this.toggleToggle}
        />
      </div>
    );
  }
}

export default MenuAcceptingNewFilter;

//   <li className="dropdown-list-container"  onClick={this.props.handleClick}>
//   <div className="dropdown-list-header" >
//     <h2>Distance Filter</h2>
//   <p id="menuDistanceStatus" >Current distance</p>
//     </div>
// <ul className="dropdown-list" >
//   {distances.map((el, i) => (
//     <li className="dropdown-list-item" key={i}>
//       <div>
//         <input
//           type="radio"
//           name="distance"
//           id={el}
//           value={el}
//           onChange={() => {
//             this.props.changeDistanceFilter(el);
//           }}
//           checked={this.props.filters.distance === el}
//         />
//         <label htmlFor={el}>
//           {el} mile{el > 1 ? "s" : ""}
//         </label>
//       </div>
//     </li>
//   ))}
//   <button className="dropdown-button" onClick={this.props.clearDistanceFilter}>Clear filter</button>
// </ul>
// </li>
