// @param userStatus type: obj
export function updateUserStatus(state, userStatus) {
  state.user = userStatus;
}

export function updateUserGuild(state, guildName) {
  state.user.guild = guildName;
}

// @param guildStatus type: obj
export function updateGuildStatus(state, guildStatus) {
  state.guild = guildStatus;
}

// @param intro type: string
export function updateGuildIntroduction(state, intro) {
  state.guild.introduction = intro;
}

export function updateGuildRecruiting(state, bool) {
  state.guild.isRecruiting = bool;
}

// @param members type: array
export function updateGuildMembers(state, members) {
  state.guildMembers = members;
}

// @param forms type: array
export function updateGuildJoinApplications(state, forms) {
  state.guildJoinApplications = forms;
}

// @param forms type: array
export function updateGuildInviteApplications(state, forms) {
  state.guildInviteApplications = forms;
}

// @param forms type: array
export function updateUserJoinApplications(state, forms) {
  state.userJoinApplications = forms;
}

// @param forms type: array
export function updateUserInviteApplications(state, forms) {
  state.userInviteApplications = forms;
}

// @param orders type: array
export function updateUserBattleOrders(state, orders) {
  state.userBattleOrders = orders;
}

// @param username type: string
export function updateGuildBossLocker(state, username) {
  state.guild.locker = username;
}

// @param members type: array
export function updateGuildHangUpMembers(state, members) {
  state.guild.hangUpMembers = members;
}

// @param records type: array
export function updateBattleRecords(state, records) {
  state.battleRecords = records;
}
