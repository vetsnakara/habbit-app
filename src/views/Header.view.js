import { View } from "../core";
import { ModelEvents } from "../constants/events";

export class HeaderView extends View {
  constructor(options) {
    super(options);
    this.render();
  }

  bindMethods() {
    this.render = this.render.bind(this);

    this.handleClick = this.handleClick.bind(this);
    this.renderSelectedHabbit = this.renderSelectedHabbit.bind(this);
    this.onHabbitDaysChange = this.onHabbitDaysChange.bind(this);
  }

  addEventHandlers() {
    this.el.addEventListener("click", this.handleClick);

    this.events.on(ModelEvents.selectHabbit, this.render);
    this.events.on(ModelEvents.removeHabbit, this.render);
    this.events.on(ModelEvents.addHabbitDay, this.onHabbitDaysChange);
    this.events.on(ModelEvents.removeHabbitDay, this.onHabbitDaysChange);
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
