<template>
  <div>
    <q-btn @click="ping" color="primary">ping</q-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ws: {}
    };
  },
  mounted() {
    this.ws = new WebSocket("ws://localhost:9000/user/ping");
    this.ws.onmessage = e => {
      console.log(e);
    };
  },
  methods: {
    ping() {
      this.ws.send("ping");
    }
  }
};
</script>
