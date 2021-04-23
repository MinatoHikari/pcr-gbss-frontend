import { Mutation } from 'vuex';
import { UserState } from 'src/store/user/state';

// @param userStatus type: obj
export const updateUserStatus: Mutation<UserState> = (state, userStatus) => {
    state.user = userStatus;
};

export const updateUserGuild: Mutation<UserState> = (state, guildName) => {
    state.user.guild = guildName;
};

// @param guildStatus type: obj
export const updateGuildStatus: Mutation<UserState> = (state, guildStatus) => {
    state.guild = guildStatus;
};

// @param intro type: string
export const updateGuildIntroduction: Mutation<UserState> = (state, intro) => {
    state.guild.introduction = intro;
};

export const updateGuildRecruiting: Mutation<UserState> = (state, bool) => {
    state.guild.isRecruiting = bool;
};

// @param members type: array
export const updateGuildMembers: Mutation<UserState> = (state, members) => {
    state.guildMembers = members;
};

// @param forms type: array
export const updateGuildJoinApplications: Mutation<UserState> = (state, forms) => {
    state.guildJoinApplications = forms;
};

// @param forms type: array
export const updateGuildInviteApplications: Mutation<UserState> = (state, forms) => {
    state.guildInviteApplications = forms;
};

// @param forms type: array
export const updateUserJoinApplications: Mutation<UserState> = (state, forms) => {
    state.userJoinApplications = forms;
};

// @param forms type: array
export const updateUserInviteApplications: Mutation<UserState> = (state, forms) => {
    state.userInviteApplications = forms;
};

// @param orders type: array
export const updateUserBattleOrders: Mutation<UserState> = (state, orders) => {
    state.userBattleOrders = orders;
};

// @param username type: string
export const updateGuildBossLocker: Mutation<UserState> = (state, username) => {
    state.guild.locker = username;
};

// @param members type: array
export const updateGuildHangUpMembers: Mutation<UserState> = (state, members) => {
    state.guild.hangUpMembers = members;
};

// @param records type: array
export const updateBattleRecords: Mutation<UserState> = (state, records) => {
    state.battleRecords = records;
};

// @param records type: array
export const updateBattleRecordList: Mutation<UserState> = (state, records) => {
    state.battleRecordList.data = records;
    console.log(state);
};
