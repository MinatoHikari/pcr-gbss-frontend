import { axios } from 'boot/axios';
import { LocalStorage } from 'quasar';
import useAjaxCallback from 'src/compositions/useRequest';
import { ActionContext } from 'vuex'
import { UserState } from './state'
import { MainState } from 'src/store';
import { useRouter } from 'vue-router'

const { ajaxCallback } = useAjaxCallback()
const router = useRouter()

type Context = ActionContext<UserState, MainState>

// 返回值为promise
export const fetchUser = (context: Context) => {
    return axios
        .get('/api/user/status/get', {
            headers: {
                Authorization: `Bearer ${ LocalStorage.getItem('JWT-token') as string }`
            }
        })
        .then(async r => {
            // ajaxCallback返回promise，async阻塞直到运行完成,then函数再返回promise
            await ajaxCallback(
                r.data,
                fetchUser.bind(null, context),
                () => {
                    context.commit('updateUserStatus', r.data.user);
                }
            );
        });
}

export function fetchGuild(context: Context, guildName: string) {
    return axios.get(`/api/public/getGuild?guild=${ guildName }`).then(r => {
        ajaxCallback(r.data, null, () => {
            context.commit('updateGuildStatus', r.data.guild[0]);
        }).catch((err) => {
            console.log(err)
        });
    });
}

export function fetchMyGuild(context: Context) {
    return axios
        .get('/api/user/guild/getGuild', {
            headers: {
                Authorization: `Bearer ${ LocalStorage.getItem('JWT-token') as string }`
            }
        })
        .then(r => {
            ajaxCallback(
                r.data,
                fetchMyGuild.bind(null, context),
                () => {
                    context.commit('updateGuildStatus', r.data.guild);
                }
            ).catch((err) => {
                console.log(err)
            });
        });
}

// config {guildName: String, redirect: from prefetch }
export function fetchGuildMembers(context: Context, config) {
    if (context.state.user.guild !== '') {
        return axios
            .get(`/api/public/getGuildMembers?guild=${ config.guildName }`)
            .then(r => {
                console.log(r);
                ajaxCallback(
                    r.data,
                    fetchGuildMembers.bind(null, context, config),
                    () => {
                        context.commit('updateGuildMembers', r.data.members);
                    }
                );
            });
    } else {
        router.replace('/user/guild/status').catch((err) => {
            console.log(err)
        });
    }
}

// config {guildName: String, redirect: from prefetch }
export function fetchGuildApplications(context: Context) {
    if (context.state.user.guild !== '') {
        return axios
            .get('/api/user/guild/getGuildApplications', {
                headers: {
                    Authorization: `Bearer ${ LocalStorage.getItem('JWT-token') }`
                }
            })
            .then(r => {
                ajaxCallback(
                    r.data,
                    fetchGuildApplications.bind(null, context),
                    () => {
                        const forms = r.data.forms;
                        const joinForms = [];
                        const inviteForms = [];
                        for (let i = 0; i <= forms.length - 1; i++) {
                            if (forms[i].type === 'join') {
                                joinForms.push(forms[i]);
                            } else {
                                inviteForms.push(forms[i]);
                            }
                        }
                        context.commit('updateGuildJoinApplications', joinForms);
                        context.commit('updateGuildInviteApplications', inviteForms);
                    },
                    () => {
                        router.replace('/user/guild/status').catch((err) => {
                            console.log(err)
                        });
                    }
                );
            });
    } else {
        router.replace('/user/guild/status').catch((err) => {
            console.log(err)
        });
    }
}

// config {user: Obj, redirect: from prefetch }
export function fetchUserAplications(context: Context, config) {
    return axios
        .get(`/api/user/status/getUserApplications?user=${ config.user.name }`, {
            headers: {
                Authorization: `Bearer ${ LocalStorage.getItem('JWT-token') as string }`
            }
        })
        .then(r => {
            ajaxCallback(
                r.data,
                fetchUserAplications.bind(null, context, config),
                () => {
                    const forms = r.data.forms;
                    const joinForms = [];
                    const inviteForms = [];
                    for (let i = 0; i <= forms.length - 1; i++) {
                        if (forms[i].type === 'join') {
                            joinForms.push(forms[i]);
                        } else {
                            inviteForms.push(forms[i]);
                        }
                    }
                    context.commit('updateUserJoinApplications', joinForms);
                    context.commit('updateUserInviteApplications', inviteForms);
                }
            );
        });
}

// config {guildName: String, redirect: from prefetch }
export function fetchMyBattleOrder(context: Context) {
    return axios
        .get(
            `/api/user/battle/searchOrder?round=${ state.guild.round }&bossNum=all&user=my`,
            {
                headers: {
                    Authorization: `Bearer ${ LocalStorage.getItem('JWT-token') as string }`
                }
            }
        )
        .then(r => {
            ajaxCallback(
                r.data,
                fetchMyBattleOrder.bind(null, context),
                () => {
                    context.commit('updateUserBattleOrders', r.data.orders);
                }
            ).catch((err) => {
                console.log(err)
            });
        });
}

export function fetchAllGuildRecords(context: Context) {
    return axios
        .get('/api/user/battle/getBattleRecords?type=all', {
            headers: {
                Authorization: `Bearer ${ LocalStorage.getItem('JWT-token') as string }`
            }
        })
        .then(r => {
            ajaxCallback(
                r.data,
                fetchAllGuildRecords.bind(null, context),
                () => {
                    context.commit('updateBattleRecordList', r.data.battleRecords);
                }
            ).catch((err) => {
                console.log(err)
            });
        });
}
