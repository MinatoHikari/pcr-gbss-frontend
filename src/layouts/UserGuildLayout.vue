<template>
  <q-page>
    <router-view />
  </q-page>
</template>

<script>
export default {
  name: "Guild",
  preFetch({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    return store.dispatch("user/fetchMyGuild", redirect);
  }
};
</script>
