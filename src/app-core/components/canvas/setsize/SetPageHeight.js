import React, { Component } from 'react';
import { bindSelf, util } from '../../../utils';
import { inject, observer } from 'mobx-react';

import { config } from '../../../config';
import { transaction } from 'mobx';

@inject('h5ds')
@observer
class SetPageHeight extends Component {
  constructor(props) {
    super(props);
  }

  @bindSelf
  setPageHei(e) {
    e.stopPropagation();
    const { edata, getPage } = this.props.h5ds;
    const page = getPage();
    if (!page.style.height) {
      page.style.height = config.appHeight;
    }
    let y0 = e.pageY;
    let nowHei = page.style.height;
    let phoneScale = edata.phoneScale;
    const $h5dsCanvasApp = $('.app-js-setsize');
    const $pageHeightNum = $('.app-js-setpage-height');
    // const $canvasRealsize = $('.app-canvas-realsize');
    // let canvasTop = (edata.canvasHeight - page.style.height * phoneScale) / 2;
    const minHeight = config.type === 'phone' ? config.appHeight : 0;
    $(document)
      .on('mousemove.h5ds.setPageHei', em => {
        nowHei = parseInt(page.style.height + (em.pageY - y0) / phoneScale, 10);
        if (nowHei < minHeight) {
          nowHei = minHeight;
        }
        $h5dsCanvasApp.height(nowHei);
        $pageHeightNum.html(nowHei);
        // $canvasRealsize.css({
        //   top: canvasTop - ((nowHei - page.style.height) / 2) * phoneScale
        // });
      })
      .on('mouseup.h5ds.setPageHei', () => {
        transaction(() => {
          page.style.height = nowHei;
          edata.pageSize.height = page.style.height;
          edata.keys = util.randomID();
          window.pubSubEditor.publish('h5ds.setHistory');
          $(document).off('mousemove.h5ds.setPageHei mouseup.h5ds.setPageHei');
        });
      });
  }

  render() {
    const { height } = this.props;
    const { edata } = this.props.h5ds;
    return (
      <div className="app-setpage-height">
        <span key={height} className="app-setpage-px">
          <span className="app-js-setpage-height">{height}</span>
          px [缩放：{edata.phoneScale}]
        </span>
        <a onMouseDown={this.setPageHei} className="app-js-setpage app-setpage-height-btn">
          <i className="app-ico app-ico-shangxiawen" />
        </a>
      </div>
    );
  }
}

export default SetPageHeight;
