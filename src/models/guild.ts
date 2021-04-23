import { User } from 'src/models/user';

export type Guild = {
    ID: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    master: string;
    subMaster: string;
    introduction: string;
    memberNum: number;
    area: string;
    round: number;
    bossNum: number;
    currentBossHP: number;
    currentBossTotalHP: number;
    currentBossScoreX: number;
    locker: string;
    isRecruiting: boolean;
    hangUpMembers: User[];
};
