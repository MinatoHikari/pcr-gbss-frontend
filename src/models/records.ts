export type OrderRecords = {
    ID: number;
    createdAt: string;
    userName: string;
    guild: string;
    round: number;
    bossNum: number;
};

export type BattleRecords = {
    ID: number;
    createdAt: string;
    userName: string;
    guild: string;
    damage: number;
    isCompensation: boolean;
    round: number;
    bossNum: number;
    rate: number;
    score: number;
    isOverkill: boolean;
};
