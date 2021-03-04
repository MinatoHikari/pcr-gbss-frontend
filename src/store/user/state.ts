export interface User {
    name: string,
    email: string,
    guild: string
}

export interface UserState {
    user: User,
    guild: string,
    guildMembers: [],
    guildJoinApplications: [],
    guildInviteApplications: [],
    userJoinApplications: [],
    userInviteApplications: [],
    userBattleOrders: [],
    battleRecords: [],
    battleRecordList: {
        data: [],
        pagination: {}
    }
}

export default function () {
    return {
        user: {
            name: '',
            email: '',
            guild: ''
        },
        guild: '',
        guildMembers: [],
        guildJoinApplications: [],
        guildInviteApplications: [],
        userJoinApplications: [],
        userInviteApplications: [],
        userBattleOrders: [],
        battleRecords: [],
        battleRecordList: {
            data: [],
            pagination: {}
        }
    };
}
