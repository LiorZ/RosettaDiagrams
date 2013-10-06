var app = app || {};

app.DiagramVerifier = {
		
		is_valid_connection: function(connection) {
			var status = {
					valid: false
			};
			var source = connection.get('source');
			var target = connection.get('target');
			if ( source == target ) {
				status['message']="Can't connect an element to itself";
				return status;
			}
			
			var target_con = app.ActiveDiagram.connection_by_target(target);
			if ( (target_con != undefined && target_con.get('source').get('type') != 'task_operation') &&
					source.get('type') != 'task_operation' ){
				//Not allowing more than one incoming connection! (PUT HERE INFORMATION MESSAGE)
				status['message'] = "Can't connect more than one node";
				return status;
			}

//			if ( source.get('type') != 'task_operation' ) {
//				var source_target = app.ActiveDiagram.connection_by_target(target);
//				if ( source_target != null ) {
//					status['message'] = "Can't form a circle in the diagram";
//					return status;
//				}
//			}
			
			if ( ! this.has_linear_path(connection) ) {
				var status = this.get_non_linear_status();
				return status;
			}
			status.valid = true;
			return status;
		},
		
		get_non_linear_status: function() {
			var status = {};
			status.valid = false;
			status['message'] = "Diagram doesn't have a linear path";
			return status;
		},
		
		/**
		 * Returns a list of connections without the containment connections.
		 */
		get_relevant_connections: function() {
			var raw_connections = app.MainDiagram.get_connections();
			if ( _.isUndefined(raw_connections) ||  raw_connections.length == 0 )
				return undefined;
			var connections = raw_connections.filter(
					function(conn) { return (!_.isUndefined(conn) && conn.get('source').get('type') != 'task_operation' && conn.get('target').get('type') != 'task_operation' )});
//			var elements = _.chain(app.MainDiagram.get_elements()).filter(function(elem) { return !_.isUndefined(elem) && elem.get('type') != 'task_operation' } );
			if ( _.isArray(connections) && connections.length == 0 ) {
				return undefined;
			}
			
			return connections;
			
		},
		
		get_sources: function() {
			var connections = this.get_relevant_connections();
			if ( _.isUndefined(connections) ) {
				return undefined;
			}
			var sources =[];
			var targets = [];
			
			_.each(connections,function(conn) {
				var source = conn.get('source');
				var target = conn.get('target');
				sources.push(source);
				targets.push(target);
			});
			
			var sources_only = _.difference(sources,targets);
			if ( _.isUndefined(sources_only) || sources_only.length == 0 ){
				return undefined;
			}
			return sources_only;
		},
		
		has_linear_path: function(new_connection) {
			var connections = this.get_relevant_connections();
			if ( _.isUndefined(connections) ){
				return true;
			}
			var sources =[];
			var targets = [];
			
			if ( !_.isUndefined(new_connection) ){
				sources.push(new_connection.get('source'));
				targets.push(new_connection.get('target'));
			}
			
			_.each(connections,function(conn) {
				var source = conn.get('source');
				var target = conn.get('target');
				sources.push(source);
				targets.push(target);
			});
			var sources_only = _.difference(sources,targets);
			if ( _.isUndefined(sources_only) || sources_only.length == 0 ){
				return false;
			}
			for(var i=0; i<sources_only.length; ++i) {
				if ( this.is_circle(sources_only[i]) ) {
					return false;
				}
			}
			
			return true;
		},
		
		is_circle:function(source) {
			var passed_nodes = [];
			var current = source;
			passed_nodes.push(current);
			var next = current.get('target_node');
			while(!_.isUndefined(next) ) {
				if ( _.contains(passed_nodes,next) ){
					return true;
				}
				passed_nodes.push(next);
				next = next.get('target_node');
			}
			return false;
		}
		
}