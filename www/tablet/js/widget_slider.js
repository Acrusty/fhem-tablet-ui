var widget_slider = {
  _slider: null,
  elements: null,
  init: function () {
  	_slider=this;
  	_slider.elements = $('div[data-type="slider"]');
 	_slider.elements.each(function(index) {

		var device = $(this).data('device');
		$(this).data('get', $(this).data('get') || 'STATE');
		$(this).data('set', $(this).data('set') || '');
		$(this).data('cmd', $(this).data('cmd') || 'set');
		readings[$(this).data('get')] = true;
		//ToDo: more data parameter: color etc. 
		
		var storeval = localStorage.getItem("slider_"+device);
		var elem =  jQuery('<input/>', {
			type: 'text',
		}).appendTo($(this));

		var pwrng = new Powerange(elem[0], { 
			vertical: true,
			hideRange: true,
			'min': $(this).data('min') || 0,
			'max': $(this).data('max') || 100,
			klass: 'slider_vertical',
			start: (storeval)?storeval:'5',
		});
		$(this).data('Powerange',pwrng);

		var releaseEventType=((document.ontouchend!==null)?'mouseup':'touchend');

		$(this).bind(releaseEventType, function(e) {
			var v = $(this).find('input').val();
			var cmdl = $(this).data('cmd')+' '+device+' '+$(this).data('set')+' '+v;
			setFhemStatus(cmdl);
			$.toast(cmdl);
			e.preventDefault();
		});
		
		//ToDo: make fit for horizontal
		$(this).addClass('slider_vertical');

	 });
  },
  update: function (dev,par) {

    var deviceElements= _slider.elements.filter('div[data-device="'+dev+'"]');
	deviceElements.each(function(index) {

        if ( $(this).data('get')==par){

			var state = getDeviceValue( $(this), 'get' );
			if (state) {
				var elem = $(this).find('input');
				if ($.isNumeric(state) && elem) {
					var pwrng = $(this).data('Powerange');
					pwrng.setStart(parseInt(state));
					DEBUG && console.log( 'slider dev:'+dev+' par:'+par+' changed to:'+state );
				}
				elem.css({visibility:'visible'});
			}
		}
	});
   }
			 
};
