var app = app || {};
$(function() {
	
	app.ServerJobView = Backbone.View.extend({
		el:'#progressbar_dialog',
		render:function() {
		    this.$el.dialog({
		        height: 200,
		        title:"Applying ...",
		        width:500,
		        autoOpen:true,
		        modal:true,
		        close:function(){
		        	$('#progressbar').show();
		        	$("#protocol_error_msg").hide();
		        }
		    });
		    
		    $( "#progressbar" ).progressbar({
		        value: false,
		        width:"100%"
		    });
		    
		    $("#progressbar .ui-progressbar-value").css({display:'inline'});
		    var p = 1;
	        var timer = setInterval(function(){
	            $("#progressbar .ui-progressbar-value").animate({width: p+"%"}, 500);
	            p = p +3;
	            if(p>100){
	                $("#progressbar .ui-progressbar-value").animate({width: "0%"}, 500);
	                p=0;
	            }
	        },500);

			$.post('/apply?protocol='+$('#code').text(),function(data) {
                clearInterval(timer);
			}).fail(function() {
				$('#progressbar').hide();
				$('#protocol_error_msg').fadeIn();
			}).always(function() { 
				clearInterval(timer); 
			});
		}
	
	});
});