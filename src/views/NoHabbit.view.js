import { View } from "../core";
import { ModelEvents } from "../constants/events";

export class NoHabbitView extends View {
  constructor(options) {
    super(options);
    this.render();
  }

  bindMethods() {
    // todo: bind render in parent class?
    this.render = this.render.bind(this);
  }

  addEventHandlers() {
    this.events.on(ModelEvents.removeHabbit, this.render);
    this.events.on(ModelEvents.selectHabbit, this.render);
    this.events.on(ModelEvents.addHabbit, this.render);
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
