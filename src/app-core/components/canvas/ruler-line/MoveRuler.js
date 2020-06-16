import React, { Component } from 'react';

export default class MoveRuler extends Component {
  state = {
    left: 0,
    top: 0
  };

  componentDidMount() {
    $('.app-center').on('mousemove', e => {
      this.setState({
        left: e.pageX - 140,
        top: e.pageY - 60
      });
    });
  }

  componentWillUnmount() {
    $('.app-center').off('mousemove');
  }

  render() {
    return (
      <React.Fragment>
        <span className="app-ruler-span-x" style={{ height: this.props.lineWidth, left: this.state.left }} />
        <span className="app-ruler-span-y" style={{ width: this.props.lineWidth, top: this.state.top }} />
      </React.Fragment>
    );
  }
}
