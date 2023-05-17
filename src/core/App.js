// todo: use core app events separately
import { ModelEvents } from "../constants/events";
import { Events } from "./Events";

export class App {
  constructor({ model, events, templates, viewsConfig }) {
    this.model = model; //! check exist
    this.events = events; //! check exist
    this.templates = templates; //! check exist
    this.viewsConfig = viewsConfig; //! check exist

    this.views = null; // assigned after model init
  }

  init() {
    this.events.on(ModelEvents.init, () => this.initViews());
  }

  initViews() {
    this.views = Object.entries(this.viewsConfig).reduce(
      (acc, [name, { Component, selector }]) => ({
        ...acc,
        [name]: new Component({
          el: document.querySelector(selector),
          model: this.model,
          events: this.events,
          templates: this.templates,
        }),
      }),
      {}
    );
  }
}
