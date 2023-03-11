import { twig } from "twig";

import { App as AppCore } from "./core";

import {
  AddHabbitView,
  DaysListView,
  HeaderView,
  NoHabbitView,
  PanelView,
} from "./views";
import { AppModel } from "./AppModel";

// todo: place somewhere
const tplElements = document.querySelectorAll("[type='x-tpl']");

const templates = Array.from(tplElements).reduce((acc, el) => {
  const name = el.getAttribute("id");

  return {
    ...acc,
    [name]: twig({
      data: el.innerHTML,
    }),
  };
}, {});

const viewsConfig = {
  panel: {
    Component: PanelView,
    selector: ".panel",
  },
  addHabbit: {
    Component: AddHabbitView,
    selector: ".cover",
  },
  header: {
    Component: HeaderView,
    selector: ".header",
  },
  daysList: {
    Component: DaysListView,
    selector: ".activeHabbit",
  },
  noHabbit: {
    Component: NoHabbitView,
    selector: ".noHabbitMessage",
  },
};

export class App extends AppCore {
  async initModel() {
    const { data: habbits = [] } = await this.api.get();

    this.model = new AppModel({
      data: {
        habbits,
        activeHabbitId: habbits[1].id,
      },
      events: this.events,
    });
  }

  // todo: place to App?
  initViews() {
    this.views = Object.entries(viewsConfig).reduce(
      (acc, [name, { Component, selector }]) => ({
        ...acc,
        [name]: new Component({
          el: document.querySelector(selector),
          model: this.model,
          events: this.events,
          templates,
        }),
      }),
      {}
    );
  }
}
