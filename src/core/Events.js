export class Events {
  constructor() {
    this.events = {};
  }

  on(eventName, eventHandler) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(eventHandler);
  }

  off(eventName, eventHandler) {
    if (eventName && eventHandler) {
      // remove specific handler
      this.events[eventName] = this.events[eventName].filter(
        (h) => h !== eventHandler
      );
    } else if (eventName && !eventHandler) {
      // remove handlers for specific event
      delete this.events[eventName];
    } else if (!eventName && !eventHandler) {
      // remove handlers for all events
      this.events = {};
    }
  }

  trigger(eventName, data) {
    const handlers = this.events[eventName];
    if (!handlers) return;

    handlers.forEach((handler) => handler(data));
  }
}
