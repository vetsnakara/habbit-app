export class Popup {
  constructor({ el, ...options }) {
    this.el = el;
    this.popup = el.querySelector(".popup");

    this.options = options;

    const {
      selectors: { closeButtonSelector, popupSelector, bodySelector },
      closeOnClickOutside = true,
    } = options;

    this.body = this.el.querySelector(bodySelector);

    this.closeButton = this.el.querySelector(closeButtonSelector);
    this.closeButton.addEventListener("click", this.toggle);

    this.el.addEventListener("click", (event) => {
      const isClickOutside = !event.target.closest(popupSelector);
      if (closeOnClickOutside && isClickOutside) {
        this.close();
      }
    });

    window.addEventListener("keyup", (event) => {
      if (this.isOpen && event.key === "Escape") {
        this.close();
      }
    });
  }

  get isOpen() {
    const { classHidden } = this.options;
    return !this.el.classList.contains(classHidden);
  }

  open = ({ body }) => {
    const { classHidden } = this.options;
    this.body.innerHTML = body;
    this.el.classList.remove(classHidden);
  };

  close = () => {
    const { classHidden } = this.options;
    this.el.classList.add(classHidden);
  };

  toggle = () => {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  };
}
