/**
 * Icons: https://themes-pixeden.com/font-demos/7-stroke/
 */
import Home from "./views/Home";
import Statistics from "views/Statistics";
import Studies from "views/Studies";
import NewStudy from "views/NewStudy";
import APIDoc from "./views/Swagger";

const dashboardRoutes = [
  {
    path: "/home",
    name: "Home",
    icon: "pe-7s-home",
    component: Home,
    layout: "/ahmet"
  },
  {
    path: "/newstudy",
    name: "New study",
    icon: "pe-7s-plugin",
    component: NewStudy,
    layout: "/ahmet",
  },
  {
    path: "/studies",
    name: "Studies",
    icon: "pe-7s-note2",
    component: Studies,
    layout: "/ahmet"
  },
  {
    path: "/statistics",
    name: "Statistics",
    icon: "pe-7s-graph",
    component: Statistics,
    layout: "/ahmet"
  },
  {
    path: "/api",
    name: "Api docs",
    icon: "pe-7s-news-paper",
    component: APIDoc,
    layout: "/ahmet",
  }
];

export default dashboardRoutes