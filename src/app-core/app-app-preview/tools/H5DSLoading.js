/**
 * 页面在加载插件的时候会调用这个方法，全屏设置一个loading模块
 * 依赖 jquery
 * await installPlugins(); 这个方法执行之前
 */
export class H5DSLoading {
  constructor(
    set = {
      id: 'app-APP', // id
      fadeTime: 300, // 隐藏动画时间
      autoHide: false, // 是否自动隐藏
      delayTime: 1000,
      callback: null // 如果开启了autoHide，动画完成后会执行 callback
    }
  ) {
    this.$target = $('#' + set.id);
    this.set = set;
    this.start();
  }

  hide() {
    return new Promise(resolve => {
      // 延迟1s消失
      setTimeout(() => {
        this.$target.find('.app-preview-loading').fadeOut(this.set.fadeTime, () => {
          resolve();
        });
      }, this.set.delayTime);
    });
  }

  /**
   * 显示loading
   */
  start() {
    this.$target.html(`<div class="app-preview-loading">
      <div class="app-preview-loading-inner">
        <img src="//cdn.h5ds.com/static/images/logo_blue.png" alt="" />
        <div class="app-preview-loading-progress">
          <span class="app-preview-loading-bar"></span>
        </div>
        <div class="app-preview-loading-tips">
          h5ds.com 友情提示:已加载<span class="app-preview-loading-span">0%</span>
        </div>
      </div>
      <style>
      .app-preview-loading{
        background: #fff;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        text-align: center;
      }
      .app-preview-loading-inner{
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }
      .app-preview-loading-inner img{
        width: 190px;
      }
      .app-preview-loading-progress{
        width: 70%;
        margin: 15px 15%;
        background: #dadada;
        height: 4px;
        border-radius: 100px;
        overflow: hidden;
      }
      .app-preview-loading-bar{
        float: left;
        background: #272894;
        height: 100%;
        transition: 0.3s;
      }
      .app-preview-loading-tips{
        color: #999;
        font-size: 12px;
      }
      </style>
    </div>`);

    const $bar = $('.app-preview-loading-bar');
    const $span = $('.app-preview-loading-span');
    if (window.pubSubLayer) {
      window.pubSubLayer.subscribe('h5ds.load.plugins', async data => {
        const { count, index, progress } = data;
        const percent = parseInt(progress * 100 * 0.7, 10);
        if (count === 0 || (count !== 0 && count === index + 1)) {
          $bar.css('width', '100%');
          $span.html('100%');
          this.set.autoHide && (await this.hide());
          this.set.callback && this.set.callback();
        } else {
          $bar.css('width', percent + '%');
          $span.html(percent + '%');
        }
      });

      // 资源占比30%
      window.pubSubLayer.subscribe('h5ds.load.scripts', async data => {
        const { count, index, progress } = data;
        const percent = parseInt(progress * 100 * 0.3 + 70, 10);
        if (count === 0 || (count !== 0 && count === index + 1)) {
          $bar.css('width', '100%');
          $span.html('100%');
          this.set.autoHide && (await this.hide());
          this.set.callback && this.set.callback();
        } else {
          $bar.css('width', percent + '%');
          $span.html(percent + '%');
        }
      });
    }
  }
}
