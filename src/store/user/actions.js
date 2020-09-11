import axios from "axios";
import { LocalStorage, Notify } from "quasar";

// 包装后返回promise
const ajaxCallback = async (data, request, success, error, redirect) => {
  if (data.code === 1) {
    if ("message" in data) {
      Notify.create({
        type: "positive",
        message: data.message
      });
    }

    if (success) {
      success();
    }
  } else if (data.code === 2) {
    // refreshToken返回一个promise，直接await
    await refreshToken(request, redirect);
  } else {
    Notify.create({
      type: "negative",
      message: data.message
    });
    if (error) {
      error();
    }
    if (data.code === -1) {
      LocalStorage.remove("JWT-token");
      redirect("/auth/login");
    }
  }
};
// 返回值为promise
const refreshToken = (request, redirect) => {
  return axios
    .post(
      "/api/public/refreshToken",
      {
        reqtype: "user",
        token: LocalStorage.getItem("JWT-token")
      },
      {
        headers: {
          Authorization: `Bearer ${LocalStorage.getItem("JWT-Refresh-token")}`
        }
      }
    )
    .then(async r => {
      switch (r.data.code) {
        case 1:
          LocalStorage.set("JWT-token", r.data.token);
          axios.defaults.headers.common.Authorization = `Bearer ${LocalStorage.getItem(
            "JWT-token"
          )}`;
          console.log(request);
          await request();
          break;
        case -1:
          Notify.create({
            type: "negative",
            message: r.data.message
          });
          LocalStorage.remove("JWT-token");
          LocalStorage.remove("JWT-Refresh-token");
          redirect("/auth/login");
          break;
        case 0:
          Notify.create({
            type: "negative",
            message: r.data.message
          });
          LocalStorage.remove("JWT-token");
          LocalStorage.remove("JWT-Refresh-token");
          redirect("/auth/login");
          break;
      }
    });
};
// 返回值为promise
export function fetchUser({ commit }, redirect) {
  const req = axios
    .get("/api/user/status/get", {
      headers: {
        Authorization: `Bearer ${LocalStorage.getItem("JWT-token")}`
      }
    })
    .then(async r => {
      // ajaxCallback返回promise，async阻塞直到运行完成,then函数再返回promise
      await ajaxCallback(
        r.data,
        fetchUser.bind(null, { commit }, redirect),
        () => {
          commit("updateUserStatus", r.data.user);
        },
        null,
        redirect
      );
    });

  return req;
}

export function fetchGuild({ commit, state }, guildName) {
  const req = axios.get(`/api/public/getGuild?guild=${guildName}`).then(r => {
    ajaxCallback(r.data, null, () => {
      commit("updateGuildStatus", r.data.guild[0]);
    });
  });
  return req;
}

export function fetchMyGuild({ commit, state }, redirect) {
  const req = axios
    .get(`/api/user/guild/getGuild`, {
      headers: {
        Authorization: `Bearer ${LocalStorage.getItem("JWT-token")}`
      }
    })
    .then(r => {
      ajaxCallback(
        r.data,
        fetchMyGuild.bind(null, { commit, state }, redirect),
        () => {
          commit("updateGuildStatus", r.data.guild);
        },
        null,
        redirect
      );
    });
  return req;
}

// config {guildName: String, redirect: from prefetch }
export function fetchGuildMembers({ commit, state }, config) {
  if (state.user.guild !== "") {
    const req = axios
      .get(`/api/public/getGuildMembers?guild=${config.guildName}`)
      .then(r => {
        console.log(r);
        ajaxCallback(
          r.data,
          fetchGuildMembers.bind(null, { commit, state }, config),
          () => {
            commit("updateGuildMembers", r.data.members);
          }
        );
      });
    return req;
  } else {
    config.redirect("/user/guild/status");
  }
}

// config {guildName: String, redirect: from prefetch }
export function fetchGuildApplications({ commit, state }, redirect) {
  if (state.user.guild !== "") {
    const req = axios
      .get(`/api/user/guild/getGuildApplications`, {
        headers: {
          Authorization: `Bearer ${LocalStorage.getItem("JWT-token")}`
        }
      })
      .then(r => {
        ajaxCallback(
          r.data,
          fetchGuildApplications.bind(null, { commit, state }, redirect),
          () => {
            const forms = r.data.forms;
            const joinForms = [];
            const inviteForms = [];
            for (let i = 0; i <= forms.length - 1; i++) {
              if (forms[i].type === "join") {
                joinForms.push(forms[i]);
              } else {
                inviteForms.push(forms[i]);
              }
            }
            commit("updateGuildJoinApplications", joinForms);
            commit("updateGuildInviteApplications", inviteForms);
          },
          () => {
            redirect("/user/guild/status");
          },
          redirect
        );
      });
    return req;
  } else {
    redirect("/user/guild/status");
  }
}

export function fetchUserAplications({ commit, state }, config) {
  const req = axios
    .get(`/api/user/status/getUserApplications?user=${config.user.name}`, {
      headers: {
        Authorization: `Bearer ${LocalStorage.getItem("JWT-token")}`
      }
    })
    .then(r => {
      ajaxCallback(
        r.data,
        fetchUserAplications.bind(null, { commit, state }, config),
        () => {
          const forms = r.data.forms;
          const joinForms = [];
          const inviteForms = [];
          for (let i = 0; i <= forms.length - 1; i++) {
            if (forms[i].type === "join") {
              joinForms.push(forms[i]);
            } else {
              inviteForms.push(forms[i]);
            }
          }
          commit("updateUserJoinApplications", joinForms);
          commit("updateUserInviteApplications", inviteForms);
        },
        null,
        config.redirect
      );
    });

  return req;
}

export function fetchMyBattleOrder({ commit, state }, redirect) {
  const req = axios
    .get(
      `/api/user/battle/searchOrder?round=${state.guild.round}&bossNum=all&user=my`,
      {
        headers: {
          Authorization: `Bearer ${LocalStorage.getItem("JWT-token")}`
        }
      }
    )
    .then(r => {
      ajaxCallback(
        r.data,
        fetchMyBattleOrder.bind(null, { commit, state }, redirect),
        () => {
          commit("updateUserBattleOrders", r.data.orders);
        },
        null,
        redirect
      );
    });
  return req;
}
