/*
 * scrollable.js
 *
 * scrollable.js - it`s custom prototype for vanilla JavaScript object.
 * Read README.txt form more information and information about usege.
 *
 * Bogdan Danileichenko (@piter_grifer)
 */

Element.prototype.scrollable = function(settings) {
  // -- Polyfill for add/remove events listeners -- //
  function eventListener(action, element, type, func) {
    if (action == 'add') { // add event listener
      if (document.addEventListener) { // if it good browser 
      element.addEventListener(type, func);
      } else { // if it retardet IE8 or later
        element.attachEvent('on' + type, func);
      };
    } else if (action == "remove") { // remove event listener
        if (document.removeEventListener) {
        element.removeEventListener(type, func);
      } else {
        element.detachEvent('on' + type, func);
      };
    } else {
      console.error("Wrong usege of function \"eventListener\"");
    };
  };
  
  // -- Polyfill for get css-style -- //
  function getStyle(elem) {
    return window.getComputedStyle ? getComputedStyle(elem, "") : elem.currentStyle;
  };
  
  /* Pointer to object ("container" further) */
  var self = this;
  
  /* Function for detect type of device */
  function isMobile() {
    if (navigator.userAgent.match(/Android/ig) ||
        navigator.userAgent.match(/webOS/ig) ||
        navigator.userAgent.match(/iPhone/ig) ||
        navigator.userAgent.match(/iPod/ig) ||
        navigator.userAgent.match(/iPad/ig) ||
        navigator.userAgent.match(/Blackberry/ig)) { // true - if mobile device
      return true;  
    } else { // false - if desktop device
      return false;
    };
  };
  
  /* Main function of generation scroller */
  function generateScroller() {
    // -- Block with main variables -- //
    var scrollerClass = settings.scrollerClass;
    var arrows = settings.arrows;
    if (arrows == true) {
      var arrowsClass = settings.arrowsClass;
    };
    var sliderClass = settings.sliderClass;
    var sliderHeight = settings.sliderHeight;
    if (sliderHeight == "auto") {
      var sliderHeightMin = settings.sliderHeightMin;
    };
    var sliderShift = settings.sliderShift;
    var stepMultipler = settings.stepMultipler;
    if (settings.autoHide == true) {
      var scrollerOpacityActive = settings.scrollerOpacityActive;
      var scrollerOpacityPassive = settings.scrollerOpacityPassive;
      var scrollerOpacityHidden = settings.scrollerOpacityHidden;
    };
    var horizontalScrolling = settings.horizontalScrolling;
    if (horizontalScrolling == true) {
      var sliderWidth = sliderHeight;
    };
    
    // -- Set attribute "tabindex" at container (it do event "onfocus" available) -- //
    self.setAttribute('tabindex', '1');
    // -- Most of elements must have 'data-type' identifier -- //
    self.setAttribute('data-type', 'container');
    
    // -- Function of adding standart css propertys -- //
    function makeByStandart(element, parent, position, className) {
      parent.appendChild(element);
      if (className) {
        element.className = className;  
      };
      element.style.position = position;
      element.style.boxSizing = "border-box";
      element.style.WebkitBoxSizing = "border-box";
      element.style.MozBoxSizing = "border-box";
      element.style.MBoxSizing = "border-box";
      element.style.OBoxSizing = "border-box";
      element.style.padding = "0px";
      element.style.margin = "0px";
      element.style.borderWidth = "1px";
      element.style.overflow = "hidden";
    };
    
    // -- Wrap the whole content of the container in div "wrapper" -- //
    var content = self.innerHTML;
    self.innerHTML = "";
    var wrapper = document.createElement('div');
    makeByStandart(wrapper, self, "relative");
    wrapper.setAttribute('data-type', 'wrapper');
    wrapper.innerHTML = content;
    if (horizontalScrolling == true) {
      var wrappedContent = wrapper.children;
      var wrappedContentLength = wrappedContent.length;
      var contentMaxWidth = wrappedContent[0].offsetWidth;
      for (var wrapperCounter = 1; wrapperCounter < wrappedContentLength; wrapperCounter++) {
        if (wrappedContent[wrapperCounter].offsetWidth > contentMaxWidth) {
          contentMaxWidth = wrappedContent[wrapperCounter].offsetWidth;
        };
      };
      wrapper.style.width = contentMaxWidth + "px";
    };
    var selfPaddingTop = wrapper.getBoundingClientRect().top - self.getBoundingClientRect().top;
    var selfPaddingBottom = parseInt(getStyle(self).paddingBottom) + self.clientTop;
    
    // -- Function for creation vertical and horizontal scroll bars -- //
    function makeScroller(axis) {
      var scroller = document.createElement('div');
      makeByStandart(scroller, self, "absolute", scrollerClass);
      if (axis == "X") { // horizontal scroll bar
        scroller.setAttribute('data-type', 'scrollerX');
        var scrollersArray = document.querySelectorAll("." + scrollerClass);
        scroller.style.width = self.clientWidth - scrollersArray[0].offsetWidth + "px";
        scroller.style.height = scrollersArray[0].offsetWidth + "px";
        scroller.style.top = self.clientHeight - scroller.offsetHeight + "px";
        scroller.style.left = "0px";
      } else if (axis == "Y") { // vertical scroll bar
        scroller.setAttribute('data-type', 'scroller');
        if (horizontalScrolling == true) {
          scroller.style.height = self.clientHeight - scroller.offsetWidth + "px";  
        } else {
          scroller.style.height = self.clientHeight + "px";
          if (sliderShift == true) {
            console.log(parseInt(getStyle(self).paddingRight) + scroller.offsetWidth);
            self.style.paddingRight = parseInt(getStyle(self).paddingRight) + scroller.offsetWidth + "px";
          };
        };
        scroller.style.top = "0px";
        scroller.style.left = self.clientWidth - scroller.offsetWidth + "px";
      };
      scroller.style.zIndex = 5;
      return scroller;
    };
    
    // -- Create a vertical scroll bar -- //
    var scroller = makeScroller("Y");
    // -- Create a horizontal scroll bar -- //
    if (horizontalScrolling == true) var scrollerX = makeScroller("X");
    
    // -- Create a arrows -- //
    if (arrows == true) {
      var arrowUp = document.createElement('div');
      var arrowDown = document.createElement('div');
      arrowUp.setAttribute('data-type', 'arrowUp');
      arrowDown.setAttribute('data-type', 'arrowDown');
      var arrowsPack = [arrowUp, arrowDown];
      if (horizontalScrolling == true) {
        var arrowLeft = document.createElement('div');
        var arrowRight = document.createElement('div');
        arrowLeft.setAttribute('data-type', 'arrowLeft');
        arrowRight.setAttribute('data-type', 'arrowRight');
        arrowsPack.push(arrowLeft, arrowRight);
      };
      for (var arrowCounter = 0; arrowCounter < arrowsPack.length; arrowCounter++) {
        if (arrowCounter > 1) {
          makeByStandart(arrowsPack[arrowCounter], scrollerX, "absolute", arrowsClass);
        } else {
          makeByStandart(arrowsPack[arrowCounter], scroller, "absolute", arrowsClass);  
        };
        arrowsPack[arrowCounter].style.width = scroller.clientWidth + "px";
        arrowsPack[arrowCounter].style.height = scroller.clientWidth + "px";
      };
      arrowDown.style.top = scroller.clientHeight - arrowDown.offsetHeight + "px";
      var topEdge = arrowUp.offsetWidth;
      var sliderFieldHeight = scroller.clientHeight - (arrowUp.offsetHeight + arrowDown.offsetHeight);
      if (horizontalScrolling == true) {
        arrowRight.style.left = scrollerX.clientWidth - arrowRight.offsetWidth + "px";
        var leftEdge = arrowLeft.offsetWidth;
        var sliderFieldXWidth = scrollerX.clientWidth - (arrowLeft.offsetWidth + arrowRight.offsetWidth);
      };
    } else {
      var topEdge = 0;
      var sliderFieldHeight = scroller.clientHeight;
      if (horizontalScrolling == true) {
        var leftEdge = 0;
        var sliderFieldXWidth = scrollerX.clientWidth;
      }; 
    };
    
    // -- Function for creation a vertical and horizontal sliders -- //
    function createSlider(axis) {
      var slider = document.createElement('div');
      if (axis == "Y") { // slider for vertical scroller
        makeByStandart(slider, scroller, "absolute", sliderClass);
        slider.setAttribute('data-type', 'slider')
        slider.style.width = scroller.clientWidth + "px";
        if (sliderHeight == "auto") {
          var selfWrapperRatio = self.clientHeight / ((wrapper.offsetHeight + selfPaddingTop * 2) / 100);
          sliderHeight = sliderFieldHeight / 100 * selfWrapperRatio;
          if (sliderHeight < sliderHeightMin) {
            sliderHeight = sliderHeightMin;
          };
        };
        if (sliderHeight > sliderFieldHeight) {
          sliderHeight = sliderFieldHeight;
        };
        slider.style.height = sliderHeight + "px";
        slider.style.top = topEdge + "px";
      } else if (axis == "X") { // slider for horizontal scroller
        makeByStandart(slider, scrollerX, "absolute", sliderClass);
        slider.setAttribute('data-type', 'sliderX');
        slider.style.height = scrollerX.clientHeight + "px";
        if (sliderWidth == "auto") {
          var selfWrapperRatioX = self.clientWidth / (wrapper.offsetWidth / 100);
          sliderWidth = sliderFieldXWidth / 100 * selfWrapperRatioX;
          if (sliderWidth < sliderHeightMin) {
            sliderWidth == sliderHeightMin;
          }; 
        };
        if (sliderWidth > sliderFieldXWidth) {
          sliderWidth = sliderFieldXWidth;
        };
        slider.style.width = sliderWidth + "px";
        slider.style.left = leftEdge + "px";
      };
      return slider;
    };
    
    // -- Create a vertical slider -- //
    var slider = createSlider("Y");
    // -- Create a horizontal slider -- //
    if (horizontalScrolling == true) var sliderX = createSlider("X");
    
    
    // -- Adding effect of hideable scroll bar -- //
    if (settings.autoHide == true) {
      function adaptiveHide(element, value) {
        element.style.WebkitTransition = "opacity, 0.4s";
        element.style.transition = "opacity, 0.4s";
        element.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (value * 100) + ")\"";
        element.style.filter = "alpha(opacity=" + (value * 100) + ")";
        element.style.MozOpacity = value;
        element.style.KhtmlOpacity = value;
        element.style.opacity = value;
      };
      if (navigator.userAgent.match(/MSIE 8.0/ig)) {
        if (getStyle(scroller).backgroundColor == "transparent") {
          var parentBackground = getStyle(self).backgroundColor;
          if (parentBackground != "transparent") {
            scroller.style.backgroundColor = parentBackground;
          } else {
            scroller.style.backgroundColor = "white";
          };
        };
      };
      var hideBy = undefined;
      adaptiveHide(scroller, scrollerOpacityHidden);
      if (horizontalScrolling == true) adaptiveHide(scrollerX, scrollerOpacityHidden);
      self.onmouseenter = function(event) {
        adaptiveHide(scroller, scrollerOpacityPassive);
        if (horizontalScrolling == true) adaptiveHide(scrollerX, scrollerOpacityPassive);
      };
      self.onmouseleave = function(event) {
        adaptiveHide(scroller, scrollerOpacityHidden);
        if (horizontalScrolling == true) adaptiveHide(scrollerX, scrollerOpacityHidden);
        if (hideBy != undefined) {
          clearTimeout(hideBy);
        };
      };
      function autoHideOnEvents(axis) {
        if (hideBy != undefined) {
          clearTimeout(hideBy);
        };
        if (axis == "X") {
          adaptiveHide(scrollerX, scrollerOpacityActive);
        } else if (axis == "Y") {
          adaptiveHide(scroller, scrollerOpacityActive);
        };
        hideBy = setTimeout(function() {
          adaptiveHide(scroller, scrollerOpacityPassive);
        }, 1000);
        return hideBy;
      };
    };
    
    // -- Ratio factor formula for future calculation -- //
    var ratioFactor;
    if (horizontalScrolling == true) {
      ratioFactor = ((wrapper.offsetHeight + selfPaddingTop + selfPaddingBottom + scrollerX.offsetHeight) - self.offsetHeight) / (sliderFieldHeight - sliderHeight);  
    } else  {
      ratioFactor = ((wrapper.offsetHeight + selfPaddingTop + selfPaddingBottom) - self.offsetHeight) / (sliderFieldHeight - sliderHeight);
    };
    
    // -- Event "Drag'n Drop" for slider -- //
    slider.onmousedown = function(event) {
      event = event || window.event;
      
      var сorrectPick = event.clientY - slider.getBoundingClientRect().top;
      
      function sliderScroll(event) {
        var sliderCoordsOld = slider.getBoundingClientRect();
        var newTop = event.clientY - scroller.getBoundingClientRect().top - scroller.clientTop - сorrectPick;
        var bottomEdge = sliderFieldHeight - sliderHeight;
        if (arrows == true) {
          bottomEdge += arrowUp.offsetHeight;  
        };
        if (newTop <= topEdge) {
          newTop = topEdge;
        } else if (newTop >= bottomEdge) {
          newTop = bottomEdge;
        };
        slider.style.top = newTop + "px";
        var sliderCoordsNew = slider.getBoundingClientRect();
        var scrollSpeed = (sliderCoordsNew.top - sliderCoordsOld.top) * ratioFactor;
        var wrapperPositionOld = (wrapper.getBoundingClientRect().top - self.getBoundingClientRect().top) - selfPaddingTop;
        wrapper.style.top = wrapperPositionOld - scrollSpeed + "px";
        
        if (settings.autoHide == true) adaptiveHide(scroller, scrollerOpacityActive);
        
        document.onselectstart = function(event) {
          event = event || window.event;
          return false;
        };
      };
      
      sliderScroll(event);
      
      document.onmousemove = function(event) {
        event = event || window.event
        sliderScroll(event);
      };
      
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
        document.onselectstart = null;
        if (settings.autoHide == true) adaptiveHide(scroller, scrollerOpacityPassive);
      };
      
      return false;
    };
    
    // -- General function of scrolling action for mouse wheel, keyboard and virtual arrows -- //
    function scrollGeneric(event, scrollStep) {
      var oldWrapperTop = (wrapper.getBoundingClientRect().top - self.getBoundingClientRect().top) - selfPaddingTop;
      var newWrapperTop = oldWrapperTop - scrollStep;
      var newSliderTop = (newWrapperTop / ratioFactor) * -1;
      if (arrows == true) {
        newSliderTop += arrowUp.offsetHeight;
      };
      var bottomEdge = sliderFieldHeight - sliderHeight;
      if (arrows == true) {
        bottomEdge += arrowUp.offsetHeight;
      };
      if (newSliderTop < topEdge) {
        newSliderTop = topEdge;
        newWrapperTop = 0;
      } else if (newSliderTop > bottomEdge) {
        newSliderTop = bottomEdge;
        if (horizontalScrolling == true) {
          newWrapperTop = (wrapper.offsetHeight - self.offsetHeight + selfPaddingTop * 2 + scrollerX.offsetHeight) * -1;  
        } else {
          newWrapperTop = (wrapper.offsetHeight - self.offsetHeight + selfPaddingTop * 2) * -1;
        };
      };
      return {
        newSliderTop: newSliderTop,
        newWrapperTop: newWrapperTop
      };
    };
    
    // -- Event of scrolling by mouse wheel -- //
    if (settings.useWheelScroll == true) {
      // polyfill for event "onwheel"
      function onwheelFixer(elem, func) {
        if (elem.addEventListener) {
          if ('onwheel' in document) {
            // IE9+, FF17+, Ch31+
            elem.addEventListener("wheel", func);
          } else if ('onmousewheel' in document) {
            // old version of "onwheel"
            elem.addEventListener("mousewheel", func);
          } else {
            // Firefox < 17
            elem.addEventListener("MozMousePixelScroll", func);
          };
        } else { // IE8-
          elem.attachEvent("onmousewheel", func);
        };
      };
      // function of scrolling by mouse wheel
      function wheelScroll(event) {
        event = event || window.event;
        var delta = event.deltaY || event.detail || event.wheelDelta;
        var scrollStep;
        if (delta > 0) {
          scrollStep = stepMultipler;
        } else if (delta < 0) {
          scrollStep = stepMultipler * -1;
        };
        var result = scrollGeneric(event, scrollStep);
        if (settings.autoHide == true) autoHideOnEvents("Y");
        wrapper.style.top = result.newWrapperTop + "px";
        slider.style.top = result.newSliderTop + "px";
      };
      // set event listener
      onwheelFixer(self, wheelScroll);
    };
    
    // -- Event of scrolling by keyboard (wrap event "onkeyboard" in "onfocus" to avoid conflict with native scroller) -- //
    if (settings.useKeyboardScroll == true) {
      self.onfocus = function(event) {
        self.onkeydown = function(event) {
          event = event || window.event;
          
          function keyboardScroll(event, arrowBtnCode, pageBtnCode, positivity) {
            var scrollStep = 0;
            if (event.keyCode == arrowBtnCode) {
              scrollStep = stepMultipler * positivity;
            } else if (event.keyCode == pageBtnCode) {
              scrollStep = (self.clientHeight) * positivity;
            };
            var result = scrollGeneric(event, scrollStep);
            if (settings.autoHide == true) autoHideOnEvents("Y");
            wrapper.style.top = result.newWrapperTop + "px";
            slider.style.top = result.newSliderTop + "px";
          };
          
          // condition for bottons "Arrow up" and "Page Down"
          if (event.keyCode == 38 || event.keyCode == 33) {
            keyboardScroll(event, 38, 33, -1);
          };
          
          // condition for bottons "Arrow down" and "Page Up"
          if (event.keyCode == 40 || event.keyCode == 34) {
            keyboardScroll(event, 40, 34, 1);
          };
        };
      };
    };
    
    // -- Event of scrolling by text selection -- //
    if (settings.scrollBySelection == true) {
      self.onmousedown = function(event) {
        event = event || window.event;
        var target = event.target || event.srcElement;
        
        self.focus();
        
        function selectionScroll(event) {
          var scrollStep = 0;
          if (event.clientY < self.getBoundingClientRect().top) {
            scrollStep = stepMultipler * -1;
          } else if (event.clientY > self.getBoundingClientRect().bottom) {
            scrollStep = stepMultipler;
          };
          var result = scrollGeneric(event, scrollStep);
          wrapper.style.top = result.newWrapperTop + "px";
          slider.style.top = result.newSliderTop + "px";
        };
        
        selectionScroll(event);
        
        eventListener('add', document, 'mousemove', selectionScroll);
        eventListener('add', document, 'mouseup', function(event) {
          eventListener('remove', document, 'mousemove', selectionScroll);
        });
      };
    };
    
    // -- Event of scrolling by click on virtual arrows and empty scroller field (using delegation) -- //
    var loops = {
      looper: undefined,
      repeat: true 
    };
    scroller.onmousedown = function(event) {
      event = event || window.event;
      var target = event.target || event.srcElement;
      
      function mouseGeneric(positivity, type) {
        var scrollStep;
        if (type == "arrowUp" || type == "arrowDown") {
          scrollStep = stepMultipler * positivity;
        } else if (type == "scroller") {
          scrollStep = self.clientHeight * positivity;
        };
        var result = scrollGeneric(event, scrollStep);
        slider.style.top = result.newSliderTop + "px";
        wrapper.style.top = result.newWrapperTop + "px";
        if (settings.autoHide == true) autoHideOnEvents("Y");
      };
      
      function loopedMouseGeneric(positivity, type) {
        var looper = setTimeout(function() {
          function repeatAgain() {
            if (loops.repeat == true) {
              var repeater = setTimeout(function() {
                mouseGeneric(positivity, type);
                repeatAgain();
              }, 50);
            };
          };
          repeatAgain();
        }, 300);
        return loops = {
          looper: looper,
          repeat: true
        };
      };
      
      if (target.getAttribute('data-type') == "arrowUp") { // condition for click on vitrual arrow up
        mouseGeneric(-1, "arrowUp");
        loopedMouseGeneric(-1, "arrowUp");
      } else if (target.getAttribute('data-type') == "arrowDown") { // condition for click on virtual arrow down
        mouseGeneric(1, "arrowDown");
        loopedMouseGeneric(1, "arrowDown");
      } else if (target.getAttribute('data-type') == "scroller") { // condition for click on empty field of scroll bar
        if (event.clientY < slider.getBoundingClientRect().top) {
          mouseGeneric(-1, "scroller");
          loopedMouseGeneric(-1, "scroller");
        } else if (event.clientY > slider.getBoundingClientRect().bottom) {
          mouseGeneric(1, "scroller");
          loopedMouseGeneric(1, "scroller");
        };
      } else {
        return;
      };
    };
    // Stop scrolling function if it run
    scroller.onmouseup = function() {
      if (loops.looper != undefined) {
        clearTimeout(loops.looper);
        loops.repeat = false;
      };
    };
  };
  
  /* Check type of device */
  if(isMobile() == true) {
    self.style.overflowY = "scroll";
  } else {
    generateScroller();
  };
};