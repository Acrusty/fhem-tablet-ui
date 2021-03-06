var Modul_image = function () {

    function update_classes(state, elem) {
        //set colors according matches for values
        var states = elem.data('states');
        var classes = elem.data('classes');
        if(states && classes) {
            var idx = indexOfGeneric(states,state);
            var elemImg = elem.find('img');
            if (idx > -1) {
                for(var i=0,len=classes.length; i<len; i++) {
                    elemImg.removeClass( classes[i] );
                }
                elemImg.addClass( classes[idx] );
            }
        }
    };

    function init_attr (elem) {
        elem.initData('state-get', '');
        elem.initData('opacity' ,  0.8);
        elem.initData('height'  ,  'auto');
        elem.initData('width'   ,  '100%');
        elem.initData('size'    ,  '100%');
        elem.initData('part'    , -1);
        elem.initData('url'     ,  '');
        elem.initData('get'     , (elem.data('url') === '') ? 'STATE' : '');
        elem.initData('path'    ,  '');
        elem.initData('suffix'  ,  '');
        elem.initData('refresh' ,  15*60);
        
        this.addReading(elem,'get');
        this.addReading(elem,'state-get');
    };

    function init() {
        var me = this;
        me.elements = $('div[data-type="'+me.widgetname+'"]',me.area);
        me.elements.each(function(index) {
            var elem = $(this);
            me.init_attr(elem);
            var elemImg =  jQuery('<img/>', {
                alt: 'img',
            }).appendTo(elem);
            elemImg.css({
                'opacity':          elem.data('opacity'),
                'height':           elem.data('height'),
                'width':            elem.data('width'),
                'max-width':        elem.data('size'),
            });
    
            //3rd party source refresh
            if (elem.data('url')){
                var url = elem.data('url');
                if( elem.data('nocache') || elem.hasClass('nocache') ) {
                    url = addurlparam(url, '_', new Date().getTime());
                }
                elemImg.attr('src', url );
                
                var counter=0;
                var refresh=elem.data('refresh');
                setInterval(function() {
                    counter++;
                    if(counter >= refresh) {
                        counter = 0;
                        if(url.match(/_=\d+/)) {
                            url = addurlparam(url, '_', new Date().getTime());
                        }
                        elemImg.attr('src', url);
                    }
                }, 1000);
            }
            // onClick events
            elem.on('click',function(e) {
                var cmd = elem.data('fhem-cmd');
                if (cmd)
                    ftui.setFhemStatus(cmd);
            });
        });
    };

    function update (dev,par) {
        var me = this;
        me.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);
            var value = elem.getReading('get').val;
            if (value) {
                    var src = [elem.data('path'), value, elem.data('suffix')].join('');
                    elem.find('img').attr('src', src );
            }
        });

        //extra reading for extra classes
        me.elements.filterDeviceReading('state-get',dev,par)
        .each(function(idx) {
            var elem = $(this);
            var state = elem.getReading('state-get').val;
            if(state) {
                var part = elem.data('part');
                var val = ftui.getPart(state,part);
                update_classes(val, elem);
            }
        });
    };

    function addurlparam (uri, key, value) {
        // http://stackoverflow.com/a/6021027
        var hash = uri.replace(/^.*#/, '#');
        if(hash!=uri) {
            uri = uri.replace(hash, '');
        } else {
            hash = '';
        }
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";

        if (uri.match(re)) {
            uri = uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            uri = uri + separator + key + "=" + value;
        }
        uri += hash;
        ftui.log(1,'widget_image url='+uri);
        return uri;
    };

    // public
    // inherit all public members from base class
    return $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'image',
        init: init,
        init_attr: init_attr,
        update: update,
    });
   };
