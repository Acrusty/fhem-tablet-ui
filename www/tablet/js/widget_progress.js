
function depends_progress (){
    if(typeof Module_famultibutton == 'undefined' || !$.fn.famultibutton) {
        return ["famultibutton"];
    }
};

var Modul_progress = function () {

    function init_attr (elem) {
        elem.initData('device'              , ' ');
        elem.initData('get'                 ,'STATE');
        elem.initData('off-color'           , getStyle('.'+this.widgetname+'.off','color')              || '#505050');
        elem.initData('off-background-color', getStyle('.'+this.widgetname+'.off','background-color')   || '#404040');
        elem.initData('on-color'            , getClassColor(elem) || getStyle('.'+this.widgetname+'.on','color')               || '#aa6900');
        elem.initData('on-background-color' , getClassColor(elem) || getStyle('.'+this.widgetname+'.on','background-color')    || '#aa6900');
        elem.initData('background-icon'     , 'fa-circle-thin');
        elem.initData('icon'                , '');
        elem.initData('set-on'              , '');
        elem.initData('set-off'             , '');
        elem.initData('min'                 , '0');
        elem.initData('max'                 , '100');
        elem.initData('progress-width'      , '15');
        elem.initData('unit'                , '' );
        elem.initData('part'                , '-1' );
        elem.data('mode', 'symbol');

        this.addReading(elem,'get');
        if (!$.isNumeric(elem.data('max')))
            this.addReading(elem,'max');
        if (!$.isNumeric(elem.data('min')))
            this.addReading(elem,'min');
        if (!elem.hasClass('novalue')){
            jQuery('<i/>', {
                 id: 'value',
                 class: 'fa fa-stack-1x value '+this.widgetname,
            }).appendTo(elem);
        }
    };

    function update(dev,par) {
        // update from normal state reading
        this.elements.filterDeviceReading('get',dev,par)
        .add( this.elements.filterDeviceReading('min',dev,par) )
        .add( this.elements.filterDeviceReading('max',dev,par) )
        .each(function(index) {
            var elem = $(this);
            var state = elem.getReading('get').val;
            if (state) {
                var part = elem.data('part');
                var val = ftui.getPart(state, part);
                var min = ( $.isNumeric(elem.data('min')) ) ? elem.data('min') : elem.getReading('min').val;
                var max = ( $.isNumeric(elem.data('max')) ) ? elem.data('max') : elem.getReading('max').val;
                var faelem = elem.data('famultibutton');
                faelem.setProgressValue((val-min)/(max-min));
                var $value = faelem.find('#value');
                var unit = elem.data('unit');
                if ($value){
                 if (elem.hasClass('percent')){
                     if (max>0 && val)
                        $value.html(Number((val-min)/(max-min)*100).toFixed(0) + "<span class='label-unit'>"+unescape(unit)+"</span>");
                 }
                 else
                    $value.html(val + "<span class='progress-unit'>"+unescape(unit)+"</span>");
                }
         }
     });
    };

    // public
    // inherit members from base class
    return $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'progress',
        init_attr:init_attr,
        update:update,
    });
};
