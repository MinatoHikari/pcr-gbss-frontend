<template>
  <q-page class="flex flex-center relative">
    <q-btn
      v-go-back="'/auth/login'"
      class="absolute btn-back q-ma-md"
      round
      color="info"
      icon="login"
    />
    <q-card style="min-width:280px">
      <q-card-section>
        <div class="text-h6">重置密码</div>
      </q-card-section>
      <q-card-section>
        <q-input
          outlined
          ref="email"
          v-model="email"
          label="账号邮箱"
          hint="请输入需要找回密码的账号邮箱"
          lazy-rules
          :rules="[
            val => $v.email.required || '请勿留空',
            val => $v.email.email || '请输入合法邮箱'
          ]"
        />
        <img :src="captcha.img" alt="" />
        <q-btn
          class="q-mt-md full-width"
          color="pink-4"
          @click="sendPasswordResetMail"
          :disable="disableSendPasswordResetMail"
        >
          <q-inner-loading :showing="disableSendPasswordResetMail">
            <q-spinner-gears size="25px" color="primary" />
          </q-inner-loading>
          获取验证码
        </q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import ajaxCallbackFunc from "../mixins/AjaxCallback";

export default {
  name: "PasswordReset",
  mixins: [ajaxCallbackFunc],
  data() {
    return {
      email: "",
      disableSendPasswordResetMail: false,
      captcha: {
        ID: "",
        img: ""
      }
    };
  },
  validations: {
    email: {
      required,
      email
    }
  },
  created() {
    this.$axios.get("/api/public/getCaptcha").then(r => {
      console.log(r);
      this.captcha = r.data.captcha
    });
  },
  methods: {
    sendPasswordResetMail() {
      this.disableSendPasswordResetMail = true;
      if (!this.$refs.email.validate()) {
        this.disableSendPasswordResetMail = false;
        return;
      }
      this.$axios
        .get(`/api/user/sendPasswordResetMail?email=${this.email}`)
        .then(r => {
          console.log(r);
          this.ajaxCallback(
            r.data,
            null,
            () => {
              this.disableSendPasswordResetMail = false;
            },
            () => {
              this.disableSendPasswordResetMail = false;
            }
          );
        });
    }
  }
};
</script>
