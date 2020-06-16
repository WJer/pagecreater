import './background.less';

import React, { Component } from 'react';
import { bindSelf, toRgba, util } from '../utils';

import CropImage from '../crop-image';
import { Radio, Switch } from 'antd';
import { SetColor } from '../color';
import { SetItem } from '../item';

export default class BackGround extends Component {
  constructor(props) {
    super(props);
    let {
      backgroundGlobal = false,
      backgroundColor = 'rgba(255,255,255,1)',
      backgroundImage = '',
      backgroundImageCrop = '{}',
      backgroundRepeat = 'no-repeat',
      backgroundSize = 'initial'
    } = props.data || {};
    backgroundColor = toRgba(backgroundColor);
    this.state = {
      backgroundColor: toRgba(backgroundColor),
      backgroundRepeat,
      backgroundImageCrop,
      backgroundGlobal,
      backgroundSize,
      backgroundImage
    };
    this.eventId = util.randomID();
  }

  // 背景图片变化
  @bindSelf
  onChange() {
    if (this.props.onChange) {
      this.props.onChange({ ...this.state });
    }
  }

  // 选择图片的回调函数
  @bindSelf
  changeImage(url) {
    this.setState({ backgroundImage: `url(${url})` }, this.onChange);
  }

  // 显示图片列表
  @bindSelf
  showSourceImgs() {
    window.pubSubEditor && window.pubSubEditor.publish('h5ds.img.modal.show', {
      callback: this.changeImage
    });
  }

  // 裁剪OK
  @bindSelf
  onCropOk(data) {
    const { uploadSet } = this.props;
    console.log('裁剪OK', data);
    if (!data.src) {
      this.setState({ backgroundImage: '' }, this.onChange);
      return;
    }
    if (uploadSet) {
      $.ajax({
        type: 'post',
        url: uploadSet.action,
        headers: { ...uploadSet.headers },
        data: {
          content: data.base64.split(',')[1]
        }
      }).done(d => {
        if (d.path) {
          this.setState({ backgroundImage: `url(${d.path})` }, this.onChange);
        } else {
          console.error(`数据返回格式错误： {path: 'xxxx'}`);
        }
      });
    } else {
      console.error('图片裁剪需要配置 uploadBase64 接口参数！');
    }
  }

  // slider 方法
  @bindSelf
  sliderDo(val, key) {
    this.setState({ [key]: val }, this.onChange);
  }

  // 颜色变化
  @bindSelf
  changeColor(color) {
    const { r, g, b, a } = color.rgb;
    this.setState({ backgroundColor: `rgba(${r},${g},${b},${a})` }, this.onChange);
  }

  @bindSelf
  changeBackgroundGlobal(val) {
    this.setState({ backgroundGlobal: val }, this.onChange);
  }

  render() {
    const RadioGroup = Radio.Group;
    const RadioButton = Radio.Button;
    let { backgroundColor, backgroundRepeat, backgroundGlobal, backgroundImage, backgroundSize } = this.state;
    const { title = '页面背景', colorTitle = '背景颜色', setBackgroundGlobal = false } = this.props;
    return (
      <div className="app-util-background">
      
      </div>
    );
  }
}
