/*柱状图组件 */

var H5ComponentBar = function ( name, cfg ) {
    var component = new H5ComponentBase( name, cfg );

    $.each(cfg.data, function (index, item) {
        var line = $('<div class="line"></div>');
        var name = $('<div class="name"></div>');
        var rate = $('<div class="rate"></div>');
        var per = $('<div class="per"></div>');
        var width = item[1]*100 + '%';
        var bgStyle = '';

        if ( item[2] !== undefined ) {
            bgStyle = 'style="background-color:'+item[2]+'"';
        }

        rate.html('<div class="bg" '+bgStyle+'></div>');
        rate.css('width', width);
        name.text( item[0] );
        per.text( width );
        line.append( name ).append( rate ).append( per );

        component.append( line );
    });

    return component;

};