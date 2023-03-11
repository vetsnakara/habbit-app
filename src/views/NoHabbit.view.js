import { Model } from "../Model";

export class NoHabbitView {
  constructor({ el, model, templates, events }) {
    this.el = el;
    this.model = model;
    this.templates = templates;
    this.events = events;

    this.render = this.render.bind(this);

    this.events.on(Model.events.removeHabbit, this.render);
    this.events.on(Model.events.selectHabbit, this.render);
    this.events.on(Model.events.addHabbit, this.render);

    this.render();
  }

  render() {
    const activeHabbit = this.model.getActiveHabbit();

    if (activeHabbit) {
      this.el.innerHTML = "";
      return;
    }

    this.el.innerHTML = this.templates.noHabbitMessage.render();

    return this;
  }
}
