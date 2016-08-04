/*
 * scrollable.js
 *
 * scrollable.js - it`s custom prototype for vanilla JavaScript object.
 * Read README.txt form more information and information about usege.
 *
 * Bogdan Danileichenko (@piter_grifer)
 */

Element.prototype.scrollable = function (settings) {
  // -- Polyfill for add/remove events listeners -- //
  function eventListener(action, element, type, func) {
    if (action === "add") { // add event listener
      if (document.addEventListener) { // if it good browser 
        element.addEventListener(type, func);
      } else { // if it retardet IE8 or later
        element.attachEvent("on" + type, func);
      }
    } else if (action === "remove") { // remove event listener
      if (document.removeEventListener) {
        element.removeEventListener(type, func);
      } else {
        element.detachEvent("on" + type, func);
      }
    }
  }
  
  // -- Polyfill for get css-style -- //
  function getStyle(elem) {
    return window.getComputedStyle ? getComputedStyle(elem, "") : elem.currentStyle;
  }
  
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
    }
  }
  
  /* Main function of generation scroller */
  function generateScroller() {
    // -- Function for set default option, if custom undefined -- //
    function setOption(cust, def) {
      if (cust === undefined) {
        return def;
      } else {
        return cust;
      }
    }
    
    // -- Block with main variables -- //
    var verticalScroller = setOption(settings.verticalScroller, true),
      horizontalScroller = setOption(settings.horizontalScroller, true),
      scrollerShift = setOption(settings.scrollerShift, true),
      arrows = setOption(settings.arrows, true),
      sliderClass = settings.sliderClass,
      sliderSize = setOption(settings.sliderSize, "auto"),
      sliderStarterSize = sliderSize,
      stepMultipler = setOption(settings.stepMultipler, 15),
      contentResize = setOption(settings.contentResize, false),
      autoHide = setOption(settings.autoHide, true),
      smoothlyScroll = setOption(settings.smoothlyScroll, false);
    
    // Set class for scroller and height for slider, if vertical (Y) scroller available
    if (verticalScroller === "auto" || verticalScroller === true) {
      var scrollerYClass = settings.scrollerYClass,
        sliderHeight = sliderSize,
        sliderStarterHeight = sliderHeight;
    }
    
    // Set class for scroller and width for slider, if horizontal (X) scroller available
    if (horizontalScroller === "auto" || horizontalScroller === true) {
      var scrollerXClass = settings.scrollerXClass,
        sliderWidth = sliderSize,
        sliderStarterWidth = sliderWidth;
    }
    
    // Set class for arrows fields and inset HTML-code in there of "chevrones" (yes, you can use Font Awesome), if arrows available
    if (arrows === true) {
      var arrowsClass = settings.arrowsClass,
        arrowChevron = settings.arrowChevron;
    }
    
    // Set minimal size for sliders, if sizes are "auto"
    if (sliderSize === "auto") {
      var sliderSizeMin = setOption(settings.sliderSizeMin, 15);
    }
    
    // Set states of "auto hide" effect, if it available
    if (autoHide === true) {
      var scrollerOpacityActive = setOption(settings.scrollerOpacityActive, 1),
        scrollerOpacityPassive = setOption(settings.scrollerOpacityPassive, 0.5),
        scrollerOpacityHidden = setOption(settings.scrollerOpacityHidden, 0.2);
    }
    
    // Set transition options, if effect of smooth scrolling are active 
    if (smoothlyScroll === true) {
      var smoothlyScrollOptions = setOption(settings.smoothlyScrollOptions, "0.3s top, 0.3s left");
    }
    
    // -- Function for detection <textarea> -- //
    function detectTextArea(elem) {
      if (elem.toString().match(/TextArea/ig)) {
        return true;
      } else {
        return false;
      }
    }
    
    // -- Detect <textarea> -- //
    var isTextArea = detectTextArea(self);
    
    // -- Function for detection textarea height by content -- //
    function textAreaHeight(textAreaSelect) {
      var textAreaStyle = textAreaSelect.style.height;
      textAreaSelect.style.height = "auto";
      textAreaSelect.setAttribute("rows", "1");
      var rowHeight = textAreaSelect.clientHeight;
      textAreaSelect.removeAttribute("rows");
      var oldBrowsersSucksBalls = textAreaSelect.scrollHeight;
      var rows = textAreaSelect.scrollHeight / rowHeight;
      textAreaSelect.style.height = textAreaStyle;
      return rows * rowHeight;
    }
    
    // -- Logic, if container is <textarea>...</textarea> -- //
    if (isTextArea === true) {
      var textAreaContainer = document.createElement("div"),
        textAreaID = self.getAttribute("id"),
        textAreaClass = self.getAttribute("class"),
        textAreaStyle = self.getAttribute("style");
      
      if (textAreaID != undefined) {
        textAreaContainer.setAttribute("id", textAreaID);
        self.removeAttribute("id");
      }
      if (textAreaClass != undefined) {
        textAreaContainer.setAttribute("class", textAreaClass);
        self.removeAttribute("class");
      }
      if (textAreaStyle != undefined) {
        textAreaContainer.setAttribute("style", textAreaStyle);
        self.removeAttribute("style");
      }
      
      document.body.insertBefore(textAreaContainer, self);
      textAreaContainer.appendChild(self);
      self.setAttribute("id", "text-area");
      
      self.style.border = "none";
      self.style.width = "100%";
      self.style.margin = "0";
      self.style.padding = "0";
      self.style.font = "inherit";
      self.style.resize = "none";
      self.style.overflow = "hidden";
      self.style.height = textAreaHeight(self) + "px";
      
      var textAreaBlock = self;
      self = textAreaContainer;
    }
    
    // -- Set attribute "tabindex" at container (it do event "onfocus" available) -- //
    self.setAttribute("tabindex", "99");
    // -- Some of elements must have 'data-type' identifier -- //
    self.setAttribute("data-type", "container");
    
    // -- Function of adding standart css propertys -- //
    function makeByStandart(element, parent, position, className) {
      parent.appendChild(element);
      if (className) {
        element.className = className;
      }
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
    }
    
    // -- Function for set effect of smoothly scrolling -- //
    function smoothly(action, element) {
      if (smoothlyScroll === true) {
        if (action === "set") {
          element.style.MozTransition = smoothlyScrollOptions;
          element.style.OTransition = smoothlyScrollOptions;
          element.style.WebkitTransition = smoothlyScrollOptions;
          element.style.transition = smoothlyScrollOptions;
        } else if (action === "remove") {
          element.style.MozTransition = "none";
          element.style.OTransition = "none";
          element.style.WebkitTransition = "none";
          element.style.transition = "none";
        }
      }
    }
    
    // -- Function for set wrapper width -- //
    function setWrapperWidth(wrapper) {
      var wrappedContent = wrapper.children,
        wrappedContentLength = wrappedContent.length,
        contentMaxWidth = wrappedContent[0].offsetWidth,
        wrapperCounter;
      for (wrapperCounter = 1; wrapperCounter < wrappedContentLength; wrapperCounter++) {
        if (wrappedContent[wrapperCounter].offsetWidth > contentMaxWidth) {
          contentMaxWidth = wrappedContent[wrapperCounter].offsetWidth;
        }
      }
      if (contentMaxWidth > wrapper.offsetWidth) {
        horizontalScroller = true;
        wrapper.style.width = contentMaxWidth + "px";
      } else if (horizontalScroller === "auto") {
        horizontalScroller = false;
      }
    }
    
    // -- Wrap the whole content of the container in div "wrapper" -- //
    var content = self.innerHTML;
    self.innerHTML = "";
    var wrapper = document.createElement("div");
    makeByStandart(wrapper, self, "relative");
    smoothly("set", wrapper);
    wrapper.setAttribute("data-type", "wrapper");
    wrapper.innerHTML = content;
    if (contentResize === true) {
      horizontalScroller = false;
    }
    if (horizontalScroller === "auto" || horizontalScroller === true) {
      setWrapperWidth(wrapper);
    }
    var wrapperHeight = wrapper.offsetHeight,
      wrapperWidth = wrapper.offsetWidth;
    
    if (isTextArea == true) {
      textAreaBlock = document.getElementById("text-area");
    };
    
    function updateHeights(textAreaSelect) {
      textAreaBlock.style.height = textAreaHeight(textAreaSelect) + "px";
      wrapper.style.height = textAreaHeight(textAreaSelect) + "px";
    }
    
    // -- Function for optional shrink content width -- //
    function fixContent() {
      var wrappedContent = wrapper.children,
        wrappedContentLength = wrappedContent.length,
        wrapperCounter;
      for (wrapperCounter = 1; wrapperCounter < wrappedContentLength; wrapperCounter++) {
        if (wrappedContent[wrapperCounter].offsetWidth > wrapper.offsetWidth) {
          wrappedContent[wrapperCounter].style.width = wrapper.offsetWidth + "px";
        }
      }
    }
    
    // -- Get borders of container for future calculations -- //
    var selfBorder = {
      top: parseFloat(getStyle(self).borderTopWidth),
      bottom: parseFloat(getStyle(self).borderBottomWidth),
      left: parseFloat(getStyle(self).borderLeftWidth),
      right: parseFloat(getStyle(self).borderRightWidth)
    };
    
    // -- Function for creation vertical and horizontal scrollbars -- //
    function makeScroller(axis) {
      var scroller = document.createElement("div");
      if (axis === "X") { // horizontal scroll bar
        makeByStandart(scroller, self, "absolute", scrollerXClass);
        scroller.setAttribute("data-type", "scrollerX");
        if (verticalScroller === true) {
          scroller.style.width = self.clientWidth - scrollerY.offsetWidth + "px";
        } else {
          scroller.style.width = self.clientWidth + "px";
          if (scrollerShift === true) {
            self.style.paddingBottom = parseFloat(getStyle(self).paddingRight) + scroller.offsetWidth + "px";
            if (isTextArea === true) {
              updateHeights(textAreaBlock);
            }
          }
        }
        scroller.style.top = self.clientHeight - scroller.offsetHeight + "px";
        scroller.style.left = "0px";
      } else if (axis === "Y") { // vertical scroll bar
        makeByStandart(scroller, self, "absolute", scrollerYClass);
        scroller.setAttribute("data-type", "scrollerY");
        if (horizontalScroller === true) {
          scroller.style.height = self.clientHeight - scroller.offsetWidth + "px";
        } else {
          scroller.style.height = self.clientHeight + "px";
          if (scrollerShift === true) {
            self.style.paddingRight = parseFloat(getStyle(self).paddingRight) + scroller.offsetWidth + "px";
            if (isTextArea === true) {
              updateHeights(textAreaBlock);
            }
          }
        }
        scroller.style.top = "0px";
        scroller.style.left = self.clientWidth - scroller.offsetWidth + "px";
      }
      if (navigator.userAgent.match(/MSIE/ig)) {
        if (getStyle(scroller).backgroundColor === "transparent") {
          var parentBackground = getStyle(self).backgroundColor;
          if (parentBackground !== "transparent") {
            scroller.style.backgroundColor = parentBackground;
          } else {
            scroller.style.backgroundColor = "white";
          }
        }
      }
      scroller.style.zIndex = 5;
      return scroller;
    }
    
    // -- Create a vertical scroll bar -- //
    if (verticalScroller === true) {
      var scrollerY = makeScroller("Y");
    }
    if (contentResize === true) {
      fixContent();
    }
    
    // -- Create a horizontal scroll bar -- //
    if (horizontalScroller === true) {
      var scrollerX = makeScroller("X");
    }
    
    /*
    // -- Create a arrows -- //
    if (arrows === true) {
      var arrowUp = document.createElement("div"),
        arrowDown = document.createElement("div"),
        arrowsPack = [arrowUp, arrowDown],
        chevronPack = [arrowChevron.top, arrowChevron.bottom],
        arrowCounter;
      if (horizontalScroller === true) {
        var arrowLeft = document.createElement("div"),
          arrowRight = document.createElement("div");
        arrowsPack.push(arrowLeft, arrowRight);
        chevronPack.push(arrowChevron.left, arrowChevron.right);
      }
      for (arrowCounter = 0; arrowCounter < arrowsPack.length; arrowCounter++) {
        if (arrowCounter > 1) {
          makeByStandart(arrowsPack[arrowCounter], scrollerX, "absolute", arrowsClass);
        } else {
          makeByStandart(arrowsPack[arrowCounter], scrollerY, "absolute", arrowsClass);
        }
        arrowsPack[arrowCounter].style.width = scrollerY.clientWidth + "px";
        arrowsPack[arrowCounter].style.height = scrollerY.clientWidth + "px";
        arrowsPack[arrowCounter].innerHTML = chevronPack[arrowCounter];
      }
      arrowDown.style.top = scrollerY.clientHeight - arrowDown.offsetHeight + "px";
      var topEdge = arrowUp.offsetWidth,
        sliderFieldHeight = scrollerY.clientHeight - (arrowUp.offsetHeight + arrowDown.offsetHeight);
      if (horizontalScroller === true) {
        arrowRight.style.left = scrollerX.clientWidth - arrowRight.offsetWidth + "px";
        var leftEdge = arrowLeft.offsetWidth,
          sliderFieldXWidth = scrollerX.clientWidth - (arrowLeft.offsetWidth + arrowRight.offsetWidth);
      }
    } else {
      var topEdge = 0,
        sliderFieldHeight = scrollerY.clientHeight;
      if (horizontalScroller === true) {
        var leftEdge = 0,
          sliderFieldXWidth = scrollerX.clientWidth;
      }
    }
    */
    
    // -- Create a arrows, if corresponding option activate and at least one of two scrollers are exist -- //
    if (arrows === true && ((verticalScroller === true) || (horizontalScroller === true))) {
      // create arrays for working with cycle 
      var arrowsPack = [],
        chevronPack = [],
        arrowSize;
      
      // set size for arrows, based on scrollers width or height
      if (verticalScroller === true) {
        arrowSize = scrollerY.clientWidth;
      } else if (horizontalScroller === true) {
        arrowSize = scrollerX.clientHeight;
      }
      
      // create "Up" and "Down" arrows and put it in array, if vertical scroller exist
      if (verticalScroller === true) {
        var arrowUp = document.createElement("div"),
          arrowDown = document.createElement("div");
        arrowsPack.push(arrowUp, arrowDown),
        chevronPack.push(arrowChevron.top, arrowChevron.bottom);
      }
      
      // create "Left" and "Right" arrows and put it in array, if horizontal scroller exist
      if (horizontalScroller === true) {
        var arrowLeft = document.createElement("div"),
          arrowRight = document.createElement("div");
        arrowsPack.push(arrowLeft, arrowRight);
        chevronPack.push(arrowChevron.left, arrowChevron.right);
      }
      
      // start cycle, for more compact code
      for (var arrowCounter = 0; arrowCounter < arrowsPack.length; arrowCounter++) {
        if (verticalScroller == true) { // setup "Up" and "Down" arrows by standart, if vertical scroller exist
          makeByStandart(arrowsPack[arrowCounter], scrollerY, "absolute", arrowsClass);
        }
        
        if (horizontalScroller == true) { // setup "Left" and "Right" arrows by standart, if horizontal scroller exist
          makeByStandart(arrowsPack[arrowCounter], scrollerX, "absolute", arrowsClass);
        }
        
        arrowsPack[arrowCounter].style.width = arrowSize + "px";
        arrowsPack[arrowCounter].style.height = arrowSize + "px";
        arrowsPack[arrowCounter].innerHTML = chevronPack[arrowCounter];
      }
      
      if (verticalScroller === true) {
        arrowDown.style.top = scrollerY.clientHeight - arrowDown.offsetHeight + "px";
        var topEdge = arrowUp.offsetWidth,
          sliderFieldHeight = scrollerY.clientHeight - (arrowUp.offsetHeight + arrowDown.offsetHeight); 
      }
      
      if (horizontalScroller === true) {
        arrowRight.style.left = scrollerX.clientWidth - arrowRight.offsetWidth + "px";
        var leftEdge = arrowLeft.offsetWidth,
          sliderFieldXWidth = scrollerX.clientWidth - (arrowLeft.offsetWidth + arrowRight.offsetWidth);
      }
    } else {
      if (verticalScroller === true) {
        var topEdge = 0,
          sliderFieldHeight = scrollerY.clientHeight;  
      }
      
      if (horizontalScroller === true) {
        var leftEdge = 0,
          sliderFieldXWidth = scrollerX.clientWidth;
      }
    }
    
    // -- Get paddings of container -- //
    var selfPadding = {
      top: parseFloat(getStyle(self).paddingTop),
      bottom: parseFloat(getStyle(self).paddingBottom),
      left: parseFloat(getStyle(self).paddingLeft),
      right: parseFloat(getStyle(self).paddingRight)
    };
    
    // -- Function for calculate height or width for sliders  -- //
    function updateSliderHW(axis) {
      if (axis === "Y") {
        if (sliderStarterHeight === "auto") {
          var selfWrapperRatio;
          if (horizontalScroller === true) {
            if (scrollerShift === true) {
              selfWrapperRatio = self.clientHeight / ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom + scrollerX.offsetHeight) / 100);
            } else {
              selfWrapperRatio = self.clientHeight / ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom) / 100);
            }
          } else {
            selfWrapperRatio = self.clientHeight / ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom) / 100);
          }
          sliderSize = Math.round(sliderFieldHeight / 100 * selfWrapperRatio);
          if (sliderSize < sliderSizeMin) {
            sliderSize = sliderSizeMin;
          }
        }
        if (sliderSize >= sliderFieldHeight) {
          sliderSize = 0;
        }
        slider.style.height = sliderSize + "px";
      } else if (axis === "X") {
        if (sliderStarterWidth === "auto") {
          var selfWrapperRatioX;
          if (scrollerShift === true) {
            selfWrapperRatioX = self.clientWidth / ((wrapper.offsetWidth + selfPadding.left + selfPadding.right + scrollerY.offsetWidth) / 100);
          } else {
            selfWrapperRatioX = self.clientWidth / ((wrapper.offsetWidth + selfPadding.left + selfPadding.right) / 100);
          }
          sliderWidth = Math.round(sliderFieldXWidth / 100 * selfWrapperRatioX);
          if (sliderWidth < sliderSizeMin) {
            sliderWidth = sliderSizeMin;
          }
        }
        if (sliderWidth >= sliderFieldXWidth) {
          sliderWidth = 0;
        }
        sliderX.style.width = sliderWidth + "px";
      }
    }
    
    // -- Function for creation a vertical and horizontal sliders -- //
    function createSlider(axis) {
      var slider = document.createElement("div");
      if (axis === "Y") { // slider for vertical scroller
        makeByStandart(slider, scrollerY, "absolute", sliderClass);
        slider.setAttribute("data-type", "slider");
        slider.style.width = scrollerY.clientWidth + "px";
        slider.style.top = topEdge + "px";
      } else if (axis === "X") { // slider for horizontal scroller
        makeByStandart(slider, scrollerX, "absolute", sliderClass);
        slider.setAttribute("data-type", "sliderX");
        slider.style.height = scrollerX.clientHeight + "px";
        slider.style.left = leftEdge + "px";
      }
      smoothly("set", slider);
      return slider;
    }
    
    // -- Create a vertical slider -- //
    var slider = createSlider("Y");
    updateSliderHW("Y");
    
    // -- Create a horizontal slider -- //
    if (horizontalScroller === true) {
      var sliderX = createSlider("X");
      updateSliderHW("X");
    }
    
    // -- Creatr plug in hole between scrollers -- //
    if ((horizontalScroller === true) && (verticalScroller === true)) {
      var plug = document.createElement("div"),
        selfCoords = self.getBoundingClientRect();
      self.appendChild(plug);
      plug.style.position = "absolute";
      plug.style.top = scrollerY.getBoundingClientRect().bottom - selfCoords.top - self.clientTop + "px";
      plug.style.left = scrollerX.getBoundingClientRect().right - selfCoords.left - self.clientLeft + "px";
      plug.style.width = selfCoords.bottom - selfBorder.bottom - scrollerY.getBoundingClientRect().bottom + "px";
      plug.style.height = selfCoords.right - selfBorder.right - scrollerX.getBoundingClientRect().right + "px";
      plug.style.backgroundColor = getStyle(scrollerY).backgroundColor;
    }
    
    // -- Adding effect of hideable scroll bar -- //
    if (autoHide === true) {
      function adaptiveHide(element, value) {
        element.style.MozTransition = "opacity, 0.4s";
        element.style.OTransition = "opacity, 0.4s";
        element.style.WebkitTransition = "opacity, 0.4s";
        element.style.transition = "opacity, 0.4s";
        element.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (value * 100) + ")\"";
        element.style.filter = "alpha(opacity=" + (value * 100) + ")";
        element.style.MozOpacity = value;
        element.style.KhtmlOpacity = value;
        element.style.opacity = value;
      }
      var hideBy,
        hideByX;
      adaptiveHide(scrollerY, scrollerOpacityHidden);
      if (horizontalScroller === true) {
        adaptiveHide(scrollerX, scrollerOpacityHidden);
        adaptiveHide(plug, scrollerOpacityHidden);
      }
      var mousePosition = "unknown";
      self.onmouseenter = function (event) {
        adaptiveHide(scrollerY, scrollerOpacityPassive);
        if (horizontalScroller === true) {
          adaptiveHide(scrollerX, scrollerOpacityPassive);
          adaptiveHide(plug, scrollerOpacityPassive);
        }
        mousePosition = "inside";
      };
      self.onmouseleave = function (event) {
        adaptiveHide(scrollerY, scrollerOpacityHidden);
        if (horizontalScroller === true) {
          adaptiveHide(scrollerX, scrollerOpacityHidden);
          adaptiveHide(plug, scrollerOpacityHidden);
        }
        if (hideBy != undefined) {
          clearTimeout(hideBy);
        }
        mousePosition = "outside";
      };
      function autoHideOnEvents(axis) {
        if (axis === "X") {
          if (hideByX != undefined) {
            clearTimeout(hideByX);
          }
          adaptiveHide(scrollerX, scrollerOpacityActive);
          adaptiveHide(plug, scrollerOpacityActive);
          hideByX = setTimeout(function () {
            if (mousePosition === "inside") {
              adaptiveHide(scrollerX, scrollerOpacityPassive);
              adaptiveHide(plug, scrollerOpacityPassive);
            } else if (mousePosition === "outside") {
              adaptiveHide(scrollerX, scrollerOpacityHidden);
              adaptiveHide(plug, scrollerOpacityHidden);
            }
          }, 1000);
        } else if (axis === "Y") {
          if (hideBy != undefined) {
            clearTimeout(hideBy);
          }
          adaptiveHide(scrollerY, scrollerOpacityActive);
          if (horizontalScroller === true) {
            adaptiveHide(plug, scrollerOpacityActive);
          }
          hideBy = setTimeout(function () {
            if (mousePosition === "inside") {
              adaptiveHide(scrollerY, scrollerOpacityPassive);
              if (horizontalScroller === true) {
                adaptiveHide(plug, scrollerOpacityPassive);
              }
            } else if (mousePosition === "outside") {
              adaptiveHide(scrollerY, scrollerOpacityHidden);
              if (horizontalScroller === true) {
                adaptiveHide(plug, scrollerOpacityHidden);
              }
            }
          }, 1000);
        }
      }
    }
    
    // -- Ratio factor calculation results -- //
    var ratioFactor = {
      vertical: 0,
      horizontal: 0
    };
    
    // -- Ratio factor formula for future calculation -- //
    function calcRatioFactor() {
      if (horizontalScroller === true) {
        if (scrollerShift === true) {
          ratioFactor.vertical = ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom + scrollerX.offsetHeight) - (self.offsetHeight - selfBorder.top - selfBorder.bottom)) / (sliderFieldHeight - sliderSize);
          ratioFactor.horizontal = ((wrapper.offsetWidth + selfPadding.left + selfPadding.right + scrollerY.offsetWidth) - (self.offsetWidth - selfBorder.left - selfBorder.right)) / (sliderFieldXWidth - sliderWidth);
        } else {
          ratioFactor.vertical = ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom) - (self.offsetHeight - selfBorder.top - selfBorder.bottom)) / (sliderFieldHeight - sliderSize);
          ratioFactor.horizontal = ((wrapper.offsetWidth + selfPadding.left + selfPadding.right) - (self.offsetWidth - selfBorder.left - selfBorder.right)) / (sliderFieldXWidth - sliderWidth);
        }
      } else {
        ratioFactor.vertical = ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom) - (self.offsetHeight - selfBorder.top - selfBorder.bottom)) / (sliderFieldHeight - sliderSize);
      }
    }
    
    calcRatioFactor();
    
    function checkSliderPosition(axis) {
      if (axis === "Y") {
        var checkedSliderTop = ((wrapper.getBoundingClientRect().top - (self.getBoundingClientRect().top + self.clientTop + selfPadding.top)) / ratioFactor.vertical) * -1;
        if (arrows === true) {
          checkedSliderTop += arrowUp.offsetHeight;
        }
        slider.style.top = checkedSliderTop + "px";
      } else if (axis === "X") {
        var checkedSliderXLeft = (parseFloat(getStyle(wrapper).left) / ratioFactor.horizontal) * -1;
        if (arrows === true) {
          checkedSliderXLeft += arrowLeft.offsetWidth;
        }
        sliderX.style.left = checkedSliderXLeft + "px";
      }
    }
    
    // -- Function for autoconfiguration scrollbars if content is dynamic (infinity scroll, for example) -- //
    function checkContentSize() {
      var timerContent = setTimeout(function () {
        if (wrapper.offsetHeight !== wrapperHeight) {
          wrapperHeight = wrapper.offsetHeight;
          updateSliderHW("Y");
          calcRatioFactor();
          checkSliderPosition("Y");
        }
        if (contentResize === true) {
          fixContent();
        }
        if (horizontalScroller === "auto" || horizontalScroller === true) {
          setWrapperWidth(wrapper);
          horizontalScroller = true;
          if (wrapper.offsetWidth !== wrapperWidth) {
            wrapperWidth = wrapper.offsetWidth;
            updateSliderHW("X");
            calcRatioFactor();
            checkSliderPosition("X");
          }
        }
        if (isTextArea !== true) {
          checkContentSize();
        }
      }, 4);
    }
    
    if (settings.dynamicContent === true) {
      checkContentSize();
    }
    
    if (isTextArea === true) {
      function updateTextAreaContent() {
        updateHeights(textAreaBlock);
        updateSliderHW("Y");
        checkSliderPosition("Y");
        calcRatioFactor();
      }
      
      function isControllKey(event) {
        if ((event.altKey == true) ||
            (event.keyCode == 33) ||
            (event.keyCode == 34) ||
            (event.keyCode == 35) ||
            (event.keyCode == 36) ||
            (event.keyCode == 37) ||
            (event.keyCode == 39) ||
            (event.keyCode == 38) ||
            (event.keyCode == 40)) {
          return true;
        } else {
          return false;
        }
      }
      
      function preventNativeScroll() {
        self.scrollTop = 0;
      }
      
      var activeNavigation = false;
      
      var textAreaTimers = {
        start: undefined,
        run: false,
        end: undefined
      };
      
      textAreaBlock.onfocus = function () {
        activeNavigation = false;
      }
      
      eventListener("add", textAreaBlock, "keydown", function (event) {
        event = event || window.event;
        
        self.onscroll = preventNativeScroll;
        
        if (event.altKey === true) {
          activeNavigation = true;
        }
        
        if ((textAreaTimers.start === undefined) && (isControllKey(event) === false)) {
          if (textAreaTimers.run === true) {
            clearTimeout(textAreaTimers.end);
            textAreaTimers.end = undefined;
            textAreaTimers.run = false;
          }
          textAreaTimers.start = setInterval(function () {
            updateTextAreaContent();
          }, 20);
        }
      });
      
      eventListener("add", textAreaBlock, "keyup", function (event) {
        event = event || window.event;
        
        if (event.keyCode === 18) {
          activeNavigation = false;
        }
        
        if (textAreaTimers.end === undefined) {
          textAreaTimers.end = setTimeout(function () {
            clearInterval(textAreaTimers.start);
            textAreaTimers.start = undefined;
            textAreaTimers.end = undefined;
            textAreaTimers.run = false;
          }, 1000);
        }
        textAreaTimers.run = true;
      });
    }
    
    // -- Object for detection picked slider -- //
    var sliderPick = {
      slider: false,
      sliderX: false,
      wrapperY: 0,
      wrapperX: 0
    };
    
    // -- Generic function for vertical and horozontal sliders -- //
    function genericSlidersEvent(event, axis, sliderMainFunction) {
      function cancelSelection(event) {
        event = event || window.event;
        return false;
      }
      eventListener("add", document, "selectstart", cancelSelection);
      eventListener("add", document, "mousemove", sliderMainFunction);
      function clearEvent() {
        eventListener("remove", document, "mousemove", sliderMainFunction);
        eventListener("remove", document, "selectstart", cancelSelection);
        eventListener("remove", document, "mouseup", clearEvent);
        if (autoHide === true) {
          if (mousePosition === "inside") {
            if (axis === "X") {
              adaptiveHide(scrollerX, scrollerOpacityPassive);
              adaptiveHide(plug, scrollerOpacityPassive);
            } else if (axis === "Y") {
              adaptiveHide(scrollerY, scrollerOpacityPassive);
              if (horizontalScroller === true) {
                adaptiveHide(plug, scrollerOpacityPassive);
              }
            }
          } else if (mousePosition === "outside") {
            if (axis === "X") {
              adaptiveHide(scrollerX, scrollerOpacityHidden);
              adaptiveHide(plug, scrollerOpacityHidden);
            } else if (axis === "Y") {
              adaptiveHide(scrollerY, scrollerOpacityHidden);
              if (horizontalScroller === true) {
                adaptiveHide(plug, scrollerOpacityHidden);
              }
            }
          }
        }
        if (axis === "X") {
          sliderPick.sliderX = false;
          smoothly("set", sliderX);
        } else if (axis === "Y") {
          sliderPick.slider = false;
          smoothly("set", slider);
        }
        smoothly("set", wrapper);
      }
      eventListener("add", document, "mouseup", clearEvent);
    }
    
    // -- Event "Drag'n Drop" for vertical slider -- //
    slider.onmousedown = function (event) {
      event = event || window.event;
      smoothly("remove", wrapper);
      smoothly("remove", slider);
      var сorrectPick = event.clientY - slider.getBoundingClientRect().top;
      function sliderScroll(event) {
        var sliderCoordsOld = slider.getBoundingClientRect(),
          newTop = event.clientY - scrollerY.getBoundingClientRect().top - scrollerY.clientTop - сorrectPick,
          bottomEdge = sliderFieldHeight - sliderSize;
        if (arrows === true) {
          bottomEdge += arrowDown.offsetHeight;  
        }
        if (newTop <= topEdge) {
          newTop = topEdge;
        } else if (newTop >= bottomEdge) {
          newTop = bottomEdge;
        }
        slider.style.top = newTop + "px";
        var sliderCoordsNew = slider.getBoundingClientRect(),
          scrollSpeed = (sliderCoordsNew.top - sliderCoordsOld.top) * ratioFactor.vertical;
        sliderPick.wrapperY -= scrollSpeed;
        wrapper.style.top = Math.round(sliderPick.wrapperY) + "px";
        if (autoHide === true) {
          adaptiveHide(scrollerY, scrollerOpacityActive);
          if (horizontalScroller === true) {
            adaptiveHide(plug, scrollerOpacityActive);
          }
        }
        return sliderPick = {
          slider: true,
          wrapperY: sliderPick.wrapperY,
          sliderX: false,
          wrapperX: sliderPick.wrapperX
        };
      }
      sliderScroll(event);
      genericSlidersEvent(event, "Y", sliderScroll);
      return false;
    };
    
    // -- Event "Drag'n Drop" for horizontal slider -- //
    if (horizontalScroller === true) {
      sliderX.onmousedown = function (event) {
        event = event || window.event;
        smoothly("remove", wrapper);
        smoothly("remove", sliderX);
        var correctPick = event.clientX - sliderX.getBoundingClientRect().left;
        function sliderXScroll(event) {
          var sliderXCoordsOld = sliderX.getBoundingClientRect(),
            newLeft = event.clientX - scrollerX.getBoundingClientRect().left - scrollerX.clientLeft - correctPick,
            rightEdge = sliderFieldXWidth - sliderWidth;
          if (arrows === true) {
            rightEdge += arrowRight.offsetWidth;
          }
          if (newLeft <= leftEdge) {
            newLeft = leftEdge;
          } else if (newLeft >= rightEdge) {
            newLeft = rightEdge;
          }
          sliderX.style.left = newLeft + "px";
          var sliderXCoordsNew = sliderX.getBoundingClientRect(),
            scrollXSpeed = (sliderXCoordsNew.left - sliderXCoordsOld.left) * ratioFactor.horizontal;
          sliderPick.wrapperX -= scrollXSpeed;
          wrapper.style.left = Math.round(sliderPick.wrapperX) + "px";
          if (autoHide === true) {
            adaptiveHide(scrollerX, scrollerOpacityActive);
            adaptiveHide(plug, scrollerOpacityActive);
          }
          return sliderPick = {
            sliderX: true,
            wrapperX: sliderPick.wrapperX,
            slider: false,
            wrapperY: sliderPick.wrapperY
          };
        }
        sliderXScroll(event);
        genericSlidersEvent(event, "X", sliderXScroll);
        return false;
      };
    }
    
    // -- General function of vertical scrolling action for mouse wheel, keyboard and virtual arrows -- //
    function scrollGeneric(event, scrollStep) {
      sliderPick.wrapperY -= scrollStep;
      var newSliderTop = (sliderPick.wrapperY / ratioFactor.vertical) * -1;
      if (arrows === true) {
        newSliderTop += arrowUp.offsetHeight;
      }
      var bottomEdge = sliderFieldHeight - sliderSize;
      if (arrows === true) {
        bottomEdge += arrowDown.offsetHeight;
      }
      if (newSliderTop < topEdge) {
        newSliderTop = topEdge;
        sliderPick.wrapperY = 0;
      } else if (newSliderTop > bottomEdge) {
        newSliderTop = bottomEdge;
        if (horizontalScroller === true) {
          if (scrollerShift === true) {
            sliderPick.wrapperY = (wrapper.offsetHeight - self.offsetHeight + selfPadding.top + selfBorder.top + selfPadding.bottom + selfBorder.bottom + scrollerX.offsetHeight) * -1;
          } else {
            sliderPick.wrapperY = (wrapper.offsetHeight - self.offsetHeight + selfPadding.top + selfBorder.top + selfPadding.bottom + selfBorder.bottom) * -1;
          }
        } else {
          sliderPick.wrapperY = (wrapper.offsetHeight - self.offsetHeight + selfPadding.top + selfBorder.top + selfPadding.bottom + selfBorder.bottom) * -1;
        }
      }
      return {
        newSliderTop: newSliderTop,
        newWrapperTop: sliderPick.wrapperY
      };
    }
    
    // -- General function of horizontal scrolling action for keyboard and virtual arrows -- //
    function scrollGenericX(event, scrollStep) {
      sliderPick.wrapperX -= scrollStep;
      var newSliderLeft = (sliderPick.wrapperX / ratioFactor.horizontal) * -1;
      if (arrows === true) {
        newSliderLeft += arrowLeft.offsetWidth;
      }
      var rightEdge = sliderFieldXWidth - sliderWidth;
      if (arrows === true) {
        rightEdge += arrowRight.offsetWidth;
      }
      if (newSliderLeft < leftEdge) {
        newSliderLeft = leftEdge;
        sliderPick.wrapperX = 0;
      } else if (newSliderLeft > rightEdge) {
        newSliderLeft = rightEdge;
        if (scrollerShift === true) {
          sliderPick.wrapperX = (wrapper.offsetWidth - self.offsetWidth + selfPadding.left + selfBorder.left + selfPadding.right + selfBorder.right + scrollerY.offsetWidth) * -1;
        } else {
          sliderPick.wrapperX = (wrapper.offsetWidth - self.offsetWidth + selfPadding.left + selfBorder.left + selfPadding.right + selfBorder.right) * -1;
        }
      }
      return {
        newSliderLeft: newSliderLeft,
        newWrapperLeft: sliderPick.wrapperX
      };
    }
    
    // -- Event of scrolling by mouse wheel -- //
    if (settings.useWheelScroll === true) {
      // polyfill for event "onwheel"
      function onwheelFixer(elem, func) {
        if (elem.addEventListener) {
          if ("onwheel" in document) {
            // IE9+, FF17+, Ch31+
            elem.addEventListener("wheel", func);
          } else if ("onmousewheel" in document) {
            // old version of "onwheel"
            elem.addEventListener("mousewheel", func);
          } else {
            // Firefox < 17
            elem.addEventListener("MozMousePixelScroll", func);
          }
        } else { // IE8-
          elem.attachEvent("onmousewheel", func);
        }
      }
      // function of scrolling by mouse wheel
      function wheelScroll(event) {
        event = event || window.event;
        var delta = event.deltaY || event.detail || (event.wheelDelta * -1),
          scrollStep;
        if (delta > 0) {
          scrollStep = stepMultipler;
        } else if (delta < 0) {
          scrollStep = stepMultipler * -1;
        }
        var result = scrollGeneric(event, scrollStep);
        if (autoHide === true) {
          autoHideOnEvents("Y");
        }
        wrapper.style.top = result.newWrapperTop + "px";
        slider.style.top = result.newSliderTop + "px";
      }
      // set event listener
      onwheelFixer(self, wheelScroll);
    };
    
    // -- Function, which return transition duration in ms -- //
    function getTransitionDurationMs() {
      var durationInSeconds = parseFloat(wrapper.style.transitionDuration) ||
        parseFloat(wrapper.style.WebkitTransitionDuration) ||
        parseFloat(wrapper.style.MozTransitionDuration) ||
        parseFloat(wrapper.style.OTransitionDuration);
      return durationInSeconds * 1000;
    }
    
    if (smoothlyScroll === true) {
      var transitionDuration = getTransitionDurationMs(),
        removeSmoothTimer = "empty";
    }
    
    function smoothActionPack(action) {
      if (action === "set") {
        smoothly("set", slider);
        if (horizontalScroller === true) {
          smoothly("set", sliderX);
        }
        smoothly("set", wrapper);
      } else if (action === "remove") {
        smoothly("remove", slider);
        if (horizontalScroller === true) {
          smoothly("remove", sliderX);
        }
        smoothly("remove", wrapper);
      }
    }
    
    // -- Event of scrolling by keyboard (wrap event "onkey..." in "onfocus" to avoid conflict with native scroller) -- //
    if (settings.useKeyboardScroll === true) {
      self.onfocus = function (event) {
        activeNavigation = true;
        
        self.onkeydown = function (event) {
          event = event || window.event;
          
          function freezTransition(axis) {
            if (smoothlyScroll === true) {
              if (removeSmoothTimer === "empty") {
                removeSmoothTimer = setTimeout(function() {
                  if (axis === "Y") {
                    smoothly("remove", slider);  
                  } else if (axis == "X") {
                    smoothly("remove", sliderX);
                  }
                  smoothly("remove", wrapper);
                }, transitionDuration);
              }
            }
          }
          
          // -- Vertical scrolling -- //
          function keyboardScroll(event, arrowBtnCode, pageBtnCode, positivity) {
            var scrollStep = 0;
            if (event.keyCode === arrowBtnCode) {
              scrollStep = stepMultipler * positivity;
              freezTransition("Y");
            } else if (event.keyCode === pageBtnCode) {
              if (horizontalScroller === true) {
                scrollStep = (self.clientHeight - scrollerX.offsetHeight) * positivity;
              } else {
                scrollStep = (self.clientHeight) * positivity;
              }
            }
            var result = scrollGeneric(event, scrollStep);
            if (autoHide === true) {
              autoHideOnEvents("Y");
            }
            slider.style.top = result.newSliderTop + "px";
            wrapper.style.top = result.newWrapperTop + "px";
          }
          // condition for bottons "Arrow up" and "Page Up"
          if ((event.keyCode == 38 || event.keyCode == 33) && (sliderSize > 0)) {
            if ((isTextArea == true) && (activeNavigation == true)) {
              keyboardScroll(event, 38, 33, -1);
            } else if (isTextArea == false) {
              keyboardScroll(event, 38, 33, -1);
            }
          }
          // condition for bottons "Arrow down" and "Page Down"
          if ((event.keyCode == 40 || event.keyCode == 34) && (sliderSize > 0)) {
            if ((isTextArea == true) && (activeNavigation == true)) {
              keyboardScroll(event, 40, 34, 1);
            } else if (isTextArea == false) {
              keyboardScroll(event, 40, 34, 1);
            }
          }
          
          // -- Horizontal scrolling -- //
          if (horizontalScroller === true) {
            function keyboardScrollX(event, arrowBtnCode, pageBtnCode, positivity) {
              var scrollStep = 0;
              if (event.keyCode === arrowBtnCode) {
                scrollStep = stepMultipler * positivity;
                freezTransition("X");
              } else if (event.keyCode === pageBtnCode) {
                scrollStep = (self.clientWidth - scrollerY.offsetWidth) * positivity;
              }
              var result = scrollGenericX(event, scrollStep);
              if (autoHide === true) {
                autoHideOnEvents("X");
              }
              sliderX.style.left = result.newSliderLeft + "px";
              wrapper.style.left = result.newWrapperLeft + "px";
            }
            // condition for bottons "Arrow left" and "Home"
            if ((event.keyCode == 37 || event.keyCode == 36) && (sliderWidth > 0)) {
              if ((isTextArea == true) && (activeNavigation == true)) {
                keyboardScrollX(event, 37, 36, -1);
              } else if (isTextArea == false) {
                keyboardScrollX(event, 37, 36, -1);
              }
            }
            // condition for bottons "Arrow right" and "End"
            if ((event.keyCode == 39 || event.keyCode == 35) && (sliderWidth > 0)) {
              if ((isTextArea == true) && (activeNavigation == true)) {
                keyboardScrollX(event, 39, 35, 1);
              } else if (isTextArea == false) {
                keyboardScrollX(event, 39, 35, 1);
              }
            }
          }
          
          if (smoothlyScroll === true) {
            self.onkeyup = function () {
              clearTimeout(removeSmoothTimer);
              removeSmoothTimer = "empty";
              smoothActionPack("set");
            };
          }
        };
      };
    }
    
    // -- Event of scrolling by text selection -- //
    if (settings.scrollBySelection === true) {
      self.onmousedown = function (event) {
        event = event || window.event;
        var target = event.target || event.srcElement;
        self.focus();
        if (horizontalScroller === true) {
          if (scrollerY.contains(target) || scrollerX.contains(target)) {
            return;
          }
          if (sliderPick.slider != false || sliderPick.sliderX != false) {
            return;
          }
        } else {
          if (scrollerY.contains(target)) {
            return;
          }
          if (sliderPick.slider != false) {
            return; 
          }
        }
        smoothActionPack("remove");
        
        // -- Vertical scrolling -- //
        function selectionScroll(event) {
          var scrollStep = 0;
          if (event.clientY < self.getBoundingClientRect().top) {
            scrollStep = stepMultipler * -1;
          } else if (event.clientY > self.getBoundingClientRect().bottom) {
            scrollStep = stepMultipler;
          }
          var result = scrollGeneric(event, scrollStep);
          wrapper.style.top = result.newWrapperTop + "px";
          slider.style.top = result.newSliderTop + "px";
        }
        selectionScroll(event);
        eventListener("add", document, "mousemove", selectionScroll);
        eventListener("add", document, "mouseup", function(event) {
          eventListener("remove", document, "mousemove", selectionScroll);
          smoothActionPack("set");
        });
        
        // -- Horizontal scrolling -- //
        if (horizontalScroller === true) {
          function selectionScrollX(event) {
            var scrollStep = 0;
            if (event.clientX < self.getBoundingClientRect().left) {
              scrollStep = stepMultipler * -1;
            } else if (event.clientX > self.getBoundingClientRect().right) {
              scrollStep = stepMultipler;
            };
            var result = scrollGenericX(event, scrollStep);
            wrapper.style.left = result.newWrapperLeft + "px";
            sliderX.style.left = result.newSliderLeft + "px";
          }
          selectionScrollX(event);
          eventListener("add", document, "mousemove", selectionScrollX);
          eventListener("add", document, "mouseup", function(event) {
            eventListener("remove", document, "mousemove", selectionScrollX);
            smoothActionPack("set");
          });
        }
      };
    }
    
    // -- Event of scrolling by click on virtual arrows and empty scroller field (using delegation) -- //
    var loops = {
      looper: undefined,
      repeat: true 
    };
    function virtualScrolling(event) {
      event = event || window.event;
      var target = event.target || event.srcElement;
      
      // -- Function for vertical scrolling -- //
      function mouseGeneric(positivity, type) {
        var scrollStep;
        if (type === "Arrow") {
          scrollStep = stepMultipler * positivity;
        } else if (type === "Scroller") {
          if (horizontalScroller === true) {
            scrollStep = (self.clientHeight - scrollerX.offsetHeight) * positivity;
          } else {
            scrollStep = self.clientHeight * positivity;
          }
        };
        var result = scrollGeneric(event, scrollStep);
        slider.style.top = result.newSliderTop + "px";
        wrapper.style.top = result.newWrapperTop + "px";
        if (autoHide === true) {
          autoHideOnEvents("Y");
        }
      }
      
      // -- Function for horizontal scrolling -- //
      if (horizontalScroller === true) {
        function mouseGenericX(positivity, type) {
          var scrollStep;
          if (type === "Arrow") {
            scrollStep = stepMultipler * positivity;
          } else if (type === "Scroller") {
            scrollStep = (self.clientWidth - scrollerY.offsetWidth) * positivity;
          }
          var result = scrollGenericX(event, scrollStep);
          sliderX.style.left = result.newSliderLeft + "px";
          wrapper.style.left = result.newWrapperLeft + "px";
          if (autoHide === true) {
            autoHideOnEvents("X");
          }
        }
      }
      
      function loopedMouseGeneric(positivity, type) {
        var looper = setTimeout(function() {
          smoothActionPack("remove");
          function repeatAgain() {
            if (loops.repeat === true) {
              var repeater = setTimeout(function() {
                if (scrollerY.contains(target)) {
                  mouseGeneric(positivity, type);
                } else if (scrollerX.contains(target)) {
                  mouseGenericX(positivity, type);
                }
                repeatAgain();
              }, 30);
            }
          }
          repeatAgain();
        }, 300);
        return loops = {
          looper: looper,
          repeat: true
        };
      }
      
      if (arrows === true) {
        if (sliderSize > 0) {
          if (arrowUp.contains(target)) { // condition for click on vitrual arrow up
            mouseGeneric(-1, "Arrow");
            loopedMouseGeneric(-1, "Arrow");
          }
          if (arrowDown.contains(target)) { // condition for click on virtual arrow down
            mouseGeneric(1, "Arrow");
            loopedMouseGeneric(1, "Arrow");
          }
        }
        if (horizontalScroller === true) {
          if (sliderWidth > 0) {
            if (arrowLeft.contains(target)) { // condition for click on vitrual arrow left
              mouseGenericX(-1, "Arrow");
              loopedMouseGeneric(-1, "Arrow");
            }
            if (arrowRight.contains(target)) { // condition for click on virtual arrow right
              mouseGenericX(1, "Arrow");
              loopedMouseGeneric(1, "Arrow");
            }
          }
        }
      }
      
      if ((target.getAttribute("data-type") === "scrollerY") && (sliderSize > 0)) { // condition for click on empty field of vertical scroll bar
        if (event.clientY < slider.getBoundingClientRect().top) {
          mouseGeneric(-1, "Scroller");
          loopedMouseGeneric(-1, "Scroller");
        } else if (event.clientY > slider.getBoundingClientRect().bottom) {
          mouseGeneric(1, "Scroller");
          loopedMouseGeneric(1, "Scroller");
        }
      }
      
      if (horizontalScroller === true) {
        if ((target.getAttribute("data-type") === "scrollerX") && (sliderWidth > 0)) { // condition for click on empty field of horizontal scroll bar
          if (event.clientX < sliderX.getBoundingClientRect().left) {
            mouseGenericX(-1, "Scroller");
            loopedMouseGeneric(-1, "Scroller");
          } else if (event.clientX > sliderX.getBoundingClientRect().right) {
            mouseGenericX(1, "Scroller");
            loopedMouseGeneric(1, "Scroller");
          }
        }
      }
      
      return;
    }
    
    // Stop scrolling function if it run
    function stopVirtualScrolling() {
      if (loops.looper != undefined) {
        clearTimeout(loops.looper);
        loops.repeat = false;
        smoothActionPack("set");
      }
    }
    eventListener("add", scrollerY, "mousedown", virtualScrolling);
    eventListener("add", scrollerY, "mouseup", stopVirtualScrolling);
    if (horizontalScroller === true) {
      eventListener("add", scrollerX, "mousedown", virtualScrolling);
      eventListener("add", scrollerX, "mouseup", stopVirtualScrolling);
    }
  }
  
  /* Check type of device */
  if(isMobile() === true) {
    self.style.overflowY = "scroll";
  } else {
    generateScroller();
  }
};