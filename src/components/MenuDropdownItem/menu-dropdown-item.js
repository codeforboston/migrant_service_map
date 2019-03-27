import React from "react";
import { connect } from "react-redux";
import { DetailsPane } from "..";
import { displayProviderInformation } from "../../redux/actions";

class DropdownMenuItem extends React.Component {
  render() {
    let { text, item, children, expanded } = this.props;

    return (
      <div className="list-item">
        <a href="#target" onClick={() => this.props.onItemClick(item.id)}>
          {text}
        </a>
        {expanded ? (
          <>
            <DetailsPane provider={item} />
            {children}
          </>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onItemClick: id => {
      dispatch(displayProviderInformation(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropdownMenuItem);
