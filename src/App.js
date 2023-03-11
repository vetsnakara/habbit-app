import { twig } from "twig";

import { Model } from "./Model";
import { Events } from "./Events";
import { Api } from "./Api";

import { AddHabbitView } from "./views/AddHabbit.view";
import { PanelView } from "./views/Panel.view";
import { HeaderView } from "./views/Header.view";
import { DaysListView } from "./views/DaysList.view";
import { NoHabbitView } from "./views/NoHabbit.view";

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

console.log("templates", templates);

export class App {
  constructor() {
    this.api = new Api();
    this.events = new Events();
  }

  async init() {
    const { data: habbits = [] } = await this.api.get();

    const data = {
      activeHabbitId: habbits[1].id,
      habbits,
    };

    this.model = new Model({
      data,
      events: this.events,
    });

    new PanelView({
      el: document.querySelector(".panel"),
      templates,
      model: this.model,
      events: this.events,
    });

    new AddHabbitView({
      el: document.querySelector(".cover"),
      templates,
      model: this.model,
      events: this.events,
    });

    new HeaderView({
      el: document.querySelector(".header"),
      templates,
      model: this.model,
      events: this.events,
    });

    new DaysListView({
      el: document.querySelector(".activeHabbit"),
      templates,
      model: this.model,
      events: this.events,
    });

    new NoHabbitView({
      el: document.querySelector(".noHabbitMessage"),
      templates,
      model: this.model,
      events: this.events,
    });
  }
}
