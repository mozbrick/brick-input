/* globals Platform */

(function() {

  var currentScript = document._currentScript || document.currentScript;

  function shimShadowStyles(styles, tag) {
    for (var i = 0; i < styles.length; i++) {
      var style = styles[i];
      var cssText = Platform.ShadowCSS.shimStyle(style, tag);
      Platform.ShadowCSS.addCssToDocument(cssText);
      style.remove();
    }
  }

  function copyAttributes(src, dest) {
    var attrs = src.attributes;
    for (var i = 0; i < attrs.length; i++) {
      var attr = src.attributes[i];
      dest.setAttribute(attr.name, attr.value);
    }
  }

  function setupInput(el) {
    el.input = el.querySelector('input');
    // create an input if we did not wrap one
    if (!el.input) {
      el.input = document.createElement('input');
      el.appendChild(el.input);
      copyAttributes(el, el.input);
    }
    el.input.addEventListener('focus', function() {
      el.setAttribute('focus','');
    });
    el.input.addEventListener('blur', function() {
      el.removeAttribute('focus');
    });
  }

  var BrickInputElementPrototype = Object.create(HTMLElement.prototype);

  BrickInputElementPrototype.createdCallback = function() {

  };

  BrickInputElementPrototype.attachedCallback = function() {

    var brickInput = this;

    // import template
    var importDoc = currentScript.ownerDocument;
    var templateContent = importDoc.querySelector('template').content;

    // fix styling for polyfill
    if (Platform.ShadowCSS) {
      shimShadowStyles(templateContent.querySelectorAll('style'),'brick-input');
    }

    // create shadowRoot and append template
    var shadowRoot = this.createShadowRoot();
    shadowRoot.appendChild(templateContent.cloneNode(true));

    // setup input
    setupInput(this);

    var clearButton = shadowRoot.querySelector('#clear');
    clearButton.addEventListener('click', function() {
      brickInput.input.value = '';
      brickInput.input.focus();
    });

  };

  BrickInputElementPrototype.detachedCallback = function() {

  };

  BrickInputElementPrototype.attributeChangedCallback = function(attr, oldVal, newVal) {
    if (attr in attrs) {
      attrs[attr].call(this, oldVal, newVal);
    }
  };

  // Attribute handlers

  var attrs = {};

  // Property handlers
  Object.defineProperties(BrickInputElementPrototype, {
    'clearbutton': {
      get: function() {
        return this.hasAttribute('clearbutton');
      },
      set: function(newVal) {
        if (newVal) {
          this.setAttribute('clearbutton', '');
        } else {
          this.removeAttribute('clearbutton');
        }
      }
    }
  });

  // Register the element

  window.BrickInputElement = document.registerElement('brick-input', {
    prototype: BrickInputElementPrototype
  });

})();
