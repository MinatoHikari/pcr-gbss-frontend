<template>
    <q-layout view="hHh lpR lFf">
        <q-header elevated class="bg-primary text-white" height-hint="98">
            <q-toolbar class="bg-pink-4">
                <q-btn dense flat round icon="menu" @click="left = !left" />

                <q-toolbar-title>
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
                    </q-avatar>
                    PCR-GBSS
                </q-toolbar-title>

                <q-btn dense flat round icon="menu" @click="right = !right" />
            </q-toolbar>

            <q-tabs inline-label class="bg-pink-11" align="left">
                <q-route-tab
                    v-show="$route.path.indexOf('user') !== -1"
                    to="/user/guild/battle"
                    label="公会战"
                    icon="sports_cricket"
                />
            </q-tabs>
        </q-header>

        <q-drawer
            show-if-above
            v-model="left"
            :mini="miniState"
            @mouseover="miniState = false"
            @mouseout="miniState = true"
            side="left"
            bordered
        >
            <router-view name="sider"></router-view>
        </q-drawer>

        <q-drawer v-model="right" side="right" bordered>
            <router-view name="sider-right"></router-view>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>

        <q-footer elevated class="bg-grey-8 text-white">
            <q-toolbar class="bg-pink-4">
                <q-toolbar-title>
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
                    </q-avatar>
                    Title
                </q-toolbar-title>
            </q-toolbar>
        </q-footer>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            left: false,
            right: false,
            miniState: true
        };
    },
    created() {
        console.log(this.left);
        console.log(this.right);
    },
    watch: {
        $route(to, from) {
            console.log(to);
            console.log(from);
        }
    }
});
</script>
