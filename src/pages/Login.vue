<template>
    <q-page class="flex flex-center relative">
        <q-btn to="/" class="absolute btn-back q-ma-md" round color="info" icon="keyboard_return" />
        <div class="column">
            <div class="col">
                <q-card>
                    <q-card-section>
                        <div class="text-h6">登录</div>
                    </q-card-section>
                    <q-card-section>
                        <q-form @submit="onSubmit" @reset="onReset" ref="login" class="q-gutter-md">
                            <q-input
                                outlined
                                v-model.trim="email"
                                label="邮箱 *"
                                lazy-rules
                                :rules="[
                                    (val) => v$.email.required || '请勿留空',
                                    (val) => v$.email.email || '请输入合法邮箱'
                                ]"
                            />

                            <q-input
                                outlined
                                v-model="password"
                                :type="seePwd ? 'password' : 'text'"
                                label="密码 *"
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
                                    >忘记密码？
                                </q-btn>
                            </div>
                        </q-form>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col q-mt-md">
                <q-btn :to="'register'" flat color="primary" label="还没有账号？点击注册" />
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import { required, email } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import useAjaxCallback from '../compositions/useRequest';
import { defineComponent, ref, Ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { authRequests } from 'src/requests/auth';
import { useVDR } from 'v-demi-request';

export default defineComponent({
    name: 'Login',
    setup() {
        const email = ref('');
        const password = ref('');
        const seePwd = ref(true);

        const v$ = useVuelidate();
        const { ajaxCallback } = useAjaxCallback();
        const $q = useQuasar();
        const router = useRouter();

        const onReset = () => {
            email.value = '';
            password.value = '';
        };

        const login = async () => {
            const { res, err } = await authRequests.login(email.value, password.value);
            if (err) return err;
            if (res) {
                ajaxCallback(res.data, null, () => {
                    $q.localStorage.set('JWT-token', res.data.token);
                    $q.localStorage.set('JWT-Refresh-token', res.data.refreshToken);
                    router.replace('/user/home').catch((err) => {
                        console.log(err);
                    });
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                });
            }
        };

        const onSubmit = () => {
            $q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: 'Submitted'
            });
            login().catch((err) => {
                console.log(err);
            });
        };

        return {
            v$,
            email,
            password,
            seePwd,
            onReset,
            login,
            onSubmit
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
    }
});
</script>
