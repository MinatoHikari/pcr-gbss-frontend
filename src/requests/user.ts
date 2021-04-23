import { axios } from 'boot/axios';
import { ResponseData, useReqWrapper } from 'src/compositions/useRequest';
import { RequestResponse } from 'src/requests/base';
import { User } from 'src/models/user';
import { LocalStorage } from 'quasar';
import { Guild } from 'src/models/guild';
import { OrderRecords } from 'src/models/records';

const { req } = useReqWrapper();

interface UserRequests {
    searchUser: (name: string, ID: number) => RequestResponse<ResponseData & { users: User[] }>;
    invite: (name: string) => RequestResponse<ResponseData>;
    reject: (userName: string, guild: string, type: string) => RequestResponse<ResponseData>;
    accept: (userName: string, guild: string) => RequestResponse<ResponseData>;
    fetchUser: () => RequestResponse<ResponseData & { user: User }>;
    getMyGuild: () => RequestResponse<ResponseData & { guild: Guild }>;
    fetchMyBattleOrder: (
        round: number
    ) => RequestResponse<ResponseData & { orders: OrderRecords[] }>;
}

export const userRequests: UserRequests = {
    searchUser: (name, ID) => {
        return req(axios.get(`/api/public/getUser?user=${name}&id=${ID}`), true);
    },
    invite: (name) => {
        return req(
            axios.post('/api/user/guild/invite', {
                userName: name
            }),
            true
        );
    },
    reject: (userName, guild, type) => {
        return req(
            axios.post('/api/user/guild/reject', {
                userName,
                guild,
                type
            }),
            true
        );
    },
    accept: (userName, guild) => {
        return req(
            axios.post('/api/user/guild/accept', {
                userName,
                guild,
                type: 'invite'
            }),
            true
        );
    },
    fetchUser: () => {
        return req(
            axios.get('/api/user/status/get', {
                headers: {
                    Authorization: `Bearer ${LocalStorage.getItem('JWT-token') as string}`
                }
            }),
            true
        );
    },
    getMyGuild: () => {
        return req(
            axios.get('/api/user/guild/getGuild', {
                headers: {
                    Authorization: `Bearer ${LocalStorage.getItem('JWT-token') as string}`
                }
            }),
            true
        );
    },
    fetchMyBattleOrder: (round) => {
        return req(
            axios.get(`/api/user/battle/searchOrder?round=${round}&bossNum=all&user=my`, {
                headers: {
                    Authorization: `Bearer ${LocalStorage.getItem('JWT-token') as string}`
                }
            }),
            true
        );
    }
};
