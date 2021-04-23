import { User } from 'src/models/user';
import { Applications } from 'src/models/applications';
import { BattleRecords } from 'src/models/records';
import { Guild } from 'src/models/guild';

export interface UserState {
    user: User;
    guild: Guild;
    guildMembers: [];
    guildJoinApplications: Applications[];
    guildInviteApplications: Applications[];
    userJoinApplications: Applications[];
    userInviteApplications: Applications[];
    userBattleOrders: [];
    battleRecords: BattleRecords[];
    battleRecordList: {
        data: BattleRecords[];
        pagination: Record<string, unknown>;
    };
}

export default function () {
    return {
        user: {
            ID: 0,
            name: '',
            email: '',
            guild: '',
            job: '',
            hangUp: false,
            SL: '',
            dailyBattleTimes: 0,
            isCompensation: false,
            createAt: ''
        },
        guild: {
            ID: 0,
            createdAt: '',
            updatedAt: '',
            name: '',
            master: '',
            subMaster: '',
            introduction: '',
            memberNum: 0,
            area: '',
            round: 0,
            bossNum: 0,
            currentBossHP: 0,
            currentBossTotalHP: 0,
            currentBossScoreX: 0,
            locker: '',
            isRecruiting: false,
            hangUpMembers: []
        },
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
    } as UserState;
}
