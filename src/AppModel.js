import { nanoid } from "nanoid";

import { Model } from "./core/Model";
import { ModelEvents } from "./constants/events";

export class AppModel extends Model {
  setActiveHabbit(activeHabbitId) {
    this.set({ activeHabbitId });

    const activeHabbit = this.getActiveHabbit();

    this.events.trigger(ModelEvents.selectHabbit, activeHabbit);
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

    this.events.trigger(ModelEvents.removeHabbit, removedHabbit);
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

    this.events.trigger(ModelEvents.addHabbit, habbit);
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

    this.events.trigger(ModelEvents.addHabbitDay, day);
  }

  editDay({ index, comment }) {
    const { activeHabbitId, habbits } = this.get();
    const activeHabbit = this.getHabbitById(activeHabbitId);

    const day = { comment };
    const habbitIndex = habbits.findIndex((h) => h.id === activeHabbit.id);

    activeHabbit.days.splice(index, 1, day);
    habbits.splice(habbitIndex, 1, activeHabbit);

    this.set({ habbits });

    this.events.trigger(ModelEvents.editHabbitDay, { index, day });
  }

  removeDay(dayIndex) {
    const { activeHabbitId, habbits } = this.get();

    const activeHabbit = this.getHabbitById(activeHabbitId);
    activeHabbit.days.splice(dayIndex);

    const habbitIndex = habbits.findIndex((h) => h.id === activeHabbit.id);
    habbits.splice(habbitIndex, 1, activeHabbit);

    this.set({ habbits });

    this.events.trigger(ModelEvents.removeHabbitDay, dayIndex);
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
