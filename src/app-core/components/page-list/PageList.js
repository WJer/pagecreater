import './pagelist.less';

import React, { Component } from 'react';
import { bindSelf } from '../../utils';
import { inject, observer } from 'mobx-react';

import List from './List';

@inject('h5ds')
@observer
class PageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 当前选中状态
      selected: 'pages' // popups, fixeds
    };
  }

  /**
   * 切换tabs
   * @param {string} selected pages，popups, fixeds
   */
  @bindSelf
  changeTabs(selected) {
    this.setState({ selected });
    this.props.h5ds.setPage(0, selected);
    window.pubSubEditor.publish('h5ds.destoryControl');
  }

  /**
   * 设置h5ds-active，tab切换选中状态
   */
  setActive(selected) {
    let cName = ['app-tab-head'];
    if (this.state.selected === selected) {
      cName.push('app-active');
    }
    return cName.join(' ');
  }

  render() {
    return (
      <div className="app-pagelist app-js-pagelist">
        <div className="app-tab">
          <div className="app-tab-header app-pagelist-btn">
            <ul className="app-global-clearfix">
              <li onClick={() => this.changeTabs('pages')} className={this.setActive('pages')}>
                页面
              </li>
              <li onClick={() => this.changeTabs('popups')} className={this.setActive('popups')}>
                弹窗
              </li>
              <li onClick={() => this.changeTabs('fixeds')} className={this.setActive('fixeds')}>
                浮动
              </li>
            </ul>
          </div>
          <div className="app-tab-body app-pagelist-pages">
            <div className="app-tab-box app-ban-animate" style={{ display: 'block' }}>
              <List />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PageList;
