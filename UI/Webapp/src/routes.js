/**
 * Icons: https://themes-pixeden.com/font-demos/7-stroke/
 */
import Home from "./views/Home";
import Statistics from "views/Statistics";
import Studies from "views/Studies";
import NewStudy from "views/NewStudy";
import APIDoc from "./views/Swagger";
import Login from "./views/Login";
import Logout from "./views/Logout";


const routes = [
  {
    path: "/home",
    name: "Home",
    icon: "pe-7s-home",
    component: Home,
    isProtected: false
  },
  {
    path: "/newstudy",
    name: "New study",
    icon: "pe-7s-plugin",
    component: NewStudy,
    isProtected: true
  },
  {
    path: "/studies",
    name: "Studies",
    icon: "pe-7s-note2",
    component: Studies,
    isProtected: true
  },
  {
    path: "/statistics",
    name: "Statistics",
    icon: "pe-7s-graph",
    component: Statistics,
    isProtected: true
  },
  {
    path: "/api",
    name: "Api docs",
    icon: "pe-7s-news-paper",
    component: APIDoc,
    isProtected: true
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    isProtected: false,
    redirect: true
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
    isProtected: false,
    redirect: true
  }
]

export default routes;
