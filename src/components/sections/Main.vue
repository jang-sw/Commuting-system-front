<template>
    <main>
        <div class="dashboard">
            <div class="actions">
                <button class="clock-in">업무 시작</button>
                <button class="clock-out">업무 종료</button>
                <button class="ooo">외출(자리 비움)</button>
            </div>
            <div class="records">
                <h3>현재 상태 : <span style="color: #685e57;">{{ state }}</span></h3>
            </div>
        </div>
        <div class="dashboard" >
            <h4 style="margin: 0; color: #514e4c;">출퇴근 인원 검색</h4>
            <hr style="background:#867e78; height:1px; border:0; margin-top: 0; ">
            <div class="search">
                <input type="text"/>
                <button class="search-btn"> 검색 </button>
            </div>
            <div class="search-result">

            </div>
        </div>
    </main>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import axios from 'axios';
    import swal from 'sweetalert2';
    import qs from 'qs';
    import conf from '../../conf/conf.json';
    import { chkSession } from '@/modules/SessionModule';

    export default defineComponent({
        name: 'MainComponent',
        data(){
            return { 
                serverUrl: conf.server,
                state:""
            }
        },
        async created() {
            const chkRes = await chkSession(this.serverUrl)
            if(chkRes != 1) this.$router.push("/login");
            this.getTodayCommuting ();
        },
        methods: {
            async getTodayCommuting (){
                const token = sessionStorage.getItem('token')
                const userInfo = sessionStorage.getItem('userInfo')
                const parsedUserInfo: any = qs.parse(userInfo ?? '');

                return await axios.get(
                    `${this.serverUrl}/api/commute/today`,
                    {
                        headers: { 
                            'content-type': 'application/x-www-form-urlencoded' 
                            , 'accountId' : parsedUserInfo['accountId']
                            , 'Authorization': token
                        }
                    }
                ).then( async (res)=>{
                    
                    if(res.data.data.dayOff){
                        this.state = res.data.data.dayOff.category;
                    }
                    if(res.data.data.commuting){
                        this.state = res.data.data.commuting.state;
                    }
                    if(!this.state)this.state = '업무전'
                    else this.state =  this.state == 'START' ? '업무중' : this.state == 'END' ? '업무 종료' : this.state == 'OUTING' ? '외출중' : this.state
                }).catch( async (err) =>{
                    console.log(err)
                })
            }
        },
    });
</script>
<style>
@import "../../css/MainStyle.css";
</style>