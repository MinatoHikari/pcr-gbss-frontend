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
            <q-card-section v-if="step === 'email'">
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
                        <q-spinner-gears size="25px" color="primary"/>
                    </q-inner-loading>
                    获取邮件验证码
                </q-btn>
            </q-card-section>
            <q-card-section v-if="step === 'reset'">
                <q-input
                    filled
                    disable
                    ref="email"
                    v-model="email"
                    label="账号邮箱"
                    lazy-rules
                />
                <q-form
                    @submit="resetPassword"
                    @reset="onFormReset"
                    class="q-mt-md q-gutter-md"
                >
                    <q-input
                        class="q-mt-md"
                        outlined
                        ref="mailVerifyNumber"
                        v-model="mailVerifyNumber"
                        label="邮件验证码"
                        hint="请输入重置邮件中的验证码"
                        lazy-rules
                        :rules="[
              val => $v.mailVerifyNumber.required || '请勿留空',
              val => $v.mailVerifyNumber.minLength || '请输入七位验证码'
            ]"
                    />
                    <q-input
                        outlined
                        class="q-mt-md"
                        v-model.trim="password"
                        :type="seePwd ? 'password' : 'text'"
                        label="密码 *"
                        hint="请输入新的账号密码"
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
                        outlined
                        class="q-mt-md"
                        v-model.trim="passwordAgain"
                        :type="seePwda ? 'password' : 'text'"
                        label="再次输入密码 *"
                        hint="请再次输入新的账号密码"
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

                    <div class="q-mt-md">
                        <q-btn label="确定" type="submit" color="primary"/>
                        <q-btn
                            label="清空"
                            type="reset"
                            color="primary"
                            flat
                            class="q-ml-sm"
                        />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script>
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";
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
                captchaLoadingState: false,
                validated: false
            },
            step: "email",
            mailVerifyNumber: "",
            password: "",
            passwordAgain: "",
            // 密码可见
            seePwd: true,
            seePwda: true
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
                                this.captcha.validated = true;
                                this.disableSendPasswordResetMail = false;
                            },
                            () => {
                                this.captcha.captchaLoadingState = false;
                            }
                        );
                    });
            }
        },
        step(val) {
            if (!this.captcha.validated) {
                this.step = "email";
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
        },
        mailVerifyNumber: {
            required,
            minLength: minLength(7)
        },
        password: {
            required
        },
        passwordAgain: {
            required,
            sameAsPassword: sameAs("password")
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
            if (this.captcha.validated) {
                this.$axios
                    .get(`/api/user/sendPasswordResetMail?email=${this.email}`)
                    .then(r => {
                        console.log(r);
                        this.ajaxCallback(
                            r.data,
                            null,
                            () => {
                                this.step = "reset";
                                this.emailBtnLoading = false;
                            },
                            () => {
                                this.emailBtnLoading = false;
                            }
                        );
                    });
                this.captcha.validated = false;
            } else {
                this.$q.notify({
                    type: "negative",
                    message: "验证状态失效，请重新验证图片验证码"
                });
                this.disableSendPasswordResetMail = false;
                this.emailBtnLoading = false;
            }
        },
        refreshCaptcha() {
            this.$axios
                .get(`/api/public/refreshCaptcha?id=${this.captcha.ID}`)
                .then(r => {
                    this.ajaxCallback(r.data, null, () => {
                        this.captcha.ID = r.data.captcha.ID;
                        this.captcha.img = r.data.captcha.img;
                    });
                    this.captcha.validated = false;
                });
        },
        resetPassword() {
            this.$axios
                .post("/api/user/resetPassword", {
                    email: this.email,
                    password: this.password,
                    passwordAgain: this.passwordAgain,
                    emailVerifyNumber: this.mailVerifyNumber
                })
                .then(r => {
                    console.log(r);
                    this.ajaxCallback(
                        r.data,
                        null,
                        () => {
                            this.$router.replace("/auth/login");
                        },
                        () => {
                            this.step = "email";
                            this.password = "";
                            this.passwordAgain = "";
                            this.mailVerifyNumber = "";
                        }
                    );
                });
        },
        onFormReset() {
            this.password = "";
            this.passwordAgain = "";
            this.mailVerifyNumber = "";
        }
    }
};
</script>
