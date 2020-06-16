import './layerset.less';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import AnimateSet from './animate-set'; // 动画设置
import LayerEvent from './layer-event'; // 交互
import StyleSet from './style-set'; // 样式设置
import { Tabs } from 'antd'; ///
import { bindSelf } from '../../../utils';
import { transaction } from 'mobx';

@inject('h5ds', 'scope')
@observer
class LayerSet extends Component {
  @bindSelf
  changeTabs() {
    transaction(() => {
      this.props.h5ds.edata.eventListShow = false;
      this.props.h5ds.edata.animateListShow = false;
    });
  }

  render() {
    const h5ds = this.props.h5ds;
    const selectlayerKeys = h5ds.edata.selectlayerKeys;
    const layer = h5ds.getLayer();
    if (!layer) {
      // 当么有选择layer的时候，销毁DOM，释放内存
      return null;
    }
    const { editorConfig = {} } = this.props.scope.pluginsKey[layer.pid] || {};
    const TabPane = Tabs.TabPane;
    return (
      <div className="app-layerset">
        <div className="app-layerset-tabsbox">
          <StyleSet key={selectlayerKeys + '1'} />
        </div>
      </div>
    );
  }
}

export default LayerSet;
