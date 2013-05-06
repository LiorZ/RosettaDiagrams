var app = app || {};
$(function() {
	
	app.ServerJobView = Backbone.View.extend({
		el:'#progressbar_dialog',
		render:function() {
		    var timer=0;

		    this.$el.dialog({
		        height: 200,
		        title:"Applying ...",
		        width:500,
		        autoOpen:true,
		        modal:true,
		        close:function(){
		        	clearInterval(timer);
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
	        timer = setInterval(function(){
	            $("#progressbar .ui-progressbar-value").animate({width: p+"%"}, 500);
	            p = p +3;
	            if(p>100){
	                $("#progressbar .ui-progressbar-value").animate({width: "0%"}, 500);
	                p=0;
	            }
	        },500);

	        var protocol_text = this.get_protocol_xml();
	        console.log(protocol_text);
			$.post('/apply?protocol='+protocol_text,function(data) {
				
			}).fail(function() {
				$('#progressbar').hide();
				$('#protocol_error_msg').fadeIn();
			}).always(function() { 
				clearInterval(timer); 
			});
		},
		get_protocol_xml:function() {
			var model = this.model;
			if ( model ){
				var declaration_str = model.get_declaration_string();
				var protocol_str = model.get_protocols_string();
				var code_clone = $('#code').clone();
				code_clone.find('span').html('');
				code_clone.find('#xml_task_operations').html($('#code').find('#xml_task_operations').html()); //add all task operations to the xml
				var typeObj = model.get('typeObj');
				code_clone.find(typeObj.codeTemplate).append(declaration_str);
				code_clone.find('#xml_protocols').append(protocol_str)
				var script = code_clone.text();
				return script;
			}else{
				var script = $("#code").text();
				return script;
			}
		}
	
	});
});