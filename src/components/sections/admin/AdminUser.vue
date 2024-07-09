<template>
    <main>
        <div class="dashboard">
            <h2>사용자 관리</h2>
            <div class="search">
                <input placeholder="이름으로 검색" v-model="name" >
                <button  class="search-btn" @click="getUser(0)"> 검색 </button>
            </div>
            
            <hr/>
            <table>
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>팀</th>
                        <th>직책</th>
                        <th>이메일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, i) in list" :key="i" style="cursor: pointer;" @click="userModalOpen(data)">
                        <td >{{data.name}}</td>
                        <td >{{data.team}}</td>
                        <td >{{data.position}}</td>
                        <td>{{data.email}} </td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination " id="pages">
                <button @click="goPage(Number(page) - 1)">Prev</button>
                <button v-for="(p, i) in pages" :key="i" @click="goPage(p)"> {{ p }}</button> 
                <button @click="goPage(Number(page) + 1)">Next</button>
            </div>

            <div class="modal-background" id="modal-background" ></div>
            <div class="request-container" id="user-modal">
                <form id="userequestForm" class="request-form" @submit="updateUser($event, 0)">
                    <h2>Leave Request <span style="float: right; color:darkgray; cursor: pointer;" @click="userModalCloase()">X</span></h2>
                    <div class="input-group">
                        <label for="name">이름</label>
                        <input type="text" id="name" name="name" required v-model="selected.name" >
                    </div>
                    <div class="input-group">
                        <label for="team">팀</label>
                        <input type="text" id="team" name="team" required v-model="selected.team">
                    </div>
                    <div class="input-group">
                        <label for="position">직책</label>
                        <input type="text" id="position" name="position" required v-model="selected.position">
                    </div>
                    <div class="input-group">
                        <label for="email">이메일</label>
                        <input type="text" id="email" name="email" required v-model="selected.email">
                    </div>
                    <button type="submit" v-bind:disabled="isProcessing">정보 수정</button>
                    <button type="button" style="margin-bottom: 10px; margin-top: 10px;" v-bind:disabled="isProcessing" @click="resetPwd(0)">비밀번호 초기화</button>
                    <button type="button" class="delete-btn"  v-bind:disabled="isProcessing" @click="deleteUser(0)">삭제</button>

                    <div id="success-message"></div>
                </form>
            </div>
        </div> 
    </main>
    
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import axios from 'axios';
    import swal from 'sweetalert2';
    import qs from 'qs';
    import conf from '../../../conf/conf.json';
    import { refreshSession, chkSession } from '@/modules/SessionModule';

   
    export default defineComponent({
        name: 'UserComponent',
        data(){
            return {
                serverUrl: conf.server,
                list: [] as {
                    accountId: number,
                    name: string,
                    team: string,
                    position: string,
                    email: string,
                }[],
                page: 1,
                pages: [] as number[],
                maxPage: 1,
                name:'',
                isProcessing: false,
                selected: {
                    accountId: 0,
                    name: '',
                    team: '',
                    position: '',
                    email: '',
                }
            }
        }, 
        async created() {
            const chkRes = await chkSession(this.serverUrl)
            if(chkRes != 1) this.$router.push("/login");
        },
        methods: {
            userModalOpen(data:  {
                accountId: number,
                name: string,
                team: string,
                position: string,
                email: string,
            }){
                this.selected =  JSON.parse(JSON.stringify(data));
                const modal = document.getElementById('user-modal');
                const background = document.getElementById('modal-background');
                modal!.style.display = 'block';
                background!.style.display = 'block';

            },
            userModalCloase(){
                const modal = document.getElementById('user-modal');
                const background = document.getElementById('modal-background');
                modal!.style.display = 'none';
                background!.style.display = 'none';
            },
            async updateUser(event:Event, retry: number){
                console.log(12)
                this.isProcessing = true;
                event.preventDefault();
                const token = sessionStorage.getItem('token')
                const userInfo = sessionStorage.getItem('userInfo')
                const parsedUserInfo: any = qs.parse(userInfo ?? '');
                let confirm = await swal.fire({
                    icon: 'question',
                    text: '정보를 수정합니까?',
                    confirmButtonText : "OK",
                    cancelButtonText : "NO",
                    showCancelButton : true,
                })
                if(!confirm.isConfirmed){
                    this.isProcessing = false;
                    return;
                }
                return await axios.post(
                    `${this.serverUrl}/adminApi/account/update`,
                    qs.stringify(this.selected),
                    {
                        headers: { 
                            'content-type': 'application/x-www-form-urlencoded' 
                            , 'accountId' : parsedUserInfo['accountId']
                            , 'Authorization': token
                        }
                    }
                ).then(res => {
                    if(res.data.result == 1){
                        swal.fire({
                            text:'성공적으로 정보를 수정 했습니다.',
                            icon: 'success'
                        });
                        this.getUser(0);
                        this.userModalCloase();
                    }else if(res.data.result == -2){
                        swal.fire({
                            text:'이미 등록된 이메일 입니다.',
                            icon: 'warning'
                        });
                    }else {
                        swal.fire({
                            text:'에러가 발생했습니다. 다시 시도해 주세요',
                            icon: 'error'
                        });
                    }

                    this.isProcessing = false;
                    return;
                }).catch(async err => {
                    console.log(err)
                    this.isProcessing = false;
                    if(err?.response?.status == 401 && retry != 1 ){
                        if(await refreshSession(this.serverUrl) == 1){
                            await this.updateUser(event, 1);
                            return;
                        }
                    }
                    await swal.fire({
                        text:'에러가 발생했습니다. 다시 시도해 주세요',
                        icon: 'error'
                    });
                    this.$router.push("/login");
                });
            },
            async deleteUser(retry: number){
                this.isProcessing = true;
                const token = sessionStorage.getItem('token')
                const userInfo = sessionStorage.getItem('userInfo')
                const parsedUserInfo: any = qs.parse(userInfo ?? '');
                let confirm = await swal.fire({
                    icon: 'question',
                    text: '유저를 비활성화 하시겠습니까?',
                    confirmButtonText : "OK",
                    cancelButtonText : "NO",
                    showCancelButton : true,
                })
                if(!confirm.isConfirmed){
                    this.isProcessing = false;
                    return;
                }
                return await axios.post(
                    `${this.serverUrl}/adminApi/account/delete`,
                    qs.stringify({
                        accountId: this.selected.accountId
                    }),
                    {
                        headers: { 
                            'content-type': 'application/x-www-form-urlencoded' 
                            , 'accountId' : parsedUserInfo['accountId']
                            , 'Authorization': token
                        }
                    }
                ).then(res => {
                    if(res.data.result == 1){
                        swal.fire({
                            text:'성공적으로 유저를 비활성화 했습니다.',
                            icon: 'success'
                        });
                        this.getUser(0);
                        this.userModalCloase();
                    } else {
                        swal.fire({
                            text:'에러가 발생했습니다. 다시 시도해 주세요',
                            icon: 'error'
                        });
                    }

                    this.isProcessing = false;
                    return;
                }).catch(async err => {
                    console.log(err)
                    this.isProcessing = false;
                    if(err?.response?.status == 401 && retry != 1 ){
                        if(await refreshSession(this.serverUrl) == 1){
                            await this.deleteUser(1);
                            return;
                        }
                    }
                    await swal.fire({
                        text:'에러가 발생했습니다. 다시 시도해 주세요',
                        icon: 'error'
                    });
                    this.$router.push("/login");
                });
            },
            async resetPwd(retry: number){
                this.isProcessing = true;
                const token = sessionStorage.getItem('token')
                const userInfo = sessionStorage.getItem('userInfo')
                const parsedUserInfo: any = qs.parse(userInfo ?? '');
                let confirm = await swal.fire({
                    icon: 'question',
                    text: '비밀번호를 초기화 합니까?',
                    confirmButtonText : "OK",
                    cancelButtonText : "NO",
                    showCancelButton : true,
                })
                if(!confirm.isConfirmed){
                    this.isProcessing = false;
                    return;
                }
                return await axios.post(
                    `${this.serverUrl}/adminApi/account/resetPwd`,
                    qs.stringify({
                        accountId: this.selected.accountId
                    }),
                    {
                        headers: { 
                            'content-type': 'application/x-www-form-urlencoded' 
                            , 'accountId' : parsedUserInfo['accountId']
                            , 'Authorization': token
                        }
                    }
                ).then(res => {
                    if(res.data.result == 1){
                        swal.fire({
                            text:'성공적으로 비밀번호를 초기화 했습니다.',
                            icon: 'success'
                        });
                        this.userModalCloase();
                    } else {
                        swal.fire({
                            text:'에러가 발생했습니다. 다시 시도해 주세요',
                            icon: 'error'
                        });
                    }

                    this.isProcessing = false;
                    return;
                }).catch(async err => {
                    console.log(err)
                    this.isProcessing = false;
                    if(err?.response?.status == 401 && retry != 1 ){
                        if(await refreshSession(this.serverUrl) == 1){
                            await this.deleteUser(1);
                            return;
                        }
                    }
                    await swal.fire({
                        text:'에러가 발생했습니다. 다시 시도해 주세요',
                        icon: 'error'
                    });
                    this.$router.push("/login");
                });
            },
            async getUser(retry: number){
                const token = sessionStorage.getItem('token')
                const userInfo = sessionStorage.getItem('userInfo')
                const parsedUserInfo: any = qs.parse(userInfo ?? '');
                return await axios.get(
                    `${this.serverUrl}/adminApi/account/byName`,
                    {
                        headers: { 
                            'content-type': 'application/x-www-form-urlencoded' 
                            , 'accountId' : parsedUserInfo['accountId']
                            , 'Authorization': token
                        },
                        params:{
                            page: this.page,
                            name: this.name,
                        }
                    }
                ).then( async (res)=>{
                    
                    this.list =  [] as {
                        accountId: number,
                        name: string,
                        team: string,
                        position: string,
                        email: string,
                    }[]
                    let users:  {
                        accountId: number,
                        name: string,
                        team: string,
                        position: string,
                        email: string,
                    }[] = res.data.data.list;

                    users.map( el => { 
                        this.list.push({
                            accountId: el.accountId,
                            name: el.name,
                            team: el.team,
                            position: el.position,
                            email: el.email,
                        })
                    });
                    this.pages = [];
                    this.maxPage = res.data.data.maxPage;
                    console.log(this.maxPage)
                    if (this.page <= 3) {
                        for (let i = 1; i <= Math.min(3, this.maxPage); i++) {
                            this.pages.push(i);
                        }
                    } else {
                        const startPage = Math.floor((this.page - 1) / 3) * 3 + 1;
                        const endPage = Math.min(startPage + 2, this.maxPage);
                
                        for (let i = startPage; i <= endPage; i++) {
                            this.pages.push(i);
                        }
                    }
                       
                }).catch( async (err) =>{
                    console.log(err)
                    if(err.response.status == 401 && retry != 1 ){
                        if(await refreshSession(this.serverUrl) == 1){
                            await this.getUser(1);
                            return;
                        }
                    }
                    await swal.fire({
                        text:'에러가 발생했습니다. 다시 시도해 주세요',
                        icon: 'error'
                    });
                    
                    this.$router.push("/login");
                })
            },
            goPage(page: number){
                if(this.maxPage < page || page < 1){
                    return
                }
                this.$router.push(`/admin/user?page=${page}`);
            }
        }
        
    });
</script>
<style>
.delete-btn{
    background-color: #971212;
}
.delete-btn:hover{
    background-color: #6f0606;
}
</style>