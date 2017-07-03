/* 环图组件 */

var H5ComponentRing = function ( name, cfg ) {
    cfg.type = 'pie';

    if(cfg.data.length > 1) {
      cfg.data = [cfg.data[0]];
    }

    var component =  new H5ComponentPie( name ,cfg );

    component.addClass('h5_component_ring');

    var mask = $('<div class="mask"></div>');

    component.append(mask);

    var text = component.find('.text');

    text.attr('style','');
    if(cfg.data[0][2]){
      text.css('color',cfg.data[0][2]);
    }

    mask.append( text );


    return component;

};