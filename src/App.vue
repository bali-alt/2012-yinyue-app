<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default { name: "app" };
</script>
<style  scoped>
#app {
  background: url("../public/bg.png");
  background-size: 100% 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;
}
</style>