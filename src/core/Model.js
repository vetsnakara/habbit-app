export class Model {
  constructor({ data = {}, events }) {
    this.data = data;
    this.events = events;
  }

  get() {
    return JSON.parse(JSON.stringify(this.data));
  }

  set(data) {
    Object.assign(this.data, data);
  }
}
