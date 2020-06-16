import './setitem.less';

import React, { Component } from 'react';

export default class SetItem extends Component {
  render() {
    // compose : subsection or combin
    const { name, children, className = '', compose = 'combin' } = this.props;
    return (
      <div className={`app-layout-setitem app-layout-setitem-${compose} ${className}`}>
        <div className="app-layout-setitem-name">{name}</div>
        <div className="app-layout-setitem-content">{children}</div>
      </div>
    );
  }
}
