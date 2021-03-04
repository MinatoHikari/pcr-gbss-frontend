<template>
    <q-scroll-area class="fit">
        <q-list v-for="(menuItem, index) in menuList" :key="index">
            <q-item clickable :to="menuItem.route" :active="menuItem.label === 'Outbox'" v-ripple>
                <q-item-section avatar>
                    <q-icon :name="menuItem.icon"/>
                </q-item-section>
                <q-item-section>
                    {{ menuItem.label }}
                </q-item-section>
            </q-item>

            <q-separator v-if="menuItem.separator"/>
        </q-list>
    </q-scroll-area>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const menuList = [
    {
        icon: 'login',
        label: '登录',
        separator: false,
        route: '/auth/login'
    },
    {
        icon: 'military_tech',
        label: '注册',
        separator: true,
        route: '/auth/register'
    }
];

export default defineComponent({
    data() {
        return {
            menuList
        };
    }
});
</script>
