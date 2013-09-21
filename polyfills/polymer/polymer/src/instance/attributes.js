/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

  // magic words

  var PUBLISHED = '__published';
  var INSTANCE_ATTRIBUTES = '__instance_attributes';

  // instance api for attributes

  var attributes = {
    PUBLISHED: PUBLISHED,
    INSTANCE_ATTRIBUTES: INSTANCE_ATTRIBUTES,
    copyInstanceAttributes: function () {
      var a$ = this[INSTANCE_ATTRIBUTES];
      for (var k in a$) {
        this.setAttribute(k, a$[k]);
      }
    },
    // for each attribute on this, deserialize value to property as needed
    takeAttributes: function() {
      for (var i=0, a$=this.attributes, l=a$.length, a; (a=a$[i]) && i<l; i++) {
        this.attributeToProperty(a.name, a.value);
      }
    },
    // if attribute 'name' is mapped to a property, deserialize
    // 'value' into that property
    attributeToProperty: function(name, value) {
      // try to match this attribute to a property (attributes are
      // all lower-case, so this is case-insensitive search)
      var name = this.propertyForAttribute(name);
      if (name) {
        // filter out 'mustached' values, these are to be
        // replaced with bound-data and are not yet values
        // themselves
        if (value && value.search(scope.bindPattern) >= 0) {
          return;
        }
        // get original value
        var defaultValue = this[name];
        // deserialize Boolean or Number values from attribute
        var value = this.deserializeValue(value, defaultValue);
        // only act if the value has changed
        if (value !== defaultValue) {
          // install new value (has side-effects)
          this[name] = value;
        }
      }
    },
    // return the published property matching name, or undefined
    propertyForAttribute: function(name) {
      // matchable properties must be published
      var properties = Object.keys(this[PUBLISHED]);
      // search for a matchable property
      return properties[properties.map(lowerCase).indexOf(name.toLowerCase())];
    },
    // convert representation of 'stringValue' based on type of 'defaultValue'
    deserializeValue: function(stringValue, defaultValue) {
      return scope.deserializeValue(stringValue, defaultValue);
    },
    serializeValue: function(value, inferredType) {
      if (inferredType === 'boolean') {
        return value ? '' : undefined;
      } else if (inferredType !== 'object' && typeof value !== 'object' &&
          value !== undefined) {
        return value;
      }
    },
    propertyToAttribute: function(name) {
      if (Object.keys(this[PUBLISHED]).indexOf(name) >= 0) {
        var inferredType = typeof this.__proto__[name];
        var serializedValue = this.serializeValue(this[name], inferredType);
        // boolean properties must reflect as boolean attributes
        if (serializedValue !== undefined) {
          this.setAttribute(name, serializedValue);
        // TODO(sorvell): we should remove attr for all properties 
        // that have undefined serialization; however, we will need to 
        // refine the attr reflection system to achieve this; pica, for example,
        // relies on having inferredType object properties not removed as 
        // attrs.
        } else if (inferredType === 'boolean') {
          this.removeAttribute(name);
        }
        
      }
    }
  };

  var lowerCase = String.prototype.toLowerCase.call.bind(
    String.prototype.toLowerCase);

  // exports

  scope.api.instance.attributes = attributes;
  
})(Polymer);
