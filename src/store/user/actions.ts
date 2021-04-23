import useAjaxCallback from 'src/compositions/useRequest';
import { ActionContext } from 'vuex';
import { UserState } from './state';
import { MainState } from 'src/store';
import { useRouter } from 'vue-router';
import { userRequests } from 'src/requests/user';
import { guildRequests } from 'src/requests/guild';
import { User } from 'src/models/user';
import { Applications } from 'src/models/applications';

const { ajaxCallback } = useAjaxCallback();
const router = useRouter();

type Context = ActionContext<UserState, MainState>;

// 返回值为promise
export const fetchUser = async (context: Context) => {
    const { res, err } = await userRequests.fetchUser();
    if (err) console.log(err);
    if (res) {
        return await ajaxCallback(res.data, res.config, () => {
            context.commit('updateUserStatus', res.data.user);
        });
    }
};

export async function fetchGuild(context: Context, guildName: string) {
    const { res, err } = await guildRequests.fetchGuild(guildName);
    if (err) console.log(err);
    if (res) {
        return await ajaxCallback(res.data, null, () => {
            context.commit('updateGuildStatus', res.data.guild[0]);
        }).catch((err) => {
            console.log(err);
        });
    }
}

export async function fetchMyGuild(context: Context) {
    const { res, err } = await userRequests.getMyGuild();
    if (err) console.log(err);
    if (res) {
        return await ajaxCallback(res.data, res.config, () => {
            context.commit('updateGuildStatus', res.data.guild);
        }).catch((err) => {
            console.log(err);
        });
    }
}

// config {guildName: String, redirect: from prefetch }
export async function fetchGuildMembers(context: Context, config: { guildName: string }) {
    if (context.state.user.guild !== '') {
        const { res, err } = await guildRequests.fetchGuildMembers(config.guildName);
        if (err) console.log(err);
        if (res) {
            return await ajaxCallback(res.data, res.config, () => {
                context.commit('updateGuildMembers', res.data.members);
            }).catch((err) => {
                console.log(err);
            });
        }
    } else {
        router.replace('/user/guild/status').catch((err) => {
            console.log(err);
        });
    }
}

const commitForms = (context: Context, forms: Applications[]) => {
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
};

// config {guildName: String, redirect: from prefetch }
export async function fetchGuildApplications(context: Context) {
    if (context.state.user.guild !== '') {
        const { res, err } = await guildRequests.fetchGuildApplications();
        if (err) console.log(err);
        if (res) {
            return await ajaxCallback(
                res.data,
                res.config,
                () => {
                    commitForms(context, res.data.forms);
                },
                () => {
                    router.replace('/user/guild/status').catch((err) => {
                        console.log(err);
                    });
                }
            ).catch((err) => {
                console.log(err);
            });
        }
    } else {
        router.replace('/user/guild/status').catch((err) => {
            console.log(err);
        });
    }
}

// config {user: Obj, redirect: from prefetch }
export async function fetchUserApplications(context: Context, config: { user: User }) {
    const { res, err } = await guildRequests.fetchUserApplications(config.user.name);
    if (err) console.log(err);
    if (res) {
        return await ajaxCallback(res.data, res.config, () => {
            commitForms(context, res.data.forms);
        }).catch((err) => {
            console.log(err);
        });
    }
}

// config {guildName: String, redirect: from prefetch }
export async function fetchMyBattleOrder(context: Context) {
    const { res, err } = await userRequests.fetchMyBattleOrder(context.state.guild.round);
    if (err) console.log(err);
    if (res) {
        return await ajaxCallback(res.data, res.config, () => {
            context.commit('updateUserBattleOrders', res.data.orders);
        }).catch((err) => {
            console.log(err);
        });
    }
}

export async function fetchAllGuildRecords(context: Context) {
    const { res, err } = await guildRequests.fetchAllGuildRecords();
    if (err) console.log(err);
    if (res) {
        return await ajaxCallback(res.data, res.config, () => {
            context.commit('updateBattleRecordList', res.data.battleRecords);
        }).catch((err) => {
            console.log(err);
        });
    }
}
