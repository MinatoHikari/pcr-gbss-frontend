<template>
    <q-page padding>
        <div class="row">
            <div class="col-12">
                <q-card>
                    <q-card-section>
                        <q-table
                            flat
                            :data="recordList.data"
                            :columns="recordColumns"
                            row-key="name"
                        >
                            <template v-slot:top="props">
                                <div class="text-h6 row col-12 items-center" :data-props="props">
                                    <q-icon
                                        class="q-mr-sm"
                                        size="md"
                                        name="las la-clipboard-list"
                                    ></q-icon>
                                    出刀记录
                                </div>
                                <div class="col-12 q-mt-md">总出刀数：{{ totalBattletimes }}</div>
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
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BattleRecords } from 'src/models/records';

export default defineComponent({
    name: 'Guild-members',
    preFetch({ store, redirect }) {
        return store.dispatch('user/fetchAllGuildRecords', redirect);
    },
    computed: {
        recordList() {
            return this.$store.state.user.battleRecordList;
        },
        totalBattletimes() {
            let n = 0;
            const arr = this.recordList.data;
            console.log(arr);
            if (arr.length === 0) {
                return n;
            }
            for (let i = 0; i <= arr.length - 1; i++) {
                if (!arr[i].isCompensation) {
                    n++;
                }
            }
            return n;
        }
    },
    data() {
        return {
            recordColumns: [
                {
                    name: 'ID',
                    required: true,
                    label: '申请ID',
                    align: 'left',
                    field: (row: BattleRecords) => row.ID,
                    format: (val: string) => `${val}`,
                    sortable: true
                },
                {
                    name: 'createdAt',
                    label: '创建时间',
                    field: 'createdAt',
                    sortable: true
                },
                {
                    name: 'userName',
                    label: '出刀人',
                    field: 'userName',
                    sortable: false
                },
                {
                    name: 'damage',
                    label: '伤害',
                    field: 'damage',
                    sortable: true
                },
                {
                    name: 'score',
                    label: '积分',
                    field: 'score',
                    sortable: true
                },
                {
                    name: 'isCompensation',
                    label: '类型',
                    field: 'isCompensation',
                    format: (val: boolean) => (val ? '补偿刀' : '正常刀'),
                    sortable: false
                },
                {
                    name: 'round',
                    label: '周目',
                    field: 'round',
                    sortable: true
                },
                {
                    name: 'bossNum',
                    label: 'Boss序号',
                    field: 'bossNum',
                    sortable: true
                },
                {
                    name: 'rate',
                    label: '倍率',
                    field: 'rate',
                    sortable: true
                },
                {
                    name: 'isOverkill',
                    label: '是否是尾刀',
                    field: 'isOverkill',
                    format: (val: boolean) => (val ? '是' : '否'),
                    sortable: false
                }
            ]
        };
    }
});
</script>
