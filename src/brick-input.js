(function () {

  var BrickInputElementPrototype = Object.create(HTMLElement.prototype);

  function addClass(el, c) {
    var list = el.className.trim().split(' ');
    c.trim().split(' ').forEach(function (name) {
      if (list.indexOf(name) === -1) {
        list.push(name);
      }
    });
    el.className = list.join(' ').trim();
    return el;
  }

  function removeClass(el, c) {
    var classes = c.trim().split(' ');
    el.className = el.className.trim().split(' ').filter(function (name) {
      return name && classes.indexOf(name) === -1;
    }).join(' ');
    return el;
  }

  function inputValueChanged(e) {
    var brickInput = e.currentTarget;
    validateInput(brickInput);
  }

  function validateInput(brickInput) {
    var regExp = new RegExp(brickInput.validate);
    var value = brickInput.inputElement.value;
    if (regExp.test(value)) {
      removeClass(brickInput, "invalid");
    } else {
      addClass(brickInput, "invalid");
    }
  }

  function showLabel(brickInput) {
    setTimeout(function() {
      addClass(brickInput, "show-label");
    }, 0);
  }
  function hideLabel(brickInput) {
    removeClass(brickInput, "show-label");
  }

  function floatingLabelHandler(e) {
    var brickInput = e.currentTarget.parentNode;
    var value = brickInput.value;
    var input = brickInput.inputElement;
    var placeholder = brickInput.label;

    var transitionEndListener = function(e){
      var brickInput = e.currentTarget;
      removeClass(brickInput,"transition");
      brickInput.removeEventListener("transitionend",transitionEndListener);
    };
    brickInput.addEventListener("transitionend",transitionEndListener);
    addClass(brickInput,"transition");
    if(e.type === "blur") {
      if (value === '') {
        hideLabel(brickInput);
        //input.setAttribute("placeholder",placeholder);
      } else {
        showLabel(brickInput);
        addClass(brickInput, "unhighlight-label");
      }
    } else if(e.type === "focus") {
      showLabel(brickInput);
      //input.removeAttribute("placeholder");
      removeClass(brickInput, "unhighlight-label");
    }
  }

  BrickInputElementPrototype.createdCallback = function () {


  };

  BrickInputElementPrototype.attachedCallback = function () {
    // todo: use template and shadow dom
    var labelText = this.label;
    var inputName = this.name;

    // create the input
    this.inputElement = document.createElement("input");
    this.inputElement.name = inputName;
    this.inputElement.id = "brick-input-" + inputName;

    // create the label
    this.labelElement = document.createElement("label");
    this.labelElement.innerHTML = labelText;
    this.labelElement.setAttribute("for",this.inputElement.id);

    // create the error msg
    this.errorElement = document.createElement("div");
    this.errorElement.innerHTML = this.error;
    this.errorElement.className = "error";

    // float the label
    if (this.floating) {
      //this.inputElement.setAttribute("placeholder",labelText);
    }

    //append it all
    this.appendChild(this.labelElement);
    this.appendChild(this.inputElement);
    this.appendChild(this.errorElement);

    // EventListeners
    this.addEventListener("change", inputValueChanged);
    if (this.floating) {
      this.inputElement.addEventListener("blur", floatingLabelHandler);
      this.inputElement.addEventListener("focus", floatingLabelHandler);
    }

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
    'label': function (oldVal, newVal) {
      // todo change label
    },
    'name': function (oldVal, newVal) {
      // todo change name
    }
  };

  // Custom methods

  BrickInputElementPrototype.showError = function () {
    this.appendChild(this.errorElement);
  };
  BrickInputElementPrototype.hideError = function () {
    this.removeChild(this.errorElement);
  };

  // Property handlers

  Object.defineProperties(BrickInputElementPrototype, {
    'label': {
      get : function () {
        return this.getAttribute("label");
      },
      set : function (newVal) {
        this.setAttribute("label",newVal);
      }
    },
    'name': {
      get : function () {
        return this.getAttribute("name");
      },
      set : function (newVal) {
        this.setAttribute("name",newVal);
      }
    },
    'validate': {
      get : function () {
        return this.getAttribute("validate");
      },
      set : function (newVal) {
        this.setAttribute("validate",newVal);
      }
    },
    'error': {
      get : function () {
        return this.getAttribute("error");
      },
      set : function (newVal) {
        this.setAttribute("error",newVal);
      }
    },
    'floating': {
      get : function () {
        if (this.getAttribute("floating") !== null) {
          return true;
        } else {
          return false;
        }
      },
      set : function (newVal) {
        this.setAttribute("floating",newVal);
      }
    },
    'value': {
      get: function() {
        return this.inputElement.value;
      },
      set: function(newVal) {
        this.inputElement.value = newVal;
      }
    },
  });

  // Register the element

  window.BrickInputElement = document.registerElement('brick-input', {
    prototype: BrickInputElementPrototype
  });

})();
