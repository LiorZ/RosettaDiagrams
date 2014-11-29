$(function($) {

  var elements = [];
  $.get('/js/elements.json', function(data) {

    elements = data;

  })

  var GlobalEvents = _.extend({}, Backbone.Events);
  var RosettaScripts = {};
  var connection_waiting = undefined;

  var graph = new joint.dia.Graph;

  var paper = new joint.dia.Paper({
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
          vertexAdd: false
          // arrowheadMove: false
        };
      }
      return true
    },
    el: $('#paper'),
    width: 800,
    height: 600,
    gridSize: 1,
    model: graph
  });



  paper.on('cell:pointerup', function(cellView, evt, x, y) {
    var target_id = cellView.model.get('target');
    var source_id = cellView.model.get('source');

    if (target_id == undefined || source_id == undefined) {
      return;
    }

    var source = graph.getCell(source_id);
    var target = graph.getCell(target_id);

    if (source.get('position').x != undefined) {
      cellView.model.set('source', cellView.model.previous('source'));
    }
    // if (target.get('position').x != undefined) {
    //   cellView.model.set('target', cellView.model.previous('target'));
    // }
  });

  paper.on('cell:pointerdblclick', function(cellview, evt, x, y) {
    var view = new AttributeView({
      model: cellview.model
    });
    view.render();
  });


  var add_element = function(ev) {
    var element_text = $("#txt_elem_name").val();
    $.each(elements, function(index, elem) {
      if (elem.name == element_text) {
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
          attributes: new AttributeCollection(elem.attributes),
          element_type: elem.type
        });
        new_elem.listenTo(GlobalEvents, "connection:start", function(model) {
          if (model != new_elem)
            return;

          connection_waiting = model;
        });

        new_elem.listenTo(GlobalEvents, "connection:end", function(model) {
          if (model != new_elem)
            return;

          var transition = new joint.shapes.uml.Transition({
            source: {
              id: connection_waiting.id
            },
            target: {
              id: model.id
            }
          });
          graph.addCell(transition);
        });
        graph.addCell(new_elem);
      }
    });
  }


  RosettaScripts.generate_rscripts = function() {
    $('.rscripts_elements').html('');

    var ordered_elements = RosettaScripts.ordered_elements();
    for (var i = 0; i < ordered_elements.length; ++i) {
      var html_str = '&lt;' + ordered_elements[i].name + " name=elem" + i + " ";
      var attributes = ordered_elements[i].attributes;
      for (var j = 0; j < attributes.length; ++j) {
        if (attributes[j].value.length > 0)
          html_str = html_str + attributes[j].key + "=" + attributes[j].value + " ";
      }
      html_str = html_str + "/&gt;"
      $('#code_template #xml_' + ordered_elements[i]['element_type']).append(html_str)
      if (ordered_elements[i]['element_type'] != "task_operation") {
        var protocol_str = "&lt;Add " + ordered_elements[i]["element_type"] + "_name=elem" + i + " /&gt;"
        $('#xml_protocols').append(protocol_str);
      }
    }
    console.log("Before Beautify:");
    console.log($('#code_template').text());
    var code_text = vkbeautify.xml($('#code_template').text());
    console.log("After Beautify:");
    console.log(code_text);
    $("#code_view").text(code_text);
    $("#code_view").removeClass("prettyprinted");
    prettyPrint();

    $('#rosetta_scripts_view').modal("show");
  }

  RosettaScripts.ordered_elements = function() {

    var first_element = undefined;
    var elements = graph.getElements();
    var rscripts_elements = [];

    //Find the first element that has no inbound connections:
    for (var i = 0; i < elements.length; ++i) {
      var links = graph.getConnectedLinks(elements[i], {
        inbound: true
      });
      console.log(links);
      if (links.length == 0) {
        first_element = elements[i];
        rscripts_elements.push(first_element.toJSON());
        break;
      }
    }

    if (first_element == undefined) {
      GlobalEvents.trigger('rscripts:error', "Can't find the first element in the protocol");
      return;
    }

    //Then, go through the path of the graph and add all the elements:
    var it_elem = first_element;
    while (graph.getConnectedLinks(it_elem, {
        outbound: true
      }).length > 0) {
      var links = graph.getConnectedLinks(it_elem, {
        outbound: true
      });
      if (links.length > 1) {
        GlobalEvents.trigger('rscripts:error', "More than one outgoing connection for an element is forbidden");
        return;
      }

      var target_id = links[0].get('target').id;
      it_elem = graph.getCell(target_id);
      rscripts_elements.push(it_elem.toJSON());
    }

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

  var MenuView = Backbone.View.extend({

    el: "#floating_menu",
    events: {
      "click #btn_delete_element" : 'delete_element',
      "click #btn_show_attributes" : "show_attributes",
      "mousedown #btn_connect" :"start_connecting"
    },
    initialize: function() {
      var context = this;
      paper.on('cell:pointerup', function(cellView, evt, x, y) {

        context.model = cellView.model;
        context.show();
      });

      paper.on("blank:pointerdown",function() { context.hide() });
      this.$el.hide();
    },
    show: function() {
      var box = this.model.getBBox();
      var paper_x = $('#paper').offset().left;
      var paper_y = $('#paper').offset().top;
      console.log(this.$el);
      this.$el.css({
        top: paper_y + box.y + 40,
        left: paper_x + box.x + box.width + 10
      }).fadeIn();
    },

    show_attributes:function( ) {
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
      console.log(ev);
      var paper_x = $('#paper').offset().left;
      var paper_y = $('#paper').offset().top;
      var transition = new joint.shapes.uml.Transition({
        source: {
          id: this.model.id
        },
        target: {
          x:ev.clientX - paper_x,
          y:ev.clientY - paper_y
        }
      });
      graph.addCell(transition);
      var view = paper.findViewByModel(transition);
      view.$el.trigger("click")
    }

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
          context.save_key_data(response, newValue)
        }
      });
      this.$el.find('.td_value_class').editable({
        success: function(response, newValue) {
          context.save_value_data(response, newValue)
        }
      });
    }
  });

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
      })
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


  var Attribute = Backbone.Model.extend({

  });

  var AttributeCollection = Backbone.Collection.extend({
    model: Attribute,
    initialize: function() {
      this.on("change:value", this.change_event);
    },
    change_event: function() {
      this.trigger("change");
    }
  })
  var ConnectionCheckbox = Backbone.View.extend({
    el: "#connection_checkbox",
    events: {
      'change': 'handle_change'
    },
    initialize: function() {
      var context = this;
      this.listenTo(graph, "add", function(cell) {
        if (cell.get('type') == 'uml.Transition') {
          context.$el.bootstrapToggle('off')
          context.cancel_waiting();
        }

      })
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
  $("#btn_add_element").click(add_element);
  $("#btn_generate_rs").click(function() {
    RosettaScripts.generate_rscripts();
  })
  var Menu = new MenuView();


  var connection_box = new ConnectionCheckbox();


}(jQuery));
