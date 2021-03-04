<template>
    <q-page padding class=" relative">
        <q-btn
            v-go-back="'/user/home'"
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
            <q-separator/>
            <q-card-section>
                <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                    <q-input
                        filled
                        :model-value="name"
                        @update:model-value="name = $event"
                        label="公会名称 *"
                        hint="创建后可修改，不可重名"
                        :lazyRules="true"
                        :rules="[val => $v.name.required || '请勿留空']"
                    />

                    <q-input
                        filled
                        type="textarea"
                        v-model.trim="introduction"
                        label="公会介绍 *"
                        hint="创建后可修改"
                        lazy-rules
                        :rules="[val => $v.introduction.required || '请勿留空']"
                    />

                    <div class="q-gutter-sm">
                        <div class="q-mt-md">
                            请选择公会所在服务器
                        </div>
                        <q-radio v-model="area" val="japan" label="日本"/>
                        <q-radio v-model="area" val="taiwan" label="台服"/>
                        <q-radio v-model="area" val="bilibili" label="BILIBILI"/>
                    </div>

                    <div>
                        <q-btn label="创建" type="submit" color="primary"/>
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

<script lang="ts">
import { required } from '@vuelidate/validators';
import useRequests from '../../../compositions/useRequest';
import { defineComponent } from 'vue';
import { Store } from 'vuex'
import { MainState } from 'src/store';

export default defineComponent({
    name: 'Guild-create',
    preFetch({ store, redirect }) {
        if ((store as Store<MainState>).state.user.user.guild !== '') {
            redirect('/user/guild/status');
        }
    },
    computed: {
        user() {
            return this.$store.state.user.user;
        }
    },
    data() {
        return {
            name: null,
            introduction: null,
            area: 'japan'
        };
    },
    validations: {
        name: {
            required
        },
        introduction: {
            required
        }
    },
    methods: {
        onSubmit() {
            this.$q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: 'Submitted'
            });
            this.createGuild();
        },
        onReset() {
            this.name = null;
            this.introduction = null;
        },
        createGuild() {
            this.$axios
                .post('/api/user/guild/create', {
                    name: this.name,
                    introduction: this.introduction,
                    area: this.area,
                    master: this.$store.state.user.user.name
                })
                .then(r => {
                    this.ajaxCallback(r.data, this.createGuild, () => {
                        this.$store.commit('user/updateUserGuild', this.name);
                        this.$router.push('/user/home');
                    });
                }).catch((err) => {
                console.log(err)
            });
        }
    }
});
</script>
