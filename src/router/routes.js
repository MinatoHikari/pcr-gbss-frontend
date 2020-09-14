import Index from "pages/Index.vue";
import SiderUser from "layouts/Sider-user.vue";
import SideAuth from "layouts/Sider-auth.vue";
import SiderRightUser from "layouts/Sider-right-user";
import Auth from "layouts/AuthLayout.vue";
import User from "layouts/UserLayout.vue";

const routes = [{
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{
        path: "",
        components: {
          default: Index,
          sider: SideAuth
        }
      },
      {
        path: "auth",
        components: {
          default: Auth,
          sider: SideAuth
        },
        children: [{
            path: "",
            beforeEnter: (to, from, next) => {
              next("/auth/login");
            }
          },
          {
            path: "register",
            component: () => import("pages/Register.vue")
          },
          {
            path: "login",
            component: () => import("pages/Login.vue")
          },
          {
            path: "password-reset",
            component: () => import("pages/PasswordReset.vue")
          }
        ]
      },
      {
        path: "user",
        components: {
          default: User,
          sider: SiderUser,
          "sider-right": SiderRightUser
        },
        children: [{
            path: "",
            beforeEnter: (to, from, next) => {
              next("/user/home");
            }
          },
          {
            path: "home",
            component: () => import("pages/user/Index.vue")
          },
          {
            path: "HR",
            component: () => import("pages/user/HR.vue")
          },
          {
            path: "search",
            component: () => import("pages/user/Search.vue")
          },
          {
            path: "logout",
            component: () => import("pages/user/Logout.vue")
          },
          {
            path: "guild",
            component: () => import("layouts/UserGuildLayout.vue"),
            children: [{
                path: "",
                beforeEnter: (to, from, next) => {
                  next("/user/guild/status");
                }
              }, {
                path: "battle",
                component: () => import("pages/user/guild/Battle.vue")
              },
              {
                path: "status",
                component: () => import("pages/user/guild/Index.vue")
              },
              {
                path: "create",
                component: () => import("pages/user/guild/Create.vue")
              },
              {
                path: "members",
                component: () => import("pages/user/guild/Members.vue")
              },
              {
                path: "applications",
                component: () => import("pages/user/guild/Applications.vue")
              },
              {
                path: "search",
                component: () => import("pages/user/guild/Search.vue")
              },
              {
                path: "records",
                component: () => import("pages/user/guild/Records.vue")
              }
            ]
          }
        ]
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
