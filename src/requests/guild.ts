import { axios } from 'boot/axios';
import { ResponseData, useReqWrapper } from 'src/compositions/useRequest';
import { RequestResponse } from 'src/requests/base';
import { Guild } from 'src/models/guild';
import { BattleRecords, OrderRecords } from 'src/models/records';
import { User } from 'src/models/user';
import { Applications } from 'src/models/applications';
import { LocalStorage } from 'quasar';

const { req } = useReqWrapper();

interface GuildRequests {
    fetchGuild: (guild: string) => RequestResponse<ResponseData & { guild: Guild[] }>;
    rejectApply: (userName: string, guild: string, type: string) => RequestResponse<ResponseData>;
    acceptApply: (userName: string, guild: string) => RequestResponse<ResponseData>;
    dismiss: (member: string) => RequestResponse<ResponseData>;
    searchGuild: (name: string, id: number) => RequestResponse<ResponseData & { guild: Guild }>;
    joinGuild: (guild: string) => RequestResponse<ResponseData>;
    createGuild: (
        name: string,
        introduction: string,
        area: string,
        master: string
    ) => RequestResponse<ResponseData>;
    dissolveGuild: (password: string) => RequestResponse<ResponseData>;
    exitGuild: () => RequestResponse<ResponseData>;
    updateSettings: (
        key: string,
        value: string
    ) => RequestResponse<ResponseData & { guild: Guild }>;
    fetchGuildMembers: (guildName: string) => RequestResponse<ResponseData & { members: User[] }>;
    fetchGuildApplications: () => RequestResponse<ResponseData & { forms: Applications[] }>;
    fetchUserApplications: (
        userName: string
    ) => RequestResponse<ResponseData & { forms: Applications[] }>;
    fetchAllGuildRecords: () => RequestResponse<ResponseData & { battleRecords: BattleRecords[] }>;
}

type BattleRequests = {
    updateBattleRecords: (
        records: BattleRecords[],
        after?: boolean
    ) => RequestResponse<ResponseData & { battleRecords: BattleRecords[] }>;
    orderBoss: (
        round: number,
        bossNum: number
    ) => RequestResponse<ResponseData & { order: OrderRecords }>;
    searchOrder: (
        round: number,
        bossNum: number
    ) => RequestResponse<ResponseData & { orders: OrderRecords[] }>;
    cancelOrder: (user: string, ID: number) => RequestResponse<ResponseData>;
    enterIn: (guild: string) => RequestResponse<ResponseData>;
    clear: (
        damage: number
    ) => RequestResponse<
        ResponseData & {
            guild: Guild;
            currentBossHP: number;
            currentBossTotalHP: number;
            currentBossScoreX: number;
            hangUpMembers: User[];
            user: User;
        }
    >;
    unlock: (guild: string) => RequestResponse<ResponseData>;
    hangUp: () => RequestResponse<ResponseData & { user: User }>;
    saveAndLoad: () => RequestResponse<ResponseData & { user: User }>;
    revert: () => RequestResponse<
        ResponseData & {
            guild: Guild;
            currentBossHP: number;
            currentBossTotalHP: number;
            currentBossScoreX: number;
            hangUpMembers: User[];
            user: User;
        }
    >;
    resetBossStatus: (
        ifclearRecord: boolean
    ) => RequestResponse<
        ResponseData & {
            guild: Guild;
            user: User;
        }
    >;
};

export const guildRequests: GuildRequests = {
    fetchGuild: (guild) => {
        return req(axios.get('/api/public/getGuild?', { params: { guild } }), false);
    },
    rejectApply: (userName, guild, type) => {
        return req(
            axios.post('/api/user/guild/reject', {
                userName: userName,
                guild: guild,
                type: type
            }),
            true
        );
    },
    acceptApply: (userName, guild) => {
        return req(
            axios.post('/api/user/guild/accept', {
                userName: userName,
                guild: guild,
                type: 'join'
            }),
            true
        );
    },
    searchGuild: (name, id) => {
        return req(
            axios.get('/api/public/getGuild', {
                params: {
                    guild: name,
                    id
                }
            }),
            true
        );
    },
    joinGuild: (guild) => {
        return req(
            axios.post('/api/user/guild/join', {
                guild
            }),
            true
        );
    },
    createGuild: (name, introduction, area, master) => {
        return req(
            axios.post('/api/user/guild/create', {
                name,
                introduction,
                area,
                master
            }),
            true
        );
    },
    dismiss: (member) => {
        return req(
            axios.post('/api/user/guild/dismiss', {
                member
            }),
            true
        );
    },
    dissolveGuild: (password) => {
        return req(
            axios.post('/api/user/guild/dissolve', {
                password
            }),
            true
        );
    },
    exitGuild: () => {
        return req(axios.get('/api/user/guild/exit'), true);
    },
    updateSettings: (key, value) => {
        return req(
            axios.post('/api/user/guild/updateSettings', {
                key,
                value
            }),
            true
        );
    },
    fetchGuildMembers: (guildName) => {
        return req(
            axios.get('/api/public/getGuildMembers', {
                params: {
                    guild: guildName
                }
            }),
            true
        );
    },
    fetchGuildApplications: () => {
        return req(
            axios.get('/api/user/guild/getGuildApplications', {
                headers: {
                    Authorization: `Bearer ${LocalStorage.getItem('JWT-token') as string}`
                }
            }),
            true
        );
    },
    fetchUserApplications: (userName) => {
        return req(
            axios.get('/api/user/status/getUserApplications', {
                headers: {
                    Authorization: `Bearer ${LocalStorage.getItem('JWT-token') as string}`
                },
                params: {
                    user: userName
                }
            }),
            true
        );
    },
    fetchAllGuildRecords: () => {
        return req(
            axios.get('/api/user/battle/getBattleRecords?type=all', {
                headers: {
                    Authorization: `Bearer ${LocalStorage.getItem('JWT-token') as string}`
                }
            }),
            true
        );
    }
};

export const battleRequests: BattleRequests = {
    updateBattleRecords: (records, after = true) => {
        if (records.length === 0) {
            return req(axios.get('/api/user/battle/getBattleRecords'), true);
        } else {
            return req(
                axios.get('/api/user/battle/getBattleRecords', {
                    params: {
                        time: `${
                            after ? records[0].createdAt : records[records.length - 1].createdAt
                        }${after ? '&type=after' : ''}`.replace('+', '%2B')
                    }
                }),
                true
            );
        }
    },
    orderBoss: (round, bossNum) => {
        return req(
            axios.post('/api/user/battle/order', {
                round,
                bossNum
            }),
            true
        );
    },
    searchOrder: (round, bossNum) => {
        return req(
            axios.get('/api/user/battle/searchOrder', {
                params: {
                    round,
                    bossNum
                }
            }),
            true
        );
    },
    cancelOrder: (user, ID) => {
        return req(
            axios.post('/api/user/battle/cancelOrder', {
                user,
                ID
            }),
            true
        );
    },
    enterIn: (guild) => {
        return req(
            axios.get('/api/user/battle/enterIn', {
                params: {
                    guild
                }
            }),
            true
        );
    },
    clear: (damage) => {
        return req(
            axios.post('/api/user/battle/clear', {
                damage
            }),
            true
        );
    },
    unlock: (guild) => {
        return req(axios.get('/api/user/battle/unlock', { params: { guild } }), true);
    },
    hangUp: () => {
        return req(axios.get('/api/user/battle/hangUp'), true);
    },
    saveAndLoad: () => {
        return req(axios.get('/api/user/battle/saveAndLoad'), true);
    },
    revert: () => {
        return req(axios.get('/api/user/battle/revert'), true);
    },
    resetBossStatus: (ifclearRecord) => {
        let url = '/api/user/battle/resetBossStatus';
        if (ifclearRecord) {
            url = '/api/user/battle/resetBossStatus?clear=true';
        }
        return req(axios.get(url), true);
    }
};
