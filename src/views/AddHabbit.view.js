import { Popup } from "../components/Popup";

// todo: use twig tpl for modal base markup

export class AddHabbitView {
  constructor({ el, model, templates, events }) {
    this.el = el;
    this.model = model;
    this.templates = templates;
    this.events = events;

    this.popup = new Popup({
      el: this.el,
      selectors: {
        popupSelector: ".popup",
        bodySelector: ".popup__content",
        closeButtonSelector: "button.popup__close",
      },
      classHidden: "cover_hidden",
    });

    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.events.on("view:openAddHabbitModal", this.handleModalOpen);

    this.el.addEventListener("submit", this.handleSubmit);
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

    console.log(habbitData);

    this.model.addHabbit(habbitData);

    this.popup.close();
  }

  render() {
    return this;
  }
}
