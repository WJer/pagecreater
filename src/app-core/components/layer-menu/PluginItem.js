import React, { Component } from 'react';

import { bindSelf } from '../../utils';

export default class PluginItem extends Component {
  @bindSelf
  onClick(e) {
    this.props.onClick && this.props.onClick(e, this.data);
  }

  render() {
    this.data = this.props.data;
    const { pid, name = '未命名', version = '1.0.0', icon } = this.props.data;
    return (
      <div className="app-plugin-item">
        <div onClick={this.onClick} className="app-plugin-span app-plugin-pic">
          {icon || <i className="app-ico app-ico-domnode" />}
        </div>
        <div className="app-plugin-span app-plugin-info">
          <h1 onClick={this.onClick}>{name}</h1>
          <p>
            <em>version:</em> {version}
          </p>
          <p>
            <a href={pid} target="_blank" rel="noopener noreferrer">
              插件详情
            </a>
          </p>
        </div>
      </div>
    );
  }
}
