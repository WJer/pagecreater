import './loading.less';

import React, { Component } from 'react';

/**
 * @desc 全屏的loading插件
 */
export default class Loading extends Component {
  render() {
    const { tips, body = null } = this.props;
    return (
      <div className="app-loading-window">
        {body ? (
          body
        ) : (
          <div className="app-loading-center">
            <div className="app-loadbox">{tips ? tips : 'loading...'}</div>
          </div>
        )}
      </div>
    );
  }
}
