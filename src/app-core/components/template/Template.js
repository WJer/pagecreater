import './template.less';

import React, { Component } from 'react';
import { bindSelf } from '../../utils';
import { inject, observer } from 'mobx-react';

@inject('h5ds', 'scope')
@observer
class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPanel: false
    };
  }

  // 折叠面板
  @bindSelf
  changePanel() {
    this.setState({
      showPanel: !this.state.showPanel
    });
  }

  componentDidMount() {
    window.pubSubEditor.subscribe('h5ds.showPageTpls', () => {
      this.setState({
        showPanel: true
      });
    });
  }

  componentWillUnmount() {
    window.pubSubEditor.unsubscribe('h5ds.showPageTpls');
  }

  render() {
    const TemplateDom = this.props.scope.options.template;
    const { showPanel } = this.state;
    const cName = ['app-template'];
    if (showPanel) {
      cName.push('app-temps-showpanel');
    }
    if (!TemplateDom) {
      return null;
    }
    return (
      <div className={cName.join(' ')}>
        <a onClick={this.changePanel} className="app-temps-flodbtn app-js-temps">
          <i className={showPanel ? 'app-ico app-ico-a3left' : 'app-ico app-ico-a3right'} />
        </a>
        <TemplateDom layerfun={this.props.layerfun} h5ds={this.props.h5ds} showPanel={showPanel} />
      </div>
    );
  }
}

export default Template;
