/*! JointJS v0.9.2 - JavaScript diagramming library  2014-09-16


This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
if (typeof exports === 'object') {

  var joint = {
    util: require('../src/core').util,
    shapes: {
      basic: require('./joint.shapes.basic')
    },
    dia: {
      ElementView: require('../src/joint.dia.element').ElementView,
      Link: require('../src/joint.dia.link').Link
    }
  };
  var _ = require('lodash');
}
joint.shapes.uml = {}
joint.shapes.rosetta = {};

joint.shapes.uml.Class = joint.shapes.basic.Generic.extend({

  markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<rect class="uml-class-name-rect"/><rect class="uml-class-attrs-rect"/><rect class="uml-class-methods-rect"/>',
    '</g>',
    '<text class="uml-class-name-text"/><text class="uml-class-attrs-text"/><text class="uml-class-methods-text"/>',
    '</g>'
  ].join(''),

  defaults: joint.util.deepSupplement({

    type: 'uml.Class',

    attrs: {
      rect: {
        'width': 200
      },

      '.uml-class-name-rect': {
        'stroke': 'black',
        'stroke-width': 2,
        'fill': '#3498db'
      },
      '.uml-class-attrs-rect': {
        'stroke': 'black',
        'stroke-width': 2,
        'fill': '#2980b9'
      },
      '.uml-class-methods-rect': {
        'stroke': 'black',
        'stroke-width': 2,
        'fill': '#2980b9'
      },

      '.uml-class-name-text': {
        'ref': '.uml-class-name-rect',
        'ref-y': .5,
        'ref-x': .5,
        'text-anchor': 'middle',
        'y-alignment': 'middle',
        'font-weight': 'bold',
        'fill': 'black',
        'font-size': 12,
        'font-family': 'Times New Roman'
      },
      '.uml-class-attrs-text': {
        'ref': '.uml-class-attrs-rect',
        'ref-y': 5,
        'ref-x': 5,
        'fill': 'black',
        'font-size': 12,
        'font-family': 'Times New Roman'
      },
      '.uml-class-methods-text': {
        'ref': '.uml-class-methods-rect',
        'ref-y': 5,
        'ref-x': 5,
        'fill': 'black',
        'font-size': 12,
        'font-family': 'Times New Roman'
      }
    },

    name: [],
    attributes: [],
    methods: []

  }, joint.shapes.basic.Generic.prototype.defaults),

  initialize: function() {

    this.on('change:name change:attributes change:methods', function() {
      this.updateRectangles();
      this.trigger('uml-update');
    }, this);

    this.updateRectangles();

    joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
  },

  getClassName: function() {
    return this.get('name');
  },

  updateRectangles: function() {

    var attrs = this.get('attrs');

    var rects = [{
      type: 'name',
      text: this.getClassName()
    }, {
      type: 'attrs',
      text: this.get('attributes')
    }, {
      type: 'methods',
      text: this.get('methods')
    }];

    var offsetY = 0;

    _.each(rects, function(rect) {

      var lines = _.isArray(rect.text) ? rect.text : [rect.text];
      var rectHeight = lines.length * 20 + 20;

      attrs['.uml-class-' + rect.type + '-text'].text = lines.join('\n');
      attrs['.uml-class-' + rect.type + '-rect'].height = rectHeight;
      attrs['.uml-class-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

      offsetY += rectHeight;
    });
  }

});

joint.shapes.uml.ClassView = joint.dia.ElementView.extend({

  initialize: function() {

    joint.dia.ElementView.prototype.initialize.apply(this, arguments);

    this.listenTo(this.model, 'uml-update', function() {
      this.update();
      this.resize();
    });
  }
});

joint.shapes.uml.Abstract = joint.shapes.uml.Class.extend({

  defaults: joint.util.deepSupplement({
    type: 'uml.Abstract',
    attrs: {
      '.uml-class-name-rect': {
        fill: '#e74c3c'
      },
      '.uml-class-attrs-rect': {
        fill: '#c0392b'
      },
      '.uml-class-methods-rect': {
        fill: '#c0392b'
      }
    }
  }, joint.shapes.uml.Class.prototype.defaults),

  getClassName: function() {
    return ['<<Abstract>>', this.get('name')];
  }

});
joint.shapes.uml.AbstractView = joint.shapes.uml.ClassView;

joint.shapes.uml.Interface = joint.shapes.uml.Class.extend({

  defaults: joint.util.deepSupplement({
    type: 'uml.Interface',
    attrs: {
      '.uml-class-name-rect': {
        fill: '#f1c40f'
      },
      '.uml-class-attrs-rect': {
        fill: '#f39c12'
      },
      '.uml-class-methods-rect': {
        fill: '#f39c12'
      }
    }
  }, joint.shapes.uml.Class.prototype.defaults),

  getClassName: function() {
    return ['<<Interface>>', this.get('name')];
  }

});
joint.shapes.uml.InterfaceView = joint.shapes.uml.ClassView;

joint.shapes.uml.Generalization = joint.dia.Link.extend({
  defaults: {
    type: 'uml.Generalization',
    attrs: {
      '.marker-target': {
        d: 'M 20 0 L 0 10 L 20 20 z',
        fill: 'white'
      }
    }
  }
});

joint.shapes.uml.Implementation = joint.dia.Link.extend({
  defaults: {
    type: 'uml.Implementation',
    attrs: {
      '.marker-target': {
        d: 'M 20 0 L 0 10 L 20 20 z',
        fill: 'white'
      },
      '.connection': {
        'stroke-dasharray': '3,3'
      }
    }
  }
});

joint.shapes.uml.Aggregation = joint.dia.Link.extend({
  defaults: {
    type: 'uml.Aggregation',
    attrs: {
      '.marker-target': {
        d: 'M 40 10 L 20 20 L 0 10 L 20 0 z',
        fill: 'white'
      }
    }
  }
});

joint.shapes.uml.Composition = joint.dia.Link.extend({
  defaults: {
    type: 'uml.Composition',
    attrs: {
      '.marker-target': {
        d: 'M 40 10 L 20 20 L 0 10 L 20 0 z',
        fill: 'black'
      }
    }
  }
});

joint.shapes.uml.Association = joint.dia.Link.extend({
  defaults: {
    type: 'uml.Association'
  }
});

// Statechart


var COLORS = {
  task_operation: {
    'fill': '#89BABE',
    'stroke': '#436265'
  },
  filter: {
    'fill': '#FFC472',
    'stroke': '#ED7943'
  },
  mover: {
    'fill': '#77DD77',
    'stroke': '#01A75A'
  }
}

var Attribute = Backbone.Model.extend({

});

var DiagramElementCollection = Backbone.Collection.extend({
  model: joint.shapes.rosetta.DiagramElement
});

var TaskOPAttribute = Attribute.extend({
  initialize: function() {
    this.set('moversList', []);
    // this.listenTo(this.get('moversList'), 'add remove', this.reset_value);
  },
  reset_value: function() {
    var movers = this.get('moversList');

    if (movers.length === 0){
      this.set('value','');
      return;
    }
    var value_arr = [];
    _.each(movers,function(mover) {
      var nameStr = mover.get_attr_by_key('name').get('value');
      value_arr.push(nameStr);
    });

    this.set('value', value_arr.join(','));
  },


  add_element: function(element, conn) {
    var name_attr = element.get_attr_by_key('name');
    this.listenTo(name_attr, 'change:value', this.reset_value);
    var context = this;
    conn.on("remove", function() {
      context.remove_element(element);
      context.reset_value();
    });
    this.get('moversList').push(element);
    this.reset_value();
  },
  remove_element: function(element) {
    var name_attr = element.get_attr_by_key('name');
    this.stopListening(name_attr);
    var index = this.get('moversList').indexOf(element);
    if ( index >= 0 ) {
      this.get('moversList').splice(index,1);
      this.reset_value();
    }

  }
});

var AttributeCollection = Backbone.Collection.extend({
  model: function(attrs, options) {
    if (attrs.key == "task_operations") {
      return new TaskOPAttribute(attrs);
    } else {
      return new Attribute(attrs);
    }
  },
  initialize: function() {
    this.on("change:value", this.change_event);
  },
  change_event: function() {
    this.trigger("change");
  }
});

joint.shapes.rosetta.TaskOPConnection = joint.dia.Link.extend({
  defaults: {
    type: 'rosetta.TaskOPConnection',
    attrs: {
      '.marker-target': {
        d: 'M 40 10 L 20 20 L 0 10 L 20 0 z',
        fill: 'black'
      }
    }
  },
  initialize: function(options,opts2) {

    joint.dia.Link.prototype.initialize.call(this, options);

    var graph = options.graph || opts2.graph;

    var source_id = this.get('source');
    var target_id = this.get('target');
    var source_elem = graph.getCell(source_id);
    var target_elem = graph.getCell(target_id);
    var attributes = target_elem.get('attributes');
    var task_attr = attributes.findWhere({
      key: "task_operations"
    });
    if (task_attr === undefined) {
      task_attr = new TaskOPAttribute({
        key: "task_operations",
        value: ""
      });
      attributes.add(task_attr);
    }
    task_attr.add_element(source_elem, this);
    this.unset('graph');
  }
});
joint.shapes.rosetta.DiagramElement = joint.shapes.basic.Generic.extend({

  markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<rect class="uml-state-body"/>',
    '</g>',
    '<path class="uml-state-separator"/>',
    '<text class="uml-state-name"/>',
    '<text class="uml-state-events"/>',
    '</g>'
  ].join(''),
  defaults: joint.util.deepSupplement({

    type: 'rosetta.DiagramElement',
    attrs: {
      '.uml-state-body': {
        'width': 200,
        'height': 200,
        'rx': 10,
        'ry': 10,
        'fill': '#ecf0f1',
        'stroke': '#bdc3c7',
        'stroke-width': 3
      },
      '.uml-state-separator': {
        'stroke': '#bdc3c7',
        'stroke-width': 2
      },
      '.uml-state-name': {
        'ref': '.uml-state-body',
        'ref-x': .5,
        'ref-y': 5,
        'text-anchor': 'middle',
        'fill': '#000000',
        'font-family': 'Courier New',
        'font-size': 14
      },
      '.uml-state-events': {
        'ref': '.uml-state-separator',
        'ref-x': 5,
        'ref-y': 5,
        'fill': '#000000',
        'font-family': 'Courier New',
        'font-size': 14
      }
    },

    name: 'Element',
    attributes: [],
    element_type: 'mover',


  }, joint.shapes.basic.Generic.prototype.defaults),
  initialize: function() {

    this.on({
      'change:name': this.updateName,
      'change:size': this.updatePath
    }, this);
    var raw_attributes = this.get('attributes');
    if (Array.isArray(raw_attributes)) {
      this.set_attributes();
    }
    this.listenTo(this.get('attributes'), 'change', this.updateAttributes);

    this.get('attrs')['.uml-state-body'].fill = COLORS[this.get('element_type')].fill;
    this.get('attrs')['.uml-state-body'].stroke = COLORS[this.get('element_type')].stroke;
    this.get('attrs')['.uml-state-separator'].stroke = COLORS[this.get('element_type')].stroke;

    this.updateName();
    this.updateAttributes();
    this.updatePath();

    joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
  },
  get_attr_by_key: function(key) {
    return this.get('attributes').findWhere({
      key: key
    });
  },
  set_attributes: function() {
    var raw = this.get('attributes');
    this.set('attributes', new AttributeCollection(raw));
  },
  toJSON: function() {
    var json = _.clone(this.attributes);
    for (var attr in json) {
      if ((json[attr] instanceof Backbone.Model) || (json[attr] instanceof Backbone.Collection)) {
        json[attr] = json[attr].toJSON();
      }
    }
    return json;
  },

  updateName: function() {

    this.attr('.uml-state-name/text', this.get('name'));
  },

  updateAttributes: function() {

    var attribute_text = this.get('attributes').filter(function(attr) {
        return attr.get('value') != undefined && attr.get('key').length > 0 && attr.get('value').length > 0;
      })
      .map(function(attr) {
        var text = attr.get('key') + " = " + attr.get('value');
        return (text.length > 19)?text.substr(0,19)+"...":text;
      });

    if (attribute_text.length > 5) {
      attribute_text = attribute_text.slice(0, 5);
    }
    this.attr('.uml-state-events/text', attribute_text.join("\n"));
  },

  updatePath: function() {

    var d = 'M 0 20 L ' + this.get('size').width + ' 20';

    // We are using `silent: true` here because updatePath() is meant to be called
    // on resize and there's no need to to update the element twice (`change:size`
    // triggers also an update).
    this.attr('.uml-state-separator/d', d, {
      silent: true
    });
  }

});




joint.shapes.uml.State = joint.shapes.basic.Generic.extend({

  markup: [
    '<g class="rotatable">',
    '<g class="scalable">',
    '<rect class="uml-state-body"/>',
    '</g>',
    '<path class="uml-state-separator"/>',
    '<text class="uml-state-name"/>',
    '<text class="uml-state-events"/>',
    '</g>'
  ].join(''),

  defaults: joint.util.deepSupplement({

    type: 'uml.State',
    attrs: {
      '.uml-state-body': {
        'width': 200,
        'height': 200,
        'rx': 10,
        'ry': 10,
        'fill': '#ecf0f1',
        'stroke': '#bdc3c7',
        'stroke-width': 3
      },
      '.uml-state-separator': {
        'stroke': '#bdc3c7',
        'stroke-width': 2
      },
      '.uml-state-name': {
        'ref': '.uml-state-body',
        'ref-x': .5,
        'ref-y': 5,
        'text-anchor': 'middle',
        'fill': '#000000',
        'font-family': 'Courier New',
        'font-size': 14
      },
      '.uml-state-events': {
        'ref': '.uml-state-separator',
        'ref-x': 5,
        'ref-y': 5,
        'fill': '#000000',
        'font-family': 'Courier New',
        'font-size': 14
      }
    },

    name: 'State',
    events: []

  }, joint.shapes.basic.Generic.prototype.defaults),

  initialize: function() {

    this.on({
      'change:name': this.updateName,
      'change:events': this.updateEvents,
      'change:size': this.updatePath
    }, this);

    this.updateName();
    this.updateEvents();
    this.updatePath();

    joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
  },

  updateName: function() {

    this.attr('.uml-state-name/text', this.get('name'));
  },

  updateEvents: function() {

    this.attr('.uml-state-events/text', this.get('events').join('\n'));
  },

  updatePath: function() {

    var d = 'M 0 20 L ' + this.get('size').width + ' 20';

    // We are using `silent: true` here because updatePath() is meant to be called
    // on resize and there's no need to to update the element twice (`change:size`
    // triggers also an update).
    this.attr('.uml-state-separator/d', d, {
      silent: true
    });
  }

});

joint.shapes.uml.StartState = joint.shapes.basic.Circle.extend({

  defaults: joint.util.deepSupplement({

    type: 'uml.StartState',
    attrs: {
      circle: {
        'fill': '#34495e',
        'stroke': '#2c3e50',
        'stroke-width': 2,
        'rx': 1
      }
    }

  }, joint.shapes.basic.Circle.prototype.defaults)

});

joint.shapes.uml.EndState = joint.shapes.basic.Generic.extend({

  markup: '<g class="rotatable"><g class="scalable"><circle class="outer"/><circle class="inner"/></g></g>',

  defaults: joint.util.deepSupplement({

    type: 'uml.EndState',
    size: {
      width: 20,
      height: 20
    },
    attrs: {
      'circle.outer': {
        transform: 'translate(10, 10)',
        r: 10,
        fill: 'white',
        stroke: '#2c3e50'
      },

      'circle.inner': {
        transform: 'translate(10, 10)',
        r: 6,
        fill: '#34495e'
      }
    }

  }, joint.shapes.basic.Generic.prototype.defaults)

});

joint.shapes.uml.Transition = joint.dia.Link.extend({
  defaults: {
    type: 'uml.Transition',
    attrs: {
      '.marker-target': {
        d: 'M 10 0 L 0 5 L 10 10 z',
        fill: '#34495e',
        stroke: '#2c3e50'
      },
      '.connection': {
        stroke: '#2c3e50'
      }
    }
  },
  initialize:function(options) {
    joint.dia.Link.prototype.initialize.call(this, options);
    this.unset('graph');
  }
});

if (typeof exports === 'object') {

  module.exports = joint.shapes.rosetta;
}
