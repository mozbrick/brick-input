/* globals Platform */

(function () {

  var currentScript = document._currentScript || document.currentScript;


  var BrickInputElementPrototype = Object.create(HTMLElement.prototype);

  // Lifecycle methods

  BrickInputElementPrototype.createdCallback = function () {

  };

  BrickInputElementPrototype.attachedCallback = function () {

    var importDoc = currentScript.ownerDocument;
    var template = importDoc.querySelector('template');

    // fix styling for polyfill
    if (Platform.ShadowCSS) {
      var styles = template.content.querySelectorAll('style');
      for (var i = 0; i < styles.length; i++) {
        var style = styles[i];
        var cssText = Platform.ShadowCSS.shimStyle(style, 'brick-input');
        Platform.ShadowCSS.addCssToDocument(cssText);
        style.remove();
      }
    }

    // create shadowRoot and append template to it.
    var shadowRoot = this.createShadowRoot();
    shadowRoot.appendChild(template.content.cloneNode(true));

  };

  BrickInputElementPrototype.detachedCallback = function () {

  };

  BrickInputElementPrototype.attributeChangedCallback = function (attr, oldVal, newVal) {
    if (attr in attrs) {
      attrs[attr].call(this, oldVal, newVal);
    }
  };

  // Attribute handlers

  var attrs = {
    'clearbutton': function (oldVal, newVal) {
      console.log(oldVal,newVal);
    }
  };

  // Custom methods

  BrickInputElementPrototype.foo = function () {

  };

  // Property handlers

  Object.defineProperties(BrickInputElementPrototype, {
    'clearbutton': {
      get: function () {
        return this.hasAttribute('clearbutton');
      },
      set: function (newVal) {
        if (newVal) {
          this.setAttribute('clearbutton','');
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
