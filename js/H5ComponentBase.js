/* 基本图文组件 */

var H5ComponentBase = function ( name, cfg ) {
    var cfg = cfg || {};

    // 当前组件唯一id
    var id = ('h5_c' + Math.random()).replace('0.', '_');

    // 当前组件添加组件类型及name到样式中，进行标识
    var cls = 'h5_component_' + cfg.type;

    // 创建组件
    var component = $('<div class="h5_component '+cls+' h5_component_name_'+name+'" id="'+id+'"></div>');

    // 设置文本
    cfg.text && component.text(cfg.text);

    // 设置样式
    cfg.css && component.css(cfg.css);

    // 单独设置背景
    cfg.bg && component.css('backgroundImage', 'url('+cfg.bg+')');

    // 设置宽高，设计图是2倍实际宽高，因此要除以2
    cfg.width && component.width( cfg.width / 2 );
    cfg.height && component.height( cfg.height / 2 );

    // 设置水平居中
    if ( cfg.center === true ) {
        component.css({
            marginLeft: ( cfg.width / 4 * -1) + 'px',
            left: '50%'
        })
    }

    // 点击事件
    if ( typeof cfg.onclick === 'function' ) {
        component.on('click', cfg.onclick );
    }

    // 注册onLoad事件
    component.on('onLoad', function () {

        setTimeout(function () {
            component.addClass( cls + '_load').removeClass( cls + '_leave' );
            cfg.animateIn && component.animate( cfg.animateIn );
        }, cfg.delay || 0)

        return false;
    });

    // 注册onLeave事件
    component.on('onLeave', function () {

        setTimeout(function () {
            component.addClass( cls + '_leave').removeClass( cls + '_load' );
            cfg.animateOut && component.animate( cfg.animateOut );
        }, cfg.delay || 0)

        return false;
    });

    // 返回组件
    return component;

};
















