import { Events } from "./Events";
import { Api } from "./Api";

export class App {
  constructor() {
    this.api = new Api();
    this.events = new Events();

    this.init();
  }

  async init() {
    await this.initModel();
    this.initViews();
  }

  async initModel() {}

  initViews() {}
}
