/* FTUI Plugin
* Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*/

var Modul_medialist = function () {

    $('head').append('<link rel="stylesheet" href="'+ ftui.config.dir + '/../css/ftui_medialist.css" type="text/css" />');

    function changedCurrent(elem, pos) {
        elem.find('.media').each(function(index) {
           $(this).removeClass('current')
        });
        var currentElem = elem.find('.media').eq(pos);
        if ( currentElem.length > 0 ){
            currentElem.addClass("current");
            if ( elem.hasClass("autoscroll")) {
                elem.scrollTop(currentElem.offset().top - elem.offset().top + elem.scrollTop());
            }
        }
    };

    function init_attr (elem) {
        elem.initData('get'                     ,'STATE');
        elem.initData('set'                     ,'play');
        elem.initData('pos'                     ,'Pos');
        elem.initData('cmd'                     ,'set');
        elem.initData('color'                   ,getClassColor(elem) || getStyle('.'+this.widgetname,'color') || '#222');
        elem.initData('background-color'        ,getStyle('.'+this.widgetname,'background-color')    || 'transparent');
        elem.initData('text-color'              ,getStyle('.'+this.widgetname,'text-color')    || '#ddd');
        elem.initData('width'                   ,'90%');
        elem.initData('height'                  ,'80%');

        this.addReading(elem,'get');
        this.addReading(elem,'pos');
    };

    function init_ui (elem) {

        // prepare container element
        elem.html('')
            .addClass('media-list')
            .css({
                width: elem.data('width'),
                maxWidth: elem.data('width'),
                height: elem.data('height'),
                color: elem.mappedColor('text-color'),
                backgroundColor: elem.mappedColor('background-color'),
        });

        elem.on('click','.media', function(index) {
            elem.data('value', $(this).index());
            elem.transmitCommand();
        });
    };

    function update(dev,par) {

        me = this;
        // update medialist reading
        this.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);
            var list = elem.getReading('get').val;
            var pos = elem.getReading('pos').val;
            if (list) {
                elem.html('');
                var text = '';
                try {
                var collection = JSON.parse(list);
                } catch (e) {
                    ftui.log(1,'widget-' + me.widgetname + ': error:' + e);
                    ftui.log(1,list);
                    ftui.toast('<b>widget-' + me.widgetname + '</b><br>' + e,'error');
                }

                for (var idx in collection) {
                    var media = collection[idx];
                    text+='<div class="media">';
                    text+='<div class="media-image">';
                    text+='<img class="cover" src="' + media.Cover + '"/>';
                    text+='</div>';
                    text+='<div class="media-text">';
                    text+='<div class="title" data-track="' + media.Track + '">'
                            + media.Title + '</div>';
                    text+='<div class="artist">' + media.Artist + '</div>';
                    text+='<div class="duration">' + durationFromSeconds(media.Time) + '</div>';
                    text+='</div></div>';
                }
                elem.append(text).fadeIn();
            }
            if(pos) {
                changedCurrent(elem,pos);
            }
         });

        //extra reading for current position
        me.elements.filterDeviceReading('pos',dev,par)
        .each(function(idx) {
            var elem = $(this);
            var pos = elem.getReading('pos').val;
            if(pos) {
                changedCurrent(elem,pos);
            }
        });
    };

    // public
    // inherit members from base class
    var me = this;
    return $.extend(new Modul_widget(), {
        //override members
        widgetname: 'medialist',
        init_attr:init_attr,
        init_ui:init_ui,
        update:update,
    });
};
