import { nanoid } from "nanoid";

// todo: use mutation inside model
// todo: clone to pass data outside

export class Model {
  static events = {
    addHabbit: "model:addHabbit",
    removeHabbit: "model:removeHabbit",
    addHabbitDay: "model:addHabbitDay",
    editHabbitDay: "model:editHabbitDay",
    removeHabbitDay: "model:removeHabbitDay",
    selectHabbit: "model:selectHabbit",
  };

  constructor({ data = {}, events }) {
    this.data = data;
    this.events = events;
  }

  get() {
    return JSON.parse(JSON.stringify(this.data));
  }

  set(data) {
    Object.assign(this.data, data);
  }

  // specified methods
  // todo: extract to child class
  setActiveHabbit(activeHabbitId) {
    this.set({ activeHabbitId });

    const activeHabbit = this.getActiveHabbit();

    this.events.trigger(Model.events.selectHabbit, activeHabbit);
  }

  getHabbits() {
    const { habbits } = this.get();
    return habbits;
  }

  getActiveHabbit() {
    const { activeHabbitId } = this.get();

    if (!activeHabbitId) return null;

    const activeHabbit = this.getHabbitById(activeHabbitId);
    const { target, days } = activeHabbit;

    return {
      ...activeHabbit,
      progress: this.calculateProgress(activeHabbit),
      isDone: days.length === target,
    };
  }

  removeActiveHabbit() {
    const { activeHabbitId } = this.data;
    this.removeHabbitById(activeHabbitId);
  }

  removeHabbitById(id) {
    const { habbits } = this.data;

    const index = habbits.findIndex((habbit) => habbit.id === id);

    const [removedHabbit] = habbits.splice(index, 1);
    this.data.activeHabbitId = null;

    this.events.trigger(Model.events.removeHabbit, removedHabbit);
  }

  addHabbit(habbitData) {
    const habbit = {
      id: nanoid(),
      days: [],
      ...habbitData,
    };

    this.set({
      habbits: [...this.data.habbits, habbit],
    });

    this.events.trigger(Model.events.addHabbit, habbit);
  }

  addDay(comment) {
    const { activeHabbitId, habbits } = this.get();
    const activeHabbit = this.getHabbitById(activeHabbitId);

    const { target, days } = activeHabbit;
    if (days.length === target) return;

    const day = { comment };
    const habbitIndex = habbits.findIndex((h) => h.id === activeHabbit.id);

    activeHabbit.days.push(day);
    habbits.splice(habbitIndex, 1, activeHabbit);

    this.set({ habbits });

    this.events.trigger(Model.events.addHabbitDay, day);
  }

  editDay({ index, comment }) {
    const { activeHabbitId, habbits } = this.get();
    const activeHabbit = this.getHabbitById(activeHabbitId);

    const day = { comment };
    const habbitIndex = habbits.findIndex((h) => h.id === activeHabbit.id);

    activeHabbit.days.splice(index, 1, day);
    habbits.splice(habbitIndex, 1, activeHabbit);

    this.set({ habbits });

    this.events.trigger(Model.events.editHabbitDay, { index, day });
  }

  removeDay(dayIndex) {
    const { activeHabbitId, habbits } = this.get();

    const activeHabbit = this.getHabbitById(activeHabbitId);
    activeHabbit.days.splice(dayIndex);

    const habbitIndex = habbits.findIndex((h) => h.id === activeHabbit.id);
    habbits.splice(habbitIndex, 1, activeHabbit);

    this.set({ habbits });

    this.events.trigger(Model.events.removeHabbitDay, dayIndex);
  }

  getHabbitById(id) {
    const { habbits } = this.get();
    const habbit = habbits.find((habbit) => habbit.id === id);
    return habbit || null;
  }

  getHabbitIndexById(id) {
    const { habbits } = this.get();
    const habbitIndex = habbits.findIndex((habbit) => habbit.id === id);
    return habbitIndex || null;
  }

  calculateProgress(habbit) {
    const { target, days } = habbit;
    const progress = ((days.length / target) * 100).toFixed(0);
    return progress;
  }
}
