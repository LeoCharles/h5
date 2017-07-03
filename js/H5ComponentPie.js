/* 饼图组件 */

var H5ComponentPie = function ( name, cfg ) {
    var component = new H5ComponentBase( name, cfg );

    var w = cfg.width;
    var h = cfg.height;

    // 网格线背景
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('zIndex', 1);
    component.append( cns );

    var r = w/2;

    // 绘制底图层
    ctx.beginPath();
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 2;
    ctx.arc(r, r, r, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();

    // 绘制数据层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('zIndex', 2);
    component.append( cns );

    var colors = ['#36c','0ff','#f93','#393','#ff0','#f60','#f0c','#3f9'];
    var sAngle = 1.5*Math.PI;
    var eAngle = 0;
    var aAngle = 2*Math.PI;

    var step = cfg.data.length;
    for (var i = 0; i < step; i++) {
        var item = cfg.data[i];
        var color = item[2] || (item[2] = colors.pop());

        eAngle = sAngle + aAngle*item[1];

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = .1;

        ctx.moveTo(r, r);
        ctx.arc(r, r, r, sAngle, eAngle);
        ctx.fill();
        ctx.stroke();
        sAngle = eAngle;

        // 加入项目文本以及百分比
        var text = $('<div class="text"></div>');
        text.text(cfg.data[i][0]);
        var per = $('<div class="per"></div>');
        per.text(cfg.data[i][1]*100+'%');
        text.append(per);

        var x = r + Math.sin(.5*Math.PI - sAngle) * r;
        var y = r + Math.cos(.5*Math.PI - sAngle) * r;

        if (x > w/2) {
            text.css('left', x/2 + 10);
        } else {
            text.css('right', (w-x)/2 + 10);
        }
        if (y > h/2) {
            text.css('top', y/2 + 10);
        } else {
            text.css('bottom', (h-y)/2 + 10);
        }
        if (cfg.data[i][2]) {
            text.css('color', cfg.data[i][2]);
        }
        text.css('opacity', 0);
        component.append(text);

    }

    // 加入蒙版层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('zIndex', 3);
    component.append( cns );

    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;

    var draw = function ( per ) {
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.moveTo(r,r);
        if (per <= 0) {
            ctx.arc(r, r, r, 0, 2*Math.PI);
            component.find('.text').css('opacity', 0);
        } else {
            ctx.arc(r, r, r, sAngle, sAngle+2*Math.PI*per, true);
        }
        ctx.fill();
        ctx.stroke();

        if (per >= 1) {
            H5ComponentPie.reSort( component.find('.text') );
            component.find('.text').css('opacity', 1);
        }
    }

    // 饼图生长动画
    component.on('onLoad', function () {
        var s = 0;
        for (var i = 0; i < 100; i++) {
            setTimeout(function () {
                s += .01;
                draw( s );
            }, i*10+500)
        }
    })
    // 饼图退场动画
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

// 重排项目文本元素
H5ComponentPie.reSort = function( list ){

  //  1. 检测相交
  var compare = function( domA, domB ){

    //  元素的位置，不用 left，因为有时候 left为 auto
    var offsetA = $(domA).offset();
    var offsetB = $(domB).offset();

    //  domA 的投影
    var shadowA_x = [ offsetA.left,$(domA).width()  + offsetA.left ];
    var shadowA_y = [ offsetA.top ,$(domA).height() + offsetA.top ];

    //  domB 的投影
    var shadowB_x = [ offsetB.left,$(domB).width()  + offsetB.left ];
    var shadowB_y = [ offsetB.top ,$(domB).height() + offsetB.top  ];

    //  检测 x
    var intersect_x = ( shadowA_x[0] > shadowB_x[0] && shadowA_x[0] < shadowB_x[1] ) || ( shadowA_x[1] > shadowB_x[0] &&  shadowA_x[1] < shadowB_x[1]  );

    //  检测 y 轴投影是否相交
    var intersect_y = ( shadowA_y[0] > shadowB_y[0] && shadowA_y[0] < shadowB_y[1] ) || ( shadowA_y[1] > shadowB_y[0] &&  shadowA_y[1] < shadowB_y[1]  );
    return intersect_x && intersect_y;
  }

  //  2. 错开重排
  var reset = function( domA, domB ){

    if( $(domA).css('top') != 'auto' ){

      $(domA).css('top', parseInt($(domA).css('top')) + $(domB).height() );
    }
    if( $(domA).css('bottom') != 'auto' ){

      $(domA).css('bottom', parseInt($(domA).css('bottom')) + $(domB).height() );
    }

  }

  //  定义将要重排的元素
  var willReset = [list[0]];

  $.each(list,function(i,domTarget){
    if( compare(willReset[willReset.length-1] , domTarget ) ){
      willReset.push(domTarget);  //  不会把自身加入到对比
    }
  });

  if(willReset.length >1 ){
      $.each(willReset,function(i,domA){
          if( willReset[i+1] ){
            reset(domA,willReset[i+1]);
          }
      });
      H5ComponentPie.reSort( willReset );
  }

}

