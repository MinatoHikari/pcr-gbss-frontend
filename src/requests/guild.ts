import { axios } from 'boot/axios';
import useRequests, { ResponseData } from 'src/compositions/useRequest';
import { RequestResponse } from 'src/requests/base';

const { req } = useRequests()

interface GuildRequests {
    rejectApply: (userName: string, guild: string, type: string) => RequestResponse<ResponseData>
    acceptApply: (userName: string, guild: string) => RequestResponse<ResponseData>
}

export const guildRequests: GuildRequests = {
    rejectApply: (userName, guild, type) => {
        return req(axios
            .post('/api/user/guild/reject', {
                userName: userName,
                guild: guild,
                type: type
            }), true)
    },
    acceptApply: (userName, guild) => {
        return req(axios
            .post('/api/user/guild/accept', {
                userName: userName,
                guild: guild,
                type: 'join'
            }), true)
    }
}
