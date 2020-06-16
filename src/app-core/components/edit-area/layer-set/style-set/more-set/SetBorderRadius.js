import React, { Component } from 'react';
import { bindSelf, util } from '../../../../../utils';
import { extendObservable, transaction } from 'mobx';
import { inject, observer } from 'mobx-react';

import { SetItem } from '../../../../../../app-components/item';
import SliderGroup from '../../../../../../app-components/slider-group';

@inject('h5ds')
@observer
class SetBorderRadius extends Component {
  constructor(props) {
    super(props);
    this.layer = props.h5ds.getLayer();
    this.element = props.h5ds.getLayerDom().find('.element');
    const borderRadius = this.layer.estyle.borderRadius || 0;
    this.state = { borderRadius };
  }

  setLayer = util.debounce(() => {
    const { borderRadius } = this.state;
    const { estyle } = this.layer;
    transaction(() => {
      if (estyle.borderRadius === undefined) {
        extendObservable(estyle, { borderRadius });
      } else {
        estyle.borderRadius = borderRadius;
      }
      this.props.h5ds.edata.keys = util.randomID();
      window.pubSubEditor.publish('h5ds.setHistory');
    });
    this.isInnerChange = false;
  }, 500);

  componentWillReact() {
    if (this.isInnerChange) {
      return;
    }
    // console.log('外部变化引起的');
    const borderRadius = this.layer.estyle.borderRadius;
    this.setState({ borderRadius });
  }

  @bindSelf
  sliderChange(borderRadius) {
    this.isInnerChange = true;
    this.element.css('border-radius', borderRadius + 'px');
    this.setState({ borderRadius }, this.setLayer);
  }

  componentDidMount() {
    $('.app-scroll-SetBorderRadius').on('mousewheel.h5ds.SetBorderRadius', e => {
      e.preventDefault();
      this.isInnerChange = true;
      let borderRadius = e.originalEvent.deltaY < 0 ? -1 : 1;
      borderRadius = this.state.borderRadius + borderRadius;
      if (borderRadius < 0) {
        borderRadius = 0;
      }
      this.setState({ borderRadius }, this.setLayer);
    });
  }

  componentWillUnmount() {
    $('.app-scroll-SetBorderRadius').off('mousewheel.h5ds.SetBorderRadius');
  }

  render() {
    const { borderRadius } = this.state;
    this.layer.estyle.borderRadius;
    return (
      <SetItem name="设置圆角">
        <SliderGroup
          mouseWheelClassName="app-scroll-SetBorderRadius"
          onChange={this.sliderChange}
          value={borderRadius}
          min={0}
          max={1000}
        />
      </SetItem>
    );
  }
}
export default SetBorderRadius;
