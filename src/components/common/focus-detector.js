import React from "react";

export default class FocusDetector extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  onClick = ({ target }) => {
    const { onFocusLost } = this.props;
    if (!this.ref.current.contains(target)) {
      onFocusLost();
    }
  };

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.onClick);
  }

  componentDidMount = () => {
    document.addEventListener("mousedown", this.onClick);
  };

  render() {
    const { className } = this.props;
    return (
      <div ref={this.ref} className={className}>
        {this.props.children}
      </div>
    );
  }
}
