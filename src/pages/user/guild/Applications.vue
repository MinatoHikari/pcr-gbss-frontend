<template>
    <q-page padding>
        <div class="row q-col-gutter-md">
            <div class="col-12">
                <q-table :data="joinData" :columns="columns" row-key="name">
                    <template v-slot:top="props">
                        <div class="text-h6 row items-center" :data-props="props">
                            <q-icon class="q-mr-sm" size="md" name="mail_outline"></q-icon>
                            申请一览
                        </div>
                    </template>
                    <template v-slot:body-cell-actions="props">
                        <q-td key="actions" :props="props">
                            <q-btn
                                v-if="user.job === 'master'"
                                color="positive"
                                :disable="props.row.job === 'master'"
                                @click="accept(props.row)"
                            >
                                同意
                            </q-btn>
                            <q-btn
                                class="q-ml-xs"
                                v-if="user.job === 'master'"
                                color="red"
                                :disable="props.row.job === 'master'"
                                @click="reject(props)"
                            >
                                拒绝
                            </q-btn>
                        </q-td>
                    </template>
                </q-table>
            </div>
            <div class="col-12">
                <q-table :data="inviteData" :columns="columns" row-key="name">
                    <template v-slot:top="props">
                        <div class="text-h6 row items-center" :data-props="props">
                            <q-icon
                                class="q-mr-sm"
                                size="md"
                                name="forward_to_inbox"
                            ></q-icon>
                            邀请一览
                        </div>
                    </template>
                    <template v-slot:body-cell-actions="props">
                        <q-td key="actions" :props="props">
                            <q-btn
                                class="q-ml-xs"
                                v-if="user.job === 'master'"
                                color="red"
                                :disable="props.row.job === 'master'"
                                @click="reject(props)"
                            >
                                撤回
                            </q-btn>
                        </q-td>
                    </template>
                </q-table>
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import useRequests from '../../../compositions/useRequest';
import { defineComponent, computed } from 'vue';
import { useStore } from 'src/store';
import { LooseDictionary } from 'quasar'
import { guildRequests } from 'src/requests/guild';

interface Row {
    userName: string
    ID: string
    guild: string
    createdAt: string
    type: string
}

export default defineComponent({
    name: 'Guild-members',
    preFetch({ store, redirect }) {
        return store.dispatch('user/fetchGuildApplications', redirect);
    },
    setup(prop, context) {
        console.log(prop)
        console.log(context)
        const { ajaxCallback } = useRequests()
        const store = useStore()

        const joinData = computed(() => store.state.user.guildJoinApplications)
        const inviteData = computed(() => store.state.user.guildInviteApplications)
        const user = computed(() => store.state.user.user)

        const reject = async (instanceProps: LooseDictionary) => {
            const row = instanceProps.row as Row
            const { res, err } = await guildRequests.rejectApply(row.userName, row.guild, row.type);
            if (err) console.log(err)
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    let arr: any[] = [];
                    let url = 'user/';
                    if (row.type === 'join') {
                        arr = arr.concat(joinData.value);
                        url = url + 'updateGuildJoinApplications';
                    } else {
                        arr = arr.concat(inviteData.value);
                        url = url + 'updateGuildInviteApplications';
                    }
                    arr.splice(instanceProps.rowIndex, 1);
                    store.commit(url, arr);
                }).catch((err) => {
                    console.log(err)
                });
            }
        }

        const accept = async (instanceProps: LooseDictionary) => {
            const row = instanceProps.row as Row
            const { res, err } = await guildRequests.acceptApply(row.userName, row.guild);
            if (err) console.log(err)
            if (res) {
                console.log(instanceProps);
                console.log(res);
                ajaxCallback(res.data, res.config, () => {
                    const arr = [...joinData.value];
                    arr.splice(instanceProps.rowIndex, 1);
                    store.commit('user/updateGuildJoinApplications', arr);
                }).catch((err) => {
                    console.log(err)
                });
            }
        }

        return {
            reject,
            accept,
            joinData,
            inviteData,
            user
        }
    },
    data() {
        return {
            confirm: false,
            currentConfirmProps: '',
            columns: [
                {
                    name: 'userName',
                    required: true,
                    label: '账号名称',
                    align: 'left',
                    field: (row: Row) => row.userName,
                    format: (val: string) => `${ val }`,
                    sortable: true
                },
                {
                    name: 'ID',
                    align: 'center',
                    label: '申请ID',
                    field: 'ID',
                    sortable: true
                },
                {
                    name: 'guild',
                    label: '申请公会',
                    field: 'guild'
                },
                {
                    name: 'createdAt',
                    label: '申请时间',
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
