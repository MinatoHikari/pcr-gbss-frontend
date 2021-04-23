<template>
    <q-page class="flex flex-center relative">
        <q-btn to="/auth/login" class="absolute btn-back q-ma-md" round color="info" icon="login" />
        <q-card style="min-width: 280px">
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
                        (val) => v$.email.required || '请勿留空',
                        (val) => v$.email.email || '请输入合法邮箱'
                    ]"
                />
                <q-input
                    class="q-mt-md full-width"
                    outlined
                    :loading="captcha.captchaLoadingState"
                    ref="captchaInput"
                    v-model="captchaDigital"
                    @focus="captcha.captchaLoadingState = true"
                    debounce="1000"
                    label="验证码"
                    hint="请输入图中的验证码，验证通过后才可获取邮件验证码"
                    lazy-rules
                    :rules="[
                        (val) => cv$.captchaDigital.required || '请勿留空',
                        (val) => cv$.captchaDigital.minLength || '请输入六位验证码'
                    ]"
                />
                <q-img
                    :src="captcha.img"
                    spinner-color="white"
                    class="q-mt-md full-width cursor-pointer"
                    @click="refreshCaptcha"
                >
                    <q-tooltip anchor="top middle" self="top middle"> 点击刷新验证码 </q-tooltip>
                </q-img>
                <q-btn
                    class="q-mt-md full-width"
                    color="pink-4"
                    @click="sendPasswordResetMail"
                    :disable="disableSendMail"
                >
                    <q-inner-loading :showing="emailBtnLoading">
                        <q-spinner-gears size="25px" color="primary" />
                    </q-inner-loading>
                    获取邮件验证码
                </q-btn>
            </q-card-section>
            <q-card-section v-if="step === 'reset'">
                <q-input filled disable ref="email" v-model="email" label="账号邮箱" lazy-rules />
                <q-form @submit="resetPassword" @reset="onFormReset" class="q-mt-md q-gutter-md">
                    <q-input
                        class="q-mt-md"
                        outlined
                        ref="mailVerifyNumber"
                        v-model="mailVerifyNumber"
                        label="邮件验证码"
                        hint="请输入重置邮件中的验证码"
                        lazy-rules
                        :rules="[
                            (val) => v$.mailVerifyNumber.required || '请勿留空',
                            (val) => v$.mailVerifyNumber.minLength || '请输入七位验证码'
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
                        outlined
                        class="q-mt-md"
                        v-model.trim="passwordAgain"
                        :type="seePwda ? 'password' : 'text'"
                        label="再次输入密码 *"
                        hint="请再次输入新的账号密码"
                        lazy-rules
                        :rules="[
                            (val) => v$.passwordAgain.required || '请勿留空',
                            (val) => v$.passwordAgain.sameAsPassword || '两次输入的密码不一致'
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
                        <q-btn label="确定" type="submit" color="primary" />
                        <q-btn label="清空" type="reset" color="primary" flat class="q-ml-sm" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script lang="ts">
import { required, email as emailRule, minLength, sameAs } from '@vuelidate/validators';
import useRequests from '../compositions/useRequest';
import useCaptcha from 'src/compositions/useCaptcha';
import { defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useVuelidate } from '@vuelidate/core';
import { authRequests } from 'src/requests/auth';

export default defineComponent({
    name: 'PasswordReset',
    setup() {
        const { ajaxCallback } = useRequests();
        const router = useRouter();
        const $q = useQuasar();
        const { captcha, captchaDigital, cv$, refreshCaptcha, disableSendMail } = useCaptcha();

        const email = ref('');
        const emailBtnLoading = ref(false);
        const step = ref('email');
        const mailVerifyNumber = ref('');
        const password = ref('');
        const passwordAgain = ref('');
        // 密码可见
        const seePwd = ref(true);
        const seePwda = ref(true);

        const rules = {
            email: { required, emailRule },
            password: { required },
            passwordAgain: { required, sameAsPassword: sameAs('password') },
            mailVerifyNumber: {
                required,
                minLength: minLength(7)
            }
        };

        const v$ = useVuelidate(rules, { email, mailVerifyNumber, password, passwordAgain });

        const sendPasswordResetMail = async () => {
            disableSendMail.value = true;
            emailBtnLoading.value = true;
            if (v$.value.email.$error) {
                disableSendMail.value = false;
                emailBtnLoading.value = false;
                return;
            }
            if (captcha.value.validated) {
                const { res, err } = await authRequests.sendPasswordResetMail(email.value);
                if (err) console.log(err);
                if (res) {
                    ajaxCallback(
                        res.data,
                        null,
                        () => {
                            step.value = 'reset';
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
                disableSendMail.value = false;
                emailBtnLoading.value = false;
            }
        };

        const resetPassword = async () => {
            const { res, err } = await authRequests.resetPassword({
                email: email.value,
                emailVerifyNumber: mailVerifyNumber.value,
                password: password.value,
                passwordAgain: passwordAgain.value
            });
            if (err) console.log(err);
            if (res) {
                ajaxCallback(
                    res.data,
                    null,
                    () => {
                        router.replace('/auth/login').catch((err) => {
                            console.log(err);
                        });
                    },
                    () => {
                        step.value = 'email';
                        password.value = '';
                        passwordAgain.value = '';
                        mailVerifyNumber.value = '';
                    }
                ).catch((err) => {
                    console.log(err);
                });
            }
        };

        watch(step, () => {
            if (!captcha.value.validated) {
                step.value = 'email';
            }
        });

        const onFormReset = () => {
            password.value = '';
            passwordAgain.value = '';
            mailVerifyNumber.value = '';
        };

        return {
            v$,
            cv$,
            email,
            captchaDigital,
            disableSendMail,
            emailBtnLoading,
            captcha,
            step,
            mailVerifyNumber,
            password,
            passwordAgain,
            seePwd,
            seePwda,
            refreshCaptcha,
            onFormReset,
            resetPassword,
            sendPasswordResetMail
        };
    }
});
</script>
