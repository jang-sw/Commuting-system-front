<template>
    <header>
        <button class="hamburger" id="hamburger" @click="toggleMenu()">&#9776;</button>
        <h2 @click="navigateTo('/')"><span>Dashboard</span></h2>
        <div style="position:fixed; top: 10px; right: 10px;">Hi 
            <i style="cursor: pointer;" @click="pwdModalOpen()">{{name}}</i> !!
            <u style="cursor: pointer; margin-left: 10px;" @click="logout()"> Logout</u>
        </div>
    </header>
    <div class="modal-background" id="modal-background"></div>
            <div class="request-container" id="pwd-modal">
                <form id="pwdRequestForm" class="request-form" @submit="changePwd($event, 0)">
                    <h2>Change Password<span style="float: right; color:darkgray; cursor: pointer;" @click="pwdModalCloase()">X</span></h2>
             
                    <div class="input-group">
                        <label for="current-pwd">현재 비밀번호</label>
                        <input type="password" id="current-pwd" name="current-pwd" required v-model="currentPassword">
                    </div>
                    <div class="input-group">
                        <label for="new-pwd">신규 비밀번호</label>
                        <input type="password" id="new-pwd" name="new-pwd" required v-model="newPassword" placeholder="알파벳, 숫자를 사용해서 8~16자">
                    </div>
                    <div class="input-group">
                        <label for="retyping-pwd">비밀번호 확인</label>
                        <input type="password" id="retyping-pwd" name="retyping-pwd" required v-model="retypingPassword">
                    </div>
                    <button type="submit" v-bind:disabled="isProcessing">Submit</button>
                    <div id="success-message"></div>
                </form>
            </div>
    
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import qs from 'qs';
    import axios from 'axios';
    import swal from 'sweetalert2';
    import conf from '../../conf/conf.json';
    import { refreshSession } from '@/modules/SessionModule';

    export default defineComponent({
        name: 'HeaderComponent',
        data(){
            return {
                name: '',
                currentPassword: '',
                newPassword: '',
                serverUrl: conf.server,
                retypingPassword: '',
                isProcessing: false,
            }
        },
        created() {
            const userInfo = sessionStorage.getItem('userInfo')
            const parsedUserInfo: any = qs.parse(userInfo ?? '');
            this.name = parsedUserInfo['name'];
        },
        methods: {
            pwdModalOpen(){
                const modal = document.getElementById('pwd-modal');
                const background = document.getElementById('modal-background');
                modal!.style.display = 'block';
                background!.style.display = 'block';

            },
            pwdModalCloase(){
                const modal = document.getElementById('pwd-modal');
                const background = document.getElementById('modal-background');
                modal!.style.display = 'none';
                background!.style.display = 'none';
            },
            toggleMenu(){
                const sidebar = document.getElementById('sidebar');

                if (sidebar!.style.transform === 'translateX(0px)') {
					sidebar!.style.transform = 'translateX(-100%)';
				} else {
					sidebar!.style.transform = 'translateX(0px)';
				}
            },
            navigateTo(path: string) {
                this.$router.push(path);
                this.toggleMenu()
            },
            logout(){
                sessionStorage.removeItem('token')
                sessionStorage.removeItem('userInfo')
                this.$router.push('/login');
            },
            async changePwd(event: Event, isRetry: number){
                this.isProcessing = true;
                event.preventDefault();
                const token = sessionStorage.getItem('token')
                const userInfo = sessionStorage.getItem('userInfo')
                const parsedUserInfo: any = qs.parse(userInfo ?? '');

                let confirm = await swal.fire({
                    icon: 'question',
                    text: '비밀번호를 변경합니까?',
                    confirmButtonText : "OK",
                    cancelButtonText : "NO",
                    showCancelButton : true,
                })
                if(!confirm.isConfirmed){
                    this.isProcessing = false;
                    return;
                }

                const passwordRegex = /^[a-zA-Z0-9]{8,16}$/ as RegExp;

                
                if(!passwordRegex.test(this.newPassword )){
                    swal.fire({
                        icon: 'warning',
                        html: '비밀번호 규칙을 확인하세요<br/> (알파벳, 숫자를 사용해서 8글자 이상 16글자 이하)'
                    })
                    this.isProcessing = false;
                    return;
                }

                if(this.newPassword != this.retypingPassword){
                    swal.fire({
                        icon: 'warning',
                        text: '비밀번호 확인이 일치하지 않습니다.'
                    })
                    this.isProcessing = false;
                    return;
                }
                await axios.post(
                    `${this.serverUrl}/api/account/changePwd`,
                    qs.stringify({
                        newPwd: this.newPassword,
                        currentPwd: this.currentPassword,
                    }),
                    {
                        headers: { 
                            'content-type': 'application/x-www-form-urlencoded'
                            , 'accountId': parsedUserInfo['accountId']
                            , 'Authorization': token
                        }
                    }
                    ).then(async (res)=>{
                        this.isProcessing = false;
                        this.pwdModalCloase()
                        if(res.data.result == 1){
                            swal.fire({
                                text: '변경에 성공했습니다.',
                                icon: 'success'
                            });
                        }else if(res.data.result == -2){
                            swal.fire({
                                text: '현재 비밀번호가 일치하지 않습니다.',
                                icon: 'warning'
                            });
                        }else{
                            swal.fire({
                                text: '변경에 실패했습니다. 다시 시도해 주세요',
                                icon: 'error'
                            });
                        }
                    }).catch(async (err) =>{
                        this.isProcessing = false;
                        console.log(err);
                        if(err.response.status == 401  && isRetry != 1){
                            await refreshSession(this.serverUrl)
                            this.changePwd(event, 1);
                            return;
                        }
                        await swal.fire({
                            html: '<span class="notranslate">Fail</span>',
                            icon: 'error'
                        });
                    })


            }
        }
    });
</script>
<style>
@import "../../css/HeaderStyle.css";
</style>