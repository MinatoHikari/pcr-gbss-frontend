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
            hint="系统登录凭证，请勿使用临时邮箱"
            lazy-rules
            :rules="[
              val => $v.email.required || '请勿留空',
              val => $v.email.email || '请输入合法邮箱'
            ]"
          />

          <q-input
            filled
            v-model.trim="name"
            label="PCR账号名 *"
            hint="注册后可自由修改"
            lazy-rules
            :rules="[val => $v.name.required || '请勿留空']"
          />

          <q-input
            filled
            v-model.trim="password"
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

          <q-input
            filled
            v-model.trim="passwordAgain"
            :type="seePwda ? 'password' : 'text'"
            label="再次输入密码 *"
            lazy-rules
            :rules="[
              val => $v.passwordAgain.required || '请勿留空',
              val => $v.passwordAgain.sameAsPassword || '两次输入的密码不一致'
            ]"
          >
            <template v-slot:append>
              <q-icon
                @click="seePwda = !seePwda"
                :name="seePwda ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <q-toggle v-model="accept" label="我同意使用条款和用户协议" />

          <div>
            <q-btn label="注册" type="submit" color="primary" />
            <q-btn
              label="清空"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </div>
      <div class="col q-mt-md">
        <q-btn :to="'login'" flat color="primary" label="已经注册？点击登录" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { required, email, sameAs } from "vuelidate/lib/validators";
import ajaxCallbackFunc from "../mixins/AjaxCallback";

export default {
  name: "Register",
  mixins: [ajaxCallbackFunc],
  data() {
    return {
      email: null,
      name: null,
      password: null,
      seePwd: true,
      passwordAgain: null,
      seePwda: true,
      accept: false
    };
  },
  validations: {
    email: {
      required,
      email
    },
    name: {
      required
    },
    password: {
      required
    },
    passwordAgain: {
      required,
      sameAsPassword: sameAs("password")
    }
  },
  methods: {
    onSubmit() {
      if (this.accept !== true) {
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "You need to accept the license and terms first"
        });
      } else {
        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Submitted"
        });
        this.register();
      }
    },
    onReset() {
      this.email = null;
      this.name = null;
      this.password = null;
      this.passwordAgain = null;
      this.accept = false;
    },
    register() {
      this.$axios
        .post("/api/user/register", {
          email: this.email,
          name: this.name,
          password: this.password,
          passwordAgain: this.passwordAgain
        })
        .then(r => {
          console.log(r);
          this.ajaxCallback(r.data, null, () => {
            this.$router.push("login");
          });
        });
    }
  }
};
</script>
