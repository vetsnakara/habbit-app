import { View } from "../core";
import { ModelEvents } from "../constants/events";

export class DaysListView extends View {
  constructor(options) {
    super(options);

    this.daysListEl = this.el.querySelector(".daysList");
    this.addDayEl = this.el.querySelector(".addDay");

    this.edit = false;

    this.render();
  }

  bindMethods() {
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onAddDay = this.onAddDay.bind(this);
    this.onEditDay = this.onEditDay.bind(this);
    this.onRemoveDay = this.onRemoveDay.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.render = this.render.bind(this);
  }

  addEventHandlers() {
    this.el.addEventListener("submit", this.handleSubmit);
    this.el.addEventListener("click", this.handleClick);
    this.el.addEventListener("dblclick", this.handleDoubleClick);

    this.events.on(ModelEvents.selectHabbit, this.render);
    this.events.on(ModelEvents.removeHabbit, this.render);
    this.events.on(ModelEvents.addHabbitDay, this.onAddDay);
    this.events.on(ModelEvents.editHabbitDay, this.onEditDay);
    this.events.on(ModelEvents.removeHabbitDay, this.onRemoveDay);
  }

  handleSubmit(event) {
    event.preventDefault();

    const { days } = this.model.getActiveHabbit();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const { id, comment } = data;

    if (!id) {
      this.model.addDay(comment);
      return;
    }

    // edit
    this.model.editDay(data);
  }

  handleDoubleClick(event) {
    const dayEl = event.target.closest("[data-day-id]");
    if (!dayEl) return;

    const id = Number(dayEl.getAttribute("data-day-id"));
    const { days } = this.model.getActiveHabbit();

    const day = days.find((day) => day.id === id);

    dayEl.outerHTML = this.templates.dayInput.render(day);
  }

  handleClick(event) {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;

    const dayEl = actionEl.closest("[data-day-id]");

    const action = actionEl.getAttribute("data-action");
    const dayId = dayEl.getAttribute("data-day-id");

    switch (action) {
      case "removeDay":
        return this.handleRemoveDay(dayId);
    }
  }

  handleRemoveDay(dayIndex) {
    this.model.removeDay(dayIndex);
  }

  onRemoveDay(dayId) {
    const dayEl = this.daysListEl.querySelector(`[data-day-id="${dayId}"]`);
    dayEl.remove();
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

  onEditDay(day) {
    const { id } = day;
    console.log("id", id);

    const dayEl = this.daysListEl.querySelector(`[data-day-id="${id}"]`);
    console.log("dayEl", dayEl);

    dayEl.outerHTML = this.templates.day.render(day);
  }

  renderAddDay() {
    const { days, isDone } = this.model.getActiveHabbit();

    this.addDayEl.style.display = isDone ? "none" : "block";

    const addDayContent = this.templates.dayInput.render({
      dayNum: days.length + 1,
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
    days.forEach((day) => {
      const dayContent = this.templates.day.render(day);

      this.daysListEl.insertAdjacentHTML("beforeend", dayContent);
    });

    this.renderAddDay();

    return this;
  }
}
