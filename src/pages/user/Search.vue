<template>
    <q-page padding>
        <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
                <q-card>
                    <q-card-section class="bg-brown-6 text-white">
                        <div class="text-h6">通过账号名称搜索</div>
                    </q-card-section>

                    <q-separator />
                    <q-card-section>
                        <q-input
                            color="brown-6"
                            filled
                            v-model="userName"
                            label="输入账号名称"
                            @keyup.enter="searchUser(userName, 0)"
                        >
                            <template v-slot:append>
                                <q-icon
                                    @click="searchUser(userName, 0)"
                                    class="cursor-pointer"
                                    name="search"
                                />
                            </template>
                        </q-input>
                    </q-card-section>
                    <q-separator />

                    <q-card-actions vertical>
                        <q-btn @click="searchUser(userName, 0)" color="brown-6">搜索</q-btn>
                    </q-card-actions>
                </q-card>
            </div>
            <div class="col-12 col-md-6">
                <q-card>
                    <q-card-section class="bg-cyan-8 text-white">
                        <div class="text-h6">通过账号ID搜索</div>
                    </q-card-section>

                    <q-separator />
                    <q-card-section>
                        <q-input
                            filled
                            color="cyan-8"
                            type="number"
                            v-model.number="userID"
                            label="输入账号在本站的ID"
                            @keyup.enter="searchUser('', userID)"
                            :min="1"
                        >
                            <template v-slot:append>
                                <q-icon
                                    @click="searchUser('', userID)"
                                    class="cursor-pointer"
                                    name="search"
                                />
                            </template>
                        </q-input>
                    </q-card-section>
                    <q-separator />

                    <q-card-actions vertical>
                        <q-btn @click="searchUser('', userID)" color="cyan-8">搜索</q-btn>
                    </q-card-actions>
                </q-card>
            </div>
            <div class="col-12">
                <q-table :data="data" :columns="columns" row-key="name">
                    <template v-slot:top="props">
                        <div class="text-h6 row items-center" :data-props="props">
                            <q-icon class="q-mr-xs" size="md" name="person_add"></q-icon>
                            符合条件的账号
                        </div>
                    </template>
                    <template v-slot:body-cell-actions="props">
                        <q-td key="actions" :props="props">
                            <q-btn
                                v-if="user.job === 'master' || user.job === 'submaster'"
                                color="teal-4"
                                @click="invite(props.row)"
                            >
                                邀请
                            </q-btn>
                        </q-td>
                    </template>
                </q-table>
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import useRequests from '../../compositions/useRequest';
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'src/store';
import { User } from 'src/models/user';
import { userRequests } from 'src/requests/user';

export default defineComponent({
    name: 'Guild-search',
    setup() {
        const store = useStore();
        const { ajaxCallback } = useRequests();
        const user = computed(() => store.state.user.user);

        const userName = ref('');
        const userID = ref(1);
        const data = ref([] as User[]);

        const searchUser = async (name: string, id: number) => {
            const { res, err } = await userRequests.searchUser(name, id);
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    data.value = res.data.users;
                }).catch((err) => {
                    console.log(err);
                });
            }
        };

        const invite = async (row: User) => {
            const { res, err } = await userRequests.invite(row.name);
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res?.config, () => {
                    console.log('success');
                }).catch((err) => {
                    console.log(err);
                });
            }
        };

        return {
            userName,
            user,
            userID,
            data,
            searchUser,
            invite
        };
    },
    data() {
        return {
            columns: [
                {
                    name: 'name',
                    required: true,
                    label: '账号名称',
                    align: 'left',
                    field: (row: User) => row.name,
                    format: (val: string) => `${val}`,
                    sortable: true
                },
                {
                    name: 'ID',
                    align: 'center',
                    label: '账号ID',
                    field: 'ID',
                    sortable: true
                },
                {
                    name: 'guild',
                    label: '公会',
                    field: 'guild'
                },
                {
                    name: 'job',
                    label: '职能',
                    field: 'job'
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
