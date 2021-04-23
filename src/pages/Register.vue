<template>
    <q-page class="flex flex-center relative">
        <q-btn to="/" class="absolute btn-back q-ma-md" round color="info" icon="keyboard_return" />
        <div class="column">
            <div class="col">
                <q-card class="q-mt-xl">
                    <q-card-section>
                        <div class="text-h6">注册</div>
                    </q-card-section>
                    <q-card-section>
                        <q-form
                            @submit="onSubmit"
                            @reset="onReset"
                            ref="register"
                            class="q-gutter-md"
                        >
                            <q-input
                                :outlined="true"
                                v-model.trim="email"
                                label="邮箱 *"
                                hint="系统登录凭证，请勿使用临时邮箱"
                                :lazy-rules="true"
                                :rules="[
                                    (val) => v$.email.required || '请勿留空',
                                    (val) => v$.email.emailRule || '请输入合法邮箱'
                                ]"
                            />
                            <q-input
                                :outlined="true"
                                v-model.trim="name"
                                label="PCR账号名 *"
                                hint="注册后可自由修改"
                                :lazy-rules="true"
                                :rules="[(val) => v$.name.required || '请勿留空']"
                            />
                            <q-input
                                :outlined="true"
                                v-model.trim="password"
                                :type="seePwd ? 'password' : 'text'"
                                label="密码 *"
                                :lazy-rules="true"
                                :rules="[(val) => v$.password.required || '请勿留空']"
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
                                :outlined="true"
                                v-model.trim="passwordAgain"
                                :type="seePwda ? 'password' : 'text'"
                                label="再次输入密码 *"
                                :lazy-rules="true"
                                :rules="[
                                    (val) => v$.passwordAgain.required || '请勿留空',
                                    (val) =>
                                        v$.passwordAgain.sameAsPassword || '两次输入的密码不一致'
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

                            <q-input
                                class="q-mt-md"
                                :outlined="true"
                                :loading="captcha.captchaLoadingState"
                                ref="captchaInput"
                                v-model="captchaDigital"
                                @focus="captcha.captchaLoadingState = true"
                                debounce="1000"
                                label="验证码"
                                hint="请输入图中的验证码，验证通过后才可获取邮件验证码"
                                :lazy-rules="true"
                                :rules="[
                                    (val) => cv$.captchaDigital.required || '请勿留空',
                                    (val) => cv$.captchaDigital.minLength || '请输入六位验证码'
                                ]"
                            />
                            <div class="q-mt-md relative-position">
                                <q-img
                                    :src="captcha.img || require('../assets/placeholder.png')"
                                    spinner-color="white"
                                    class="full-width cursor-pointer"
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
                                    :disable="disableSendMail"
                                >
                                    <q-inner-loading :showing="emailBtnLoading">
                                        <q-spinner-gears size="25px" color="primary" />
                                    </q-inner-loading>
                                    获取邮件验证码
                                </q-btn>
                            </div>

                            <q-input
                                :outlined="true"
                                v-model.trim="emailVerifyNumber"
                                label="邮件验证码 *"
                                hint="请输入7位邮件验证码"
                                :lazy-rules="true"
                                :rules="[
                                    (val) => v$.name.required || '请勿留空',
                                    (val) => v$.captchaDigital.minLength || '请输入六位验证码'
                                ]"
                            />
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
                    </q-card-section>
                </q-card>
            </div>
            <div class="col q-mt-md q-mb-xl">
                <q-btn :to="'login'" flat color="primary" label="已经注册？点击登录" />
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import { required, email as emailRule, sameAs, minLength } from '@vuelidate/validators';
import useRequests from '../compositions/useRequest';
import { defineComponent, ref } from 'vue';
import { authRequests } from 'src/requests/auth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useVuelidate } from '@vuelidate/core';
import useCaptcha from 'src/compositions/useCaptcha';

export default defineComponent({
    name: 'Register',
    setup() {
        const { ajaxCallback } = useRequests();
        const router = useRouter();
        const $q = useQuasar();

        const email = ref('');
        const name = ref('');
        const password = ref('');
        const seePwd = ref(true);
        const passwordAgain = ref('');
        const seePwda = ref(true);
        const emailVerifyNumber = ref('');
        const accept = ref(false);
        const emailBtnLoading = ref(false);
        const { captcha, captchaDigital, cv$, refreshCaptcha, disableSendMail } = useCaptcha();

        const rules = {
            email: { required, emailRule },
            name: { required },
            password: { required },
            passwordAgain: { required, sameAsPassword: sameAs('password') },
            captchaDigital: {
                required,
                minLength: minLength(6)
            }
        };

        const v$ = useVuelidate(rules, { email, name, password, passwordAgain });

        const onReset = () => {
            email.value = '';
            name.value = '';
            password.value = '';
            passwordAgain.value = '';
            accept.value = false;
        };

        const register = async () => {
            const { res, err } = await authRequests.register({
                email: email.value,
                password: password.value,
                passwordAgain: passwordAgain.value,
                name: name.value,
                verifyNumber: emailVerifyNumber.value
            });
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, null, async () => {
                    await router.push('login');
                }).catch((err) => {
                    console.log(err);
                });
            }
        };

        const onSubmit = async () => {
            if (accept.value !== true) {
                $q.notify({
                    color: 'red-5',
                    textColor: 'white',
                    icon: 'warning',
                    message: 'You need to accept the license and terms first'
                });
            } else {
                $q.notify({
                    color: 'green-4',
                    textColor: 'white',
                    icon: 'cloud_done',
                    message: 'Submitted'
                });
                await register();
            }
        };

        const sendAddressVerifyMail = async () => {
            disableSendMail.value = true;
            emailBtnLoading.value = true;
            if (v$.value.email.$error) {
                disableSendMail.value = false;
                emailBtnLoading.value = false;
                return;
            }
            if (captcha.value.validated) {
                const { res, err } = await authRequests.sendAddressVerifyMail(email.value);
                captcha.value.validated = false;
                if (err) console.log(err);
                if (res) {
                    ajaxCallback(
                        res.data,
                        null,
                        () => {
                            emailBtnLoading.value = false;
                        },
                        () => {
                            emailBtnLoading.value = false;
                        }
                    ).catch((err) => {
                        console.log(err);
                    });
                }
            } else {
                $q.notify({
                    type: 'negative',
                    message: '验证状态失效，请重新验证图片验证码'
                });
                emailBtnLoading.value = false;
            }
        };

        return {
            email,
            name,
            password,
            seePwd,
            passwordAgain,
            seePwda,
            emailVerifyNumber,
            accept,
            captcha,
            captchaDigital,
            disableSendMail,
            emailBtnLoading,
            onReset,
            register,
            onSubmit,
            refreshCaptcha,
            sendAddressVerifyMail,
            v$,
            cv$
        };
    }
});
</script>
