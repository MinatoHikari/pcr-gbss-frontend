<template>
  <q-page padding>
    <div class="row">
      <div class="col-12">
        <q-table :data="tableData" :columns="columns" row-key="name">
          <template v-slot:top="props">
            <div class="text-h6 row items-center" :data-props="props">
              <q-icon class="q-mr-sm" size="md" name="people"></q-icon> 公会成员
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

<script>
import ajaxCallbackFunc from "../../../mixins/AjaxCallback";
// import { extend } from "quasar";

export default {
  name: "Guild-members",
  mixins: [ajaxCallbackFunc],
  preFetch({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    return store.dispatch("user/fetchGuildMembers", {
      guildName: store.state.user.user.guild,
      redirect
    });
  },
  computed: {
    tableData() {
      return this.$store.state.user.guildMembers;
    },
    user() {
      return this.$store.state.user.user;
    }
  },
  data() {
    return {
      confirm: false,
      currentConfirmProps: "",
      columns: [
        {
          name: "name",
          required: true,
          label: "成员名称",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "ID",
          align: "center",
          label: "成员ID",
          field: "ID",
          sortable: true
        },
        {
          name: "guild",
          label: "所属公会",
          field: "guild"
        },
        {
          name: "job",
          label: "职能",
          field: "job",
          format: this.jobFormat
        },
        {
          name: "actions",
          label: "操作",
          field: "actions",
          sortable: false
        }
      ]
    };
  },
  methods: {
    handleDismiss(props) {
      this.confirm = true;
      this.currentConfirmProps = props;
    },
    dismiss() {
      this.$axios
        .post("/api/user/guild/dismiss", {
          member: this.currentConfirmProps.row.name
        })
        .then(r => {
          this.ajaxCallback(r.data, this.dismiss, () => {
            let arr = [];
            arr = arr.concat(this.tableData);
            arr.splice(this.currentConfirmProps.rowIndex, 1);
            this.$store.commit("user/updateGuildMembers", arr);
          });
        });
    },
    jobFormat(val) {
      switch (val) {
        case "master":
          return "会长";
        case "submaster":
          return "副会长";
        case "employed":
          return "会员";
      }
    }
  }
};
</script>
