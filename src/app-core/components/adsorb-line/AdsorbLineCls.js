/**
 * @desc 吸附线，配合 canvas/AdsorbLine.jsx 使用
 */
export class AdsorbLineCls {
  constructor(options = {}, $lines, $outbox) {
    this.set = Object.assign(
      {
        gap: 5 // 默认吸附距离
      },
      options
    );
    this.$lines = $lines || $('.app-adsorb-line');
    this.$outbox = $outbox || $('#h5dsCanvasApp');
    this.lines = {
      xt: this.$lines.eq(0),
      xc: this.$lines.eq(1),
      xb: this.$lines.eq(2),
      yl: this.$lines.eq(3),
      yc: this.$lines.eq(4),
      yr: this.$lines.eq(5)
    };
    this.scale = parseFloat($('.app-canvas-box').transform('scale')) || 1;
    this.canvasRect = this.$outbox[0].getBoundingClientRect();
    // console.log('this.canvasRect', this.canvasRect);
  }

  /**
   * @desc 因为涉及到旋转图形，这个方法用于矫正图形
   * @param checkNodes layer 图层 $dom
   */
  correct(checkNodes) {
    let arr = [];
    checkNodes.each((i, item) => {
      let rotate = $(item).transform('rotate');
      let $itemInner = $(item).find('.app-adsorb-layer-item');
      if (rotate && !$itemInner[0]) {
        let { top, left, right, bottom, width, height } = item.getBoundingClientRect();
        $(item).append(`<div class="app-adsorb-layer-item" style="
        left: ${-(right - left - item.offsetWidth) / 2}px;
        top: ${-(bottom - top - item.offsetHeight) / 2}px;
        width: ${width}px;
        height: ${height}px;
        transform: rotate(-${rotate}deg) scale(${1 / this.scale});
        "></div>`);
        arr.push($(item).find('.app-adsorb-layer-item')[0]);
      } else if ($itemInner[0]) {
        arr.push($itemInner[0]);
      } else {
        $(item).append(`<div class="app-default-layer-item" style="
        width: ${item.offsetWidth}px;
        height: ${item.offsetHeight}px;"></div>`);
        arr.push(item);
      }
    });
    return arr;
  }

  clear() {
    $('.app-adsorb-layer-item').remove();
    $('.app-default-layer-item').remove();
  }

  /**
   * @param dragNode {Element} 拖拽元素的$node
   * @param checkNodes {String|Element} 选择器 或者 $node集合
   */
  check(dragNode, checkNodes) {

    let dragRect = dragNode[0].getBoundingClientRect();
    // 计算canvas的缩放偏移量
    // let cavOffsetLeft = (this.$outbox.width() * (this.scale - 1)) / 2;
    // let cavOffsetTop = (this.$outbox.height() * (this.scale - 1)) / 2;
    // console.log('cavOffsetTop', cavOffsetTop, cavOffsetLeft);
    this.uncheck();
    checkNodes.forEach(item => {
      item.classList.remove('app-adsorb-line-active');
      let canvasRect = this.canvasRect;
      if (item === dragNode[0]) return;
      let itemInner = dragNode.find('.app-adsorb-layer-item');
      if (itemInner[0] && item === itemInner[0]) {
        return;
      }
      let { top, height, bottom, left, width, right } = item.getBoundingClientRect();
      let dragWidthHalf = dragRect.width / 2;
      let itemWidthHalf = width / 2;
      let dragHeightHalf = dragRect.height / 2;
      let itemHeightHalf = height / 2;
      let conditions = {
        top: [
          // xt-top
          {
            type: 'xt-top',
            isNearly: this._isNearly(dragRect.top, top),
            lineNode: this.lines.xt,
            lineValue: top,
            dragValue: top - canvasRect.top
          },
          // xt-bottom
          {
            type: 'xt-bottom',
            isNearly: this._isNearly(dragRect.bottom, top),
            lineNode: this.lines.xt,
            lineValue: top,
            dragValue: top - dragRect.height - canvasRect.top
          },
          // xc
          {
            type: 'xc',
            isNearly: this._isNearly(dragRect.top + dragHeightHalf, top + itemHeightHalf),
            lineNode: this.lines.xc,
            lineValue: top + itemHeightHalf,
            dragValue: top + itemHeightHalf - dragHeightHalf - canvasRect.top
          },
          // xb-top
          {
            type: 'xb-top',
            isNearly: this._isNearly(dragRect.bottom, bottom),
            lineNode: this.lines.xb,
            lineValue: bottom,
            dragValue: bottom - dragRect.height - (canvasRect.bottom - canvasRect.height)
          },
          // xb-bottom
          {
            type: 'xb-bottom',
            isNearly: this._isNearly(dragRect.top, bottom),
            lineNode: this.lines.xb,
            lineValue: bottom,
            dragValue: bottom - canvasRect.top
          }
        ],

        left: [
          // yl-left
          {
            type: 'yl-left',
            isNearly: this._isNearly(dragRect.left, left),
            lineNode: this.lines.yl,
            lineValue: left,
            dragValue: left - canvasRect.left
          },
          // yl-right
          {
            type: 'yl-right',
            isNearly: this._isNearly(dragRect.right, left),
            lineNode: this.lines.yl,
            lineValue: left,
            dragValue: left - dragRect.width - canvasRect.left
          },
          // yc
          {
            type: 'yc',
            isNearly: this._isNearly(dragRect.left + dragWidthHalf, left + itemWidthHalf),
            lineNode: this.lines.yc,
            lineValue: left + itemWidthHalf,
            dragValue: left + itemWidthHalf - dragWidthHalf - canvasRect.left
          },
          // yr-left
          {
            type: 'yr-left',
            isNearly: this._isNearly(dragRect.right, right),
            lineNode: this.lines.yr,
            lineValue: right,
            dragValue: right - dragRect.width - (canvasRect.right - canvasRect.width)
          },
          // yr-right
          {
            type: 'yr-right',
            isNearly: this._isNearly(dragRect.left, right),
            lineNode: this.lines.yr,
            lineValue: right,
            dragValue: right - (canvasRect.right - canvasRect.width)
          }
        ]
      };

      for (let key in conditions) {
        // 遍历符合的条件并处理
        conditions[key].forEach(condition => {
          if (!condition.isNearly) return;
          item.classList.add('app-adsorb-line-active');
          if (dragNode.find('.app-adsorb-layer-item')[0]) {
            let val = 0;
            if (key === 'left') {
              val = (dragNode.find('.app-adsorb-layer-item').width() - dragNode.width() * this.scale) / 2;
            } else {
              val = (dragNode.find('.app-adsorb-layer-item').height() - dragNode.height() * this.scale) / 2;
            }
            dragNode.css(key, `${(condition.dragValue + val) / this.scale}px`);
          } else {
            dragNode.css(key, `${condition.dragValue / this.scale}px`);
          }
          condition.lineNode.css(key, `${condition.lineValue}px`);
          condition.lineNode.show();
        });
      }
    });
  }

  uncheck() {
    this.$lines.hide();
    $('.app-adsorb-line-active').removeClass('app-adsorb-line-active');
  }

  _isNearly(dragValue, targetValue) {
    return Math.abs(dragValue - targetValue) <= this.set.gap;
  }
}
