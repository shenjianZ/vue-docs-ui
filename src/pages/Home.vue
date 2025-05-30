<template>
  <div class="home-page">
    <DashboardCards />
  </div>
</template>

<script>
import DashboardCards from '../components/DashboardCards.vue'

export default {
  name: 'Home',
  components: {
    DashboardCards,
  },
}
</script>

<style lang="scss" scoped>
.home-page {
  min-height: calc(100vh - var(--header-height));
  background: var(--bg-color);
}
</style> 