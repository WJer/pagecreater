import { Button, Icon, InputNumber, Popover, Select, Spin, Switch } from 'antd';
import React, { Component } from 'react';
import { SetGrid, SetItem } from '../../../../../app-components/item';
import { bindSelf, util } from '../../../../utils';
import { toJS, transaction } from 'mobx';

import Artword from './artword';
import ContentEditable from './ContentEditable';
import { ReactColor } from '../../../../../app-components/color';
import SliderGroup from '../../../../../app-components/slider-group';
import { animates } from './textAnimate';
import { fontData } from './fontData';
import { fontFamilyData } from './fontFamily';
import { loadFont } from './loadText';

// 艺术字类型
const artwordTypes = [
  { type: '3d', name: '3D', colors: ['#ffab00', '#67490d'] },
  { type: 'kaTong', name: '卡通', colors: ['#4e1515'] },
  { type: 'jiaXin', name: '夹心', colors: ['#bf2929', '#fff'] },
  { type: 'yinYing', name: '阴影', colors: ['#3c9df3', '#12e686'] },
  { type: 'niHong', name: '霓虹', colors: ['#f33c3c'] },
  { type: 'border', name: '边框', colors: ['#fff', '#3c5ef3'] },
  { type: 'cuoJue', name: '错觉', colors: ['#000', '#ff1dff', '#4affff'] },
  { type: 'jianBian', name: '渐变', colors: ['#fff', '#1d24ff', '#00efff'] },
  { type: 'qieGe', name: '切割', colors: ['#9075ff', '#e227b1'] },
  { type: 'fire', name: '火焰', colors: ['#F00'] },
  { type: 'snow', name: '冰雪', colors: ['#9dffff', '#98e7ff'] },
  { type: 'louKong', name: '镂空', colors: ['#ff7c7c', '#de0000'] }
];

export default class EditorSet extends Component {
  constructor(props) {
    super(props);
    const data = toJS(props.layer.data) || {};
    this.state = {
      html: data.data,
      fontFamilySet: data.fontFamilySet || {},
      style: data.style || {},
      animate: data.animate,
      artword: data.artword || {},
      artwordKey: util.randomID(),
      fontLoading: false
    };
    this.unmount = false;
  }

  // renderLayer
  renderLayer = util.debounce(this.renderLayerAsyncFlase, 100);

  @bindSelf
  renderLayerAsyncFlase() {
    const { layer } = this.props;
    const { style, animate, artword, fontFamilySet } = this.state;
    transaction(() => {
      layer.data.fontFamilySet = { ...fontFamilySet };
      layer.data.style = { ...style };
      layer.data.animate = animate ? { ...animate } : '';
      layer.data.artword = util.cloneDeep(artword);
      this.calibration();
    });
  }

  // 校准dom
  @bindSelf
  calibration() {
    transaction(() => {
      this.props.h5ds.edata.keys = util.randomID();
      const $layer = this.props.h5ds.getLayerDom();
      if (!$layer) {
        return;
      }
      this.editAuto = $layer.find('.layer-h5ds_text-auto');
      if (this.editAuto) {
        this.props.layer.style.height = this.editAuto.height();
        window.pubSubEditor.publish('h5ds.initControl'); // 实例化控制器
        window.pubSubEditor.publish('h5ds.setHistory');
      }
    });
  }

  @bindSelf
  setClassName(isActive) {
    let dataArr = ['app-ex-h5ds_text-btn'];
    if (isActive) {
      dataArr.push('app-active');
    }
    return dataArr.join(' ');
  }

  @bindSelf
  fontWeight() {
    const style = this.state.style;
    if (style.fontWeight === 'bold') {
      style.fontWeight = 'normal';
    } else {
      style.fontWeight = 'bold';
    }
    this.setState({ style }, this.renderLayer);
  }

  @bindSelf
  fontStyle(key) {
    const style = this.state.style;
    if (style.fontStyle === key) {
      style.fontStyle = 'normal';
    } else {
      style.fontStyle = key;
    }
    this.setState({ style }, this.renderLayer);
  }

  @bindSelf
  fontDecoration(key) {
    const style = this.state.style;
    if (style.textDecoration === key) {
      style.textDecoration = 'none';
    } else {
      style.textDecoration = key;
    }
    this.setState({ style }, this.renderLayer);
  }

  @bindSelf
  textAlign(key) {
    const style = this.state.style;
    if (style.textAlign === key) {
      style.textAlign = 'normal';
    } else {
      style.textAlign = key;
    }
    this.setState({ style }, this.renderLayer);
  }

  @bindSelf
  setFontSize(val) {
    const style = this.state.style;
    style.fontSize = val;
    this.setState({ style }, this.renderLayer);
  }

  // 字体颜色
  @bindSelf
  setFontColor(val) {
    let { r, g, b, a } = val.rgb;
    const { style } = this.state;
    style.color = `rgba(${r},${g},${b},${a})`;
    this.setState({ style }, this.renderLayer);
  }

  // 间距
  @bindSelf
  changeFontSpace(val) {
    const { style } = this.state;
    style.letterSpacing = val;
    this.setState({ style }, this.renderLayerAsyncFlase);
  }

  // 行距
  @bindSelf
  changeFontLineHeight(val) {
    const { style } = this.state;
    style.lineHeight = val;
    this.setState({ style }, this.renderLayerAsyncFlase);
  }

  // 选择动画
  @bindSelf
  selectAnimate(val) {
    let animate = {};
    for (let i = 0; i < animates.length; i++) {
      if (animates[i].animate === val) {
        animate = { ...animates[i] };
        break;
      }
    }
    this.setState({ animate }, this.renderLayerAsyncFlase);
  }

  // 加载字体
  @bindSelf
  async loadFontFamily(n) {
    this.setState({ fontLoading: true });
    await loadFont(n).then(d => {
      //设置字体
      let { style, fontFamilySet } = this.state;
      style.fontFamily = d; // 字体名字不会变化的
      if (d !== '默认字体') {
        // 这里的字体名称会在发布的时候替换成minfont
        fontFamilySet = fontFamilyData.filter(data => data.name === d)[0];
      } else {
        fontFamilySet = {
          name: '默认字体',
          url: ''
        };
      }
      this.setState({ style, fontFamilySet, fontLoading: false }, this.renderLayerAsyncFlase);
    });
  }

  // 设置参数
  @bindSelf
  setAnimate(val, key) {
    let { animate } = this.state;
    if (key !== 'fun') {
      animate[key] = val + 's';
    } else {
      animate[key] = val;
    }
    this.setState({ animate }, this.renderLayerAsyncFlase);
  }

  @bindSelf
  onSwitchAnimate(val) {
    let animate = '';
    if (val) {
      animate = { ...animates[0] };
    }
    this.setState({ animate }, this.renderLayer);
  }

  @bindSelf
  onSwitchArtWord(val) {
    let artword = null;
    if (val) {
      artword = { ...artwordTypes[0] };
    } else {
      artword = { type: '', name: '', colors: [] };
    }
    this.setState({ artword }, this.renderLayer);
  }

  // 选择艺术字
  @bindSelf
  selectArtWord(d) {
    this.props.layer.data.artword = util.cloneDeep(d);
    this.setState(
      {
        artword: util.cloneDeep(d),
        artwordKey: util.randomID()
      },
      this.renderLayer
    );
  }

  // 设置艺术字size
  @bindSelf
  onChangeArtWordSize(val) {
    let artword = this.state.artword;
    artword.size = val;
    this.setState({ artword }, this.renderLayer);
  }

  @bindSelf
  setArtWordColor(d, i) {
    let { r, g, b, a } = d.rgb;
    let color = `rgba(${r},${g},${b},${a})`;
    let artword = this.state.artword;
    artword.colors[i] = color;
    this.setState({ artword }, this.renderLayer);
  }

  // 文本变化
  changeText = util.debounce(e => {
    this.props.layer.data.data = e.target.value;
    this.calibration();
  }, 500);

  // 文字加载
  @bindSelf
  loadFontSource() {
    console.log('新初始化了 <EditorSet />');
    // 切换到文本编辑器的时候，loading字体
    let { fontFamily, fontFamilySet } = this.state.style;
    this.setState({ fontLoading: true });
    loadFont(fontFamily).then(d => {
      if (d !== '默认字体') {
        // 这里的字体名称会在发布的时候替换成minfont
        fontFamilySet = fontFamilyData.filter(data => data.name === d)[0];
      } else {
        fontFamilySet = {
          name: '默认字体',
          url: ''
        };
      }
      if (!this.unmount) {
        // 加载字体成功后，更新下字体
        this.setState({ fontFamilySet, fontLoading: false }, this.renderLayerAsyncFlase);
      }
    });
  }

  componentDidMount() {
    this.loadFontSource();
  }

  componentWillUnmount() {
    this.unmount = true;
  }

  render() {
    const Option = Select.Option;
    const {
      fontWeight = 'normal',
      textAlign = 'left',
      textDecoration = 'none',
      fontStyle = 'normal',
      color = 'rgba(0,0,0,1)',
      fontSize = '14px',
      lineHeight = 1,
      letterSpacing = 0,
      fontFamily
    } = this.state.style;

    const {
      // name = '弹入',
      // type = 'in',
      animate = 'bounceIn',
      time = '0s',
      delay = '0s',
      // count = 1,
      interval = '0.2s',
      fun = 'ease'
    } = this.state.animate || {};

    // const { type = '', name = '', colors = [] } = this.state.artword || {};
    const artword = this.state.artword;
    // console.log(lineHeight, letterSpacing);

    return (
      <div key={this.props.keyid}>
        <SetGrid>
          <ContentEditable className="app-ex-h5ds_text-richtext" onChange={this.changeText} html={this.state.html} />
        </SetGrid>
        <SetItem name="字体大小">
          <Select
            key={fontSize}
            onChange={this.setFontSize}
            size="small"
            value={fontSize || '14px'}
            style={{ width: 120 }}
          >
            {fontData.map(d => {
              return (
                <Option key={d} value={d + 'px'}>
                  {d}px
                </Option>
              );
            })}
          </Select>
        </SetItem>
        {!artword.type ? (
          <SetItem name="字体颜色">
            <ReactColor onChange={this.setFontColor} color={color} />
          </SetItem>
        ) : null}
      </div>
    );
  }
}
