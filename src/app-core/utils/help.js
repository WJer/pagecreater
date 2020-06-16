/**
 * @desc 帮助提示jquery插件
 * data 传入一个 数组 [ {dom: '#id1', content: '内容...'} ]
 */
$.helps = function(setting) {
  let defaults = {
    data: [] // 提示列队
  };
  let set = $.extend(defaults, setting);

  // 如果没有，就初始化一个
  if (!$('.app-helps')[0]) {
    $('body').append(`
      <div class="app-helps">
          <div class="app-helps-content">
              <a class="app-helps-close"><i class="app-ico app-ico-close"></i></a>
              <div class="app-helps-info"></div>
              <div class="app-helps-btns">
                  <a class="app-helps-prev">上一步</a>
                  <a class="app-helps-next">下一步</a>
                  <a class="app-helps-end">完成</a>
              </div>
          </div>
      </div>
      `);
  }

  let $help = $('.app-helps');
  let $content = $help.find('.app-helps-content');

  // 显示DOM
  let showDom = function(index) {
    if (index === 0) {
      $('.app-helps-prev').hide();
      $('.app-helps-next').show();
      $('.app-helps-end').hide();
    } else if (index === set.data.length - 1) {
      $('.app-helps-next').hide();
      $('.app-helps-end').show();
      $('.app-helps-prev').show();
    } else {
      $('.app-helps-end').hide();
      $('.app-helps-next').show();
      $('.app-helps-prev').show();
    }
    let obj = set.data[index];
    let $target = $(obj.dom);
    let size = {
      transfrom: $target.css('transfrom'),
      width: $target.outerWidth(),
      height: $target.outerHeight(),
      left: $target.offset().left,
      top: $target.offset().top
    };
    console.log('size ->', size);
    $help.css(size);
    $content.removeClass().addClass('app-helps-content app-helps-' + obj.pos);
    $help.find('.app-helps-info').html(obj ? obj.content : '');
  };

  // 默认显示第一个
  let activeIndex = 0;
  showDom(activeIndex);
  if (set.data.length === 1) {
    $('.app-helps-next').hide();
    $('.app-helps-end').show();
  }

  // 事件绑定
  $help.on('click', '.app-helps-next', function() {
    activeIndex++;
    if (activeIndex < set.data.length) {
      showDom(activeIndex);
    }
  });

  $help.on('click', '.app-helps-prev', function() {
    activeIndex--;
    if (activeIndex >= 0) {
      showDom(activeIndex);
    }
  });

  $help.on('click', '.app-helps-close, .app-helps-end', function() {
    $help.off('click');
    $help.remove();
  });
};
