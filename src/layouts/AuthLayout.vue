<template>
  <q-page>
    <router-view />
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";

export default {
  name: "Auth",
  preFetch({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    if (LocalStorage.has('JWT-token')) {
      redirect('/user')
    }
  }
};
</script>
