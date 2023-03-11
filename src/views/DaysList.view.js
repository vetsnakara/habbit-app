import { Model } from "../Model";

// todo: use util to extract data from form
// todo: incapsulate (separate) ui event handlers from model event handlers
// todo: use modal before day deletion

export class DaysListView {
  constructor({ el, model, templates, events }) {
    this.el = el;
    this.model = model;
    this.templates = templates;
    this.events = events;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onAddDay = this.onAddDay.bind(this);
    this.onEditDay = this.onEditDay.bind(this);
    this.onRemoveDay = this.onRemoveDay.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.render = this.render.bind(this);

    this.el.addEventListener("submit", this.handleSubmit);
    this.el.addEventListener("click", this.handleClick);
    this.el.addEventListener("dblclick", this.handleDoubleClick);

    this.events.on(Model.events.selectHabbit, this.render);
    this.events.on(Model.events.removeHabbit, this.render);
    this.events.on(Model.events.addHabbitDay, this.onAddDay);
    this.events.on(Model.events.editHabbitDay, this.onEditDay);
    this.events.on(Model.events.removeHabbitDay, this.onRemoveDay);

    this.daysListEl = this.el.querySelector(".daysList");
    this.addDayEl = this.el.querySelector(".addDay");

    this.edit = false;

    this.render();
  }

  handleSubmit(event) {
    event.preventDefault();

    const { days } = this.model.getActiveHabbit();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const { comment } = data;
    const index = Number(data.index);

    const isNew = index === days.length;
    console.log("isNew", isNew);

    if (isNew) {
      this.model.addDay(comment);
      return;
    }

    // edit
    this.model.editDay({ index, comment });
  }

  handleDoubleClick(event) {
    const dayEl = event.target.closest("[data-day-index]");
    if (!dayEl) return;

    const index = Number(dayEl.getAttribute("data-day-index"));
    const { days } = this.model.getActiveHabbit();

    const { comment } = days[index];

    dayEl.outerHTML = this.templates.dayInput.render({
      index,
      comment,
    });
  }

  handleClick(event) {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;

    const dayEl = actionEl.closest("[data-day-index]");

    const action = actionEl.getAttribute("data-action");
    const dayIndex = dayEl.getAttribute("data-day-index");

    switch (action) {
      case "removeDay":
        return this.handleRemoveDay(dayIndex);
    }
  }

  handleRemoveDay(dayIndex) {
    this.model.removeDay(dayIndex);
  }

  onRemoveDay(dayIndex) {
    const dayElements = this.daysListEl.children;
    dayElements[dayIndex].remove();
    this.renderAddDay();
  }

  onAddDay(day) {
    const { days } = this.model.getActiveHabbit();

    // todo: DRY
    const dayContent = this.templates.day.render({
      ...day,
      index: days.length - 1,
    });

    this.daysListEl.insertAdjacentHTML("beforeend", dayContent);

    this.renderAddDay();
  }

  onEditDay({ index, day: { comment } }) {
    console.log("onEditDay", index, comment);

    const dayElements = this.daysListEl.children;
    const dayEl = dayElements[index];

    dayEl.outerHTML = this.templates.day.render({
      index,
      comment,
    });
  }

  renderAddDay() {
    const { days, isDone } = this.model.getActiveHabbit();

    this.addDayEl.style.display = isDone ? "none" : "block";

    const addDayContent = this.templates.dayInput.render({
      index: days.length,
    });

    this.addDayEl.innerHTML = "";
    this.addDayEl.insertAdjacentHTML("beforeend", addDayContent);

    const inputEl = this.addDayEl.querySelector("input");
    inputEl.focus();
  }

  render() {
    const activeHabbit = this.model.getActiveHabbit();

    this.el.style.display = activeHabbit ? "block" : "none";

    if (!activeHabbit) return;

    const { days } = activeHabbit;

    this.daysListEl.innerHTML = "";
    days.forEach((day, index) => {
      const dayContent = this.templates.day.render({
        ...day,
        index,
      });

      this.daysListEl.insertAdjacentHTML("beforeend", dayContent);
    });

    this.renderAddDay();

    return this;
  }
}
