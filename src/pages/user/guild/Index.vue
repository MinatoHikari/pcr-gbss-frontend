<template>
    <q-page padding class="relative">
        <div v-if="user.guild !== ''" class="column q-col-gutter-md">
            <div class="col-12">
                <div class="row q-col-gutter-md">
                    <div class="col-12 col-md-6">
                        <q-card>
                            <q-card-section>
                                <div class="row text-h6">
                                    <div>
                                        <q-avatar
                                            color="teal-4"
                                            class="q-mr-xs"
                                            size="lg"
                                            text-color="white"
                                        >
                                            {{ guild.name[0].toUpperCase() }}
                                        </q-avatar>
                                        {{ guild.name }}
                                    </div>
                                </div>
                            </q-card-section>
                            <q-separator />
                            <q-card-section>
                                <q-banner rounded class="bg-orange-5 text-white">
                                    <template v-slot:avatar>
                                        <q-icon
                                            name="notifications_active"
                                            size="md"
                                            color="white"
                                        />
                                    </template>
                                    {{ guild.introduction }}
                                    <template v-slot:action>
                                        <q-btn
                                            v-if="user.name === guild.master"
                                            size="md"
                                            flat
                                            color="white"
                                            label="修改"
                                            @click="guildIntroEditor = true"
                                        />
                                    </template>
                                </q-banner>
                            </q-card-section>
                            <q-card-section>
                                <div class="row items-center justify-between">
                                    <div class="col">
                                        <q-chip
                                            color="primary"
                                            text-color="white"
                                            icon="las la-user"
                                        >
                                            公会人数
                                        </q-chip>
                                        <q-chip outline color="primary" text-color="white">
                                            {{ guild.memberNum + ' 人' }}
                                        </q-chip>
                                    </div>
                                    <div class="col">
                                        <q-chip
                                            color="deep-orange"
                                            text-color="white"
                                            icon="las la-atom"
                                        >
                                            服务器
                                        </q-chip>
                                        <q-chip outline color="orange" text-color="white">
                                            {{ guild.area }}
                                        </q-chip>
                                    </div>
                                </div>
                            </q-card-section>
                            <q-card-section>
                                <div class="row items-center justify-between">
                                    <div class="col">
                                        <q-chip color="brown-5" text-color="white" icon="sms">
                                            招募状态
                                        </q-chip>
                                        <q-chip
                                            :icon="
                                                guild.isRecruiting
                                                    ? 'person_add_alt_1'
                                                    : 'las la-user-lock'
                                            "
                                            outline
                                            :color="guild.isRecruiting ? 'positive' : 'grey-6'"
                                            text-color="white"
                                        >
                                            {{ guild.isRecruiting ? '开放' : '关闭' }}
                                        </q-chip>
                                        <q-toggle
                                            checked-icon="check"
                                            unchecked-icon="clear"
                                            color="pink-4"
                                            v-model="isRecruiting"
                                            v-if="user.name === guild.master"
                                            @input="switchRecruiting"
                                        />
                                    </div>
                                </div>
                            </q-card-section>
                            <q-separator />
                            <q-card-actions align="right">
                                <q-btn to="/user/guild/members" color="blue-6">查看成员</q-btn>
                                <q-btn
                                    v-if="guild.master === user.name"
                                    color="red"
                                    @click="prompt = true"
                                >
                                    解散公会
                                </q-btn>
                            </q-card-actions>
                        </q-card>
                    </div>
                    <div class="col-12 col-md-6">
                        <q-card>
                            <q-card-section>
                                <div class="text-h6">
                                    <q-avatar
                                        color="teal-4"
                                        class="q-mr-sm"
                                        size="lg"
                                        text-color="white"
                                    >
                                        {{ user.name[0].toUpperCase() }}
                                    </q-avatar>
                                    {{ user.name }}
                                </div>
                            </q-card-section>
                            <q-separator />
                            <q-card-section>
                                <div>
                                    <q-badge class="q-mr-sm" outline color="primary" label="职能" />
                                    {{ jobFilter(user.job) }}
                                </div>
                            </q-card-section>
                            <q-separator />
                            <q-card-actions align="right">
                                <q-btn
                                    v-if="user.job === 'master'"
                                    to="/user/guild/applications"
                                    color="blue-6"
                                >
                                    审核申请/邀请
                                </q-btn>
                                <q-btn
                                    v-if="user.job === 'master'"
                                    to="/user/search"
                                    color="orange-5"
                                >
                                    招募成员
                                </q-btn>

                                <q-btn v-if="user.job !== 'master'" color="red" label="退出公会">
                                    <q-popup-proxy>
                                        <q-card flat :bordered="false">
                                            <q-card-section class="row items-center">
                                                <q-avatar
                                                    size="md"
                                                    font-size="1.7rem"
                                                    icon="error_outline"
                                                    color="warning"
                                                    text-color="white"
                                                />
                                                <span class="q-ml-sm">确定要退出公会吗？</span>
                                            </q-card-section>

                                            <q-card-actions align="right">
                                                <q-btn
                                                    flat
                                                    label="取消"
                                                    color="primary"
                                                    v-close-popup
                                                />
                                                <q-btn
                                                    label="确定"
                                                    color="red"
                                                    v-close-popup
                                                    @click="exitGuild"
                                                />
                                            </q-card-actions>
                                        </q-card>
                                    </q-popup-proxy>
                                </q-btn>
                            </q-card-actions>
                        </q-card>
                    </div>
                </div>
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
                            <q-badge outline color="blue-6" :label="guild.round + '周目'" />
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
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn
                            label="公会战"
                            to="/user/guild/battle"
                            icon="sports_cricket"
                            color="accent"
                            v-close-popup
                        />
                    </q-card-actions>
                </q-card>
            </div>
        </div>
        <div class="column" v-else>
            <q-card>
                <q-card-section class="bg-purple text-white">
                    <div class="text-h6">
                        <q-avatar
                            size="lg"
                            color="red"
                            font-size="1.6rem"
                            class="q-mr-sm q-mb-sm"
                            text-color="white"
                            icon="error_outline"
                        />
                        还未加入任何公会
                    </div>
                    <div class="text-subtitle2">请选择创建公会或加入一个公会</div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn to="/user/guild/create" color="primary">创建公会</q-btn>
                    <q-btn to="/user/guild/search" color="teal-4">加入公会</q-btn>
                </q-card-actions>
            </q-card>
        </div>
        <q-dialog v-model="guildIntroEditor">
            <q-card style="min-width: 350px">
                <q-card-section>
                    <div class="text-h6">请输入新的公会介绍</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-input
                        dense
                        v-model="guildIntroToEdit"
                        autofocus
                        type="textarea"
                        @keyup.enter="guildIntroEdit"
                    />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="取消" v-close-popup />
                    <q-btn color="primary" @click="guildIntroEdit" label="确定" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-dialog v-model="prompt">
            <q-card style="min-width: 350px">
                <q-card-section>
                    <div class="text-h6">请输入登录密码</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-input
                        :type="isPwd ? 'password' : 'text'"
                        dense
                        v-model="password"
                        autofocus
                        @keyup.enter="prompt = false"
                    >
                        <template v-slot:append>
                            <q-icon
                                :name="isPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="isPwd = !isPwd"
                            />
                        </template>
                    </q-input>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="取消" v-close-popup />
                    <q-btn color="primary" label="确认" @click="dissolveGuild" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script lang="ts">
import useRequests from '../../../compositions/useRequest';
import useUtils from 'src/compositions/useUtils';
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'src/store';
import { useQuasar } from 'quasar';
import { guildRequests } from 'src/requests/guild';

export default defineComponent({
    name: 'Guild-Index',
    computed: {
        currentBossHPPervent() {
            return (
                this.$store.state.user.guild.currentBossHP /
                this.$store.state.user.guild.currentBossTotalHP
            );
        },
        currentBossHPStatus() {
            return `${this.$store.state.user.guild.currentBossHP} / ${this.$store.state.user.guild.currentBossTotalHP}`;
        }
    },
    setup() {
        const { ajaxCallback } = useRequests();
        const { jobFilter } = useUtils();
        const $q = useQuasar();
        const store = useStore();

        const user = computed(() => store.state.user.user);
        const guild = computed(() => store.state.user.guild);

        const password = ref('');
        const prompt = ref(false);
        const isPwd = ref(true);
        const guildIntroEditor = ref(false);
        const guildIntroToEdit = ref('');
        const isRecruiting = ref(true);

        isRecruiting.value = guild.value.isRecruiting;

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

        const dissolveGuild = async () => {
            const { res, err } = await guildRequests.dissolveGuild(password.value);
            if (err) console.log(err);
            if (res) {
                ajaxCallback(
                    res.data,
                    res.config,
                    () => {
                        store.commit('user/updateUserGuild', '');
                        password.value = '';
                    },
                    () => {
                        password.value = '';
                    }
                ).catch((err) => {
                    console.log(err);
                });
            }
        };

        const exitGuild = async () => {
            const { res, err } = await guildRequests.exitGuild();
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    store.commit('user/updateUserGuild', '');
                }).catch((err) => {
                    console.log(err);
                });
            }
        };

        const guildIntroEdit = async () => {
            const { res, err } = await guildRequests.updateSettings(
                'introduction',
                guildIntroToEdit.value
            );
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    store.commit('user/updateGuildIntroduction', res.data.guild.introduction);
                }).catch((err) => {
                    console.log(err);
                });
            }
        };

        const switchRecruiting = async (val: string) => {
            const { res, err } = await guildRequests.updateSettings('isRecruiting', val);
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    store.commit('user/updateGuildRecruiting', res.data.guild.isRecruiting);
                }).catch((err) => {
                    console.log(err);
                });
            }
        };

        return {
            jobFilter,
            password,
            prompt,
            isPwd,
            guildIntroEditor,
            guildIntroToEdit,
            isRecruiting,
            user,
            guild,
            refreshBossStatus,
            dissolveGuild,
            exitGuild,
            guildIntroEdit,
            switchRecruiting
        };
    }
});
</script>
