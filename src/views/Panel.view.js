import { Model } from "../Model";

export class PanelView {
  constructor({ el, model, templates, events }) {
    this.el = el;
    this.model = model;
    this.templates = templates;
    this.events = events;

    // add view listeners
    this.el.addEventListener("click", this.handleClick.bind(this));

    // add model listeners
    this.events.on(Model.events.addHabbit, this.handleAddHabbit.bind(this));
    this.events.on(
      Model.events.removeHabbit,
      this.handleRemoveHabbit.bind(this)
    );

    this.render();
  }

  // root view click handler
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

  // select habbit
  selectHabbit(activeHabbitId) {
    this.model.setActiveHabbit(activeHabbitId);

    Array.from(this.menuEl.children).forEach((currHabbitButtonEl) => {
      const habbitId = currHabbitButtonEl.getAttribute("data-habbit-id");
      currHabbitButtonEl.classList.toggle(
        "menu__item_active",
        activeHabbitId === habbitId
      );
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
      habbitButtonEl.classList.toggle(
        "menu__item_active",
        activeHabbitId === habbit.id
      );
    });

    return this;
  }
}
