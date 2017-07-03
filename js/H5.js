/* H5内容管理对象 */

var H5 = function () {
    this.id = ('h5' + Math.random()).replace('0.', '_');
    this.el = $('<div class="h5" id="'+this.id+'"></div>');
    this.page = [];
    $('body').append( this.el );

    /**
     * 添加页面
     * @param {string} name 页面的名称，会添加到className中
     * @param {string} text 页面内的文本
     * @return {H5} H5对象 支持链式操作
     */
    this.addPage = function ( name, text ) {
        var page = $('<div class="h5_page section"></div>')

        if ( name !== undefined ) {
            page.addClass('h5_page_' + name );
        }

        if ( text !== undefined ) {
            page.text( text );
        }

        this.el.append( page );
        this.page.push( page );

        if( typeof this.whenAddPage === 'function' ){
                    this.whenAddPage();
        }

        return this;
    };

    /* 添加组件*/
    this.addComponent = function ( name, cfg ) {
        var cfg = cfg || {};

        cfg = $.extend({
            type: 'base'
        }, cfg);

        var component;
        var page = this.page.slice(-1)[0];

        switch( cfg.type ) {
            case 'base':
                component = new H5ComponentBase( name, cfg );
                break;
            case 'polyline':
                component = new H5ComponentPolyline( name, cfg );
                break;

            case 'point':
                component = new H5ComponentPoint( name, cfg );
                break;
            case 'bar':
                component = new H5ComponentBar( name, cfg );
                break;
            case 'bar_v':
                component = new H5ComponentBar_v( name, cfg );
                break;
            case 'pie':
                component = new H5ComponentPie( name, cfg );
                break;
            case 'radar':
                component = new H5ComponentRadar( name, cfg );
                break;
            case 'ring':
                component = new H5ComponentRing( name, cfg );
                break;
            default:
        }

        page.append( component );

        return this;
    };


    /* H5对象初始化 */
    this.loader = function ( firstPage ) {
        this.el.fullpage({
            onLeave: function (index, nextIndex, direction) {
                $(this).find('.h5_component').trigger('onLeave');
            },
            afterLoad: function (anchorLink, index) {
                $(this).find('.h5_component').trigger('onLoad');
            }
        });
        this.page[0].find('.h5_component').trigger('onLoad');
        this.el.show();
        if ( firstPage ) {
            $.fn.fullpage.moveTo( firstPage );
        }
    };

    this.loader = typeof H5_loading == 'function' ? H5_loading : this.loader;

    return this;

};





