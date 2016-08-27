
// -- Function for detect textarea sizes by content -- //
function getTextAreaSize(elem, size) {
  if (size === "height") { // case to get height
    // get current element height 
    var currentHeight = elem.offsetHeight;

    // reset current element height
    elem.style.height = "auto";

    // set for textarea number of rows at "1", for measurements
    elem.setAttribute("rows", "1");

    // detect height of single row
    var rowHeight = elem.clientHeight;

    // it really necessary for old browsers, trust me
    var oldBrowsersSucksBalls = elem.scrollHeight;

    // detect number of rows
    var rows = elem.scrollHeight / rowHeight;

    // reset counts of rows
    elem.removeAttribute("rows");

    // return current element height
    elem.style.height = currentHeight + "px";

    // return calculated textarea height 
    return rows * rowHeight;
  } else if (size === "width") { // case to get width
    // get current element width
    var currentWidth = elem.offsetWidth;

    // reset element current width
    elem.style.width = "auto";

    // set for textarea number of cols at "1", for measurements
    elem.setAttribute("cols", "1");

    // detect width of single col
    var colWidth = elem.clientWidth;

    // it really necessary for old browsers, trust me
    var oldBrowsersSucksBalls = elem.scrollWidth;

    // detect number of cols
    var cols = elem.scrollWidth / colWidth;

    // reset counts of cols
    elem.removeAttribute("cols");

    // return current element width
    elem.style.width = currentWidth + "px";

    // return calculated textarea width
    return cols * colWidth;
  }
}