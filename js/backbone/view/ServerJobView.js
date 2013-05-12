var app = app || {};
$(function() {
	
	app.ServerJobView = Backbone.View.extend({
		el:'#progressbar_dialog',
		timer:0,
		model:false,
		events: {
			'click #btn_send_job':'send_job'
		},
		initialize:function() {
			$('#pdb_form').ajaxForm({
			    target: '#results_div'
			});
		},
		send_job:function(e){
			$('#pre_job_dialog').hide();
			e.preventDefault();
			this.render_progress_bar();
		},
		render:function(model) {
			this.model = model;
		    this.$el.dialog({
		        height: 250,
		        title:"Applying ...",
		        width:500,
		        autoOpen:true,
		        modal:true,
		        close:function(){
		        	clearInterval(this.timer);
		        	$('#progressbar').hide();
		        	$('#pre_job_dialog').show();
		        	$("#protocol_error_msg").hide();
		        }
		    });
		},
		render_progress_bar:function() {
			$('#progressbar').show();
		    $( "#progressbar" ).progressbar({
		        value: false,
		        width:"100%"
		    });
		    
		    $("#progressbar .ui-progressbar-value").css({display:'inline'});
		    var p = 1;
	        this.timer = setInterval(function(){
	            $("#progressbar .ui-progressbar-value").animate({width: p+"%"}, 400);
	            p = (p+3)%100;
	        },405);

	        var protocol_text = this.get_protocol_xml();
	        console.log("Protocol: \n" + protocol_text);
	        $('input[name="txt_protocol"]').val(protocol_text);
	        
	        $('#pdb_form').ajaxSubmit({
	            target: '#results_div'
	        })
	        
	        
	        
			/*$.post('/apply?protocol='+protocol_text+"&"+"pdb_file="+'',function(data) {
				
			}).fail(function() {
				$('#progressbar').hide();
				$('#protocol_error_msg').fadeIn();
			}).always(function() { 
				clearInterval(timer); 
			});*/
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