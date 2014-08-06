/* globals Platform */

(function() {

  var currentScript = document._currentScript || document.currentScript;

  function shimShadowStyles(styles, tag) {
    if (!Platform.ShadowCSS) {
      return;
    }
    for (var i = 0; i < styles.length; i++) {
      var style = styles[i];
      var cssText = Platform.ShadowCSS.shimStyle(style, tag);
      Platform.ShadowCSS.addCssToDocument(cssText);
      style.remove();
    }
  }

  function copyAttributes(src, dest, exceptions) {
    var attrs = src.attributes;
    for (var i = 0; i < attrs.length; i++) {
      var attr = src.attributes[i];
      if (exceptions.indexOf(attr.name) === -1) {
        dest.setAttribute(attr.name, attr.value);
      }
    }
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
    shimShadowStyles(templateContent.querySelectorAll('style'),'brick-input');

    // create shadowRoot and append template
    var shadowRoot = this.createShadowRoot();
    shadowRoot.appendChild(templateContent.cloneNode(true));

    // get the input
    if (this.hasAttribute('multiline')) {
      this.input = document.createElement('textarea');
    } else {
      this.input = document.createElement('input');
    }
    copyAttributes(this,this.input,['label']);
    this.appendChild(this.input);
    this.input.addEventListener('change', function() {
      if(!brickInput.input.checkValidity()) {
        brickInput.setAttribute('invalid','');
      } else {
        brickInput.removeAttribute('invalid');
      }
    });

    // setup label
    var placeholderText = this.getAttribute('placeholder');
    var labelText = this.getAttribute('label');
    if (labelText) {
      var label = shadowRoot.querySelector('.label');
      label.appendChild(document.createTextNode(labelText));
    }
    var ariaLabel = labelText || placeholderText;
    if (ariaLabel) {
      this.input.setAttribute('aria-label',labelText);
    }

    // setup error message
    var errorText = this.getAttribute('error');
    if (errorText) {
      var error = shadowRoot.querySelector('.error');
      error.appendChild(document.createTextNode(errorText));
    }

    // setup clear button and listen to it
    var clearButton = shadowRoot.querySelector('.clear');
    this.clearing = false;
    clearButton.addEventListener('click', function() {
      brickInput.input.value = '';
      brickInput.input.focus();
    });
    clearButton.addEventListener('mousedown', function() {
      brickInput.clearing = true;
    });
    clearButton.addEventListener('mouseup', function() {
      brickInput.clearing = false;
    });

    // listen to focus and blur
    this.input.addEventListener('focus', function() {
      brickInput.setAttribute('focus','');
    });
    this.input.addEventListener('blur', function() {
      if (!brickInput.clearing) {
        brickInput.removeAttribute('focus');
      }
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

  var attrs = {

  };

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
