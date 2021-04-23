<template>
    <q-page padding>
        <div class="row q-col-gutter-md">
            <div class="col-12">
                <q-card>
                    <q-card-section>
                        <div class="text-h6">
                            <q-avatar class="q-mr-sm" color="teal-4" size="lg" text-color="white">
                                {{ user.name[0].toUpperCase() }}
                            </q-avatar>
                            <span class="q-mr-sm">{{ user.name }}</span>
                            <q-badge v-if="user.hangUp" outline color="red" label="挂树" />
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-section>
                        <div class="row">
                            <div class="col-12 col-md-6">
                                <q-chip
                                    square
                                    outline
                                    color="deep-purple-8"
                                    icon="las la-feather-alt"
                                >
                                    今日出刀
                                </q-chip>
                                <q-chip outline color="deep-orange-6">
                                    {{ user.dailyBattleTimes + ' 刀' }}
                                </q-chip>
                            </div>
                            <div class="col-12 col-md-6">
                                <q-chip
                                    square
                                    outline
                                    color="deep-purple-4"
                                    icon="las la-battery-half"
                                >
                                    当前刀
                                </q-chip>
                                <q-chip
                                    outline
                                    :color="user.isCompensation ? 'lime-8' : 'green-5'"
                                    :icon="
                                        user.isCompensation
                                            ? 'las la-battery-quarter'
                                            : 'las la-battery-full'
                                    "
                                >
                                    {{ user.isCompensation ? '补偿刀' : '完整刀' }}
                                </q-chip>
                            </div>
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn
                            color="blue-6"
                            to="/user/guild/records"
                            label="查看出刀统计"
                            icon="las la-clipboard-list"
                        ></q-btn>
                        <q-btn
                            v-if="user.job === 'master'"
                            label="重置Boss状态"
                            color="red"
                            icon="update"
                        >
                            <q-popup-proxy :offset="[0, 10]">
                                <q-banner>
                                    <template v-slot:avatar>
                                        <q-icon name="warning" color="red" />
                                    </template>
                                    <span>确认重置Boss状态吗？</span>
                                    <template v-slot:action>
                                        <q-toggle
                                            v-model="ifclearRecord"
                                            label="清空出刀记录"
                                            class="q-mr-md"
                                        />
                                        <q-btn color="red" label="取消" v-close-popup />
                                        <q-btn
                                            color="blue-6"
                                            label="确定"
                                            @click="resetBossStatus"
                                            v-close-popup="2"
                                        />
                                    </template>
                                </q-banner>
                            </q-popup-proxy>
                        </q-btn>
                    </q-card-actions>
                </q-card>
            </div>
            <div class="col-12">
                <q-card>
                    <q-card-section>
                        <div class="text-h6 row items-center">
                            <q-icon class="q-mr-sm" size="sm" name="pets" />
                            <span class="q-mr-sm">BOSS状态</span>
                            <q-btn
                                round
                                color="pink-4"
                                icon="loop"
                                size="sm"
                                class="q-mr-sm"
                                @click="refreshBossStatus"
                            >
                                <q-tooltip> 刷新Boss状态</q-tooltip>
                            </q-btn>
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-section>
                        <div>
                            <q-badge class="q-mr-sm" outline color="positive" label="HP" />
                            <q-badge
                                outline
                                class="q-mr-sm"
                                color="pink-4"
                                :label="guild.bossNum + '号Boss'"
                            />
                            <q-badge
                                outline
                                color="purple-5"
                                :label="'倍率 x ' + guild.currentBossScoreX"
                            />
                        </div>
                        <q-linear-progress
                            rounded
                            size="25px"
                            :value="currentBossHPPervent"
                            color="pink-4"
                            class="q-mt-sm"
                        >
                            <div class="absolute-full flex flex-center">
                                <q-badge
                                    color="white"
                                    text-color="pink-4"
                                    :label="currentBossHPStatus"
                                />
                            </div>
                        </q-linear-progress>
                        <div class="q-mt-md">
                            <q-chip square outline color="orange" icon="las la-redo-alt">
                                当前周目
                            </q-chip>
                            <q-chip outline color="cyan-6">
                                {{ guild.round + ' 周目' }}
                            </q-chip>
                        </div>
                        <div class="q-mt-md">
                            <q-chip
                                square
                                outline
                                color="primary"
                                text-color="white"
                                icon="las la-key"
                            >
                                锁定状态
                            </q-chip>
                            <q-chip
                                outline
                                :color="lockColor"
                                :text-color="lockColor"
                                :icon="guild.locker === '' ? 'las la-unlock' : 'las la-lock'"
                            >
                                {{ guild.locker === '' ? '未锁定' : '已锁定' }}
                            </q-chip>
                            <q-chip
                                v-if="guild.locker !== ''"
                                outline
                                color="indigo-6"
                                text-color="indigo-6"
                                icon="las la-gamepad"
                            >
                                {{ guild.locker + ' 正在出刀' }}
                            </q-chip>
                        </div>
                        <div class="q-mt-md">
                            <q-chip square outline color="grey-8" icon="las la-user-lock">
                                上树的成员
                            </q-chip>
                            <q-chip
                                v-for="user in guild.hangUpMembers"
                                :key="user"
                                outline
                                color="indigo-6"
                                text-color="indigo-6"
                                icon="las la-skull-crossbones"
                            >
                                {{ user.name }}
                            </q-chip>
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-section>
                        <div class="row q-col-gutter-md">
                            <div class="col-12">
                                <q-btn-group spread>
                                    <q-btn-dropdown
                                        menu-fit
                                        @before-hide="showSearchResult = false"
                                        color="blue-6"
                                        label="预约出刀"
                                        icon="security"
                                    >
                                        <q-list>
                                            <q-item-label header
                                                >选择要预约的Boss
                                                <q-badge
                                                    outline
                                                    color="blue-6"
                                                    :label="orderBossNum + '号Boss'"
                                                />
                                            </q-item-label>
                                            <q-item>
                                                <q-item-section>
                                                    <q-slider
                                                        v-model="orderBossNum"
                                                        :min="1"
                                                        :max="5"
                                                        label
                                                        color="blue-6"
                                                    />
                                                </q-item-section>
                                            </q-item>
                                            <q-item>
                                                <q-item-section>
                                                    <q-btn
                                                        color="pink-4"
                                                        @click="searchOrder"
                                                        name="volume_up"
                                                        label="查询"
                                                    />
                                                </q-item-section>
                                                <q-item-section>
                                                    <q-btn
                                                        color="blue-6"
                                                        @click="orderBoss"
                                                        name="volume_up"
                                                        label="预约"
                                                    />
                                                </q-item-section>
                                            </q-item>
                                        </q-list>
                                    </q-btn-dropdown>
                                    <q-btn
                                        color="orange-5"
                                        :disable="
                                            guild.locker !== '' ||
                                            user.hangUp ||
                                            (!user.isCompensation && user.dailyBattleTimes >= 3)
                                        "
                                        label="申请出刀"
                                        icon="gps_fixed"
                                        @click="enterIn"
                                    />
                                </q-btn-group>
                            </div>
                            <div class="col-12">
                                <q-btn-group spread>
                                    <q-btn-dropdown
                                        :disable="guild.locker !== user.name && !user.hangUp"
                                        label="结算"
                                        icon="insert_chart_outlined"
                                        color="purple"
                                    >
                                        <q-list>
                                            <q-item>
                                                <q-item-section>
                                                    <q-input
                                                        v-model="damage"
                                                        min="1"
                                                        :max="guild.currentBossHP"
                                                        type="number"
                                                        label="请输入结算伤害"
                                                        hint="如果已击杀Boss请直接点击收尾"
                                                        @blur="fixDamageValue"
                                                    />
                                                </q-item-section>
                                            </q-item>
                                            <q-item>
                                                <q-item-section>
                                                    <q-btn
                                                        color="pink-4"
                                                        name="volume_up"
                                                        label="收尾"
                                                    >
                                                        <q-popup-proxy :offset="[0, 10]">
                                                            <q-banner>
                                                                <template v-slot:avatar>
                                                                    <q-icon
                                                                        name="warning"
                                                                        color="warning"
                                                                    />
                                                                </template>
                                                                确定已经击杀Boss了吗？
                                                                <template v-slot:action>
                                                                    <q-btn
                                                                        color="red"
                                                                        label="取消"
                                                                        v-close-popup
                                                                    />
                                                                    <q-btn
                                                                        color="blue-6"
                                                                        label="确定"
                                                                        @click="clear(true)"
                                                                        v-close-popup="2"
                                                                    />
                                                                </template>
                                                            </q-banner>
                                                        </q-popup-proxy>
                                                    </q-btn>
                                                </q-item-section>
                                                <q-item-section>
                                                    <q-btn
                                                        color="blue-6"
                                                        name="volume_up"
                                                        label="报刀"
                                                    >
                                                        <q-popup-proxy :offset="[0, 10]">
                                                            <q-banner>
                                                                <template v-slot:avatar>
                                                                    <q-icon
                                                                        name="warning"
                                                                        color="warning"
                                                                    />
                                                                </template>
                                                                <span>
                                                                    伤害
                                                                    <q-badge
                                                                        class="q-mx-sm"
                                                                        outline
                                                                        color="pink-4"
                                                                        :label="this.damage"
                                                                    />，请确认</span
                                                                >
                                                                <template v-slot:action>
                                                                    <q-btn
                                                                        color="red"
                                                                        label="取消"
                                                                        v-close-popup
                                                                    />
                                                                    <q-btn
                                                                        color="blue-6"
                                                                        label="确定"
                                                                        @click="clear(false)"
                                                                        v-close-popup="2"
                                                                    />
                                                                </template>
                                                            </q-banner>
                                                        </q-popup-proxy>
                                                    </q-btn>
                                                </q-item-section>
                                            </q-item>
                                        </q-list>
                                    </q-btn-dropdown>
                                    <q-btn
                                        :disable="guild.locker !== user.name"
                                        color="blue-grey-5"
                                        @click="unlock"
                                    >
                                        <q-icon
                                            class="q-mr-sm margin-none-xs"
                                            size="sm"
                                            name="lock_open"
                                        />
                                        <span>解锁</span>
                                    </q-btn>
                                </q-btn-group>
                            </div>
                            <div class="col-12">
                                <q-btn-group spread>
                                    <q-btn
                                        :disable="guild.locker !== user.name"
                                        color="red"
                                        @click="hangUp"
                                    >
                                        <q-icon
                                            class="q-mr-sm margin-none-xs"
                                            size="sm"
                                            name="sentiment_very_dissatisfied"
                                        />
                                        <span>挂树</span>
                                    </q-btn>
                                    <q-btn color="brown-4" @click="saveAndLoad">
                                        <q-icon
                                            class="q-mr-sm margin-none-xs"
                                            size="sm"
                                            name="refresh"
                                        />
                                        <span>S/L</span>
                                    </q-btn>
                                </q-btn-group>
                            </div>
                        </div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-12">
                <div class="row q-col-gutter-md">
                    <div class="col-12 col-md-6">
                        <q-table :data="orderData" :columns="orderColumns" row-key="name">
                            <template v-slot:top="props">
                                <div class="text-h6 row items-center" :data-props="props">
                                    <q-icon class="q-mr-xs" size="md" name="star"></q-icon>
                                    我的预约
                                </div>
                            </template>
                            <template v-slot:body-cell-actions="props">
                                <q-td key="actions" :props="props">
                                    <q-btn color="red" @click="cancelOrder(props)">
                                        取消预约
                                    </q-btn>
                                </q-td>
                            </template>
                        </q-table>
                    </div>
                    <div class="col-12 col-md-6">
                        <q-card>
                            <q-card-section>
                                <div class="text-h6">
                                    <q-icon
                                        class="q-mr-xs"
                                        size="md"
                                        name="las la-calendar-week"
                                    ></q-icon>
                                    <span>出刀记录</span>
                                </div>
                            </q-card-section>
                            <q-separator />
                            <q-card-section>
                                <q-timeline color="secondary">
                                    <!-- <q-timeline-entry heading>
                                      月公会战
                                    </q-timeline-entry> -->
                                    <q-infinite-scroll @load="nextBattleRecords" :offset="250">
                                        <q-timeline-entry
                                            v-for="(item, index) in battleRecords"
                                            :key="item.ID"
                                            :title="item.userName"
                                            :subtitle="item.createdAt"
                                            class="caption"
                                            :heading="item.type === 'heading'"
                                        >
                                            <span v-if="item.type === 'heading'"
                                                >November, 2017</span
                                            >
                                            <p class="row items-center justify-between" v-else>
                                                <span>
                                                    在 {{ item.round }} 周目对
                                                    {{ item.bossNum }} 号Boss 造成了
                                                    {{ item.damage }} 伤害
                                                </span>
                                                <span
                                                    class="q-mr-lg"
                                                    v-if="
                                                        index === 0 &&
                                                        (user.job === 'master' ||
                                                            item.userName === user.name)
                                                    "
                                                >
                                                    <q-btn color="red" label="撤销">
                                                        <q-popup-proxy :offset="[0, 10]">
                                                            <q-banner>
                                                                <template v-slot:avatar>
                                                                    <q-icon
                                                                        name="warning"
                                                                        color="warning"
                                                                    />Î
                                                                </template>
                                                                <span> 确认撤销出刀吗？ </span>
                                                                <template v-slot:action>
                                                                    <q-btn
                                                                        color="red"
                                                                        label="取消"
                                                                        v-close-popup
                                                                    />
                                                                    <q-btn
                                                                        color="blue-6"
                                                                        label="确定"
                                                                        @click="revert"
                                                                        v-close-popup="2"
                                                                    />
                                                                </template>
                                                            </q-banner>
                                                        </q-popup-proxy>
                                                    </q-btn>
                                                </span>
                                            </p>
                                        </q-timeline-entry>
                                        <template v-slot:loading>
                                            <div class="row justify-center q-my-md">
                                                <q-spinner-dots color="pink-4" size="40px" />
                                            </div>
                                        </template>
                                    </q-infinite-scroll>
                                </q-timeline>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
            </div>
        </div>
        <q-dialog v-model="showSearchResult" seamless position="bottom">
            <q-card style="width: 350px">
                <q-linear-progress :value="1" color="pink" />

                <q-card-section class="row items-center no-wrap">
                    <div>
                        <div class="text-weight-bold">查询结果</div>
                        <div class="text-grey">
                            <span class="q-mr-xs">
                                预约
                                <q-badge outline color="blue-6" :label="orderBossNum + '号Boss'" />
                                的人:
                            </span>
                            <q-badge
                                v-for="member in orderSearchResult"
                                class="q-mr-sm"
                                :key="member.ID + member.userName"
                                outline
                                color="orange-7"
                                :label="member.userName"
                            />
                        </div>
                    </div>
                    <q-space />
                    <q-btn flat round icon="close" v-close-popup />
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script lang="ts">
import useRequests from '../../../compositions/useRequest';
import { computed, defineComponent, ref } from 'vue';
import { Store } from 'vuex';
import { MainState, useStore } from 'src/store';
import { OrderRecords, BattleRecords } from 'src/models/records';
import { battleRequests } from 'src/requests/guild';
import { useQuasar } from 'quasar';
import { RouteRecordRaw } from 'vue-router';
import { User } from 'src/models/user';

export default defineComponent({
    name: 'Guild-battle',
    preFetch({ store, redirect }) {
        if ((store as Store<MainState>).state.user.user.guild === '') {
            redirect({ path: '/user/guild/status' } as RouteRecordRaw);
        }
        return store.dispatch('user/fetchMyBattleOrder', redirect);
    },
    setup() {
        const { ajaxCallback } = useRequests();
        const store = useStore();
        const $q = useQuasar();

        const user = computed(() => store.state.user.user);
        const guild = computed(() => store.state.user.guild);
        const currentBossHPPervent = computed(
            () => store.state.user.guild.currentBossHP / store.state.user.guild.currentBossTotalHP
        );
        const currentBossHPStatus = computed(
            () =>
                `${store.state.user.guild.currentBossHP} / ${store.state.user.guild.currentBossTotalHP}`
        );
        const orderData = computed(() => store.state.user.userBattleOrders);
        const lockColor = computed(() => (guild.value.locker === '' ? 'pink-4' : 'accent'));
        const battleRecords = computed(() => store.state.user.battleRecords);

        const orderBossNum = ref(1);
        const orderSearchResult = ref([] as OrderRecords[]);
        const showSearchResult = ref(false);
        const ifclearRecord = ref(false);
        const damage = ref(1);

        const fixDamageValue = () => {
            if (damage.value > guild.value.currentBossHP) {
                damage.value = guild.value.currentBossHP;
            }
        };

        const getNewestBattleRecords = async () => {
            const { res, err } = await battleRequests.updateBattleRecords(battleRecords.value);
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    let arr = ([] as BattleRecords[]).concat(battleRecords.value);
                    arr = res.data.battleRecords.concat(arr);
                    store.commit('user/updateBattleRecords', arr);
                }).catch((err) => {
                    console.log(err);
                });
            }
        };

        const nextBattleRecords = async (index: number, done: (bol?: boolean) => void) => {
            const { res, err } = await battleRequests.updateBattleRecords(
                battleRecords.value,
                false
            );
            if (err) console.log(err);
            if (res) {
                console.log(res);
                if ('battleRecords' in res.data && res.data.battleRecords.length === 0) {
                    $q.notify({
                        type: 'warning',
                        message: '已无更多记录'
                    });
                    done(true);
                    return;
                }
                ajaxCallback(res.data, res.config, () => {
                    if (battleRecords.value.length === 0) {
                        store.commit('user/updateBattleRecords', res.data.battleRecords);
                    } else {
                        let arr = ([] as BattleRecords[]).concat(battleRecords.value);
                        arr = arr.concat(res.data.battleRecords);
                        store.commit('user/updateBattleRecords', arr);
                    }
                    done();
                }).catch((err) => {
                    console.log(err);
                });
            }
        };
        // 刷新boss状态
        const refreshBossStatus = () => {
            store
                .dispatch('user/fetchMyGuild')
                .then(() => {
                    $q.notify({
                        type: 'positive',
                        message: '已刷新Boss状态'
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        // 预约
        const orderBoss = async () => {
            const { res, err } = await battleRequests.orderBoss(
                guild.value.round,
                orderBossNum.value
            );
            if (err) console.log(err);
            if (res) {
                ajaxCallback(
                    res.data,
                    res.config,
                    () => {
                        let arr: OrderRecords[] = [];
                        arr = arr.concat(orderData.value);
                        arr.push(res.data.order);
                        store.commit('user/updateUserBattleOrders', arr);
                    },
                    () => {
                        refreshBossStatus();
                    }
                ).catch((err) => {
                    console.log(err);
                });
            }
        };
        // 查询预约
        const searchOrder = async () => {
            const { res, err } = await battleRequests.searchOrder(
                guild.value.round,
                orderBossNum.value
            );
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    orderSearchResult.value = res.data.orders;
                    showSearchResult.value = true;
                }).catch((err) => {
                    console.log(err);
                });
            }
        };
        // 取消预约
        const cancelOrder = async ({ rowIndex, row }: { rowIndex: number; row: OrderRecords }) => {
            const { res, err } = await battleRequests.cancelOrder(user.value.name, row.ID);
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    let arr: OrderRecords[] = [];
                    arr = arr.concat(orderData.value);
                    arr.splice(rowIndex, 1);
                    store.commit('user/updateUserBattleOrders', arr);
                }).catch((err) => {
                    console.log(err);
                });
            }
        };
        // 申请出刀
        const enterIn = async () => {
            const { res, err } = await battleRequests.enterIn(user.value.guild);
            if (err) console.log(err);
            if (res) {
                ajaxCallback(
                    res.data,
                    res.config,
                    () => {
                        store.commit('user/updateGuildBossLocker', user.value.name);
                    },
                    () => {
                        refreshBossStatus();
                    }
                ).catch((err) => {
                    console.log(err);
                });
            }
        };
        // 报刀
        const clear = async (isOverkill: boolean) => {
            let realDamage = Number(damage.value);
            if (isOverkill) {
                realDamage = guild.value.currentBossHP;
            }
            const { res, err } = await battleRequests.clear(realDamage);
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    console.log(res);
                    const guild = res.data.guild;
                    guild.currentBossTotalHP = res.data.currentBossTotalHP;
                    guild.currentBossScoreX = res.data.currentBossScoreX;
                    guild.hangUpMembers = res.data.hangUpMembers;
                    store.commit('user/updateGuildStatus', guild);
                    store.commit('user/updateUserStatus', res.data.user);
                    if (isOverkill) {
                        let arr: OrderRecords[] = [].concat(orderData.value);
                        arr = arr.filter((item) => {
                            return item.bossNum !== guild.bossNum;
                        });
                        store.commit('user/updateUserBattleOrders', arr);
                    }
                    getNewestBattleRecords().catch((err) => {
                        console.log(err);
                    });
                }).catch((err) => {
                    console.log(err);
                });
            }
        };
        // 解锁
        const unlock = async () => {
            const { res, err } = await battleRequests.unlock(user.value.guild);
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    store.commit('user/updateGuildBossLocker', '');
                }).catch((err) => {
                    console.log(err);
                });
            }
        };
        // 挂树
        const hangUp = async () => {
            const { res, err } = await battleRequests.hangUp();
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    store.commit('user/updateUserStatus', res.data.user);
                    store.commit('user/updateGuildBossLocker', '');
                    let arr: User[] = [];
                    if (guild.value.hangUpMembers.length) {
                        arr = arr.concat(guild.value.hangUpMembers);
                    }
                    arr.push(user.value);
                    console.log(arr);
                    store.commit('user/updateGuildHangUpMembers', arr);
                }).catch((err) => {
                    console.log(err);
                });
            }
        };
        // SL
        const saveAndLoad = async () => {
            const { res, err } = await battleRequests.saveAndLoad();
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    store.commit('user/updateUserStatus', res.data.user);
                }).catch((err) => {
                    console.log(err);
                });
            }
        };
        // 撤销出刀
        const revert = async (id: number) => {
            console.log(id);
            const { res, err } = await battleRequests.revert();
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    const guild = res.data.guild;
                    guild.currentBossTotalHP = res.data.currentBossTotalHP;
                    guild.currentBossScoreX = res.data.currentBossScoreX;
                    guild.hangUpMembers = res.data.hangUpMembers;
                    store.commit('user/updateGuildStatus', res.data.guild);
                    store.commit('user/updateUserStatus', res.data.user);
                    const arr: BattleRecords[] = ([] as BattleRecords[]).concat(
                        battleRecords.value
                    );
                    arr.shift();
                    store.commit('user/updateBattleRecords', arr);
                }).catch((err) => {
                    console.log(err);
                });
            }
        };
        const resetBossStatus = async () => {
            const { res, err } = await battleRequests.resetBossStatus(ifclearRecord.value);
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    store.commit('user/updateGuildStatus', res.data.guild);
                    store.commit('user/updateUserStatus', res.data.user);
                    if (ifclearRecord.value) {
                        store.commit('user/updateBattleRecords', []);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        };

        return {
            orderBossNum,
            orderSearchResult,
            showSearchResult,
            ifclearRecord,
            damage,
            user,
            guild,
            currentBossHPPervent,
            currentBossHPStatus,
            orderData,
            lockColor,
            battleRecords,
            fixDamageValue,
            getNewestBattleRecords,
            nextBattleRecords,
            refreshBossStatus,
            orderBoss,
            searchOrder,
            cancelOrder,
            enterIn,
            clear,
            unlock,
            hangUp,
            saveAndLoad,
            revert,
            resetBossStatus
        };
    },
    data() {
        return {
            orderColumns: [
                {
                    name: 'ID',
                    required: true,
                    label: '预约ID',
                    align: 'left',
                    field: (row: OrderRecords) => row.ID,
                    format: (val: string) => `${val}`,
                    sortable: true
                },
                {
                    name: 'round',
                    align: 'center',
                    label: '周目',
                    field: 'round'
                },
                {
                    name: 'bossNum',
                    label: 'Boss序号',
                    field: 'bossNum'
                },
                {
                    name: 'actions',
                    label: '操作',
                    field: 'actions',
                    sortable: false
                }
            ]
        };
    }
});
</script>
