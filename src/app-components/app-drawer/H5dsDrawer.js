import './h5dsdrawer.less';

import React, { Component } from 'react';

import ReactDOM from 'react-dom';
import { bindSelf } from '../utils';

/**
 * @desc 顶部的抽屉
 */
export default class H5dsDrawer extends Component {
  constructor(props) {
    super(props);
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
  }

  @bindSelf
  onClose() {
    this.props.close && this.props.close();
  }

  render() {
    const { show, title, className } = this.props;
    const cls = ['app-drawer'];
    if (show) {
      cls.push('app-drawer-show');
    }
    if (title) {
      cls.push('app-drawer-hastitle');
    }
    if (className) {
      cls.push(className);
    }
    return ReactDOM.createPortal(
      <div className={cls.join(' ')}>
        <a className="app-drawer-close" onClick={this.onClose}>
          &times;
        </a>
        {title ? (
          <div className="app-drawer-title">
            <span className="app-drawer-title-icon" />
            <h3>{title}</h3>
          </div>
        ) : null}
        <div className="app-drawer-content">{show ? this.props.children : null}</div>
      </div>,
      this.container
    );
  }
}
