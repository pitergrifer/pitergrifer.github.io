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
    
    // -- Function for set/remove effect of smoothly scrolling -- //
    function smoothly(action, element) {
      if (action === "set") { // set case
        element.style.MozTransition = smoothlyScrollOptions;
        element.style.OTransition = smoothlyScrollOptions;
        element.style.WebkitTransition = smoothlyScrollOptions;
        element.style.transition = smoothlyScrollOptions;
      } else if (action === "remove") { // remove case
        element.style.MozTransition = "none";
        element.style.OTransition = "none";
        element.style.WebkitTransition = "none";
        element.style.transition = "none";
      }
    }
    
    // -- Function for set wrapper width -- //
    function setWrapperWidth(wrapper) {
      var wrappedContent = wrapper.children, // create array from all elements in wrapper,.. 
        wrappedContentLength = wrappedContent.length, // ...save length of it
        contentMaxWidth = wrappedContent[0].offsetWidth; // ... and save width of first children
      
      // strat cycle for detect max width of all childrens
      for (var wrapperCounter = 1; wrapperCounter < wrappedContentLength; wrapperCounter++) {
        // update "contentMaxWidth", if current children has width bigger, then previoust
        if (wrappedContent[wrapperCounter].offsetWidth > contentMaxWidth) {
          contentMaxWidth = wrappedContent[wrapperCounter].offsetWidth;
        }
      }
      
      // activate horizontal scroller and set new width for wrapper, if their content to big...
      if (contentMaxWidth > wrapper.offsetWidth) {
        horizontalScroller = true;
        wrapper.style.width = contentMaxWidth + "px";
      } else if (horizontalScroller === "auto") { // ...or deactivate horizontal scroller
        horizontalScroller = false;
      }
    }
    
    // -- Wrap the whole content of the container in div "wrapper" -- //
    // save content of container 
    var content = self.innerHTML;
    
    // remove content from container
    self.innerHTML = "";
    
    // create wrapper
    var wrapper = document.createElement("div");
    
    // set standart style settings to wrapper
    makeByStandart(wrapper, self, "relative");
    
    // set attribute to wrapper 
    wrapper.setAttribute("data-type", "wrapper");
    
    // set transition for smooth scrolling effect, if iy avalible
    if (smoothlyScroll === true) {
      smoothly("set", wrapper);
    }
    
    // inset HTML-code of conteiner content in to wrapper
    wrapper.innerHTML = content;
    
    //
    if (contentResize === true) {
      horizontalScroller = false;
    }
    
    // set wrapper width, if horizontal scrolling avalible
    if (horizontalScroller === "auto" || horizontalScroller === true) {
      setWrapperWidth(wrapper);
    }
    
    // save wrapper width and height for future calculations
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
      // create scroller, as DOM-element
      var scroller = document.createElement("div");
      
      if (axis === "Y") { // case for vertical scroll bar
        // set standart css-properties
        makeByStandart(scroller, self, "absolute", scrollerYClass);
        
        // set attribute at vertical scroller
        scroller.setAttribute("data-type", "scrollerY");
        
        if (horizontalScroller === true) { // set height for vertical scroller with considering horizontal scroller, if it exist
          scroller.style.height = self.clientHeight - scroller.offsetWidth + "px";
        } else { // set width for vertical scroller without considering horizontal scroller
          scroller.style.height = self.clientHeight + "px";
          
          if (scrollerShift === true) { // grow right padding at container, if it option active
            self.style.paddingRight = parseFloat(getStyle(self).paddingRight) + scroller.offsetWidth + "px";
            
            if (isTextArea === true) {
              updateHeights(textAreaBlock);
            }
          }
        }
        
        // set position for vertical slider
        scroller.style.top = "0px";
        scroller.style.left = self.clientWidth - scroller.offsetWidth + "px";
      } else if (axis === "X") { // case for horizontal scrollbar
        // set standart css-properties
        makeByStandart(scroller, self, "absolute", scrollerXClass);
        
        // set attribute at vertical scroller
        scroller.setAttribute("data-type", "scrollerX");
        
        if (verticalScroller === true) { // set width for horizontal scroller with considering vertical scroller width, if it exist
          scroller.style.width = self.clientWidth - scrollerY.offsetWidth + "px";
        } else { // set width for horizontal scroller without considering horizontal scroller height
          scroller.style.width = self.clientWidth + "px";
          
          if (scrollerShift === true) { // grow bottom padding at container, if it option active
            self.style.paddingBottom = parseFloat(getStyle(self).paddingRight) + scroller.offsetWidth + "px";
            
            if (isTextArea === true) { // 
              updateHeights(textAreaBlock);
            }
          }
        }
        
        // set position for horizontal scroller
        scroller.style.top = self.clientHeight - scroller.offsetHeight + "px";
        scroller.style.left = "0px";
      }
      
      if (navigator.userAgent.match(/MSIE/ig)) { // fix "blind click" bug in IEs at event onclick on object without background color
        if (getStyle(scroller).backgroundColor === "transparent") { // if scroller background color is transparent (or it doesn't exist)...
          // .., pick container background color, and...
          var parentBackground = getStyle(self).backgroundColor;
          
          if (parentBackground !== "transparent") { // ... if container has background color, set it to scroller
            scroller.style.backgroundColor = parentBackground;
          } else { // ... set white color as background to scroller, if container background color transparent
            scroller.style.backgroundColor = "white";
          }
        }
      }
      
      // set z-index for fix opacity inheritance from parents in IEs 
      scroller.style.zIndex = 5;
      
      // return created element
      return scroller;
    }
    
    // -- Create a vertical scroll bar -- //
    if (verticalScroller === true) {
      var scrollerY = makeScroller("Y");
    }
    
    //
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
      if (smoothlyScroll === true) {
        smoothly("set", slider);
      }
      
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
      // calc ratio factor for vertical scrolling
      if (verticalScroller === true) {
        if ((horizontalScroller === true) && (scrollerShift === true)) { // case, if horizontal scroller and shif avalible
          ratioFactor.vertical = ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom + scrollerX.offsetHeight) - (self.offsetHeight - selfBorder.top - selfBorder.bottom)) / (sliderFieldY - sliderHeight);
        } else { // case, if horizontal scroller and shif not avalible
          ratioFactor.vertical = ((wrapper.offsetHeight + selfPadding.top + selfPadding.bottom) - (self.offsetHeight - selfBorder.top - selfBorder.bottom)) / (sliderFieldY - sliderHeight);
        }
      }
      
      // calc ratio factor for horizontal scrolling
      if (horizontalScroller === true) {
        if ((verticalScroller === true) && (scrollerShift === true)) {  // case, if vertical scroller and shif avalible
          ratioFactor.horizontal = ((wrapper.offsetWidth + selfPadding.left + selfPadding.right + scrollerY.offsetWidth) - (self.offsetWidth - selfBorder.left - selfBorder.right)) / (sliderFieldX - sliderWidth);
        } else {  // case, if vertical scroller and shif not avalible
          ratioFactor.horizontal = ((wrapper.offsetWidth + selfPadding.left + selfPadding.right) - (self.offsetWidth - selfBorder.left - selfBorder.right)) / (sliderFieldX - sliderWidth);
        }
      }
    }
    
    // -- Calculate ratio factor by formula -- //
    calcRatioFactor();
    
    // -- Function for update sliders pisitions in case, where content is dynamic -- // 
    function updateSliderPosition(axis) {
      if (axis === "Y") { // case for vertical slider
        // calculate new position for vertical slider
        var updatedSliderYTop = ((wrapper.getBoundingClientRect().top - (self.getBoundingClientRect().top + self.clientTop + selfPadding.top)) / ratioFactor.vertical) * -1;
        
        // correct pisition, if arrow exist
        if (arrows === true) {
          updatedSliderYTop += arrowUp.offsetHeight;
        }
        
        // set new position
        sliderY.style.top = updatedSliderYTop + "px";
      } else if (axis === "X") { // case for horizontal slider
        // calculate new position for horizontal slider
        var checkedSliderXLeft = (parseFloat(getStyle(wrapper).left) / ratioFactor.horizontal) * -1;
        
        // correct pisition, if arrow exist
        if (arrows === true) {
          checkedSliderXLeft += arrowLeft.offsetWidth;
        }
        
        // set new position
        sliderX.style.left = checkedSliderXLeft + "px";
      }
    }
    
    // -- Function for autoconfiguration wrapper and sliders, if content is dynamic (infinity scroll, for example) -- //
    function checkContentSize() {
      // set listener on updating content 
      var timerContent = setTimeout(function () {
        // case for vertical scroller
        if ((verticalScroller === "auto") || (verticalScroller === true)) {
          //setWrapperHeight(wrapper);
          
          //verticalScroller = true;
          
          // if current wrapper height does not equal old value, update it  
          if (wrapper.offsetHeight !== wrapperHeight) {
            wrapperHeight = wrapper.offsetHeight;
            
            // besides, set new slider size and pisition...
            setSliderSize("Y");
            updateSliderPosition("Y");
            
            // ...and calculate ratio factor again 
            calcRatioFactor();
          }
        }
        
        if (contentResize === true) {
          fixContent();
        }
        
        // case for horizontal scroller
        if ((horizontalScroller === "auto") || (horizontalScroller === true)) {
          // set new wrapper width 
          setWrapperWidth(wrapper);
          
          // activate horizontal scroller
          horizontalScroller = true;
          
          // if current wrapper width does not equal old value, update it
          if (wrapper.offsetWidth !== wrapperWidth) {
            wrapperWidth = wrapper.offsetWidth;
            
            // besides, set new slider size and pisition...
            setSliderSize("X");
            updateSliderPosition("X");
            
            // ...and calculate ratio factor again
            calcRatioFactor();
          }
        }
        
        // if container is not a textarea, call function again 
        if (isTextArea !== true) {
          checkContentSize();
        }
      }, 4);
    }
    
    // -- Call function, which autoconfigurat wrapper and sliders, if content is dynamic -- //
    if ((settings.dynamicContent === true) && (isTextArea !== true)) {
      checkContentSize();
    }
    
    if (isTextArea === true) {
      function updateTextAreaContent() {
        updateHeights(textAreaBlock);
        setSliderSize("Y");
        updateSliderPosition("Y");
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
      // function for prevent selection, while user interact with slider
      function cancelSelection(event) {
        event = event || window.event;
        return false;
      }
      
      // set event listener on "selectstart" event for prevent selection
      eventListener("add", document, "selectstart", cancelSelection);
      
      // set event listener on "mousemove" event for "drag" action with slider  
      eventListener("add", document, "mousemove", sliderMainFunction);
      
      // function for clear events listeners
      function clearEvent() {
        // remove "mousemove", "selectstart", "mouseup" events on document
        eventListener("remove", document, "mousemove", sliderMainFunction);
        eventListener("remove", document, "selectstart", cancelSelection);
        eventListener("remove", document, "mouseup", clearEvent);
        
        // change opacity of scrollers, if option of auto hide effect is on
        if (autoHide === true) {
          if (mousePosition === "inside") { // case, where cursor is over container
            if (axis === "X") { // case for horizontal scroller
              // change horizontal scroller condition to passive, after interaction 
              adaptiveHide(scrollerX, scrollerOpacityPassive);
              
              if ((verticalScroller === true) || (horizontalScroller === true)) { // if plug exist...
                // ...change it condition to passive, after iteraction with scroller
                adaptiveHide(plug, scrollerOpacityPassive);
              }
            } else if (axis === "Y") { // case for vertical scroller
              // change vertical scroller condition to passive, after interaction 
              adaptiveHide(scrollerY, scrollerOpacityPassive);
              
              if ((verticalScroller === true) || (horizontalScroller === true)) { // if plug exist...
                // ...change it condition to passive, after iteraction with scroller
                adaptiveHide(plug, scrollerOpacityPassive);
              }
            }
          } else if (mousePosition === "outside") { // case, where cursor is over container
            if (axis === "X") { // case for horizontal scroller
              // change horizontal scroller condition to hidden, after interaction 
              adaptiveHide(scrollerX, scrollerOpacityHidden);
              
              if ((verticalScroller === true) || (horizontalScroller === true)) { // if plug exist...
                // ...change it condition to hidden, after iteraction with scroller
                adaptiveHide(plug, scrollerOpacityHidden);
              }
            } else if (axis === "Y") { // case for vertical scroller
              // change vertical scroller condition to hidden, after interaction 
              adaptiveHide(scrollerY, scrollerOpacityHidden);
              
              if ((verticalScroller === true) || (horizontalScroller === true)) { // if plug exist...
                // ...change it condition to hidden, after iteraction with scroller
                adaptiveHide(plug, scrollerOpacityHidden);
              }
            }
          }
        }
        
        // update information about picked slider
        if (axis === "X") { // ...if it horizontal
          sliderPick.sliderX = false;
          
          // activate effect of smooth scrolling again for horizontal slider, if it exist before
          if (smoothlyScroll === true) {
            smoothly("set", sliderX);
          }
        } else if (axis === "Y") { // ...if it vertical
          sliderPick.sliderY = false;
          
          // activate effect of smooth scrolling again for vertical slider, if it exist before
          if (smoothlyScroll === true) {
            smoothly("set", sliderY);
          }
        }
        
        // activate effect of smooth scrolling again for wrapper, if it exist before
        if (smoothlyScroll === true) {
          smoothly("set", wrapper);
        }
      }
      
      // call function, which clear all events, on "mouseup" event
      eventListener("add", document, "mouseup", clearEvent);
    }
    
    // -- Event "Drag'n Drop" for vertical slider -- //
    if (verticalScroller === true) {
      sliderY.onmousedown = function (event) {
        event = event || window.event;
        
        // stop smooth scrolling effect, while user interact with slider 
        if (smoothlyScroll === true) {
          smoothly("remove", wrapper);
          smoothly("remove", sliderY);
        }
        
        // detect area, where user pick slider, for correct behavior of "D'n D" interation type
        var сorrectPick = event.clientY - sliderY.getBoundingClientRect().top;
        
        // function for moving slider and wrapper
        function sliderYScroll(event) {
          // some variables: 
          var sliderYCoordsOld = sliderY.getBoundingClientRect(), // slider pisition before draging
            newTop = event.clientY - scrollerY.getBoundingClientRect().top - scrollerY.clientTop - сorrectPick, // new position for slider at start of interaction
            bottomEdge = sliderFieldY - sliderHeight; // detect lower allowable position
          
          // change lower allowable position, if arrows exist
          if (arrows === true) {
            bottomEdge += arrowDown.offsetHeight;  
          }
          
          // prevent out of range
          if (newTop <= topEdge) { // if new position out higher allowable position...
            // ...new position must be equal higher allowable position
            newTop = topEdge;
          } else if (newTop >= bottomEdge) { // if new position out lower allowable position...
            // ...new position must be equal lower allowable position
            newTop = bottomEdge;
          }
          
          // set calculated position
          sliderY.style.top = newTop + "px";
          
          // detect new coords of slider...
          var sliderYCoordsNew = sliderY.getBoundingClientRect(),
            scrollSpeed = (sliderYCoordsNew.top - sliderYCoordsOld.top) * ratioFactor.vertical; // and calculate scrolling speed of wrapper
          
          // calculate new position for wrapper
          sliderPick.wrapperY -= scrollSpeed;
          
          // set calculaterd position for wrapper, which give scrolling effect
          wrapper.style.top = Math.round(sliderPick.wrapperY) + "px";
          
          // change opacity of scrollers, if option of auto hide effect is on 
          if (autoHide === true) {
            // on interaction, change vertical scroller condition to active 
            adaptiveHide(scrollerY, scrollerOpacityActive);
            
            if ((verticalScroller === true) && (horizontalScroller === true)) { // if plug exist...
              // on interaction, change plug condition to active
              adaptiveHide(plug, scrollerOpacityActive);
            }
          }
          
          // return data about picked slider and new wrapper position
          return sliderPick = {
            sliderY: true,
            wrapperY: sliderPick.wrapperY,
            sliderX: false,
            wrapperX: sliderPick.wrapperX
          };
        }
        
        // call function for moving slider and content
        sliderYScroll(event);
        
        // call generic actions
        genericSlidersEvent(event, "Y", sliderYScroll);
        
        // prevent default browser event
        return false;
      };
    }
    
    // -- Event "Drag'n Drop" for horizontal slider -- //
    if (horizontalScroller === true) {
      sliderX.onmousedown = function (event) {
        event = event || window.event;
        
        // stop smooth scrolling effect, while user interact with slider
        if (smoothlyScroll === true) {
          smoothly("remove", wrapper);
          smoothly("remove", sliderX);
        }
        
        // detect area, where user pick slider, for correct behavior of "D'n D" interation type
        var correctPick = event.clientX - sliderX.getBoundingClientRect().left;
        
        // function for moving slider and content
        function sliderXScroll(event) {
          // some variables: 
          var sliderXCoordsOld = sliderX.getBoundingClientRect(),// slider pisition before draging
            newLeft = event.clientX - scrollerX.getBoundingClientRect().left - scrollerX.clientLeft - correctPick, // new position for slider at start of interaction
            rightEdge = sliderFieldX - sliderWidth; // detect lower allowable position
          
          // change lower allowable position, if arrows exist
          if (arrows === true) {
            rightEdge += arrowRight.offsetWidth;
          }
          
          // prevent out of range
          if (newLeft <= leftEdge) { // if new position out of leftmost allowable position...
            // ...new position must be equal leftmost allowable position
            newLeft = leftEdge;
          } else if (newLeft >= rightEdge) { // if new position out of rightmost allowable position...
            // ...new position must be equal rightmost allowable position
            newLeft = rightEdge;
          }
          
          // set calculated position
          sliderX.style.left = newLeft + "px";
          
          // detect new coords of slider...
          var sliderXCoordsNew = sliderX.getBoundingClientRect(),
            scrollXSpeed = (sliderXCoordsNew.left - sliderXCoordsOld.left) * ratioFactor.horizontal; // and calculate scrolling speed of wrapper
          
          // calculate new position for wrapper
          sliderPick.wrapperX -= scrollXSpeed;
          
          // set calculaterd position for wrapper, which give scrolling effect
          wrapper.style.left = Math.round(sliderPick.wrapperX) + "px";
          
          // change opacity of scrollers, if option of auto hide effect is on 
          if (autoHide === true) {
            // on interaction, change vertical scroller condition to active 
            adaptiveHide(scrollerX, scrollerOpacityActive);
              
            if ((verticalScroller === true) || (horizontalScroller === true)) { // if plug exist...
              // on interaction, change plug condition to active
              adaptiveHide(plug, scrollerOpacityActive);
            }
          }
          
          // return data about picked slider and new wrapper position
          return sliderPick = {
            sliderX: true,
            wrapperX: sliderPick.wrapperX,
            sliderY: false,
            wrapperY: sliderPick.wrapperY
          };
        }
        
        // call function for moving slider and content
        sliderXScroll(event);
        
        // call generic actions
        genericSlidersEvent(event, "X", sliderXScroll);
        
        // prevent default browser event
        return false;
      };
    }
    
    // -- General function of vertical scrolling action for mouse wheel, keyboard and virtual arrows -- //
    function scrollYGeneric(event, scrollStep) {
      // calculate new position for wrapper
      sliderPick.wrapperY -= scrollStep;
      
      // calculate new slider position
      var newSliderTop = (sliderPick.wrapperY / ratioFactor.vertical) * -1;
      
      // detect lower allowable slider position
      var bottomEdge = sliderFieldY - sliderHeight;
      
      if (arrows === true) { // if arrows exist...
        // ...change slider position
        newSliderTop += arrowUp.offsetHeight;
        
        // ...change lower allowable slider position
        bottomEdge += arrowDown.offsetHeight;
      }
      
      // prevent out of range
      if (newSliderTop < topEdge) { // if new slider position out of higher allowable position...
        // ...new position must be equal higher allowable position
        newSliderTop = topEdge;
        
        // ...and wrapper position must be equal 0
        sliderPick.wrapperY = 0;
      } else if (newSliderTop > bottomEdge) { // if new position out of lower allowable position...
        // ...new position must be equal lower allowable position
        newSliderTop = bottomEdge;
        
        // ...calculate wrapper lower allowable position
        if (horizontalScroller === true) { // if horizontal scroller exist, and...
          if (scrollerShift === true) { // ... scroller shift is on
            sliderPick.wrapperY = (wrapper.offsetHeight - self.offsetHeight + selfPadding.top + selfBorder.top + selfPadding.bottom + selfBorder.bottom + scrollerX.offsetHeight) * -1;
          } else { // ..scroller shift is off
            sliderPick.wrapperY = (wrapper.offsetHeight - self.offsetHeight + selfPadding.top + selfBorder.top + selfPadding.bottom + selfBorder.bottom) * -1;
          }
        } else { // if horizontal scroller does't exist
          sliderPick.wrapperY = (wrapper.offsetHeight - self.offsetHeight + selfPadding.top + selfBorder.top + selfPadding.bottom + selfBorder.bottom) * -1;
        }
      }
      
      // return data about slider and wrapper positions
      return {
        newSliderTop: newSliderTop,
        newWrapperTop: sliderPick.wrapperY
      };
    }
    
    // -- General function of horizontal scrolling action for keyboard and virtual arrows -- //
    function scrollXGeneric(event, scrollStep) {
      // calculate new position for wrapper
      sliderPick.wrapperX -= scrollStep;
      
      // calculate new slider position
      var newSliderLeft = (sliderPick.wrapperX / ratioFactor.horizontal) * -1;
      
      // detect rightmost allowable slider position
      var rightEdge = sliderFieldX - sliderWidth;
      
      if (arrows === true) { // if arrows exist...
        // ...change slider position
        newSliderLeft += arrowLeft.offsetWidth;
        
        // ...change rightmost allowable slider position
        rightEdge += arrowRight.offsetWidth;
      }
      
      // prevent out of range
      if (newSliderLeft < leftEdge) { // if new slider position out of leftmost allowable position...
        // ...new slider position must be equal leftmost allowable position
        newSliderLeft = leftEdge;
        
        // ...new wrapper position must be equal 0
        sliderPick.wrapperX = 0;
      } else if (newSliderLeft > rightEdge) { // if new slider position out of rightmost allowable position...
        // ...new slider position must be equal leftmost allowable position
        newSliderLeft = rightEdge;
        
        // ...calculate wrapper rightmost allowable position 
        if (verticalScroller === true) { // if vertical scroller exist, and...
          if (scrollerShift === true) { // ...scroller shift is on
            sliderPick.wrapperX = (wrapper.offsetWidth - self.offsetWidth + selfPadding.left + selfBorder.left + selfPadding.right + selfBorder.right + scrollerY.offsetWidth) * -1;
          } else { // ...scroller shift is off
            sliderPick.wrapperX = (wrapper.offsetWidth - self.offsetWidth + selfPadding.left + selfBorder.left + selfPadding.right + selfBorder.right) * -1;
          }
        } else { // if vertical scroller does't exist
          sliderPick.wrapperX = (wrapper.offsetWidth - self.offsetWidth + selfPadding.left + selfBorder.left + selfPadding.right + selfBorder.right) * -1;
        }
      }
      
      // return data about slider and wrapper positions
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
        
        // detect cross-browser delta 
        var delta = event.deltaY || event.detail || (event.wheelDelta * -1),
          scrollStep;
        
        // set scroll step as...
        if (delta > 0) { // ...positive number
          scrollStep = stepMultipler;
        } else if (delta < 0) { // ... negative number
          scrollStep = stepMultipler * -1;
        }
        
        if (verticalScroller !== true) { // scroll by X-axis, if vertical scroller does't exist
          // change vertical scroller opacity condition 
          if (autoHide === true) {
            autoHideOnEvents("X");
          }
          
          // calculate new positions for vertical slider and wrapper 
          var result = scrollXGeneric(event, scrollStep);
          
          // set new positions for wrapper and slider  
          wrapper.style.left = result.newWrapperLeft + "px";
          sliderX.style.left = result.newSliderLeft + "px";
        } else { // scroll by Y-axis, if vertical scroller exist
          // change vertical scroller opacity condition 
          if (autoHide === true) {
            autoHideOnEvents("Y");
          }
          
          // calculate new positions for vertical slider and wrapper 
          var result = scrollYGeneric(event, scrollStep);
          
          // set new positions for wrapper and slider  
          wrapper.style.top = result.newWrapperTop + "px";
          sliderY.style.top = result.newSliderTop + "px";
        }
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
    
    // -- If smooth effect on scrolling is on... -- //
    if (smoothlyScroll === true) {
      var transitionDuration = getTransitionDurationMs(), // ...get time on transition
        removeSmoothTimer = "empty"; // ...set ID for future timer
    }
    
    // -- Some duplicate actions with options of smooth effect -- //
    function smoothActionPack(action) {
      if (action === "set") { // in case, where need add smooth effect 
        // if vertical scroller exist...
        if (verticalScroller === true) {
          // ...set this effect on it 
          smoothly("set", sliderY);
        }
        
        // if horizontal scroller exist...
        if (horizontalScroller === true) {
          // ...set this effect on it
          smoothly("set", sliderX);
        }
        
        // set this effect on wrapper
        smoothly("set", wrapper);
      } else if (action === "remove") { // in case, where need delete smooth effect
        // if vertical scroller exist...
        if (verticalScroller === true) {
          // ...remove this effect from it
          smoothly("remove", sliderY);
        }
        
        // if horizontal scroller exist...
        if (horizontalScroller === true) {
          // ...remove this effect from it
          smoothly("remove", sliderX);
        }
        
        // remove this effect from wrapper
        smoothly("remove", wrapper);
      }
    }
    
    // -- Event of scrolling by keyboard (wrap event "onkey..." in "onfocus" to avoid conflict with native scroller) -- //
    if (settings.useKeyboardScroll === true) {
      self.onfocus = function (event) {
        activeNavigation = true;
        
        self.onkeydown = function (event) {
          event = event || window.event;
          
          // function, which freez smooth effect, when key pressed a long time
          function freezTransition(axis) {
            // perform function, if effect of smooth scrolling is active and timer does't already run
            if ((smoothlyScroll === true) && (removeSmoothTimer === "empty"))  {
              // start freezing, after complete first iteration of smooth action (it`s transition duration)
              removeSmoothTimer = setTimeout(function() {
                 // stop smooth effect...
                if (axis === "Y") { // ...on vertical slider, ...
                  smoothly("remove", sliderY);  
                } else if (axis == "X") { // ...or horizontal slider, ... 
                  smoothly("remove", sliderX);
                }
                // ... and wrapper
                smoothly("remove", wrapper);
              }, transitionDuration);
            }
          }
          
          // function of vertical scrolling by keys 
          function keyboardScrollY(event, arrowBtnCode, pageBtnCode, positivity) {
            // set scroll step for next calculation
            var scrollStep = 0;
            
            // calculate scroll step...
            if (event.keyCode === arrowBtnCode) { // ...if it one of "Arrow" keys  
              scrollStep = stepMultipler * positivity;
            } else if (event.keyCode === pageBtnCode) { // ...if it one of "Page" keys
              if (horizontalScroller === true) { // in case, where horizontal scroller exist
                scrollStep = (self.clientHeight - scrollerX.offsetHeight) * positivity;
              } else { // in case without horizontal scroller
                scrollStep = (self.clientHeight) * positivity;
              }
            }
            
            // freez smooth effect
            freezTransition("Y");
            
            // change opacity condition for vertical scroller
            if (autoHide === true) {
              autoHideOnEvents("Y");
            }
            
            // calculate new positions for wrapper and slider
            var result = scrollYGeneric(event, scrollStep);
            
            // set at wrapper and slider calculated positions
            sliderY.style.top = result.newSliderTop + "px";
            wrapper.style.top = result.newWrapperTop + "px";
          } 
          
          // function of vertical scrolling by keys
          function keyboardScrollX(event, arrowBtnCode, pageBtnCode, positivity) {
            // set scroll step for next calculation
            var scrollStep = 0;
            
            // calculate scroll step...
            if (event.keyCode === arrowBtnCode) { // ...if it one of "Arrow" keys  
              scrollStep = stepMultipler * positivity;
            } else if (event.keyCode === pageBtnCode) { // ...if it one of "Page" keys
              if (verticalScroller === true) { // in case, where vertical scroller exist
                scrollStep = (self.clientWidth - scrollerY.offsetWidth) * positivity;
              } else { // in case without vertical scroller
                scrollStep = self.clientWidth * positivity;
              }
            }
            
            // freez smooth effect
            freezTransition("X");
            
            // change opacity condition for horizontal scroller
            if (autoHide === true) {
              autoHideOnEvents("X");
            }
            
            // calculate new positions for wrapper and slider
            var result = scrollXGeneric(event, scrollStep);
            
            // set at wrapper and slider calculated positions
            sliderX.style.left = result.newSliderLeft + "px";
            wrapper.style.left = result.newWrapperLeft + "px";
          }
          
          // condition for bottons "Arrow up" and "Page Up"
          if ((event.keyCode == 38 || event.keyCode == 33) && (sliderHeight > 0) && (verticalScroller === true)) {
            if ((isTextArea == true) && (activeNavigation == true)) { // in case if it textarea
              keyboardScrollY(event, 38, 33, -1);
            } else if (isTextArea == false) { // in other cases
              keyboardScrollY(event, 38, 33, -1);
            }
          }
          
          // condition for bottons "Arrow down" and "Page Down"
          if ((event.keyCode == 40 || event.keyCode == 34) && (sliderHeight > 0) && (verticalScroller === true)) {
            if ((isTextArea == true) && (activeNavigation == true)) { // in case if it textarea
              keyboardScrollY(event, 40, 34, 1);
            } else if (isTextArea == false) { // in other cases
              keyboardScrollY(event, 40, 34, 1);
            }
          }
          
          // condition for bottons "Arrow left" and "Home"
          if ((event.keyCode == 37 || event.keyCode == 36) && (sliderWidth > 0) && (horizontalScroller === true)) {
            if ((isTextArea == true) && (activeNavigation == true)) { // in case if it textarea
              keyboardScrollX(event, 37, 36, -1);
            } else if (isTextArea == false) { // in other cases
              keyboardScrollX(event, 37, 36, -1);
            }
          }
          
          // condition for bottons "Arrow right" and "End"
          if ((event.keyCode == 39 || event.keyCode == 35) && (sliderWidth > 0) && (horizontalScroller === true)) {
            if ((isTextArea == true) && (activeNavigation == true)) { // in case if it textarea
              keyboardScrollX(event, 39, 35, 1);
            } else if (isTextArea == false) { // in other cases
              keyboardScrollX(event, 39, 35, 1);
            }
          }
          
          // if effect of smooth scrolling is on...
          if (smoothlyScroll === true) { // ...set event listener on "keyup", which...
            self.onkeyup = function () {
              // ... clear timer, which delay freezing...
              clearTimeout(removeSmoothTimer);
              removeSmoothTimer = "empty";
              
              // ...and set smooth effect effect
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
        
        // get cross-browser "target" element
        var target = event.target || event.srcElement;
        
        // set focus to container
        self.focus();
        
        // prevent event, if... 
        // ... vertical scroller exist, and...
        if (verticalScroller === true) {
          // ...it contanis target
          if (scrollerY.contains(target)) {
            return;
          }
          
          // ...user interact with slider
          if (sliderPick.sliderY != false) {
            return; 
          }
        }
        
        // ... vertical scroller exist, and...
        if (horizontalScroller === true) {
          // ...it contanis target
          if (scrollerX.contains(target)) {
            return;
          }
          
          // ...user interact with slider
          if (sliderPick.sliderX != false) {
            return; 
          }
        }
        
        // remove smooth effect, while scrolling
        smoothActionPack("remove");
        
        // function of vertical scrolling by text selection
        function selectionScrollY(event) {
          // set scroll step for future calculation
          var scrollStep = 0;
          
          // calculate scroll step...
          if (event.clientY < self.getBoundingClientRect().top) { // ...if cursor over the top of container
            scrollStep = stepMultipler * -1;
          } else if (event.clientY > self.getBoundingClientRect().bottom) { // ...if cursor under the bottom of container
            scrollStep = stepMultipler;
          }
          
          // calculate new positions for wrapper and vertical slider
          var result = scrollYGeneric(event, scrollStep);
          
          // set calculated positions to wrapper and vertical slider
          wrapper.style.top = result.newWrapperTop + "px";
          sliderY.style.top = result.newSliderTop + "px";
        }
        
        // function of horizontal scrolling by text selection
        function selectionScrollX(event) {
          // set scroll step for future calculation
          var scrollStep = 0;
          
          // calculate scroll step...
          if (event.clientX < self.getBoundingClientRect().left) { // ...if cursor came out the left side of container
            scrollStep = stepMultipler * -1;
          } else if (event.clientX > self.getBoundingClientRect().right) { // ...if cursor came out the right side of container
            scrollStep = stepMultipler;
          };
          
          // calculate new positions for wrapper and horizontal slider
          var result = scrollXGeneric(event, scrollStep);
          
          // set calculated positions for wrapper and horizontal slider
          wrapper.style.left = result.newWrapperLeft + "px";
          sliderX.style.left = result.newSliderLeft + "px";
        }
        
        // case of vertical scrolling
        if (verticalScroller === true) {
          // call function of vertical scrolling by text selection
          selectionScrollY(event);
          
          // set event listener on "mousemove" event
          eventListener("add", document, "mousemove", selectionScrollY);
          
          // set listener, which...
          eventListener("add", document, "mouseup", function(event) {
            // ...clear listener of "mousemove" event and...
            eventListener("remove", document, "mousemove", selectionScrollY);
            // ...return smooth effect back again
            smoothActionPack("set");
          });
        }
        
        // case of horizontal scrolling
        if (horizontalScroller === true) {
          // call function of horizontal scrolling by text selection
          selectionScrollX(event);
          
          // set event listener on "mousemove" event
          eventListener("add", document, "mousemove", selectionScrollX);
          
          // set listener, which...
          eventListener("add", document, "mouseup", function(event) {
            // ...clear listener of "mousemove" event and...
            eventListener("remove", document, "mousemove", selectionScrollX);
            // ...return smooth effect back again
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
        var result = scrollYGeneric(event, scrollStep);
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
          var result = scrollXGeneric(event, scrollStep);
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