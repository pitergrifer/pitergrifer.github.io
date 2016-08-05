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
      
      // pick count of arrows
      var arrowsCount = arrowsPack.length;
      
      // function with generick action at arrows at all cases
      function generickArrowsOptions(arrowCounter) {
        arrowsPack[arrowCounter].style.width = arrowSize + "px";
        arrowsPack[arrowCounter].style.height = arrowSize + "px";
        arrowsPack[arrowCounter].innerHTML = chevronPack[arrowCounter];
      }
      
      // start cycle, for more compact code
      for (var arrowCounter = 0; arrowCounter < arrowsPack.length; arrowCounter++) {
        if (arrowsCount == 4) { // algorithm, if both scrollers exist
          if (arrowCounter < 2) { // setup "Up" and "Down" arrows by standart, if vertical scroller exist
            makeByStandart(arrowsPack[arrowCounter], scrollerY, "absolute", arrowsClass);
          } else if (arrowCounter >= 2) { // setup "Left" and "Right" arrows by standart, if horizontal scroller exist
            makeByStandart(arrowsPack[arrowCounter], scrollerX, "absolute", arrowsClass);
          }
          
          // other generick options
          generickArrowsOptions(arrowCounter);
        } else if (arrowsCount == 2) { // algorithm, if only one scroller exist
          if (verticalScroller === true) { // setup arrows at vertical scroller, if it exist
            makeByStandart(arrowsPack[arrowCounter], scrollerY, "absolute", arrowsClass);
            generickArrowsOptions(arrowCounter);
          }
          
          if (horizontalScroller === true) { // setup arrows at horizontal scroller, if it exist
            makeByStandart(arrowsPack[arrowCounter], scrollerX, "absolute", arrowsClass);
            generickArrowsOptions(arrowCounter);
          }
        }
      }
      
      // positioning "Down" arrow, and get data about margins of walking for slider
      if (verticalScroller === true) {
        arrowDown.style.top = scrollerY.clientHeight - arrowDown.offsetHeight + "px";
        var topEdge = arrowUp.offsetWidth,
          sliderFieldY = scrollerY.clientHeight - (arrowUp.offsetHeight + arrowDown.offsetHeight); 
      }
      
      // positioning "Right" arrow, and get data about margins of walking for slider
      if (horizontalScroller === true) {
        arrowRight.style.left = scrollerX.clientWidth - arrowRight.offsetWidth + "px";
        var leftEdge = arrowLeft.offsetWidth,
          sliderFieldX = scrollerX.clientWidth - (arrowLeft.offsetWidth + arrowRight.offsetWidth);
      }
    } else { // get data about margins of walking for slider, if arrows doesn't exist...
      if (verticalScroller === true) { // ...and vertical scroller exist
        var topEdge = 0,
          sliderFieldY = scrollerY.clientHeight;  
      }
      
      if (horizontalScroller === true) { // ...and horizontal scroller exist
        var leftEdge = 0,
          sliderFieldX = scrollerX.clientWidth;
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
    function setSliderSize(axis) {
      if (axis === "Y") { // algorithm for vertical slider
        if (sliderStarterHeight === "auto") { // if slider size is "auto", strt calculation
          // ratio factor of container and wrapper heights
          var selfWrapperRatioY;
          
          // calculations, considering...
          if (horizontalScroller === true) { // ...availability of horizontal scroller
            if (scrollerShift === true) { // ...availability of shift content for scroller
              selfWrapperRatioY = self.clientHeight / ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom + scrollerX.offsetHeight) / 100);
            } else { //... or absence of shift content for scroller
              selfWrapperRatioY = self.clientHeight / ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom) / 100);
            }
          } else { //... or absence of horizontal scroller
            selfWrapperRatioY = self.clientHeight / ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom) / 100);
          }
          
          // slider size must be rounded, to prevent fractional numbers
          sliderHeight = Math.round(sliderFieldY / 100 * selfWrapperRatioY);
          
          // slider size cant't be less, then minimal size
          // P.S. if container contain to much content, this case save slider from collapse
          if (sliderHeight < sliderSizeMin) {
            sliderHeight = sliderSizeMin;
          }
        }
        
        // collapse slider, if content occupy not all space of container
        if (sliderHeight >= sliderFieldY) {
          sliderHeight = 0;
        }
        
        // finaly, set calculated size
        sliderY.style.height = sliderHeight + "px";
      } else if (axis === "X") { // algorithm for horizontal slider
        if (sliderStarterWidth === "auto") {
          // ratio factor of container and wrapper widths
          var selfWrapperRatioX;
          
          // calculations, considering...
          if (verticalScroller === true) { // ...availability of vertical scroller
            if (scrollerShift === true) { // ...availability of shift content for scroller
              selfWrapperRatioX = self.clientWidth / ((wrapper.offsetWidth + selfPadding.left + selfPadding.right + scrollerY.offsetWidth) / 100);
            } else { //... or absence of shift content for scroller
              selfWrapperRatioX = self.clientWidth / ((wrapper.offsetWidth + selfPadding.left + selfPadding.right) / 100);
            } 
          } else { //... or absence of vertical scroller
            selfWrapperRatioX = self.clientWidth / ((wrapper.offsetWidth + selfPadding.left + selfPadding.right) / 100);
          }
          
          // slider size must be rounded, to prevent fractional numbers
          sliderWidth = Math.round(sliderFieldX / 100 * selfWrapperRatioX);
          
          // slider size cant't be less, then minimal size
          // P.S. if container contain to much content, this case save slider from collapse
          if (sliderWidth < sliderSizeMin) {
            sliderWidth = sliderSizeMin;
          }
        }
        
        // collapse slider, if content occupy not all space of container
        if (sliderWidth >= sliderFieldX) {
          sliderWidth = 0;
        }
        
        // finaly, set calculated size
        sliderX.style.width = sliderWidth + "px";
      }
    }
    
    // -- Function for creation a vertical and horizontal sliders -- //
    function createSlider(axis) {
      // create <div>-element
      var slider = document.createElement("div");
      
      if (axis === "Y") { // case for vertical slider
        // set standart style features
        makeByStandart(slider, scrollerY, "absolute", sliderClass);
        
        // set data-attribute
        slider.setAttribute("data-type", "slider");
        
        // set other style feature
        slider.style.width = scrollerY.clientWidth + "px";
        slider.style.top = topEdge + "px";
      } else if (axis === "X") { // case for horizontal slider
        // set standart style features
        makeByStandart(slider, scrollerX, "absolute", sliderClass);
        
        // set data-attribute
        slider.setAttribute("data-type", "sliderX");
        
        // set other style feature
        slider.style.height = scrollerX.clientHeight + "px";
        slider.style.left = leftEdge + "px";
      }
      
      // set smooth scrolling effect to slider 
      smoothly("set", slider);
      
      // return computed <div>-element
      return slider;
    }
    
    // -- Create a vertical slider -- //
    if (verticalScroller === true) {
      var sliderY = createSlider("Y");
      setSliderSize("Y");
    }
    
    // -- Create a horizontal slider -- //
    if (horizontalScroller === true) {
      var sliderX = createSlider("X");
      setSliderSize("X");
    }
    
    // -- Insert plug in hole between scrollers -- //
    if ((horizontalScroller === true) && (verticalScroller === true)) { // ...if both scrollers exist 
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
    
    // -- Function for set "transition" and "opacity" in cross-browser way -- //
    function adaptiveHide(element, value) {
      // transition propertie
      element.style.MozTransition = "opacity, 0.4s"; // old Firefox
      element.style.OTransition = "opacity, 0.4s"; // old Opera
      element.style.WebkitTransition = "opacity, 0.4s"; // old Chrome and other
      element.style.transition = "opacity, 0.4s"; // standart
      
      // opacity propertie
      element.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (value * 100) + ")\""; // MSIE
      element.style.filter = "alpha(opacity=" + (value * 100) + ")"; // MSIE
      element.style.MozOpacity = value; // old Firefox
      element.style.KhtmlOpacity = value; // old Safari
      element.style.opacity = value; // standart
    }
    
    // -- Adding effect of hideable scroll bar -- //
    if (autoHide === true) {
      // pick id for future timers
      var hideByY,
        hideByX;
      
      // add cross-browser css-properties for vertical scroller in hidden condition 
      if (verticalScroller === true) {
        adaptiveHide(scrollerY, scrollerOpacityHidden);
      }
      
      // add cross-browser css-properties for horizontal scroller in hidden condition 
      if (horizontalScroller === true) {
        adaptiveHide(scrollerX, scrollerOpacityHidden);
      }
      
      // add cross-browser css-properties for plug in hidden condition 
      if ((verticalScroller === true) && (horizontalScroller === true)) {
        adaptiveHide(plug, scrollerOpacityHidden);
      }
      
      // it help us known cursor over the container or not
      var mousePosition = "unknown";
      
      // event, when cursor enter in container
      self.onmouseenter = function (event) {
        // change cross-browser css-properties for vertical scroller to passive (semi-hidden) condition 
        if (verticalScroller === true) {
          adaptiveHide(scrollerY, scrollerOpacityPassive);
        }
        
        // change cross-browser css-properties for horizontal scroller to passive (semi-hidden) condition 
        if (horizontalScroller === true) {
          adaptiveHide(scrollerX, scrollerOpacityPassive);
        }
        
        // change cross-browser css-properties for plug scroller to passive (semi-hidden) condition 
        if ((verticalScroller === true) && (horizontalScroller === true)) {
          adaptiveHide(plug, scrollerOpacityPassive);
        }
        
        // change information about cursor 
        mousePosition = "inside";
      };
      
      // event, when cursor leave container
      self.onmouseleave = function (event) {
        // change cross-browser css-properties for vertical scroller to hidden condition 
        if (verticalScroller === true) {
          adaptiveHide(scrollerY, scrollerOpacityHidden);
        }
        
        // change cross-browser css-properties for horizontal scroller to hidden condition 
        if (horizontalScroller === true) {
          adaptiveHide(scrollerX, scrollerOpacityHidden);
        }
        
        // change cross-browser css-properties for plug scroller to hidden condition 
        if ((verticalScroller === true) && (horizontalScroller === true)) {
          adaptiveHide(plug, scrollerOpacityHidden);
        }
        
        // change information about cursor 
        mousePosition = "outside";
      };
    }
    
    // -- Function for hiding scrollers at events -- //
    function autoHideOnEvents(axis) {
      if (axis === "Y") { // algorithm for vertical scroller
        // if timer already run, clear it
        if (hideByY != undefined) {
          clearTimeout(hideByY);
        }
        
        // change vertical scroller condition to active, if user interact with it 
        if (verticalScroller === true) {
          adaptiveHide(scrollerY, scrollerOpacityActive);
        }
        
        // change plug condition to active, if user interact with scroller 
        if ((horizontalScroller === true) && (verticalScroller === true))  {
          adaptiveHide(plug, scrollerOpacityActive);
        }
        
        // set timer, which change scrollers condition, if user don`t interact with it... 
        hideByY = setTimeout(function () {
          if (mousePosition === "inside") { // ...in case, where cursor over the container
            // change vertical scroller condition to passive 
            if (verticalScroller === true) {
              adaptiveHide(scrollerY, scrollerOpacityPassive);
            }
            
            // change plug condition to passive
            if ((verticalScroller === true) && (horizontalScroller === true)) {
              adaptiveHide(plug, scrollerOpacityPassive);
            }
          } else if (mousePosition === "outside") { // ...in case, where cursor out from the container  
            // change vertical scroller condition to hidden 
            if (verticalScroller === true) {
              adaptiveHide(scrollerY, scrollerOpacityHidden);
            }
            
            // change plug condition to hidden
            if ((verticalScroller === true) && (horizontalScroller === true)) {
              adaptiveHide(plug, scrollerOpacityHidden);
            }
          }
        }, 1000);
      } else if (axis === "X") { // algorithm for horizontal scroller
        // if timer already run, clear it
        if (hideByX != undefined) {
          clearTimeout(hideByX);
        }
        
        // change horizontal scroller condition to active, if user interact with it 
        if (horizontalScroller === true) {
          adaptiveHide(scrollerX, scrollerOpacityActive);
        }
        
        // change plug condition to active, if user interact with scroller 
        if ((horizontalScroller === true) && (verticalScroller === true))  {
          adaptiveHide(plug, scrollerOpacityActive);
        }
        
        // set timer, which change scrollers condition, if user don`t interact with it... 
        hideByX = setTimeout(function () {
          if (mousePosition === "inside") { // ...in case, where cursor over the container
            // change horizontal scroller condition to passive 
            if (horizontalScroller === true) {
              adaptiveHide(scrollerX, scrollerOpacityPassive);
            }
            
            // change plug condition to passive
            if ((verticalScroller === true) && (horizontalScroller === true)) {
              adaptiveHide(plug, scrollerOpacityPassive);
            }
          } else if (mousePosition === "outside") { // ...in case, where cursor out from the container  
            // change horizontal scroller condition to hidden 
            if (horizontalScroller === true) {
              adaptiveHide(scrollerX, scrollerOpacityHidden);
            }
            
            // change plug condition to hidden
            if ((verticalScroller === true) && (horizontalScroller === true)) {
              adaptiveHide(plug, scrollerOpacityHidden);
            }
          }
        }, 1000);
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
          ratioFactor.vertical = ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom + scrollerX.offsetHeight) - (self.offsetHeight - selfBorder.top - selfBorder.bottom)) / (sliderFieldY - sliderHeight);
          ratioFactor.horizontal = ((wrapper.offsetWidth + selfPadding.left + selfPadding.right + scrollerY.offsetWidth) - (self.offsetWidth - selfBorder.left - selfBorder.right)) / (sliderFieldX - sliderWidth);
        } else {
          ratioFactor.vertical = ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom) - (self.offsetHeight - selfBorder.top - selfBorder.bottom)) / (sliderFieldY - sliderHeight);
          ratioFactor.horizontal = ((wrapper.offsetWidth + selfPadding.left + selfPadding.right) - (self.offsetWidth - selfBorder.left - selfBorder.right)) / (sliderFieldX - sliderWidth);
        }
      } else {
        ratioFactor.vertical = ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom) - (self.offsetHeight - selfBorder.top - selfBorder.bottom)) / (sliderFieldY - sliderHeight);
      }
    }
    
    calcRatioFactor();
    
    function checkSliderPosition(axis) {
      if (axis === "Y") {
        var checkedSliderTop = ((wrapper.getBoundingClientRect().top - (self.getBoundingClientRect().top + self.clientTop + selfPadding.top)) / ratioFactor.vertical) * -1;
        if (arrows === true) {
          checkedSliderTop += arrowUp.offsetHeight;
        }
        sliderY.style.top = checkedSliderTop + "px";
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
          setSliderSize("Y");
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
            setSliderSize("X");
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
        setSliderSize("Y");
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
      sliderY: false,
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
          sliderPick.sliderY = false;
          smoothly("set", sliderY);
        }
        smoothly("set", wrapper);
      }
      eventListener("add", document, "mouseup", clearEvent);
    }
    
    // -- Event "Drag'n Drop" for vertical slider -- //
    sliderY.onmousedown = function (event) {
      event = event || window.event;
      smoothly("remove", wrapper);
      smoothly("remove", sliderY);
      var сorrectPick = event.clientY - sliderY.getBoundingClientRect().top;
      function sliderScroll(event) {
        var sliderCoordsOld = sliderY.getBoundingClientRect(),
          newTop = event.clientY - scrollerY.getBoundingClientRect().top - scrollerY.clientTop - сorrectPick,
          bottomEdge = sliderFieldY - sliderHeight;
        if (arrows === true) {
          bottomEdge += arrowDown.offsetHeight;  
        }
        if (newTop <= topEdge) {
          newTop = topEdge;
        } else if (newTop >= bottomEdge) {
          newTop = bottomEdge;
        }
        sliderY.style.top = newTop + "px";
        var sliderCoordsNew = sliderY.getBoundingClientRect(),
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
          sliderY: true,
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
            rightEdge = sliderFieldX - sliderWidth;
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
            sliderY: false,
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
      var bottomEdge = sliderFieldY - sliderHeight;
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
      var rightEdge = sliderFieldX - sliderWidth;
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
        sliderY.style.top = result.newSliderTop + "px";
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
        smoothly("set", sliderY);
        if (horizontalScroller === true) {
          smoothly("set", sliderX);
        }
        smoothly("set", wrapper);
      } else if (action === "remove") {
        smoothly("remove", sliderY);
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
                    smoothly("remove", sliderY);  
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
            sliderY.style.top = result.newSliderTop + "px";
            wrapper.style.top = result.newWrapperTop + "px";
          }
          // condition for bottons "Arrow up" and "Page Up"
          if ((event.keyCode == 38 || event.keyCode == 33) && (sliderHeight > 0)) {
            if ((isTextArea == true) && (activeNavigation == true)) {
              keyboardScroll(event, 38, 33, -1);
            } else if (isTextArea == false) {
              keyboardScroll(event, 38, 33, -1);
            }
          }
          // condition for bottons "Arrow down" and "Page Down"
          if ((event.keyCode == 40 || event.keyCode == 34) && (sliderHeight > 0)) {
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
          if (sliderPick.sliderY != false || sliderPick.sliderX != false) {
            return;
          }
        } else {
          if (scrollerY.contains(target)) {
            return;
          }
          if (sliderPick.sliderY != false) {
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
          sliderY.style.top = result.newSliderTop + "px";
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
        sliderY.style.top = result.newSliderTop + "px";
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
        if (sliderHeight > 0) {
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
      
      if ((target.getAttribute("data-type") === "scrollerY") && (sliderHeight > 0)) { // condition for click on empty field of vertical scroll bar
        if (event.clientY < sliderY.getBoundingClientRect().top) {
          mouseGeneric(-1, "Scroller");
          loopedMouseGeneric(-1, "Scroller");
        } else if (event.clientY > sliderY.getBoundingClientRect().bottom) {
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