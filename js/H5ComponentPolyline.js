/* 折线图组件 */

var H5ComponentPolyline = function ( name, cfg ) {
    var component = new H5ComponentBase( name, cfg );

    // 绘制网格线
    var w = cfg.width;
    var h = cfg.height;

    // 添加画布(背景)
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    // 水平网格线
    var step = 10;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#aaa';

    window.ctx = ctx;

    for (var i = 0; i < step+1; i++) {
        var y = ( h / step ) * i;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
    }

    // 垂直网格线
    step = cfg.data.length+1;
    var text_w = w / step >> 0;
    for (var i = 0; i < step+1; i++) {
        var x = ( w / step ) * i;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);

        if ( cfg.data[i] ) {
            var text = $('<div class="text"></div>');
            text.text( cfg.data[i][0] );
            text.css('width', text_w/2).css('left', x/2+text_w/4);
            component.append( text );
        }

    }

    ctx.closePath();
    ctx.stroke();

    // 添加画布(数据层)
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    /**
     * 绘制折线、阴影和数据
     * @param  {floor} per  0到1之间的数据，折线生长的比例
     * @return {DOM}  Component
     */
    var draw = function ( per ) {
        // 清空画布
        ctx.clearRect(0, 0, w, h);
        // 折线数据
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ff8878';

        var x = 0;
        var y = 0;
        var row_w = ( w / (cfg.data.length + 1 ) );

        // 画点
        for (var i = 0; i < cfg.data.length; i++) {
            var item = cfg.data[i];
            x = ( i + 1 )*row_w;
            y = h - item[1]*h*per;
            ctx.moveTo(x, y);
            ctx.arc(x, y, 5, 0, 2*Math.PI);
        }

        // 连线
        ctx.moveTo( row_w, h - cfg.data[0][1]*h*per);
        for (var i = 0; i < cfg.data.length; i++) {
            var item = cfg.data[i];
            x = ( i + 1 )*row_w;
            y = h - item[1]*h*per;
            ctx.lineTo(x, y);
        }

        // 标注数据
        for (var i = 0; i < cfg.data.length; i++) {
            var item = cfg.data[i];
            x = ( i + 1 )*row_w;
            y = h - item[1]*h*per;
            ctx.fillStyle = item[2] ? item[2] : '#595959';
            ctx.fillText( (item[1]*100 >> 0)+'%', x-10, y-10 );
        }
        ctx.stroke();

        // 绘制阴影
        ctx.strokeStyle = 'rgba(255, 255, 255, 0)';
        ctx.lineTo(x, h);
        ctx.lineTo(row_w, h);
        ctx.fillStyle = 'rgba(255, 136, 120, 0.3)';
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    };

    // 折线图生长动画
    component.on('onLoad', function () {
        var s = 0;
        for (var i = 0; i < 100; i++) {
            setTimeout(function () {
                s += .01;
                draw( s );
            }, i*10+500)
        }
    })
    // 折线图退场动画
    component.on('onLeave', function () {
        var s = 1;
        for (var i = 0; i < 100; i++) {
            setTimeout(function () {
                s -= .01;
                draw( s );
            }, i*10)
        }
    })

    return component;

};