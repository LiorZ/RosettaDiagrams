(function( $ ){

	  $.fn.make_menu = function(options) {
		  var start_loc = options.start_loc;
		  var start_method = options.start_method;
		  var end_loc = options.end_loc;
		  var end_method = options.end_method;
		  var timer_in = undefined;
		  var time_out = undefined;
			$(this).mouseenter(function(e) {
				var elem = this;
				time_out = setTimeout(function() {$(elem).animate(start_loc, start_method ); }, 200);
				if ( timer_in )
					clearTimeout(timer_in);
			});
			var context = this;
			$(this).mouseleave(function(e) {
				if (time_out){
					clearTimeout(time_out);
					time_out = undefined;
				}
				
				timer_in = setTimeout(function() {
					$(context).animate(end_loc, end_method); timer_in = undefined; 
				}, 800);
			});
	  };
	})( jQuery );
	

(function() {
	$(document).ready(function() {
		var menu_container_start_left = $("#menu_container").css('left');
		var mover_properties_start_bottom = $("#mover_properties_container").css('bottom');
		var display_code_container_start_right = $("#display_code_container").css('right');
		
		$("#menu_container").make_menu({
			start_loc: {left  : 0}, 
			start_method: {duration: 1000, method: 'easeInSine'},
			end_loc: {left:menu_container_start_left},
			end_method:{duration: 1000, method: 'easeOutSine'}
		});
		
		$("#mover_properties_container").make_menu({
			start_loc: { bottom  : 5}, 
			start_method: {duration: 1000, method: 'easeInSine'},
			end_loc: {bottom: mover_properties_start_bottom},
			end_method:{duration: 1000, method: 'easeOutSine'}
		});
		
		$("#display_code_container").make_menu({
			start_loc: { right  : 0}, 
			start_method: {duration: 1000, method: 'easeInSine'},
			end_loc: {right: display_code_container_start_right},
			end_method:{duration: 1000, method: 'easeOutSine'}
		});
		
	});
	
}());