<template>
  <q-scroll-area class="fit">
    <q-list v-for="(menuItem, index) in menuList" :key="index">
      <q-item clickable :to="menuItem.route" :active="menuItem.label === 'Outbox'" v-ripple>
        <q-item-section avatar>
          <q-icon :name="menuItem.icon" />
        </q-item-section>
        <q-item-section>
          {{ menuItem.label }}
        </q-item-section>
      </q-item>

      <q-separator v-if="menuItem.separator" />
    </q-list>
  </q-scroll-area>
</template>

<script>
  const menuList = [{
      icon: "person",
      label: "个人中心",
      separator: false,
      route: "/user/home"
    },
    {
      icon: "contact_mail",
      label: "我的人事",
      separator: false,
      route: "/user/HR"
    },
    {
      icon: "perm_contact_calendar",
      label: "账号检索",
      separator: true,
      route: "/user/search"
    },
    {
      icon: "sports_esports",
      label: "我的公会",
      separator: false,
      route: "/user/guild/status"
    },
    {
      icon: "search",
      label: "公会检索",
      separator: false,
      route: "/user/guild/search"
    },
    {
      icon: "event_note",
      label: "会战统计",
      separator: true,
      route: "/user/guild/records"
    },
    {
      icon: "run_circle",
      label: "退出登录",
      separator: true,
      route: "/user/logout"
    }
  ];

  export default {
    data() {
      return {
        menuList
      };
    }
  };

</script>
