<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-table :data="joinData" :columns="joinColumns" row-key="name">
          <template v-slot:top="props">
            <div class="text-h6 row items-center" :data-props="props">
              <q-icon
                class="q-mr-sm"
                size="md"
                name="forward_to_inbox"
              ></q-icon>
              我的申请
            </div>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td key="actions" :props="props">
              <q-btn color="red" @click="reject(props)">
                撤回
              </q-btn>
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
              <q-btn color="red" @click="reject(props)">
                拒绝
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import ajaxCallbackFunc from "../../mixins/AjaxCallback";

export default {
  name: "User-HR",
  mixins: [ajaxCallbackFunc],
  preFetch({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    return store.dispatch("user/fetchUserAplications", {
      user: store.state.user.user,
      redirect
    });
  },
  computed: {
    user() {
      return this.$store.state.user.user;
    },
    joinData() {
      return this.$store.state.user.userJoinApplications;
    },
    inviteData() {
      return this.$store.state.user.userInviteApplications;
    }
  },
  data() {
    return {
      joinColumns: [
        {
          name: "ID",
          required: true,
          label: "申请ID",
          align: "left",
          field: row => row.ID,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "guild",
          label: "公会",
          field: "guild"
        },
        {
          name: "createdAt",
          label: "创建时间",
          field: "createdAt"
        },
        {
          name: "actions",
          label: "操作",
          field: "actions",
          sortable: false
        }
      ],
      inviteColumns: [
        {
          name: "ID",
          required: true,
          label: "邀请ID",
          align: "left",
          field: row => row.ID,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "guild",
          label: "公会",
          field: "guild"
        },
        {
          name: "creater",
          label: "邀请者",
          field: "creater"
        },
        {
          name: "createdAt",
          label: "创建时间",
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
      console.log(props);
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
              url = url + "updateUserJoinApplications";
            } else {
              arr = arr.concat(this.inviteData);
              url = url + "updateUserInviteApplications";
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
          type: "invite"
        })
        .then(r => {
          console.log(r);
          this.ajaxCallback(r.data, this.accept.bind(this, props), () => {
            let arr = [];
            arr = arr.concat(this.inviteData);
            arr.splice(props.rowIndex, 1);
            this.$store.commit("user/updateUserInviteApplications", arr);
            this.$store.commit("user/updateUserGuild", props.row.guild);
          });
        });
    }
  }
};
</script>
