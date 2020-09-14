<template>
  <q-page class="flex flex-center relative">
    <q-btn
      v-go-back="'/'"
      class="absolute btn-back q-ma-md"
      round
      color="info"
      icon="keyboard_return"
    />
    <div class="column">
      <div class="col">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            filled
            v-model.trim="email"
            label="邮箱 *"
            lazy-rules
            :rules="[
              val => $v.email.required || '请勿留空',
              val => $v.email.email || '请输入合法邮箱'
            ]"
          />

          <q-input
            filled
            v-model="password"
            :type="seePwd ? 'password' : 'text'"
            label="密码 *"
            lazy-rules
            :rules="[val => $v.password.required || '请勿留空']"
          >
            <template v-slot:append>
              <q-icon
                @click="seePwd = !seePwd"
                :name="seePwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <div>
            <q-btn label="登录" type="submit" color="primary" />
            <q-btn
              label="清空"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
            <q-btn flat color="pink-4" size="md" to="/auth/password-reset"
              >忘记密码？</q-btn
            >
          </div>
        </q-form>
      </div>
      <div class="col q-mt-md">
        <q-btn
          :to="'register'"
          flat
          color="primary"
          label="还没有账号？点击注册"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import ajaxCallbackFunc from "../mixins/AjaxCallback";

export default {
  name: "Login",
  mixins: [ajaxCallbackFunc],
  data() {
    return {
      email: null,
      password: null,
      seePwd: true
    };
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  },
  methods: {
    onSubmit() {
      this.$q.notify({
        color: "green-4",
        textColor: "white",
        icon: "cloud_done",
        message: "Submitted"
      });
      this.login();
    },
    onReset() {
      this.email = null;
      this.password = null;
    },
    login() {
      this.$axios
        .post("/api/user/login", {
          email: this.email,
          password: this.password
        })
        .then(r => {
          this.ajaxCallback(r.data, null, () => {
            this.$q.localStorage.set("JWT-token", r.data.token);
            this.$q.localStorage.set("JWT-Refresh-token", r.data.refreshToken);
            this.$router.replace("/user/home");
            console.log(r);
          });
        });
    }
  }
};
</script>
