export class View {
  constructor({ el, model, templates, events }) {
    this.el = el;
    this.model = model;
    this.templates = templates;
    this.events = events;

    this.bindMethods();
    this.addEventHandlers();
    this.init();

    // this.render();
  }

  init() {}

  bindMethods() {
    // todo: bind render here?
    // todo: bind all methods by default maybe?
  }

  addEventHandlers() {}

  //   render() {}
}
