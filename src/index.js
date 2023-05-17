import { App, Events, Api } from "./core";
import { viewsConfig } from "./views";
import { getTemplates } from "./utils/getTemplates";

import { AppModel } from "./AppModel";
import { AppApi } from "./AppApi";

init();

// todo: move init to core
function init() {
  const templates = getTemplates();

  const events = new Events();

  const api = new AppApi({
    baseURL: "http://localhost:8000",
  });

  const model = new AppModel({
    events,
    api,
  });

  const app = new App({
    model,
    events,
    templates,
    viewsConfig,
  });

  app.init();
}
