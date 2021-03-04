<template>
    <div>
        <q-btn @click="ping" color="primary">ping</q-btn>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            ws: {} as WebSocket
        };
    },
    mounted() {
        this.ws = new WebSocket('ws://localhost:9000/user/ping');
        this.ws.onmessage = e => {
            console.log(e);
        };
    },
    methods: {
        ping() {
            this.ws.send('ping');
        }
    }
});
</script>
