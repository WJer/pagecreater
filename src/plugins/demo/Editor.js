import './editor.less';

import React, { Component } from 'react';

const icon = <i className="app-ico app-ico-xingzhuang" />;

/**
 * props: h5ds, scope, layer  mobx
 */
class Editor extends Component {
  constructor(props) {
    super(props);
  }

  showModal = () => {
    window.pubSubInstance.publish('demo.show.modal');
  };

  changeData = () => {
    this.props.layer.data = +new Date();
    this.props.h5ds.updateCanvas();
  }

  render() {
    return (
      <div className="editor-mantou-demo">
        <button onClick={this.showModal}>点击弹窗</button>
        <br/>
        <br/>
        <button onClick={this.changeData}>修改data</button>
      </div>
    );
  }
}

export { Editor, icon };
