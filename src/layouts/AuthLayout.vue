<template>
    <q-page>
        <router-view/>
    </q-page>
</template>

<script lang="ts">
import { LocalStorage } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Auth',
    beforeRouteEnter(to, from, next) {
        if (LocalStorage.has('JWT-token')) {
            next('/user')
        }
    }
});
</script>
