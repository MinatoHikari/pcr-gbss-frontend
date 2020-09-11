<template>
  <q-page>
    <router-view />
  </q-page>
</template>

<script>
export default {
  name: "User",
  preFetch({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    return store.dispatch("user/fetchUser", redirect);
  }
};
</script>
