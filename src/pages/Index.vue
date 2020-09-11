<template>
  <q-page padding class="flex flex-center">
    <div class="column">
      <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg" /> -->
      <div class="col">
        <div class="column text-center">
          <div class="col text-h3">公主连结会战辅助系统</div>
          <div class="col text-h4">PCR guild battle support system</div>
        </div>
      </div>
      <div class="col">
        <div class="q-mt-md">
          <div class="row q-col-gutter-sm">
            <div class="col">
              <q-btn
                outline
                class="col auth-btn"
                color="primary"
                to="/auth/login"
                label="登录"
              />
            </div>
            <div class="col">
              <q-btn
                outline
                class="col auth-btn"
                color="secondary"
                label="注册"
                to="/auth/register"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageIndex"
};
</script>

<style lang="stylus">
.auth-btn
  width 100%
.btn-back
  top 0
  right 0
  z-index 1
</style>
