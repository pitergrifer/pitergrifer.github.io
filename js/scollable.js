/*
 * scrollable.js
 *
 * scrollable.js - it`s custom prototype for vanilla JavaScript object.
 * Read README.txt form more information and information about usege.
 *
 * Bogdan Danileichenko (@piter_grifer)
 */

Element.prototype.scrollable = function(settings) {
  /* Polyfill for add/remove events liseners */
  function eventListener(action, element, type, func) {
    if (action == 'add') {
      if (document.addEventListener) {
        element.addEventListener(type, func);
      } else {
        element.attachEvent('on' + type, func);
      };
    } else if (action == "remove") {
        if (document.removeEventListener) {
        element.removeEventListener(type, func);
      } else {
        element.detachEvent('on' + type, func);
      };
    } else {
      console.error("Wrong usege of function \"eventListener\"");
    };
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
    };
    if (settings.teleporter == true) {
      var teleporterClass = settings.teleporterClass;
      var teleporterTextToUp = settings.teleporterTextToUp;
      var teleporterTextGoBack = settings.teleporterTextGoBack;
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
      element.style.padding = "0";
      element.style.margin = "0";
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
    var selfPaddingTop = wrapper.getBoundingClientRect().top - self.getBoundingClientRect().top;
    
    // -- Create a scroll bar -- //
    var scroller = document.createElement('div');
    makeByStandart(scroller, self, "absolute", scrollerClass);
    scroller.setAttribute('data-type', 'scroller');
    scroller.style.height = self.clientHeight + "px";
    scroller.style.top = "0";
    scroller.style.left = self.clientWidth - scroller.offsetWidth + "px";
    scroller.style.zIndex = 5;
    if (sliderShift == true) {
      self.style.paddingRight = (self.clientWidth - wrapper.offsetWidth) / 2 + scroller.offsetWidth + "px";
    };
    
    // -- Create a arrows -- //
    if (arrows == true) {
      var arrowUp = document.createElement('div');
      var arrowDown = document.createElement('div');
      arrowUp.setAttribute('data-type', 'arrowUp');
      arrowDown.setAttribute('data-type', 'arrowDown');
      var arrowsPack = [arrowUp, arrowDown];
      for (var arrowCounter = 0; arrowCounter < arrowsPack.length; arrowCounter++) {
        makeByStandart(arrowsPack[arrowCounter], scroller, "absolute", arrowsClass);
        arrowsPack[arrowCounter].style.width = scroller.clientWidth + "px";
        arrowsPack[arrowCounter].style.height = scroller.clientWidth + "px";
      };
      arrowDown.style.top = scroller.clientHeight - arrowDown.offsetHeight + "px";
      var topEdge = arrowUp.offsetWidth;
      var sliderFieldHeight = scroller.clientHeight - (arrowUp.offsetHeight + arrowDown.offsetHeight);
    } else {
      var topEdge = 0;
      var sliderFieldHeight = scroller.clientHeight;
    };
    
    // -- Create a slider -- //
    var slider = document.createElement('div');
    makeByStandart(slider, scroller, "absolute", sliderClass);
    slider.setAttribute('data-type', 'slider');
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
    
    // -- Create a teleporter -- //
    if (settings.teleporter == true) {
      var teleporter = document.createElement('div');
      self.appendChild(teleporter);
      teleporter.setAttribute('data-type', 'teleporter');
      teleporter.className = "teleporter";
      teleporter.style.position = "absolute";
      teleporter.style.maxWidth = self.clientWidth - scroller.offsetWidth + "px";
      var teleporterText = document.createElement('span');
      teleporter.appendChild(teleporterText);
      teleporterText.setAttribute('data-type', 'teleporter');
      teleporterText.innerHTML = teleporterTextToUp;
      teleporterText.style.position = "relative";
      teleporter.style.display = "block";
      teleporterText.style.top = (teleporter.offsetHeight / 2) - (teleporterText.offsetHeight / 2) + "px";
      teleporter.style.display = "none";
      teleporterText.style.display = "block";
      teleporterText.style.textAlign = "center";
      
      var VZPosition = {
        oldWrapperPosition: 0,
        newWrapperPosition: 0,
        oldSliderPosition: topEdge,
        newSliderPosition: topEdge
      };
      
      // -- Special function for showing teleporter and get current position of visible zone -- //
      function checkVisibleZone(influence) {
        var prevWrapperPosition  = VZPosition.newWrapperPosition;
        var currentWrapperPosition = wrapper.getBoundingClientRect().top - self.getBoundingClientRect().top - selfPaddingTop;
        if (influence == true) {
          if (currentWrapperPosition * -1 >= self.clientHeight) {
            teleporter.style.display = "block";
            if (teleporterText.innerHTML == teleporterTextGoBack) {
              teleporterText.innerHTML = teleporterTextToUp;
            };
          } else if (currentWrapperPosition * -1 < self.clientHeight) {
            teleporter.style.display = "none";
          };
        };
        var prevSliderPosition = VZPosition.newSliderPosition;
        var currentSliderPosition;
        if (arrows == true) {
          currentSliderPosition = slider.getBoundingClientRect().top - (self.getBoundingClientRect().top + self.clientTop);
        } else {
          currentSliderPosition = slider.getBoundingClientRect().top - arrowUp.getBoundingClientRect().bottom;
        };
        return VZPosition = {
          oldWrapperPosition: prevWrapperPosition,
          newWrapperPosition: currentWrapperPosition,
          oldSliderPosition: prevSliderPosition,
          newSliderPosition: currentSliderPosition
        };
      };
    };
    // -- Adding effect of hideable scroll bar and teleporter -- //
    if (settings.autoHide == true) {
      function adaptiveHide(element, value) {
        element.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (value * 100) + ")\"";
        element.style.filter = "alpha(opacity=" + (value * 100) + ")";
        element.style.MozOpacity = value;
        element.style.KhtmlOpacity = value;
        element.style.opacity = value;
      };
      var hideBy = undefined;
      adaptiveHide(scroller, 0);
      if (teleporter) adaptiveHide(teleporter, 0);
      self.onmouseover = function(event) {
        event = event || window.event;
        var target = event.target || event.srcElement;
        adaptiveHide(scroller, scrollerOpacityPassive);
        if (teleporter) {
          adaptiveHide(teleporter, scrollerOpacityPassive);
          if (teleporter.contains(target) == true) {
            adaptiveHide(teleporter, scrollerOpacityActive);
          };
        };
      };
      self.onmouseout = function(event) {
        adaptiveHide(scroller, 0);
        if (teleporter) adaptiveHide(teleporter, 0);
        if (hideBy != undefined) {
          clearTimeout(hideBy);
        };
      };
      function autoHideOnEvents() {
        if (hideBy != undefined) {
          clearTimeout(hideBy);
        };
        adaptiveHide(scroller, scrollerOpacityActive);
        if (teleporter) adaptiveHide(teleporter, scrollerOpacityActive);
        hideBy = setTimeout(function() {
          adaptiveHide(scroller, scrollerOpacityPassive);
          if (teleporter) adaptiveHide(teleporter, scrollerOpacityPassive);
        }, 1000);
        return hideBy;
      };
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
        var ratioFactor = ((wrapper.offsetHeight + selfPaddingTop * 2) - self.offsetHeight) / (sliderFieldHeight - sliderHeight);
        var scrollSpeed = (sliderCoordsNew.top - sliderCoordsOld.top) * ratioFactor;
        var wrapperPositionOld = (wrapper.getBoundingClientRect().top - self.getBoundingClientRect().top) - selfPaddingTop;
        wrapper.style.top = wrapperPositionOld - scrollSpeed + "px";
        
        if (settings.autoHide == true) {
          adaptiveHide(scroller, scrollerOpacityActive);
          if (teleporter) adaptiveHide(teleporter, scrollerOpacityActive);
        };
        
        if (teleporter) checkVisibleZone(true);
      };
      
      sliderScroll(event);
      
      document.onselectstart = function() {
        return;
      };
      
      document.onmousemove = function(event) {
        event = event || window.event;
        sliderScroll(event);
      };
      
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
        document.onselectstart = null;
        if (settings.autoHide == true) {
          adaptiveHide(scroller, scrollerOpacityPassive);
          if (teleporter) adaptiveHide(teleporter, scrollerOpacityPassive);
        };
      };
      
      return false;
    };
    
    // -- General function of scrolling action for mouse wheel, keyboard and virtual arrows -- //
    function scrollGeneric(event, scrollStep) {
      var oldWrapperTop = (wrapper.getBoundingClientRect().top - self.getBoundingClientRect().top) - selfPaddingTop;
      var newWrapperTop = oldWrapperTop - scrollStep;
      var sliderFactor = ((wrapper.offsetHeight + selfPaddingTop * 2) - self.offsetHeight) / (sliderFieldHeight - sliderHeight);
      var newSliderTop = (newWrapperTop / sliderFactor) * -1;
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
        newWrapperTop = (wrapper.offsetHeight - self.offsetHeight + selfPaddingTop * 2) * -1;
      };
      return {
        newSliderTop: newSliderTop,
        newWrapperTop: newWrapperTop
      };
    };
    
    // -- Event of scrolling by mouse wheel -- // событие скроллинга посредством колесика мыши
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
        var scrollStep = delta * stepMultipler;
        var result = scrollGeneric(event, scrollStep);
        if (settings.autoHide == true) autoHideOnEvents();
        wrapper.style.top = result.newWrapperTop + "px";
        slider.style.top = result.newSliderTop + "px";
        if (teleporter) checkVisibleZone(true);
      };
      // set event listener
      onwheelFixer(self, wheelScroll);
    };
    
    // -- Event of scrolling by keyboard (wrap event "onkeyboard" in "onfocus" to avoid conflict with native scroller) -- //
    if (settings.useKeyboardScroll == true) {
      self.onfocus = function() {
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
            if (settings.autoHide == true) autoHideOnEvents();
            wrapper.style.top = result.newWrapperTop + "px";
            slider.style.top = result.newSliderTop + "px";
            if (teleporter) checkVisibleZone(true);
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
      self.onblur = function() {
        scroller.style.opacity = 0;
      };
    };
    
    // -- Event of scrolling by text selection -- //
    if (settings.scrollBySelection == true) {
      self.onmousedown = function(event) {
        event = event || window.event;
        var target = event.target || event.srcElement;
        
        self.focus();
        
        if (target.getAttribute('data-type') == 'teleporter' ||
          target.getAttribute('data-type') == 'scroller' ||
          target.getAttribute('data-type') == 'slider' ||
          target.getAttribute('data-type') == 'arrowUp' ||
          target.getAttribute('data-type') == 'arrowDown' ||
          teleporter.contains(target) == true 
        ) return;
        
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
          if (teleporter) checkVisibleZone(true);
        };
        
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
        var scrollStep = stepMultipler * positivity;
        if (type == "arrowUp" || type == "arrowDown") {
          scrollStep = stepMultipler * positivity;
        } else if (type == "scroller") {
          scrollStep = self.clientHeight * positivity;
        };
        var result = scrollGeneric(event, scrollStep);
        slider.style.top = result.newSliderTop + "px";
        wrapper.style.top = result.newWrapperTop + "px";
        if (settings.autoHide == true) autoHideOnEvents();
        if (teleporter) checkVisibleZone(true);
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
    // -- Stop scrolling function if it run -- //
    scroller.onmouseup = function() {
      if (loops.looper != undefined) {
        clearTimeout(loops.looper);
        loops.repeat = false;
      };
    };
    
    // -- Event of "teleportation" -- //
    if (settings.teleporter == true) {
      teleporter.onclick = function(event) {
        event = event || window.event;
        
        if (VZPosition.newWrapperPosition == 0) {
          wrapper.style.top = VZPosition.oldWrapperPosition + "px";
          slider.style.top = VZPosition.oldSliderPosition + "px";
          teleporterText.innerHTML = teleporterTextToUp;
        } else {
          wrapper.style.top = "0px";
          slider.style.top = topEdge + "px";
          teleporterText.innerHTML = teleporterTextGoBack;
        };
        
        checkVisibleZone(false);
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