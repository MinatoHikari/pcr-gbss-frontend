<template>
    <q-scroll-area class="fit">
        <q-list v-for="(menuItem, index) in menuList" :key="index">
            <q-item
                clickable
                :to="menuItem.route"
                @click="action(menuItem)"
                :active="menuItem.label === 'Outbox'"
                v-ripple
            >
                <q-item-section avatar>
                    <q-icon :name="menuItem.icon"/>
                </q-item-section>
                <q-item-section>
                    {{ menuItem.label }}
                </q-item-section>
            </q-item>

            <q-separator v-if="menuItem.separator"/>
        </q-list>

        <q-dialog v-model="confirm">
            <q-card style="width: 300px">
                <q-card-section class="row items-center">
                    <q-avatar icon="run_circle" color="white" font-size="40px" text-color="warning"/>
                    <span class="q-ml-sm"
                    >确认登出账号吗？</span
                    >
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="取消" color="primary" v-close-popup/>
                    <q-btn label="确定" to="/user/logout" color="primary" v-close-popup/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-scroll-area>
</template>

<script lang="ts">
import { defineComponent, ref, UnwrapRef } from 'vue';

interface MenuListItem {
    icon: string
    label: string
    separator: boolean
    route: string
    action?: CallableFunction
}

export default defineComponent({
    data() {
        return {};
    },
    setup() {
        const confirm = ref(false)

        const menuList: MenuListItem[] = [
            {
                icon: 'person',
                label: '个人中心',
                separator: false,
                route: '/user/home'
            },
            {
                icon: 'contact_mail',
                label: '我的人事',
                separator: false,
                route: '/user/HR'
            },
            {
                icon: 'perm_contact_calendar',
                label: '账号检索',
                separator: true,
                route: '/user/search'
            },
            {
                icon: 'sports_esports',
                label: '我的公会',
                separator: false,
                route: '/user/guild/status'
            },
            {
                icon: 'search',
                label: '公会检索',
                separator: false,
                route: '/user/guild/search'
            },
            {
                icon: 'event_note',
                label: '会战统计',
                separator: true,
                route: '/user/guild/records'
            },
            {
                icon: 'run_circle',
                label: '退出登录',
                separator: true,
                route: '',
                action() {
                    confirm.value = true;
                }
            }
        ]

        const action = (item: UnwrapRef<MenuListItem>) => {
            item.action && item.action();
        }

        return {
            confirm,
            menuList,
            action
        }
    }
});
</script>
