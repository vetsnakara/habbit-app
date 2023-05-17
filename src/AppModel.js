import { Model } from "./core/Model";
import { ModelEvents } from "./constants/events";

// todo: mutate state directly

export class AppModel extends Model {
  async setData() {
    const { data: habbits = [] } = await this.api.getHabbits();

    this.data = {
      habbits,
      activeHabbitId: habbits[0]?.id,
    };
  }

  async addHabbit(habbitData) {
    const { data } = await this.api.addHabbit(habbitData);

    const habbit = {
      ...data,
      days: [],
    };

    this.set({
      habbits: [...this.data.habbits, habbit],
      activeHabbitId: habbit.id,
    });

    this.events.trigger(ModelEvents.addHabbit, habbit);
  }

  async removeActiveHabbit() {
    const { activeHabbitId } = this.data;
    await this.api.removeHabbit(activeHabbitId);
    this.removeHabbitById(activeHabbitId);
  }

  async addDay(comment) {
    const { activeHabbitId, habbits } = this.get();
    const activeHabbit = this.getHabbitById(activeHabbitId);

    const { target, days } = activeHabbit;
    if (days.length === target) return;

    const { data: day } = await this.api.addHabbitDay({
      habbitId: activeHabbitId,
      dayNum: days.length + 1,
      comment,
    });

    const habbitIndex = habbits.findIndex((h) => h.id === activeHabbit.id);

    activeHabbit.days.push(day);
    habbits.splice(habbitIndex, 1, activeHabbit);

    this.set({ habbits });

    console.log(JSON.parse(JSON.stringify(this.data)));

    this.events.trigger(ModelEvents.addHabbitDay, day);

    console.log(JSON.parse(JSON.stringify(this.data)));
  }

  async removeDay(dayId) {
    await this.api.removeDay(dayId);

    const { activeHabbitId } = this.data;
    const activeHabbit = this.getHabbitById(activeHabbitId);
    const dayIndex = activeHabbit.days.findIndex((d) => d.id === Number(dayId));

    activeHabbit.days.splice(dayIndex, 1);

    this.events.trigger(ModelEvents.removeHabbitDay, dayId);
  }

  async editDay({ id, comment }) {
    const { data: day } = await this.api.editDay(id, { comment });

    const { activeHabbitId } = this.data;
    const activeHabbit = this.getHabbitById(activeHabbitId);
    const { days } = activeHabbit;

    const dayIndex = days.findIndex((d) => d.id === Number(id));
    days[dayIndex].comment = comment;

    this.events.trigger(ModelEvents.editHabbitDay, day);
  }

  setActiveHabbit(activeHabbitId) {
    this.set({ activeHabbitId: Number(activeHabbitId) });

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

  removeHabbitById(id) {
    const { habbits } = this.data;

    const index = habbits.findIndex((habbit) => habbit.id === id);

    const [removedHabbit] = habbits.splice(index, 1);
    this.data.activeHabbitId = null;

    this.events.trigger(ModelEvents.removeHabbit, removedHabbit);
  }

  getHabbitById(id) {
    const { habbits } = this.data;
    const habbit = habbits.find((habbit) => habbit.id == id);
    return habbit || null;
  }

  getHabbitIndexById(id) {
    const { habbits } = this.get();
    const habbitIndex = habbits.findIndex((habbit) => habbit.id == id);
    return habbitIndex || null;
  }

  calculateProgress(habbit) {
    const { target, days } = habbit;
    const progress = ((days.length / target) * 100).toFixed(0);
    return progress;
  }
}
