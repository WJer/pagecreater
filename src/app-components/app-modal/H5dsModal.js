import './h5dsmodal.less';

import React, { Component } from 'react';

import ReactDOM from 'react-dom';
import { bindSelf } from '../utils';

export default class H5dsModal extends Component {
  constructor(props) {
    super(props);
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
  }

  @bindSelf
  onClose() {
    this.props.close && this.props.close();
  }

  componentWillUnmount() {
    document.body.removeChild(this.container);
  }
  render() {
    const { show, title, className, forceRender = false } = this.props;
    const cls = ['app-modal'];
    if (show) {
      cls.push('app-modal-show');
    }
    if (title) {
      cls.push('app-modal-hastitle');
    }
    if (className) {
      cls.push(className);
    }
    return ReactDOM.createPortal(
      <div className={cls.join(' ')}>
        <a className="app-modal-close" onClick={this.onClose}>
          &times;
        </a>
        {title ? (
          <div className="app-modal-title">
            <span className="app-modal-title-icon" />
            <h3>{title}</h3>
          </div>
        ) : null}
        {!forceRender ? <div className="app-modal-content">{this.props.children}</div> : <div className="app-modal-content">{show ? this.props.children : null}</div>}
      </div>,
      this.container
    );
  }
}
