var container = document.getElementById("container");
container.style.top = document.documentElement.clientHeight / 2 - container.offsetHeight / 2 + "px";

container.scrollable({
  verticalScroller: true,
  scrollerYClass: "scroller-y-field", // css-класс скроллера
  horizontalScroller: true, // наличие горизонтальной прокрутки (флаги "true", "false" и "auto")
  scrollerXClass: "scroller-x-field",
  scrollerShift: true, // наличие смещения контента для скроллера (флаги "true", "false")
  arrows: true, // наличие стрелок (флаги значения: "true", "false") 
  arrowsClass: "scroller-arrows", // css-класс стрелок
  arrowChevron: {
    top: "<div class=\"arrow-chevron-top\"></div>",
    bottom: "<div class=\"arrow-chevron-bottom\"></div>",
    left: "<div class=\"arrow-chevron-left\"></div>",
    right: "<div class=\"arrow-chevron-right\"></div>"
  }, // объект с HTML разметкой для "лычек"
  sliderClass: "scroller-slider", // css-класс ползунка
  sliderSize: "auto", // высота ползунка ("auto" - расчитывается в зависимости от контента; число (без указания пикселей или процентов) - высота в пикселях)
  sliderSizeMin: 30, // минимальная высота ползунка в пикселях (указывать еденицу измерения ненужно)
  stepMultipler: 15, // скорость прокрутки
  scrollBySelection: true, // возможность прокрутки при выделении текста (флаги "true", "false")
  useWheelScroll: true, // возможность прокрутки колесиком мыши (флаги "true", "false")
  useKeyboardScroll: true, // возможность прокрутки клавишами "Стрелки", "PageUp" и "PageDown" (флаги "true", "false")
  dynamicContent: true,
  autoHide: true, // наличие эффекта исчезающей полосы прокрутки (флаги "true", "false")
  scrollerOpacityActive: 1, // прозрачность в активном состоянии
  scrollerOpacityPassive: 0.5, // прозрачность в пассивном состоянии
  scrollerOpacityHidden: 0.2, // прозрачность в "спрятанном" состоянии
  smoothlyScroll: true,
  smoothlyScrollOptions: "0.3s top, 0.3s left"
});

var textarea = document.getElementById("textarea");
textarea.style.top = document.documentElement.clientHeight / 2 - textarea.offsetHeight / 2 + "px";

container.style.left = (document.documentElement.clientWidth - textarea.offsetWidth) / 2 - container.offsetWidth / 2 + "px";
textarea.style.left = (document.documentElement.clientWidth - container.offsetWidth) / 2 - textarea.offsetWidth / 2 + "px";

textarea.scrollable({
  verticalScroller: true,
  scrollerYClass: "scroller-y-field", // css-класс скроллера
  horizontalScroller: true, // наличие горизонтальной прокрутки (флаги "true", "false" и "auto")
  scrollerXClass: "scroller-x-field",
  scrollerShift: true, // наличие смещения контента для скроллера (флаги "true", "false")
  arrows: true, // наличие стрелок (флаги значения: "true", "false") 
  arrowsClass: "scroller-arrows", // css-класс стрелок
  arrowChevron: {
    top: "<div class=\"arrow-chevron-top\"></div>",
    bottom: "<div class=\"arrow-chevron-bottom\"></div>",
    left: "<div class=\"arrow-chevron-left\"></div>",
    right: "<div class=\"arrow-chevron-right\"></div>"
  }, // объект с HTML разметкой для "лычек"
  sliderClass: "scroller-slider", // css-класс ползунка
  sliderSize: "auto", // высота ползунка ("auto" - расчитывается в зависимости от контента; число (без указания пикселей или процентов) - высота в пикселях)
  sliderSizeMin: 30, // минимальная высота ползунка в пикселях (указывать еденицу измерения ненужно)
  stepMultipler: 15, // скорость прокрутки
  scrollBySelection: true, // возможность прокрутки при выделении текста (флаги "true", "false")
  useWheelScroll: true, // возможность прокрутки колесиком мыши (флаги "true", "false")
  useKeyboardScroll: true, // возможность прокрутки клавишами "Стрелки", "PageUp" и "PageDown" (флаги "true", "false")
  dynamicContent: false,
  autoHide: true, // наличие эффекта исчезающей полосы прокрутки (флаги "true", "false")
  scrollerOpacityActive: 1, // прозрачность в активном состоянии
  scrollerOpacityPassive: 0.5, // прозрачность в пассивном состоянии
  scrollerOpacityHidden: 0.2, // прозрачность в "спрятанном" состоянии
  smoothlyScroll: true,
  smoothlyScrollOptions: "0.3s top, 0.3s left"
});