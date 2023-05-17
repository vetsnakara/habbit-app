import { AddHabbitView } from "./AddHabbit.view";
import { DaysListView } from "./DaysList.view";
import { HeaderView } from "./Header.view";
import { NoHabbitView } from "./NoHabbit.view";
import { PanelView } from "./Panel.view";

export const viewsConfig = {
  panel: {
    Component: PanelView,
    selector: ".panel",
  },
  addHabbit: {
    Component: AddHabbitView,
    selector: ".cover",
  },
  header: {
    Component: HeaderView,
    selector: ".header",
  },
  daysList: {
    Component: DaysListView,
    selector: ".activeHabbit",
  },
  noHabbit: {
    Component: NoHabbitView,
    selector: ".noHabbitMessage",
  },
};
