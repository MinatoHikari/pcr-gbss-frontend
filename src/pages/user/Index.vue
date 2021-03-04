<template>
    <q-page padding class="relative">
        <div class="column">
            <div class="col">
                <q-card class="my-card">
                    <q-card-section>
                        <div class="text-h6">
                            <q-avatar class="q-mr-sm" color="teal-4" size="lg" text-color="white">
                                {{ user.name[0].toUpperCase() }}
                            </q-avatar>
                            <span>{{ user.name }}</span>
                        </div>
                    </q-card-section>
                    <q-separator/>
                    <q-card-section>
            <span>
              <q-badge class="q-mr-sm" outline color="primary" label="Email"/>
              {{ user.email }}
            </span>
                    </q-card-section>
                    <q-card-section>
            <span>
              <q-badge class="q-mr-sm" outline color="deep-purple-8" label="所属公会"/>
              {{ user.guild }}
            </span>
                    </q-card-section>
                    <q-separator/>
                    <q-card-actions align="right">
                        <q-btn to="/user/guild/create" color="primary" v-if="user.guild === ''">创建公会</q-btn>
                        <q-btn to="/user/guild/search" color="teal-4" v-if="user.guild === ''">加入公会</q-btn>
                        <q-btn color="teal-4" v-else to="/user/guild">查看公会</q-btn>
                    </q-card-actions>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'User',
    computed: {
        user() {
            return this.$store.state.user.user;
        }
    }
});

</script>
