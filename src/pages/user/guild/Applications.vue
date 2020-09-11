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
                @click="accept(props)"
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

<script>
import ajaxCallbackFunc from "../../../mixins/AjaxCallback";
// import { extend } from "quasar";

export default {
  name: "Guild-members",
  mixins: [ajaxCallbackFunc],
  preFetch({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    return store.dispatch("user/fetchGuildApplications", redirect);
  },
  computed: {
    joinData() {
      return this.$store.state.user.guildJoinApplications;
    },
    inviteData() {
      return this.$store.state.user.guildInviteApplications;
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
          name: "userName",
          required: true,
          label: "账号名称",
          align: "left",
          field: row => row.userName,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "ID",
          align: "center",
          label: "申请ID",
          field: "ID",
          sortable: true
        },
        {
          name: "guild",
          label: "申请公会",
          field: "guild"
        },
        {
          name: "createdAt",
          label: "申请时间",
          field: "createdAt"
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
    reject(props) {
      this.$axios
        .post("/api/user/guild/reject", {
          userName: props.row.userName,
          guild: props.row.guild,
          type: props.row.type
        })
        .then(r => {
          this.ajaxCallback(r.data, this.reject.bind(this, props), () => {
            let arr = [];
            let url = "user/";
            if (props.row.type === "join") {
              arr = arr.concat(this.joinData);
              url = url + "updateGuildJoinApplications";
            } else {
              arr = arr.concat(this.inviteData);
              url = url + "updateGuildInviteApplications";
            }
            arr.splice(props.rowIndex, 1);
            this.$store.commit(url, arr);
          });
        });
    },
    accept(props) {
      this.$axios
        .post("/api/user/guild/accept", {
          userName: props.row.userName,
          guild: props.row.guild,
          type: "join"
        })
        .then(r => {
          console.log(props);
          console.log(r);
          this.ajaxCallback(r.data, this.accept.bind(this, props), () => {
            let arr = [];
            arr = arr.concat(this.tableData);
            arr.splice(props.rowIndex, 1);
            this.$store.commit("user/updateGuildJoinApplications", arr);
          });
        });
    }
  }
};
</script>
