import axios from "axios";

// todo: use config to configure Api
export class Api {
  constructor(config) {
    const { baseURL } = config;

    this.request = axios.create({
      baseURL,
      headers: {
        Authorization: "123",
      },
    });
  }

  get(url) {
    return this.request.get(url);
  }

  post(url, data) {
    return this.request.post(url, data);
  }

  put(url, data) {
    return this.request.put(url, data);
  }

  patch(url, data) {
    return this.request.patch(url, data);
  }

  delete(url) {
    return this.request.delete(url);
  }
}
