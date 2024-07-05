<template>
    <nav class="sidebar" id="sidebar">
      <ul>
        <li @click="navigateTo('/')">출퇴근 처리</li>
        <li @click="navigateTo('/leave')">휴가 신청</li>
        <li @click="navigateTo('/history')">내 근무 내역 확인</li>
      </ul>
    </nav>
  </template>
  
<script lang="ts">
    import { defineComponent } from 'vue';
  
    export default defineComponent({
        name: 'MenuComponent',
        data() {
            return {};
        },
        methods: {
            navigateTo(path: string) {
                this.$router.push(path);
            }
        }
    });
</script>
<style>
    @import "../../css/MenuStyle.css";
</style>