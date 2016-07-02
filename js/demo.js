var container = document.getElementById('container');
container.style.top = document.documentElement.clientHeight / 2 - container.offsetHeight / 2 + "px";

container.scrollable({
  scrollerClass: "scroller-field", // css-класс скроллера
  arrows: true, // наличие стрелок (флаги значения: "true", "false") 
  arrowsClass: "scroller-arrows", // css-класс стрелок
  sliderClass: "scroller-slider", // css-класс ползунка
  sliderHeight: "auto", // высота ползунка ("auto" - расчитывается в зависимости от контента; число (без указания пикселей или процентов) - высота в пикселях)
  sliderHeightMin: 30, // минимальная высота ползунка в пикселях (указывать еденицу измерения ненужно)
  sliderShift: true, // наличие смещения контента для скроллера (флаги "true", "false")
  stepMultipler: 10, // скорость прокрутки
  scrollBySelection: true, // возможность прокрутки при выделении текста (флаги "true", "false")
  useWheelScroll: true, // возможность прокрутки колесиком мыши (флаги "true", "false")
  useKeyboardScroll: true, // возможность прокрутки клавишами "Стрелки", "PageUp" и "PageDown" (флаги "true", "false")
  autoHide: true, // наличие эффекта исчезающей полосы прокрутки (флаги "true", "false")
  scrollerOpacityActive: 1, // прозрачность в активном состоянии
  scrollerOpacityPassive: 0.4 // прозрачность в пассивном состоянии
});