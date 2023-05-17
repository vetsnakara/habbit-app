import { View } from "../core";
import { Popup } from "../components/Popup";
import { ViewEvents } from "../constants/events";

export class AddHabbitView extends View {
  init() {
    this.popup = new Popup({
      el: this.el,
      selectors: {
        popupSelector: ".popup",
        bodySelector: ".popup__content",
        closeButtonSelector: "button.popup__close",
      },
      classHidden: "cover_hidden",
    });
  }

  bindMethods() {
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  addEventHandlers() {
    this.el.addEventListener("submit", this.handleSubmit);
    this.events.on(ViewEvents.openAddHabbitModal, this.handleModalOpen);
  }

  handleModalOpen() {
    const body = this.templates.addHabbitModal.render();
    this.popup.open({ body });
  }

  handleSubmit(event) {
    event.preventDefault();

    const formEl = event.target;

    const formData = new FormData(formEl);

    const habbitData = Object.fromEntries(formData.entries());
    const { target } = habbitData;

    habbitData.target = Number(target);

    // todo: validation

    this.model.addHabbit(habbitData);

    this.popup.close();
  }

  render() {
    return this;
  }
}
