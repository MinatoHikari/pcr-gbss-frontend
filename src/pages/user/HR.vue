<template>
    <q-page padding>
        <div class="row q-col-gutter-md">
            <div class="col-12">
                <q-table :data="joinData" :columns="joinColumns" row-key="name">
                    <template v-slot:top="props">
                        <div class="text-h6 row items-center" :data-props="props">
                            <q-icon class="q-mr-sm" size="md" name="forward_to_inbox"></q-icon>
                            我的申请
                        </div>
                    </template>
                    <template v-slot:body-cell-actions="props">
                        <q-td key="actions" :props="props">
                            <q-btn color="red" @click="reject(props)"> 撤回 </q-btn>
                        </q-td>
                    </template>
                </q-table>
            </div>
            <div class="col-12">
                <q-table :data="inviteData" :columns="inviteColumns" row-key="name">
                    <template v-slot:top="props">
                        <div class="text-h6 row items-center" :data-props="props">
                            <q-icon class="q-mr-sm" size="md" name="mail_outline"></q-icon>
                            我收到的邀请
                        </div>
                    </template>
                    <template v-slot:body-cell-actions="props">
                        <q-td key="actions" :props="props">
                            <q-btn class="q-mr-xs" color="positive" @click="accept(props)">
                                同意
                            </q-btn>
                            <q-btn color="red" @click="reject(props)"> 拒绝 </q-btn>
                        </q-td>
                    </template>
                </q-table>
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import useRequests from '../../compositions/useRequest';
import { computed, defineComponent } from 'vue';
import { Store } from 'vuex';
import { MainState, useStore } from 'src/store';
import { Applications } from 'src/models/applications';
import { userRequests } from 'src/requests/user';
import { LooseDictionary } from 'quasar';

export default defineComponent({
    name: 'User-HR',
    preFetch({ store, redirect }) {
        return store.dispatch('user/fetchUserApplications', {
            user: (store as Store<MainState>).state.user.user,
            redirect
        });
    },
    setup() {
        const { ajaxCallback } = useRequests();
        const store = useStore();

        const user = computed(() => store.state.user.user);
        const joinData = computed(() => store.state.user.userJoinApplications);
        const inviteData = computed(() => store.state.user.userInviteApplications);

        const reject = async (instanceProps: LooseDictionary) => {
            const row = instanceProps.row as Applications;
            const { res, err } = await userRequests.reject(row.userName, row.guild, row.type);
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    let arr: Applications[] = [];
                    let url = 'user/';
                    if (row.type === 'join') {
                        arr = arr.concat(joinData.value);
                        url = url + 'updateUserJoinApplications';
                    } else {
                        arr = arr.concat(inviteData.value);
                        url = url + 'updateUserInviteApplications';
                    }
                    arr.splice(instanceProps.rowIndex, 1);
                    store.commit(url, arr);
                }).catch((err) => {
                    console.log(err);
                });
            }
        };

        const accept = async (instanceProps: LooseDictionary) => {
            const row = instanceProps.row as Applications;
            const { res, err } = await userRequests.accept(row.userName, row.guild);
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    let arr: Applications[] = [];
                    arr = arr.concat(inviteData.value);
                    arr.splice(instanceProps.rowIndex, 1);
                    store.commit('user/updateUserInviteApplications', arr);
                    store.commit('user/updateUserGuild', row.guild);
                }).catch((err) => {
                    console.log(err);
                });
            }
        };

        return {
            user,
            joinData,
            inviteData,
            reject,
            accept
        };
    },
    data() {
        return {
            joinColumns: [
                {
                    name: 'ID',
                    required: true,
                    label: '申请ID',
                    align: 'left',
                    field: (row: Applications) => row.ID,
                    format: (val: string) => `${val}`,
                    sortable: true
                },
                {
                    name: 'guild',
                    label: '公会',
                    field: 'guild'
                },
                {
                    name: 'createdAt',
                    label: '创建时间',
                    field: 'createdAt'
                },
                {
                    name: 'actions',
                    label: '操作',
                    field: 'actions',
                    sortable: false
                }
            ],
            inviteColumns: [
                {
                    name: 'ID',
                    required: true,
                    label: '邀请ID',
                    align: 'left',
                    field: (row: Applications) => row.ID,
                    format: (val: string) => `${val}`,
                    sortable: true
                },
                {
                    name: 'guild',
                    label: '公会',
                    field: 'guild'
                },
                {
                    name: 'creater',
                    label: '邀请者',
                    field: 'creater'
                },
                {
                    name: 'createdAt',
                    label: '创建时间',
                    field: 'createdAt'
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
