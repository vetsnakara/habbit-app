import { View } from "../core";
import { ModelEvents } from "../constants/events";

export class PanelView extends View {
  constructor(options) {
    super(options);
    this.render();
  }

  bindMethods() {
    this.handleClick = this.handleClick.bind(this);
    this.handleAddHabbit = this.handleAddHabbit.bind(this);
    this.handleRemoveHabbit = this.handleRemoveHabbit.bind(this);
  }

  addEventHandlers() {
    this.el.addEventListener("click", this.handleClick);

    this.events.on(ModelEvents.addHabbit, this.handleAddHabbit);
    this.events.on(ModelEvents.removeHabbit, this.handleRemoveHabbit);
  }

  handleClick(event) {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;

    const action = actionEl.getAttribute("data-action");

    const habbitId = actionEl.getAttribute("data-habbit-id");

    switch (action) {
      case "selectHabbit": // todo: use constants
        return this.selectHabbit(habbitId);
      case "addHabbit":
        return this.addHabbit();
    }
  }

  selectHabbit(activeHabbitId) {
    this.model.setActiveHabbit(activeHabbitId);

    Array.from(this.menuEl.children).forEach((currHabbitButtonEl) => {
      const habbitId = currHabbitButtonEl.getAttribute("data-habbit-id");
      const isActive = activeHabbitId == habbitId;
      currHabbitButtonEl.classList.toggle("menu__item_active", isActive);
    });
  }

  addHabbit() {
    // todo: use constants for app events
    this.events.trigger("view:openAddHabbitModal");
  }

  handleAddHabbit(habbit) {
    // todo: DRY
    const habbitButtonContent = this.templates.habbitButton.render(habbit);
    this.menuEl.insertAdjacentHTML("beforeend", habbitButtonContent);
    this.selectHabbit(habbit.id);
  }

  handleRemoveHabbit(habbit) {
    const { id } = habbit;
    const habbitEl = this.menuEl.querySelector(`[data-habbit-id='${id}']`);
    habbitEl.remove();
  }

  render() {
    const { habbits, activeHabbitId } = this.model.get();

    this.el.innerHTML = this.templates.panel.render();
    this.menuEl = this.el.querySelector(".menu__list");

    habbits.forEach((habbit) => {
      const habbitButtonContent = this.templates.habbitButton.render(habbit);
      this.menuEl.insertAdjacentHTML("beforeend", habbitButtonContent);

      const habbitButtonEl = this.menuEl.lastElementChild;
      const isActive = habbit.id == activeHabbitId;

      habbitButtonEl.classList.toggle("menu__item_active", isActive);
    });

    return this;
  }
}
