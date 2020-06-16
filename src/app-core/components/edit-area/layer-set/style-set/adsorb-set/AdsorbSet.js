import './adsorbset.less';

import React, { Component } from 'react';
import { SetItem } from '../../../../../../app-components/item';
import { bindSelf } from '../../../../../utils';
import { inject, observer } from 'mobx-react';

import { Switch } from 'antd';

@inject('h5ds', 'scope')
@observer
class AdsorbSet extends Component {
  constructor(props) {
    super(props);
    this.layer = props.h5ds.getLayer();
    this.state = {
      checked: this.layer.adsorb ? true : false,
      active: `app-adsorbset-${this.layer.adsorb}`
    };
  }

  @bindSelf
  onChange(checked) {
    this.setState({ checked });
    this.layer.adsorb = '';
  }

  @bindSelf
  setAdsorb(active) {
    this.setState({ active });
    this.layer.adsorb = active.replace('app-adsorbset-', '');
  }

  render() {
    const classes = [
      'app-adsorbset-top-left',
      'app-adsorbset-top-center',
      'app-adsorbset-top-right',
      'app-adsorbset-left-center',
      'app-adsorbset-right-center',
      'app-adsorbset-bottom-left',
      'app-adsorbset-bottom-center',
      'app-adsorbset-bottom-right'
    ];
    const { checked, active } = this.state;
    const { editorConfig = {} } = this.props.scope.pluginsKey[this.layer.pid] || {};
    return (
      <div className="app-adsorbset">
        {editorConfig.adsorb !== false && (
          <SetItem name="外框吸附">
            <Switch checked={checked} onChange={this.onChange} />
            {checked ? (
              <React.Fragment>
                <div className="app-adsorbset-tips">外框吸附说明：吸附效果会根据整个视图区域进行定位，选择一个相对的对齐点</div>
                <div className="app-adsorbset-dots">
                  {classes.map(d => {
                    let cls = [d];
                    if (d === active) {
                      cls.push('app-adsorbset-active');
                    }
                    return <a onClick={() => this.setAdsorb(d)} key={d} className={cls.join(' ')} />;
                  })}
                </div>
              </React.Fragment>
            ) : null}
          </SetItem>
        )}
      </div>
    );
  }
}

export default AdsorbSet;
