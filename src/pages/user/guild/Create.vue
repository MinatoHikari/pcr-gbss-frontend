<template>
    <q-page padding class="relative">
        <q-btn
            to="/user/home"
            class="absolute btn-back q-ma-md"
            round
            color="info"
            icon="home"
        />
        <q-card>
            <q-card-section>
                <div class="text-h6">
                    <span>创建公会</span>
                </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
                <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                    <q-input
                        filled
                        :model-value="name"
                        @update:model-value="name = $event"
                        label="公会名称 *"
                        hint="创建后可修改，不可重名"
                        :lazyRules="true"
                        :rules="[(val) => $v.name.required || '请勿留空']"
                    />

                    <q-input
                        filled
                        type="textarea"
                        v-model.trim="introduction"
                        label="公会介绍 *"
                        hint="创建后可修改"
                        lazy-rules
                        :rules="[(val) => $v.introduction.required || '请勿留空']"
                    />

                    <div class="q-gutter-sm">
                        <div class="q-mt-md">请选择公会所在服务器</div>
                        <q-radio v-model="area" val="japan" label="日本" />
                        <q-radio v-model="area" val="taiwan" label="台服" />
                        <q-radio v-model="area" val="bilibili" label="BILIBILI" />
                    </div>

                    <div>
                        <q-btn label="创建" type="submit" color="primary" />
                        <q-btn label="清空" type="reset" color="primary" flat class="q-ml-sm" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script lang="ts">
import { required } from '@vuelidate/validators';
import useRequests from '../../../compositions/useRequest';
import { computed, defineComponent, ref } from 'vue';
import { Store } from 'vuex';
import { MainState, useStore } from 'src/store';
import { guildRequests } from 'src/requests/guild';
import { RouteRecordRaw, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
    name: 'Guild-create',
    preFetch({ store, redirect }) {
        if ((store as Store<MainState>).state.user.user.guild !== '') {
            redirect({ path: '/user/guild/status' } as RouteRecordRaw);
        }
    },
    setup() {
        const { ajaxCallback } = useRequests();
        const store = useStore();
        const router = useRouter();
        const $q = useQuasar();

        const user = computed(() => store.state.user.user);

        const name = ref('');
        const introduction = ref('');
        const area = ref('japan');

        const onReset = () => {
            name.value = '';
            introduction.value = '';
        };

        const createGuild = async () => {
            const { res, err } = await guildRequests.createGuild(
                name.value,
                introduction.value,
                area.value,
                user.value.name
            );
            if (err) console.log(err);
            if (res) {
                ajaxCallback(res.data, res.config, () => {
                    store.commit('user/updateUserGuild', name.value);
                    router.push('/user/home').catch((err) => {
                        console.log(err);
                    });
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
            createGuild().catch((err) => {
                console.log(err);
            });
        };

        return {
            user,
            name,
            introduction,
            area,
            onReset,
            createGuild,
            onSubmit
        };
    },
    validations: {
        name: {
            required
        },
        introduction: {
            required
        }
    }
});
</script>
