import { Api } from "./core";

export class AppApi extends Api {
  getHabbits() {
    return this.get("/habbits?_embed=days");
  }

  addHabbit(data) {
    return this.post("/habbits", data);
  }

  removeHabbit(habbitId) {
    return this.delete(`/habbits/${habbitId}`);
  }

  addHabbitDay(data) {
    return this.post("/days", data);
  }

  removeDay(dayId) {
    return this.delete(`/days/${dayId}`);
  }

  editDay(dayId, data) {
    return this.patch(`/days/${dayId}`, data);
  }
}
