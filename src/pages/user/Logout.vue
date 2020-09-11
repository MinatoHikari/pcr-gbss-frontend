<template>
  <q-page class="flex flex-center relative"></q-page>
</template>

<script>
export default {
  name: "Logout",
  mounted() {
    this.$q.localStorage.remove("JWT-token");
    this.$router.replace("/");
    this.$q.notify({
      color: "green-4",
      textColor: "white",
      icon: "sentiment_satisfied",
      message: "登出完毕"
    });
  }
};
</script>
