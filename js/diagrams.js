var RosettaDiagrams = {} || RosettaDiagrams;

$(function($) {


  function random_string(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  var autoCompleteElements = {
    "mover": [],
    "filter": [],
    "task_operation": []
  };
  var bMovers, bFilters, bTask;

  var elements = [];
  $.get('/js/RosettaDiagrams/js/elements.json', function(data) {

    elements = data;
    _.each(elements, function(elem) {
      autoCompleteElements[elem.type].push(elem.name);
    });
    bMovers = new Bloodhound({
      local: autoCompleteElements['mover'],
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('element'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
    });
    bFilters = new Bloodhound({
      local: autoCompleteElements['filter'],
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('element'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
    });

    bTask = new Bloodhound({
      local: autoCompleteElements['task_operation'],
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('element'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
    });


  });

  RosettaDiagrams.RosettaDiagramsGraph = joint.dia.Graph.extend({

    defaults: _.extend({}, joint.dia.Graph.prototype.defaults, {
      name: 'Untitled Diagram',
      is_public: false
    })

  });

  //shortcut:
  var RosettaDiagramsGraph = RosettaDiagrams.RosettaDiagramsGraph;



  var GlobalEvents = _.extend({}, Backbone.Events);
  var connection_waiting;
  var paper;
  var DiagramCollectionModel = Backbone.Collection.extend({
    model: RosettaDiagramsGraph,
    url: '/diagrams',
    save: function(options) {
      var arr = this;
      var json_arr = [];
      for (var i = 0; i < arr.length; ++i) {
        if (arr.at(i).get('id') === undefined) {
          var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
              v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });

          arr.at(i).set('id', id);
        }
        json_arr.push(arr.at(i).toJSON());
      }

      window.localStorage.setItem('diagrams', JSON.stringify(json_arr));
    },



  });


  RosettaDiagrams.DiagramsCollection = new DiagramCollectionModel();

  GlobalEvents.on("connection:start", function(model) {
    connection_waiting = model;
  });


  GlobalEvents.on("connection:end", function(model) {
    var connection_model;
    if (connection_waiting.get('element_type') != "task_operation") {
      connection_model = joint.shapes.uml.Transition;
    } else {
      connection_model = joint.shapes.rosetta.TaskOPConnection;
    }
    var transition = new connection_model({
      source: {
        id: connection_waiting.id
      },
      target: {
        id: model.id
      },
      graph: paper.model
    });

    paper.model.addCell(transition);
    connection_waiting = undefined;
  });

  RosettaDiagrams.new_diagram = function() {

    // var graph = RosettaDiagrams.DiagramsCollection.create({
    //   name: "Untitled Diagram"
    // }, {
    //   wait: true,
    //   success:function(g) {
    //     console.log("GRAPH:");
    //     console.log(g.toJSON());
    //   }
    // });

    // $.ajax({
    //   url: '/diagrams',
    //   type: 'POST',
    //   data: JSON.stringify({'name':'Untitled Diagram'}),
    //   dataType: 'application/json'
    // }).done(function(data,status){
    //   console.log("DATA: ");
    //   console.log(data);
    // }).fail(function(dd){
    //   console.log("FAIL");
    //   console.log(dd);
    // });
    var graph = new RosettaDiagramsGraph();
    $.post("/diagrams", JSON.stringify({
        'name': 'Untitled Diagram'
      }))
      .done(function(data, status) {
        if (data.cells === undefined) {
          data.cells = [];
        }
        graph.fromJSON(data, {
          graph: graph
        });
        RosettaDiagrams.DiagramsCollection.add(graph);
      }).fail(function(dd) {
        //Handle fail of creation.
        console.log("FAIL");
        console.log(dd);
      });
    set_paper(graph);
    GlobalEvents.trigger("diagram:new", graph);
  };

  var set_paper = function(g) {

    paper = new joint.dia.Paper({
      linkView: joint.dia.LinkView.extend({
        pointerdblclick: function(evt, x, y) {
          if (V(evt.target).hasClass('connection') || V(evt.target).hasClass('connection-wrap')) {
            this.addVertex({
              x: x,
              y: y
            });
          }
        }
      }),
      interactive: function(cellView) {
        if (cellView.model instanceof joint.dia.Link) {
          // Disable the default vertex add functionality on pointerdown.
          return {
            vertexAdd: false,
            arrowheadMove: false
          };
        }
        return true;
      },
      el: $('#paper'),
      width: 1250,
      height: 550,
      gridSize: 1,
      model: g
    });

    paper.on('cell:pointerdblclick', function(cellview, evt, x, y) {
      var view = new AttributeView({
        model: cellview.model
      });
      view.render();
    });

    paper.on('cell:pointerup', function(cellView, evt, x, y) {
      var target_id = cellView.model.get('target');
      var source_id = cellView.model.get('source');

      if (target_id === undefined || source_id === undefined) {
        return;
      }

      var source = paper.model.getCell(source_id);
      var target = paper.model.getCell(target_id);

      if (source.get('position').x !== undefined) {
        cellView.model.set('source', cellView.model.previous('source'));
      }
      // if (target.get('position').x != undefined) {
      //   cellView.model.set('target', cellView.model.previous('target'));
      // }
    });
    paper.resetCells(g.get("cells"));
  };

  RosettaDiagrams.diagram_by_id = function(id) {
    var diagram = RosettaDiagrams.DiagramsCollection.find(function(d) {
      return d.get('id') == id;
    });
    return diagram;
  };

  RosettaDiagrams.open_existing_diagram = function(g) {
    set_paper(g);
    RosettaDiagrams.paper = paper;
    GlobalEvents.trigger("diagram:new", g);
  };

  RosettaDiagrams.get_rosetta_scripts = function(diagram_graph) {

    $('.rscripts_elements').html('');

    //Get all elements, task operations appear at the end of the array
    var ordered_elements = RosettaDiagrams.ordered_elements(diagram_graph);

    if (ordered_elements === undefined) {
      ordered_elements = [];
    }

    for (var i = 0; i < ordered_elements.length; ++i) {
      var html_str = '&lt;' + ordered_elements[i].name + " ";
      var attributes = ordered_elements[i].attributes;
      for (var j = 0; j < attributes.length; ++j) {
        if (attributes[j].value.length > 0)
          html_str = html_str + attributes[j].key + "=" + attributes[j].value + " ";
      }
      html_str = html_str + "/&gt;";
      $('#code_template #xml_' + ordered_elements[i].element_type).append(html_str);
      var name_attr = _.findWhere(ordered_elements[i].attributes, {
        key: 'name'
      });
      if (ordered_elements[i].element_type != "task_operation") {
        var protocol_str = "&lt;Add " + ordered_elements[i].element_type + "_name=" + name_attr.value + " /&gt;";
        $('#xml_protocols').append(protocol_str);
      }
    }
    var xml = $("#code_template").text();
    var code_text = vkbeautify.xml($('#code_template').text());
    return code_text;
  };

  RosettaDiagrams.generate_rscripts = function(diagram_graph) {
    var xml = RosettaDiagrams.get_rosetta_scripts(diagram_graph);
    $("#code_view").text(xml);
    $("#code_view").removeClass("prettyprinted");
    prettyPrint();

    $('#rosetta_scripts_view').modal("show");
  };

  RosettaDiagrams.ordered_elements = function(diagram_graph) {
    if (diagram_graph === undefined) {
      diagram_graph = paper.model;
    }
    var first_element;
    var elements = _.filter(diagram_graph.getElements(), function(elem) {
      return elem.get('element_type') != "task_operation";
    });
    var rscripts_elements = [];

    var get_flow_links = function(elem, options) {
      var all_links = diagram_graph.getConnectedLinks(elem, options);

      return _.filter(all_links, function(link) {
        return link.get('type') == 'uml.Transition';
      });
    };

    //Find the first element that has no inbound connections:
    for (var i = 0; i < elements.length; ++i) {
      var links = get_flow_links(elements[i], {
        inbound: true
      });
      if (links.length === 0) {
        first_element = elements[i];
        rscripts_elements.push(first_element.toJSON());
        break;
      }
    }

    if (first_element === undefined) {
      GlobalEvents.trigger('rscripts:error', "Can't find the first element in the protocol");
      return;
    }

    //Then, go through the path of the graph and add all the elements:
    var it_elem = first_element;
    while (get_flow_links(it_elem, {
        outbound: true
      }).length > 0) {
      var links = get_flow_links(it_elem, {
        outbound: true
      });
      if (links.length > 1) {
        GlobalEvents.trigger('rscripts:error', "More than one outgoing connection for an element is forbidden");
        return;
      }

      var target_id = links[0].get('target').id;
      it_elem = diagram_graph.getCell(target_id);
      rscripts_elements.push(it_elem.toJSON());
    }

    _.each(diagram_graph.getElements(), function(elem) {
      if (elem.get('element_type') == "task_operation") {
        rscripts_elements.push(elem.toJSON());
      }
    });

    return rscripts_elements;

  }

  var connection_mode_func = function(element_view, evt, x, y) {
    if (connection_waiting === undefined) {
      GlobalEvents.trigger("connection:start", element_view.model);
    } else {
      GlobalEvents.trigger("connection:end", element_view.model);
    }
  }

  //Backbone Views:

  var AttributeView = Backbone.View.extend({
    template: _.template($('#attribute_view_template').html()),
    events: {
      'hidden.bs.modal': 'clear_table',
      'click #btn_add_attribute': 'add_attribute'
    },
    add_attribute: function() {
      this.model.get('attributes').create({
        key: "attribute",
        value: ""
      });
    },

    add_attribute_view: function(attr) {

      var attr_view = new SingleAttributeView({
        target: this.table,
        model: attr
      });
      attr_view.render();
      this.child_views.push(attr_view);
    },
    child_views: [],
    remove_attribute: function(model) {
      for (var i = 0; i < this.child_views.length; ++i) {
        if (this.child_views[i].model == model) {
          this.child_views[i].remove();
          this.child_views.splice(i, 1);
          return;
        }
      }
    },
    initialize: function() {
      this.listenTo(this.model.get('attributes'), 'add', this.add_attribute_view);
      this.listenTo(this.model.get('attributes'), 'destroy', this.remove_attribute);
      var compiled_template = this.template(this.model.toJSON());
      $('body').append(compiled_template);
      this.$el = $('#attribute_view');
      var context = this;
      this.table = $('#attributes_table');
      this.model.get('attributes').each(function(attr) {
        context.add_attribute_view(attr);
      });
    },
    render: function() {
      for (var i = 0; i < this.child_views.length; ++i) {
        this.child_views[i].render();
      }
      this.$el.modal("show");
    },
    clear_table: function() {
      for (var i = 0; i < this.child_views.length; ++i) {
        this.child_views[i].remove();
      }
      this.remove();
    },
  });

  var DiagramContainerView = Backbone.View.extend({
    el: '#rosetta_diagrams_view',
    events: {
      "click #btn_add_element": "add_element",
      "click #btn_diagram_close": "save_diagram",
      "keypress #txt_elem_name": "add_element_on_enter"
    },
    initialize: function() {
      var context = this;
      var title = this.$el.find('#rosetta_diagrams_view_title');

      title.editable({
        success: function(response, newValue) {
          context.model.set('name', newValue);
          context.model.save(null, {
            success: function() {}
          });
        }
      });

      title.on("shown", function(e, editable) {
        editable.input.$input.val(context.model.get('name'));
      });

      GlobalEvents.on("diagram:new", this.switch_model, this);
    },
    add_element_on_enter: function(ev) {
      var key_pressed = ev.which;
      if (ev.which == 13) {
        this.add_element();
      }
    },
    switch_model: function(model) {
      console.log("DiagramContainerView switching models");
      this.undelegateEvents();
      this.model = model;
      this.delegateEvents();
      $("#txt_elem_name").typeahead({
        highlight: true
      }, {
        name: 'movers',
        display: 'element',
        source: bMovers,
        templates: {
          header: '<h3 class="mover-type">Movers</h3>'
        }
      }, {
        name: 'filters',
        display: 'element',
        source: bFilters,
        templates: {
          header: '<h3 class="mover-type">Filters</h3>'
        }
      },
      {
        name: 'task_operations',
        display: 'element',
        source: bTask,
        templates: {
          header: '<h3 class="mover-type">Task Operations</h3>'
        }
      }

      );

      this.$el.find("#rosetta_diagrams_view_title").text(model.get("name"));


    },
    save_diagram: function() {
      this.model.save();
    },

    add_element: function() {
      var context = this;
      var element_text = $("#txt_elem_name").val();
      $.each(elements, function(index, elem) {
        if (elem.name == element_text) {
          var attributes_clone = _.map(elem.attributes, _.clone);
          attributes_clone.push({
            key: 'name',
            value: "element_" + random_string(5)
          });
          var new_elem = new joint.shapes.rosetta.DiagramElement({
            position: {
              x: 100,
              y: 100
            },
            size: {
              width: 200,
              height: 100
            },
            name: element_text,
            attributes: new AttributeCollection(attributes_clone),
            element_type: elem.type
          });
          context.model.addCell(new_elem);
        }
      });


      $("#txt_elem_name").val('');
    }
  });
  var ConnectionCheckbox = Backbone.View.extend({
    el: "#connection_checkbox",
    events: {
      'change': 'handle_change'
    },
    initialize: function() {
      GlobalEvents.on("diagram:new", this.switch_models, this);
      this.$el.bootstrapToggle('off');
    },

    switch_models: function(model) {
      console.log("ConnectionCheckbox switching models");
      this.stopListening();
      this.model = model;
      this.listen_to_graph();
    },

    listen_to_graph: function() {
      var context = this;
      this.listenTo(this.model, "add", function(cell) {
        if (cell.get('type') == 'uml.Transition' || cell.get('type') == "rosetta.TaskOPConnection") {
          context.$el.bootstrapToggle('off');
          context.cancel_waiting();
        }

      });
    },
    cancel_waiting: function() {
      connection_waiting = undefined;
      paper.off("cell:pointerclick", connection_mode_func);
    },
    handle_change: function(ev) {
      if (!$(ev.target).is(":checked")) {
        this.cancel_waiting();
      } else {
        paper.on("cell:pointerclick", connection_mode_func);
      }
    }
  });

  //jQuery bindings:
  $("#btn_generate_rs").click(function() {
    RosettaDiagrams.generate_rscripts();
  });

  var SingleAttributeView = Backbone.View.extend({
    template: _.template($('#single_attribute_view').html()),
    events: {
      'click #btn_delete_attribute': 'delete_attribute'
    },
    initialize: function(options) {
      var compiled = this.template(this.model.toJSON());
      this.$el = $(compiled);
      options.target.append(this.$el);
    },
    delete_attribute: function() {
      this.model.destroy();
    },
    save_key_data: function(response, newValue) {
      this.model.set('key', newValue);
    },
    save_value_data: function(response, newValue) {
      this.model.set('value', newValue);
    },
    render: function() {
      var context = this;
      this.$el.find('.td_key_class').editable({
        success: function(response, newValue) {
          context.save_key_data(response, newValue);
        }
      });
      this.$el.find('.td_value_class').editable({
        success: function(response, newValue) {
          context.save_value_data(response, newValue);
        }
      });
    }
  });
  var MenuView = Backbone.View.extend({

    el: "#floating_menu",
    events: {
      "click #btn_delete_element": 'delete_element',
      "click #btn_show_attributes": "show_attributes",
      "click #btn_info_element": "show_info",
      "mousedown #btn_connect": "start_connecting"
    },
    initialize: function() {
      var context = this;
      this.$el.hide();
      GlobalEvents.on("diagram:new", this.switch_models, this);
    },

    show_info: function() {
      iframe = $('#rosetta_doc');
      iframe.load(function() {
        var css = {
          width: "100%",
          height: "50%"
        };

        iframe.css(css);
      });
      var url_filename = "";
      var element_name = this.model.get("name");
      if (this.model.get("element_type") == "mover") {
        url_filename = "movers.html";
      } else if (this.model.get("element_type") == "filter") {
        url_filename = "filters.html";
      } else if (this.model.get("element_type") == "task_operation") {
        url_filename = "taskop.html"
      }

      iframe.attr('src', '/docs/' + url_filename + "#" + element_name);

      $('#rosetta_info_view').modal("show");
    },

    switch_models: function(g) {
      this.undelegateEvents();
      this.model = g;
      var context = this;

      paper.on('cell:pointerup', function(cellView, evt, x, y) {
        context.model = cellView.model;
        context.show();
      });

      paper.on("blank:pointerdown", function() {
        context.hide();
      });
      this.delegateEvents();
    },

    show: function() {
      var box = this.model.getBBox();
      var pos = box.topRight();
      var paper_top = $("#paper").offset().top;
      console.log(box)
      this.$el.css({
        top: pos.y + paper_top - box.height + 10,
        left: pos.x + 20
      }).fadeIn();
    },

    show_attributes: function() {
      var view = new AttributeView({
        model: this.model
      });
      view.render();
    },

    delete_element: function() {
      this.model.remove();
      this.$el.hide();
    },

    hide: function() {
      this.$el.fadeOut();
    },
    start_connecting: function(ev) {
      var paper_x = $('#paper').offset().left;
      var paper_y = $('#paper').offset().top;
      var transition = new joint.shapes.uml.Transition({
        source: {
          id: this.model.id
        },
        target: {
          x: ev.clientX - paper_x,
          y: ev.clientY - paper_y
        }
      });
      paper.model.addCell(transition);
      var view = paper.findViewByModel(transition);
      view.$el.trigger("click");
    }

  });



  var DiagramView = new DiagramContainerView({});

  var connection_box = new ConnectionCheckbox();
  var Menu = new MenuView();

  $('#rosetta_diagrams_view').on('hidden.bs.modal', function() {
    paper.undelegateEvents();
    paper.stopListening();
    $("#paper svg").remove();
  });
}(jQuery));
