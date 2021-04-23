<template>
    <q-page padding>
        <div class="row">
            <div class="col-12">
                <q-table :data="tableData" :columns="columns" row-key="name">
                    <template v-slot:top="props">
                        <div class="text-h6 row items-center" :data-props="props">
                            <q-icon class="q-mr-sm" size="md" name="people"></q-icon>
                            公会成员
                        </div>
                    </template>
                    <template v-slot:body-cell-actions="props">
                        <q-td key="actions" :props="props">
                            <q-btn
                                v-if="user.job === 'master'"
                                color="red"
                                :disable="props.row.job === 'master'"
                                @click="handleDismiss(props)"
                            >
                                解雇
                            </q-btn>
                        </q-td>
                    </template>
                </q-table>
            </div>
        </div>
        <q-dialog v-model="confirm">
            <q-card>
                <q-card-section class="row items-center">
                    <q-avatar
                        font-size="2rem"
                        icon="error_outline"
                        color="warning"
                        text-color="white"
                    />
                    <span class="q-ml-sm">确定要解雇此会员吗？</span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="取消" color="primary" v-close-popup />
                    <q-btn label="确定" color="red" @click="dismiss" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script lang="ts">
import useRequests from '../../../compositions/useRequest';
import { computed, defineComponent, ref } from 'vue';
import { Store } from 'vuex';
import { MainState, useStore } from 'src/store';
import { User } from 'src/models/user';
import { guildRequests } from 'src/requests/guild';
import useUtils from 'src/compositions/useUtils';

type Props = { row: User; rowIndex: number };

export default defineComponent({
    name: 'Guild-members',
    preFetch({ store }) {
        return store.dispatch('user/fetchGuildMembers', {
            guildName: (store as Store<MainState>).state.user.user.guild
        });
    },
    setup() {
        const store = useStore();
        const { jobFilter } = useUtils();

        const { ajaxCallback } = useRequests();
        const tableData = computed(() => store.state.user.guildMembers);
        const user = computed(() => store.state.user.user);

        const confirm = ref(false);
        const currentConfirmProps = ref('' as '' | Props);

        const dismiss = async () => {
            const { res, err } = await guildRequests.dismiss(
                (currentConfirmProps.value as Props).row.name
            );
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    let arr: User[] = [];
                    arr = arr.concat(tableData.value);
                    arr.splice((currentConfirmProps.value as Props).rowIndex, 1);
                    store.commit('user/updateGuildMembers', arr);
                }).catch((err) => {
                    console.log(err);
                });
            }
        };

        const handleDismiss = (props: Props) => {
            confirm.value = true;
            currentConfirmProps.value = props;
        };

        return {
            tableData,
            user,
            jobFilter,
            dismiss,
            handleDismiss
        };
    },
    data() {
        return {
            columns: [
                {
                    name: 'name',
                    required: true,
                    label: '成员名称',
                    align: 'left',
                    field: (row: User) => row.name,
                    format: (val: string) => `${val}`,
                    sortable: true
                },
                {
                    name: 'ID',
                    align: 'center',
                    label: '成员ID',
                    field: 'ID',
                    sortable: true
                },
                {
                    name: 'guild',
                    label: '所属公会',
                    field: 'guild'
                },
                {
                    name: 'job',
                    label: '职能',
                    field: 'job',
                    format: this.jobFilter
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
