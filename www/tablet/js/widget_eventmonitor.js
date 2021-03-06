
var Modul_eventmonitor  = function () {

       function init_attr (elem) {
           elem.initData('height', '450px');
           elem.initData('width',  '750px');
           elem.initData('device-filter',  '.*');
           elem.initData('reading-filter', '.*');
           elem.initData('max-items',      100);
       };

       function init_ui(elem) {

           var content=elem.html();
           elem.html('');
           var starter = jQuery('<div/>', {
                 class: 'eventmonitor-starter'
               }).html(content)
                 .appendTo(elem);
           var dialog = jQuery('<div/>', {
                 class: 'dialog'
               }).appendTo(elem);
           var header = jQuery('<header>EVENTMONITOR</header>', {
               }).appendTo(dialog);
           var events = jQuery('<div/>', {
                 class: 'events'
               }).appendTo(dialog);
           var close = jQuery('<div/>', {
                 class: 'dialog-close'
               }).html('x').appendTo(dialog);

            events.append("<div class='event'>"
                   +(ftui.doLongPoll)?"longpoll is on":"longpoll is off"
                   +"</div>");
            dialog.css({'height':elem.data('height'),'width':elem.data('width')});
            elem.css({'cursor': 'pointer'});
            elem.closest('.gridster>ul>li').css({overflow: 'visible'});
            $(window).resize(function() {
              dialog.css({
                top: ($(window).height() / 2 - dialog.outerHeight() / 2),
                left: ($(window).width() / 2 - dialog.outerWidth() / 2)
              });
             });
                //prepare events
                close.on('click',function(e) {
                    dialog.fadeOut(500, function() {
                    showModal(false);
                    });
                });
                $(document).on('shadeClicked', function() {
                    dialog.fadeOut(500, function() {
                      showModal(false);
                    });
                });
                starter.on('click',function(e) {
                    e.preventDefault();
                    showModal(true);
                    dialog.fadeIn(500);
                });
       $(window).resize();
    };

    function update (dev,par) {
        this.elements.each(function(index) {
            if ( dev.match(new RegExp('^' + $(this).data('device-filter') + '$'))
                    && par.match(new RegExp('^' + $(this).data('reading-filter') + '$'))) {
                var now = new Date();
                var events=$(this).find('.events');
                var max=$(this).data('max-items');
                if ( events.children().length>max )
                    events.find('.event:first').remove();
                events.last().append("<div class='event'>"
                        +[now.toLocaleDateString(),now.toLocaleTimeString(),dev,par,ftui.getDeviceParameter(dev,par).val].join(' ')
                        +"</div>")
                .scrollTop(events.last()[0].scrollHeight);
            }
            });
    };

    // public
    // inherit members from base class
    return $.extend(new Modul_widget(), {
        //override members
        widgetname: 'eventmonitor',
        init_attr:init_attr,
        init_ui:init_ui,
        update:update,
    });
};
