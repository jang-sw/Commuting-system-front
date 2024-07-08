<template>
    <div class="login-body">
        <div class="login-container">
            <form id="loginForm" class="login-form" @submit="login">
                <h2>Login</h2>
                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="text" id="email" name="email" v-model="email" required>
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="pwd" name="pwd" v-model="pwd" required>
                </div>
                <button type="submit" v-bind:disabled="isProcessing">Login</button>
                <div id="error-message"></div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import swal from 'sweetalert2';
    import axios from 'axios';
    import qs from 'qs';
    import conf from '../conf/conf.json';
    import { chkSession } from '@/modules/SessionModule';

    export default defineComponent({
        name: 'LoginComponent',
        data(){
            return {
                isProcessing: false,
                email:'',
                pwd:'',
                serverUrl: conf.server
            }
        },
        async created () {
            const chkRes = await chkSession(this.serverUrl)
            if(chkRes == 1) this.$router.push("/");
        },  
        methods:{
            async login(event: Event){
                this.isProcessing = true;
                event.preventDefault();
                await axios.post(
                    `${this.serverUrl}/openApi/account/login`,
                    qs.stringify({
                        email: this.email,
                        pwd: this.pwd,
                    })
                ).then(async (res)=>{
                    if(res.data.result == 1){
                        await swal.fire({
                            text:"로그인 성공"
                            , icon : "success"
                        })
                        sessionStorage.setItem('token',res.headers['authorization']);
                        sessionStorage.setItem('userInfo',qs.stringify({
                            accountId: res.data.data.accountId,
                            email: res.data.data.email,
                            auth: res.data.data.auth,
                            name: res.data.data.name,
                            team: res.data.data.team,
                            position: res.data.data.position,
                            rank: res.data.data.rank,
                        }));
                        this.$router.push("/");
                    }else{
                        swal.fire({
                            text:"로그인 실패, 아이디와 비밀번호를 확인해 주세요"
                            , icon : "warning"
                        })
                    }
                }).catch(async (err) =>{
                    console.log(err)
                    swal.fire({
                        text:"에러가 발생했습니다. 다시 시도해 주세요"
                        , icon : "error"
                    })
                });
                this.isProcessing = false;
            },
            
        }
    });
</script>
<style>
@import "../css/LoginFormStyle.css";
</style>