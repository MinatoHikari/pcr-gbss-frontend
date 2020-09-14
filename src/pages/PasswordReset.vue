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
        <q-input
          class="q-mt-md full-width"
          outlined
          :loading="captcha.captchaLoadingState"
          ref="captchaDigital"
          v-model="captchaDigital"
          @focus="captcha.captchaLoadingState = true"
          debounce="1000"
          label="验证码"
          hint="请输入图中的验证码，验证通过后才可获取邮件验证码"
          lazy-rules
          :rules="[
            val => $v.captchaDigital.required || '请勿留空',
            val => $v.captchaDigital.minLength || '请输入六位验证码'
          ]"
        />
        <q-img
          :src="captcha.img"
          spinner-color="white"
          class="q-mt-md full-width cursor-pointer"
          @click="refreshCaptcha"
        >
          <q-tooltip anchor="top middle" self="top middle">
            点击刷新验证码
          </q-tooltip>
        </q-img>
        <q-btn
          class="q-mt-md full-width"
          color="pink-4"
          @click="sendPasswordResetMail"
          :disable="disableSendPasswordResetMail"
        >
          <q-inner-loading :showing="emailBtnLoading">
            <q-spinner-gears size="25px" color="primary" />
          </q-inner-loading>
          获取邮件验证码
        </q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { required, email, minLength } from "vuelidate/lib/validators";
import ajaxCallbackFunc from "../mixins/AjaxCallback";

export default {
  name: "PasswordReset",
  mixins: [ajaxCallbackFunc],
  data() {
    return {
      email: "",
      captchaDigital: "",
      disableSendPasswordResetMail: true,
      emailBtnLoading: false,
      captcha: {
        ID: "",
        img: "",
        captchaLoadingState: false
      }
    };
  },
  watch: {
    captchaDigital(val) {
      if (this.$refs.captchaDigital.validate()) {
        this.$axios
          .post("/api/public/verifyCaptcha", {
            ID: this.captcha.ID,
            digitalStr: val
          })
          .then(r => {
            console.log(r);
            this.ajaxCallback(
              r.data,
              null,
              () => {
                this.captcha.captchaLoadingState = false;
                this.disableSendPasswordResetMail = false;
              },
              () => {
                this.captcha.captchaLoadingState = false;
              }
            );
          });
      }
    }
  },
  validations: {
    email: {
      required,
      email
    },
    captchaDigital: {
      required,
      minLength: minLength(6)
    }
  },
  created() {
    this.$axios.get("/api/public/getCaptcha").then(r => {
      this.captcha.ID = r.data.captcha.ID;
      this.captcha.img = r.data.captcha.img;
    });
  },
  methods: {
    sendPasswordResetMail() {
      this.disableSendPasswordResetMail = true;
      this.emailBtnLoading = true;
      if (!this.$refs.email.validate()) {
        this.disableSendPasswordResetMail = false;
        this.emailBtnLoading = false;
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
              this.emailBtnLoading = false;
            },
            () => {
              this.disableSendPasswordResetMail = false;
              this.emailBtnLoading = false;
            }
          );
        });
    },
    refreshCaptcha() {
      this.$axios
        .get(`/api/public/refreshCaptcha?id=${this.captcha.ID}`)
        .then(r => {
          this.ajaxCallback(r.data, null, () => {
            this.captcha.ID = r.data.captcha.ID;
            this.captcha.img = r.data.captcha.img;
          });
        });
    }
  }
};
</script>
