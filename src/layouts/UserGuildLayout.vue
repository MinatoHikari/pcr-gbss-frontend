<template>
    <q-page>
        <router-view/>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Guild',
    preFetch({ store, redirect }) {
        return store.dispatch('user/fetchMyGuild', redirect);
    }
});
</script>
