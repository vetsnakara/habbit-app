import { Model } from "../Model";

export class HeaderView {
  constructor({ el, model, templates, events }) {
    this.el = el;
    this.model = model;
    this.templates = templates;
    this.events = events;

    // todo: use bindMethods([...])
    this.renderSelectedHabbit = this.renderSelectedHabbit.bind(this);
    this.onHabbitDaysChange = this.onHabbitDaysChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.render = this.render.bind(this);

    this.el.addEventListener("click", this.handleClick);

    this.events.on(Model.events.selectHabbit, this.render);
    this.events.on(Model.events.removeHabbit, this.render);
    this.events.on(Model.events.addHabbitDay, this.onHabbitDaysChange);
    this.events.on(Model.events.removeHabbitDay, this.onHabbitDaysChange);

    this.render();
  }

  handleClick(event) {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;

    const action = actionEl.getAttribute("data-action");

    switch (action) {
      case "removeHabbit":
        return this.removeHabbit();
    }
  }

  removeHabbit() {
    this.model.removeActiveHabbit();
  }

  onHabbitDaysChange() {
    const activeHabbit = this.model.getActiveHabbit();
    this.renderProgress(activeHabbit);
  }

  renderSelectedHabbit(activeHabbit) {
    this.renderHabbitName(activeHabbit);
    this.renderProgress(activeHabbit);
  }

  renderProgress(habbit) {
    const progress = `${habbit.progress}%`;
    this.progressCoverEl.style.width = progress;
    this.progressPercentEl.textContent = progress;
  }

  renderHabbitName(habbit) {
    this.habbitName.textContent = habbit.name;
  }

  render() {
    const activeHabbit = this.model.getActiveHabbit();

    if (!activeHabbit) {
      this.el.innerHTML = "";
      return;
    }

    this.el.innerHTML = this.templates.header.render();

    this.habbitName = this.el.querySelector(".header__habbit-name");
    this.progressCoverEl = this.el.querySelector(".progress__cover-bar");
    this.progressPercentEl = this.el.querySelector(".progress__percent");

    this.renderSelectedHabbit(activeHabbit);

    return this;
  }
}
