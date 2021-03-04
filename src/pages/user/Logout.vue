<template>
    <q-page class="flex flex-center relative"></q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar';

export default defineComponent({
    name: 'Logout',
    setup() {
        const router = useRouter()
        const $q = useQuasar()

        $q.localStorage.remove('JWT-token');
        router.replace('/').catch((err) => {
            console.log(err)
        });
        $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'sentiment_satisfied',
            message: '登出完毕'
        });
    }
});
</script>
