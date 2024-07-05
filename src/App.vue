<template>
  <Header v-if="!$route.meta.hideLayout"></Header>
  <Menu v-if="!$route.meta.hideLayout"></Menu>
  <router-view></router-view>
  <Footer v-if="!$route.meta.hideLayout"></Footer>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

import Footer from './components/layouts/Footer.vue';
import Header from './components/layouts/Header.vue';
import Menu from './components/layouts/Menu.vue';

export default defineComponent({
  name: 'App',
  components: {
    Menu,
    Header,
    Footer,
  }
});
</script>

<style>
body{
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  color: #333;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
Main {
  margin-left: 200px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease-in-out;
}
Footer{
  position: fixed;
  bottom: 0;
  width: 100%;
}
Header{
  position: fixed;
  width: 100%;
}
.modal-background{
  z-index: 1;
  background-color: #333333a6;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: none;
}
@media (max-width: 768px) {
    Main {
        margin-left: 0;
    }
}
</style>
