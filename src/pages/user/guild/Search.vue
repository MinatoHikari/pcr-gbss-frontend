<template>
    <q-page padding>
        <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
                <q-card>
                    <q-card-section class="bg-brown-6 text-white">
                        <div class="text-h6">通过公会名称搜索</div>
                    </q-card-section>

                    <q-separator />
                    <q-card-section>
                        <q-input
                            color="brown-6"
                            filled
                            v-model="guildName"
                            label="输入公会名称"
                            @keyup.enter="searchGuild(guildName, 0)"
                        >
                            <template v-slot:append>
                                <q-icon
                                    @click="searchGuild(guildName, 0)"
                                    class="cursor-pointer"
                                    name="search"
                                />
                            </template>
                        </q-input>
                    </q-card-section>
                    <q-separator />

                    <q-card-actions vertical>
                        <q-btn @click="searchGuild(guildName, 0)" color="brown-6">搜索 </q-btn>
                    </q-card-actions>
                </q-card>
            </div>
            <div class="col-12 col-md-6">
                <q-card>
                    <q-card-section class="bg-cyan-8 text-white">
                        <div class="text-h6">通过公会ID搜索</div>
                    </q-card-section>

                    <q-separator />
                    <q-card-section>
                        <q-input
                            filled
                            color="cyan-8"
                            type="number"
                            v-model.number="guildID"
                            label="输入公会在本站的ID"
                            @keyup.enter="searchGuild('', guildID)"
                            min="1"
                        >
                            <template v-slot:append>
                                <q-icon
                                    @click="searchGuild('', guildID)"
                                    class="cursor-pointer"
                                    name="search"
                                />
                            </template>
                        </q-input>
                    </q-card-section>
                    <q-separator />

                    <q-card-actions vertical>
                        <q-btn @click="searchGuild('', guildID)" color="cyan-8">搜索</q-btn>
                    </q-card-actions>
                </q-card>
            </div>
            <div class="col-12">
                <q-table :data="tableData" :columns="columns" row-key="name">
                    <template v-slot:top="props">
                        <div class="text-h6 row items-center" :data-props="props">
                            <q-icon class="q-mr-xs" size="md" name="turned_in"></q-icon>
                            符合条件的公会
                        </div>
                    </template>
                    <template v-slot:body-cell-actions="props">
                        <q-td key="actions" :props="props">
                            <q-btn color="teal-4" @click="joinGuild(props.row)"> 申请加入 </q-btn>
                        </q-td>
                    </template>
                </q-table>
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import useRequests from '../../../compositions/useRequest';
import { defineComponent, ref } from 'vue';
import { guildRequests } from 'src/requests/guild';
import { Guild } from 'src/models/guild';

export default defineComponent({
    name: 'Guild-search',
    setup() {
        const guildName = ref('');
        const guildID = ref(1);
        const tableData = ref([] as Guild[]);

        const { ajaxCallback } = useRequests();

        const searchGuild = async (name: string, id: number) => {
            const { res, err } = await guildRequests.searchGuild(name, id);
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, null, () => {
                    tableData.value = [res.data.guild];
                }).catch((err) => {
                    console.log(err);
                });
            }
        };

        const joinGuild = async (row: Guild) => {
            const { res, err } = await guildRequests.joinGuild(row.name);
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    return true;
                }).catch((err) => {
                    console.log(err);
                });
            }
        };

        return {
            guildName,
            guildID,
            searchGuild,
            joinGuild,
            tableData
        };
    },
    data() {
        return {
            columns: [
                {
                    name: 'name',
                    required: true,
                    label: '公会名称',
                    align: 'left',
                    field: (row: Guild) => row.name,
                    format: (val: string) => `${val}`,
                    sortable: true
                },
                {
                    name: 'ID',
                    align: 'center',
                    label: '公会ID',
                    field: 'ID',
                    sortable: true
                },
                {
                    name: 'createdAt',
                    label: '创建时间',
                    field: 'createdAt',
                    sortable: true
                },
                {
                    name: 'master',
                    label: '会长',
                    field: 'master'
                },
                {
                    name: 'introduction',
                    label: '公会介绍',
                    field: 'introduction'
                },
                {
                    name: 'memberNum',
                    label: '工会人数',
                    field: 'memberNum'
                },
                {
                    name: 'area',
                    label: '服务器',
                    field: 'area',
                    sortable: true
                },
                {
                    name: 'isRecruiting',
                    label: '是否开放招募',
                    field: 'isRecruiting',
                    format: (val: boolean) => (val ? '开放' : '不开放'),
                    sortable: true
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
