import React from "react";
import { connect, dispatch } from "react-redux";
import { filterByName } from "../../actions";

class MenuSearch extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.searchChange(event.target.value);
  }
  render() {
    return <input id="menu-search" type="text" onChange={this.onChange} />;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    searchChange: name => {
      return dispatch(filterByName(name));
    }
  };
};

export default connect(
  ({ providerTypes }) => ({ providerTypes }),
  mapDispatchToProps
)(MenuSearch);
