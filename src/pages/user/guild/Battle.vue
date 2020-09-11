<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">
              <q-avatar
                class="q-mr-sm"
                color="teal-4"
                size="lg"
                text-color="white"
              >
                {{ user.name[0].toUpperCase() }}
              </q-avatar>
              <span class="q-mr-sm">{{ user.name }}</span>
              <q-badge v-if="user.hangUp" outline color="red" label="挂树" />
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row">
              <div class="col-12 col-md-6">
                <q-chip
                  square
                  outline
                  color="deep-purple-8"
                  icon="las la-feather-alt"
                >
                  今日出刀
                </q-chip>
                <q-chip outline color="deep-orange-6">
                  {{ user.dailyBattleTimes + " 刀" }}
                </q-chip>
              </div>
              <div class="col-12 col-md-6">
                <q-chip
                  square
                  outline
                  color="deep-purple-4"
                  icon="las la-battery-half"
                >
                  当前刀
                </q-chip>
                <q-chip
                  outline
                  :color="user.isCompensation ? 'lime-8' : 'green-5'"
                  :icon="
                    user.isCompensation
                      ? 'las la-battery-quarter'
                      : 'las la-battery-full'
                  "
                >
                  {{ user.isCompensation ? "补偿刀" : "完整刀" }}
                </q-chip>
              </div>
            </div>
          </q-card-section>
        </q-card>
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
                <q-tooltip>
                  刷新Boss状态
                </q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div>
              <q-badge class="q-mr-sm" outline color="positive" label="HP" />
              <q-badge
                outline
                color="pink-4"
                :label="guild.bossNum + '号Boss'"
              />
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
            <div class="q-mt-md">
              <q-chip square outline color="orange" icon="las la-redo-alt">
                当前周目
              </q-chip>
              <q-chip outline color="cyan-6">
                {{ guild.round + " 周目" }}
              </q-chip>
            </div>
            <div class="q-mt-md">
              <q-chip
                square
                outline
                color="primary"
                text-color="white"
                icon="las la-key"
              >
                锁定状态
              </q-chip>
              <q-chip
                outline
                :color="lockColor"
                :text-color="lockColor"
                :icon="guild.locker === '' ? 'las la-unlock' : 'las la-lock'"
              >
                {{ guild.locker === "" ? "未锁定" : "已锁定" }}
              </q-chip>
              <q-chip
                v-if="guild.locker !== ''"
                outline
                color="indigo-6"
                text-color="indigo-6"
                icon="las la-gamepad"
              >
                {{ guild.locker + " 正在出刀" }}
              </q-chip>
            </div>
            <div class="q-mt-md">
              <q-chip square outline color="grey-8" icon="las la-user-lock">
                上树的成员
              </q-chip>
              <q-chip
                v-for="user in guild.hangUpMembers"
                :key="user"
                outline
                color="indigo-6"
                text-color="indigo-6"
                icon="las la-skull-crossbones"
              >
                {{ user }}
              </q-chip>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-btn-group spread>
                  <q-btn-dropdown
                    menu-fit
                    @before-hide="showSearchResult = false"
                    color="blue-6"
                    label="预约出刀"
                    icon="security"
                  >
                    <q-list>
                      <q-item-label header
                        >选择要预约的Boss
                        <q-badge
                          outline
                          color="blue-6"
                          :label="orderBossNum + '号Boss'"
                        />
                      </q-item-label>
                      <q-item>
                        <q-item-section>
                          <q-slider
                            v-model="orderBossNum"
                            :min="1"
                            :max="5"
                            label
                            color="blue-6"
                          />
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-btn
                            color="pink-4"
                            @click="searchOrder"
                            name="volume_up"
                            label="查询"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-btn
                            color="blue-6"
                            @click="orderBoss"
                            name="volume_up"
                            label="预约"
                          />
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                  <q-btn
                    color="orange-5"
                    :disable="guild.locker !== '' || user.hangUp"
                    label="申请出刀"
                    icon="gps_fixed"
                    @click="enterIn"
                  />
                </q-btn-group>
              </div>
              <div class="col-12">
                <q-btn-group spread>
                  <q-btn-dropdown
                    :disable="guild.locker !== user.name && !user.hangUp"
                    label="结算"
                    icon="insert_chart_outlined"
                    color="purple"
                  >
                    <q-list>
                      <q-item>
                        <q-item-section>
                          <q-input
                            v-model="damage"
                            min="1"
                            :max="guild.currentBossHP"
                            type="number"
                            label="请输入结算伤害"
                            hint="如果已击杀Boss请直接点击收尾"
                            @blur="fixDamageValue"
                          />
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-btn color="pink-4" name="volume_up" label="收尾">
                            <q-popup-proxy :offset="[0, 10]">
                              <q-banner>
                                <template v-slot:avatar>
                                  <q-icon name="warning" color="warning" />
                                </template>
                                确定已经击杀Boss了吗？
                                <template v-slot:action>
                                  <q-btn
                                    color="red"
                                    label="取消"
                                    v-close-popup
                                  />
                                  <q-btn
                                    color="blue-6"
                                    label="确定"
                                    @click="clear(true)"
                                    v-close-popup="2"
                                  />
                                </template>
                              </q-banner>
                            </q-popup-proxy>
                          </q-btn>
                        </q-item-section>
                        <q-item-section>
                          <q-btn color="blue-6" name="volume_up" label="报刀">
                            <q-popup-proxy :offset="[0, 10]">
                              <q-banner>
                                <template v-slot:avatar>
                                  <q-icon name="warning" color="warning" />
                                </template>
                                <span>
                                  伤害<q-badge
                                    class="q-mx-sm"
                                    outline
                                    color="pink-4"
                                    :label="this.damage"
                                  />，请确认
                                </span>
                                <template v-slot:action>
                                  <q-btn
                                    color="red"
                                    label="取消"
                                    v-close-popup
                                  />
                                  <q-btn
                                    color="blue-6"
                                    label="确定"
                                    @click="clear(false)"
                                    v-close-popup="2"
                                  />
                                </template>
                              </q-banner>
                            </q-popup-proxy>
                          </q-btn>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                  <q-btn
                    :disable="guild.locker !== user.name"
                    color="blue-grey-5"
                    @click="unlock"
                  >
                    <q-icon
                      class="q-mr-sm margin-none-xs"
                      size="sm"
                      name="lock_open"
                    />
                    <span>解锁</span>
                  </q-btn>
                </q-btn-group>
              </div>
              <div class="col-12">
                <q-btn-group spread>
                  <q-btn
                    :disable="guild.locker !== user.name"
                    color="red"
                    @click="hangUp"
                  >
                    <q-icon
                      class="q-mr-sm margin-none-xs"
                      size="sm"
                      name="sentiment_very_dissatisfied"
                    />
                    <span>挂树</span>
                  </q-btn>
                  <q-btn color="brown-4" @click="saveAndLoad">
                    <q-icon
                      class="q-mr-sm margin-none-xs"
                      size="sm"
                      name="refresh"
                    />
                    <span>S/L</span>
                  </q-btn>
                </q-btn-group>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-table :data="orderData" :columns="orderColumns" row-key="name">
              <template v-slot:top="props">
                <div class="text-h6 row items-center" :data-props="props">
                  <q-icon class="q-mr-xs" size="md" name="star"></q-icon>
                  我的预约
                </div>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td key="actions" :props="props">
                  <q-btn color="red" @click="cancelOrder(props)">
                    取消预约
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </div>
          <div class="col-12 col-md-6">
            <q-card>
              <q-card-section>
                <div class="text-h6">
                  <q-icon
                    class="q-mr-xs"
                    size="md"
                    name="las la-calendar-week"
                  ></q-icon>
                  <span>出刀记录</span>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-timeline color="secondary">
                  <!-- <q-timeline-entry heading>
                    月公会战
                  </q-timeline-entry> -->
                  <q-infinite-scroll @load="nextBattleRecords" :offset="250">
                    <q-timeline-entry
                      v-for="(item, index) in battleRecords"
                      :key="item.ID"
                      :title="item.userName"
                      :subtitle="item.createdAt"
                      class="caption"
                      :heading="item.type === 'heading'"
                    >
                      <span v-if="item.type === 'heading'">November, 2017</span>
                      <p class="row items-center justify-between" v-else>
                        <span>
                          在 {{ item.round }} 周目对 {{ item.bossNum }} 号Boss
                          造成了 {{ item.damage }} 伤害
                        </span>
                        <span class="q-mr-lg" v-if="index === 0">
                          <q-btn color="red" label="撤销">
                            <q-popup-proxy :offset="[0, 10]">
                              <q-banner>
                                <template v-slot:avatar>
                                  <q-icon name="warning" color="warning" />
                                </template>
                                <span>
                                  确认撤销出刀吗？
                                </span>
                                <template v-slot:action>
                                  <q-btn
                                    color="red"
                                    label="取消"
                                    v-close-popup
                                  />
                                  <q-btn
                                    color="blue-6"
                                    label="确定"
                                    @click="revert()"
                                    v-close-popup="2"
                                  />
                                </template>
                              </q-banner>
                            </q-popup-proxy>
                          </q-btn>
                        </span>
                      </p>
                    </q-timeline-entry>
                    <template v-slot:loading>
                      <div class="row justify-center q-my-md">
                        <q-spinner-dots color="pink-4" size="40px" />
                      </div>
                    </template>
                  </q-infinite-scroll>
                </q-timeline>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="showSearchResult" seamless position="bottom">
      <q-card style="width: 350px">
        <q-linear-progress :value="1" color="pink" />

        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight-bold">查询结果</div>
            <div class="text-grey">
              <span class="q-mr-xs">
                预约
                <q-badge
                  outline
                  color="blue-6"
                  :label="orderBossNum + '号Boss'"
                />
                的人:
              </span>
              <q-badge
                v-for="member in orderSearchResult"
                class="q-mr-sm"
                :key="member.ID + member.userName"
                outline
                color="orange-7"
                :label="member.userName"
              />
            </div>
          </div>
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import ajaxCallbackFunc from "../../../mixins/AjaxCallback";

export default {
  name: "Guild-battle",
  mixins: [ajaxCallbackFunc],
  preFetch({ store, redirect }) {
    if (store.state.user.user.guild === "") {
      redirect("/user/guild/status");
    }
    return store.dispatch("user/fetchMyBattleOrder", redirect);
  },
  computed: {
    user() {
      return this.$store.state.user.user;
    },
    guild() {
      return this.$store.state.user.guild;
    },
    currentBossHPPervent() {
      return (
        this.$store.state.user.guild.currentBossHP /
        this.$store.state.user.guild.currentBossTotalHP
      );
    },
    currentBossHPStatus() {
      return `${this.$store.state.user.guild.currentBossHP} / ${this.$store.state.user.guild.currentBossTotalHP}`;
    },
    orderData() {
      return this.$store.state.user.userBattleOrders;
    },
    lockColor() {
      return this.guild.locker === "" ? "pink-4" : "accent";
    },
    battleRecords() {
      return this.$store.state.user.battleRecords;
    }
  },
  data() {
    return {
      orderBossNum: 1,
      orderSearchResult: [],
      showSearchResult: false,
      damage: 1,
      orderColumns: [
        {
          name: "ID",
          required: true,
          label: "预约ID",
          align: "left",
          field: row => row.ID,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "round",
          align: "center",
          label: "周目",
          field: "round"
        },
        {
          name: "bossNum",
          label: "Boss序号",
          field: "bossNum"
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
    fixDamageValue() {
      if (this.damage > this.guild.currentBossHP) {
        this.damage = this.guild.currentBossHP;
      }
    },
    getNewestBattleRecords() {
      let url;
      console.log(this.battleRecords);
      if (this.battleRecords.length === 0) {
        url = `/api/user/battle/getBattleRecords`;
      } else {
        url = `/api/user/battle/getBattleRecords?time=${this.battleRecords[0].createdAt}&type=after`.replace(
          "+",
          "%2B"
        );
      }

      this.$axios.get(url).then(r => {
        console.log(r);
        this.ajaxCallback(r.data, this.getNewestBattleRecords, () => {
          let arr = [].concat(this.battleRecords);
          arr = r.data.battleRecords.concat(arr);
          this.$store.commit("user/updateBattleRecords", arr);
        });
      });
    },
    nextBattleRecords(index, done) {
      let url;
      console.log(this.battleRecords);
      if (this.battleRecords.length === 0) {
        url = `/api/user/battle/getBattleRecords`;
      } else {
        url = `/api/user/battle/getBattleRecords?time=${
          this.battleRecords[this.battleRecords.length - 1].createdAt
        }`.replace("+", "%2B");
      }

      this.$axios.get(url).then(r => {
        console.log(r);
        if ("battleRecords" in r.data && r.data.battleRecords.length === 0) {
          this.$q.notify({
            type: "warning",
            message: "已无更多记录"
          });
          done(true);
          return;
        }
        this.ajaxCallback(
          r.data,
          this.nextBattleRecords.bind(this, index, done),
          () => {
            if (this.battleRecords.length === 0) {
              this.$store.commit(
                "user/updateBattleRecords",
                r.data.battleRecords
              );
            } else {
              let arr = [].concat(this.battleRecords);
              arr = arr.concat(r.data.battleRecords);
              this.$store.commit("user/updateBattleRecords", arr);
            }
            done();
          }
        );
      });
    },
    // 刷新boss状态
    refreshBossStatus() {
      this.$store
        .dispatch("user/fetchMyGuild", this.$router.replace.bind(this.$router))
        .then(r => {
          this.$q.notify({
            type: "positive",
            message: "已刷新Boss状态"
          });
        });
    },
    // 预约
    orderBoss() {
      this.$axios
        .post("/api/user/battle/order", {
          round: this.guild.round,
          bossNum: this.orderBossNum
        })
        .then(r => {
          this.ajaxCallback(
            r.data,
            this.orderBoss,
            () => {
              let arr = [];
              arr = arr.concat(this.orderData);
              arr.push(r.data.order);
              this.$store.commit("user/updateUserBattleOrders", arr);
            },
            () => {
              this.refreshBossStatus();
            }
          );
        });
    },
    // 查询预约
    searchOrder() {
      this.$axios
        .get(
          `/api/user/battle/searchOrder?round=${this.guild.round}&bossNum=${this.orderBossNum}`
        )
        .then(r => {
          console.log(r);
          this.ajaxCallback(r.data, this.searchOrder, () => {
            this.orderSearchResult = r.data.orders;
            this.showSearchResult = true;
          });
        });
    },
    // 取消预约
    cancelOrder(props) {
      this.$axios
        .post("/api/user/battle/cancelOrder", {
          user: this.user.name,
          ID: props.row.ID
        })
        .then(r => {
          this.ajaxCallback(r.data, this.cancelOrder.bind(this, props), () => {
            let arr = [];
            arr = arr.concat(this.orderData);
            arr.splice(props.rowIndex, 1);
            this.$store.commit("user/updateUserBattleOrders", arr);
          });
        });
    },
    // 申请出刀
    enterIn() {
      this.$axios
        .get(`/api/user/battle/enterIn?guild=${this.user.guild}`)
        .then(r => {
          this.ajaxCallback(
            r.data,
            this.enterIn,
            () => {
              this.$store.commit("user/updateGuildBossLocker", this.user.name);
            },
            () => {
              this.refreshBossStatus();
            }
          );
        });
    },
    // 报刀
    clear(isOverkill) {
      let damage = Number(this.damage);
      if (isOverkill) {
        damage = this.guild.currentBossHP;
      }
      this.$axios
        .post("/api/user/battle/clear", {
          damage
        })
        .then(r => {
          this.ajaxCallback(r.data, this.clear.bind(this, isOverkill), () => {
            console.log(r);
            const guild = r.data.guild;
            guild.currentBossTotalHP = r.data.currentBossTotalHP;
            guild.currentBossScoreX = r.data.currentBossScoreX;
            guild.hangUpMembers = r.data.hangUpMembers;
            this.$store.commit("user/updateGuildStatus", guild);
            this.$store.commit("user/updateUserStatus", r.data.user);
            if (isOverkill) {
              let arr = [].concat(this.orderData);
              arr = arr.filter(item => {
                return item.bossNum !== guild.bossNum;
              });
              this.$store.commit("user/updateUserBattleOrders", arr);
            }
            this.getNewestBattleRecords();
          });
        });
    },
    // 解锁
    unlock() {
      this.$axios
        .get(`/api/user/battle/unlock?guild=${this.user.guild}`)
        .then(r => {
          this.ajaxCallback(r.data, this.unlock, () => {
            this.$store.commit("user/updateGuildBossLocker", "");
          });
        });
    },
    // 挂树
    hangUp() {
      this.$axios.get("/api/user/battle/hangUp").then(r => {
        this.ajaxCallback(r.data, this.hangUp, () => {
          this.$store.commit("user/updateUserStatus", r.data.user);
          this.$store.commit("user/updateGuildBossLocker", "");
          let arr = [];
          if (this.guild.hangUpMembers) {
            arr = arr.concat(this.guild.hangUpMembers);
          }
          arr.push(this.user.name);
          console.log(arr);
          this.$store.commit("user/updateGuildHangUpMembers", arr);
        });
      });
    },
    // SL
    saveAndLoad() {
      this.$axios.get("/api/user/battle/saveAndLoad").then(r => {
        this.ajaxCallback(r.data, this.saveAndLoad, () => {
          this.$store.commit("user/updateUserStatus", r.data.user);
        });
      });
    },
    // 撤销出刀
    revert(id) {
      this.$axios.get("/api/user/battle/revert").then(r => {
        console.log(r);
        this.ajaxCallback(r.data, this.revert.bind(this, id), () => {
          const guild = r.data.guild;
          guild.currentBossTotalHP = r.data.currentBossTotalHP;
          guild.currentBossScoreX = r.data.currentBossScoreX;
          guild.hangUpMembers = r.data.hangUpMembers;
          this.$store.commit("user/updateGuildStatus", r.data.guild);
          this.$store.commit("user/updateUserStatus", r.data.user);
          const arr = [].concat(this.battleRecords);
          arr.shift();
          this.$store.commit("user/updateBattleRecords", arr);
        });
      });
    }
  }
};
</script>
