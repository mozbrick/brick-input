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

  function inputValueChanged(e) {
    var brickInput = e.currentTarget;
    validateInput(brickInput);
  }

  function validateInput(brickInput) {
    var regExp = new RegExp(brickInput.validate);
    var value = brickInput.inputElement.value;
    if (regExp.test(value)) {
      //
    } else {
      //
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
    this.input = shadowRoot.querySelector('input');
    copyAttributes(this,this.input,['label']);

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

    // setup clear button and listen to it
    var clearButton = shadowRoot.querySelector('.clear');
    clearButton.addEventListener('click', function() {
      brickInput.input.value = '';
      brickInput.input.focus();
    });

    // listen to focus and blur
    this.addEventListener('focus', function() {
      brickInput.setAttribute('focus','');
    });
    this.addEventListener('blur', function(e) {
      // todo: figure out how to prevent indicator flashing
      brickInput.removeAttribute('focus');
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
