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
                <q-card class="q-mt-xl">
                    <q-card-section>
                        <div class="text-h6">注册</div>
                    </q-card-section>
                    <q-card-section>
                        <q-form @submit="onSubmit" @reset="onReset" ref="register" class="q-gutter-md">
                            <q-input
                                outlined
                                v-model.trim="email"
                                label="邮箱 *"
                                hint="系统登录凭证，请勿使用临时邮箱"
                                lazy-rules
                                :rules="[val => $v.email.required || '请勿留空', val => $v.email.email || '请输入合法邮箱']"/>
                            <q-input
                                outlined
                                v-model.trim="name"
                                label="PCR账号名 *"
                                hint="注册后可自由修改"
                                lazy-rules
                                :rules="[val => $v.name.required || '请勿留空']"/>
                            <q-input
                                outlined
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
                                outlined
                                v-model.trim="passwordAgain"
                                :type="seePwda ? 'password' : 'text'"
                                label="再次输入密码 *"
                                lazy-rules
                                :rules="[val => $v.passwordAgain.required || '请勿留空',
                                val => $v.passwordAgain.sameAsPassword || '两次输入的密码不一致']"
                            >
                                <template v-slot:append>
                                    <q-icon
                                        @click="seePwda = !seePwda"
                                        :name="seePwda ? 'visibility_off' : 'visibility'"
                                        class="cursor-pointer"
                                    />
                                </template>
                            </q-input>

                            <q-input
                                class="q-mt-md"
                                outlined
                                :loading="captcha.captchaLoadingState"
                                ref="captchaDigital"
                                v-model="captchaDigital"
                                @focus="captcha.captchaLoadingState = true"
                                debounce="1000"
                                label="验证码"
                                hint="请输入图中的验证码，验证通过后才可获取邮件验证码"
                                lazy-rules
                                :rules="[ val => $v.captchaDigital.required || '请勿留空',
                                val => $v.captchaDigital.minLength || '请输入六位验证码' ]"/>
                            <div class="q-mt-md">
                                <q-img
                                    :src="captcha.img"
                                    spinner-color="white"
                                    class=" full-width cursor-pointer"

                                    @click="refreshCaptcha"
                                >
                                    <q-tooltip anchor="top middle" self="top middle">
                                        点击刷新验证码
                                    </q-tooltip>
                                </q-img>
                            </div>

                            <div>
                                <q-btn
                                    class="q-mt-md full-width"
                                    color="pink-4"
                                    @click="sendAddressVerifyMail"
                                    :disable="disableSendAddressVerifyMail"
                                >
                                    <q-inner-loading :showing="emailBtnLoading">
                                        <q-spinner-gears size="25px" color="primary"/>
                                    </q-inner-loading>
                                    获取邮件验证码
                                </q-btn>
                            </div>

                            <q-input
                                outlined
                                v-model.trim="emailVerifyNumber"
                                label="邮件验证码 *"
                                hint="请输入7位邮件验证码"
                                lazy-rules
                                :rules="[val => $v.name.required || '请勿留空',
                                val => $v.captchaDigital.minLength || '请输入六位验证码']"/>
                            <q-toggle v-model="accept" label="我同意使用条款和用户协议"/>
                            <div>
                                <q-btn label="注册" type="submit" color="primary"/>
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
            </div>
            <div class="col q-mt-md q-mb-xl">
                <q-btn :to="'login'" flat color="primary" label="已经注册？点击登录"/>
            </div>
        </div>
    </q-page>
</template>

<script>
import { required, email, sameAs, minLength } from "vuelidate/lib/validators";
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
            emailVerifyNumber: "",
            accept: false,
            captcha: {
                ID: "",
                img: "",
                captchaLoadingState: false,
                validated: false
            },
            captchaDigital: "",
            disableSendAddressVerifyMail: true,
            emailBtnLoading: false
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
                                this.disableSendAddressVerifyMail = false;
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
        name: {
            required
        },
        password: {
            required
        },
        passwordAgain: {
            required,
            sameAsPassword: sameAs("password")
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
                    passwordAgain: this.passwordAgain,
                    verifyNumber: this.emailVerifyNumber
                })
                .then(r => {
                    console.log(r);
                    this.ajaxCallback(r.data, null, () => {
                        this.$router.push("login");
                    });
                });
        },
        refreshCaptcha() {
            this.$axios
                .get(`/api/public/refreshCaptcha?id=${ this.captcha.ID }`)
                .then(r => {
                    this.ajaxCallback(r.data, null, () => {
                        this.captcha.ID = r.data.captcha.ID;
                        this.captcha.img = r.data.captcha.img;
                    });
                    this.captcha.validated = false;
                });
        },
        sendAddressVerifyMail() {
            this.disableSendAddressVerifyMail = true;
            this.emailBtnLoading = true;
            if (!this.$refs.register.validate()) {
                this.disableSendAddressVerifyMail = false;
                this.emailBtnLoading = false;
                return;
            }
            if (this.captcha.validated) {
                this.$axios
                    .get(`/api/user/sendRegisterVerifyEmail?email=${ this.email }`)
                    .then(r => {
                        console.log(r);
                        this.ajaxCallback(
                            r.data,
                            null,
                            () => {
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
                this.emailBtnLoading = false;
            }
        }
    }
};
</script>
