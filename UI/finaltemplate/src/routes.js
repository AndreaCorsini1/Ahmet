/**
 *
 */
import NewStudy from "./views/NewStudy";
import Statistics from "views/Statistics.jsx";
import UserProfile from "views/UserProfile.jsx";
import Studies from "views/Studies.jsx";
import Typography from "views/Typography.jsx";
//import Icons from "views/Icons.jsx";
//import Notifications from "views/Notifications.jsx";

const dashboardRoutes = [
  {
    path: "/study",
    name: "New Study",
    icon: "pe-7s-plugin",
    component: NewStudy,
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
    path: "/studies",
    name: "Studies",
    icon: "pe-7s-note2",
    component: Studies,
    layout: "/ahmet"
  },
{
    path: "/typography",
    name: "Typography",
    icon: "pe-7s-news-paper",
    component: Typography,
    layout: "/ahmet"
  },
  /*{
    path: "/icons",
    name: "Icons (temporary)",
    icon: "pe-7s-science",
    component: Icons,
    layout: "/ahmet"
  },*/
  {
    path: "/user",
    name: "User Profile",
    icon: "pe-7s-user",
    component: UserProfile,
    layout: "/ahmet"
  },
/*  {
    path: "/notifications",
    name: "Notifications",
    icon: "pe-7s-bell",
    component: Notifications,
    layout: "/ahmet"
  }*/
];

export default dashboardRoutes;
