<template>
    <nav class="sidebar" id="sidebar">
      <ul>
        <li @click="navigateTo('/')">출퇴근 처리</li>
        <li @click="navigateTo('/leave')">휴가 신청</li>
        <li @click="navigateTo('/history')">내 근무 내역 확인</li>
        <div v-if="auth == 'ADMIN'">
            <div class="hr-sect" >ADMIN MENU</div>
            <li @click="navigateTo('/admin/leave')">휴가 내역</li>
            <li @click="navigateTo('/admin/history')">근무 내역</li>
            <li @click="navigateTo('/admin/user')">유저 관리</li>
        </div>
        
      </ul>
       
    </nav>
    
  </template>
  
<script lang="ts">
    import { defineComponent } from 'vue';
    import qs from 'qs';

    export default defineComponent({
        name: 'MenuComponent',
        data() {
            return {
                auth: 'NORMAL'
            };
        },
        created(){
            const token = sessionStorage.getItem('token')
            const userInfo = sessionStorage.getItem('userInfo')
            const parsedUserInfo: any = qs.parse(userInfo ?? '');
            this.auth = parsedUserInfo['auth']
        },
        methods: {
            navigateTo(path: string) {
                this.$router.push(path);
                this.toggleMenu();
            },
            toggleMenu(){
                const sidebar = document.getElementById('sidebar');

                if (sidebar!.style.transform === 'translateX(0px)') {
					sidebar!.style.transform = 'translateX(-100%)';
				} else {
					sidebar!.style.transform = 'translateX(0px)';
				}
            },
        }
    });
</script>
<style>
    @import "../../css/MenuStyle.css";
</style>