import { ModelEvents } from "../constants/events";

export class Model {
  constructor({ events, api }) {
    this.events = events; //! check exist
    this.api = api; //! check exist

    this.init();
  }

  async init() {
    await this.setData();
    this.events.trigger(ModelEvents.init);
  }

  async setData() {
    this.data = {};
  }

  get() {
    return this.data;
  }

  set(data) {
    Object.assign(this.data, data);
  }
}
