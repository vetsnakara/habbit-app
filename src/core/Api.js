import axios from "axios";

const API_ROOT = "http://localhost:8000";

// todo: extract parent and child class functionality
// todo: add events here (loading, error ...)
export class Api {
  constructor() {
    this.request = axios.create({
      headers: {
        Authorization: "123",
      },
    });
  }

  async get() {
    return this.request.get(`${API_ROOT}/habbits?_embed=days`);
  }
}
