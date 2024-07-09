<template>
    <main>
        <div class="dashboard">
            <div class="actions" v-if="state == '업무전' || state == '업무중' || state == '외출중' || state == '업무 종료'">
                <button v-bind:disabled="processing" class="clock-in" v-if="state == '업무전'" @click="changeCommutingState('START', 0)">업무 시작</button>
                <button v-bind:disabled="processing" class="clock-out" v-if="state == '업무중'" @click="changeCommutingState('END', 0)">업무 종료</button>
                <button v-bind:disabled="processing" class="ooo" v-if="state == '업무중'" @click="changeCommutingState('OUTING', 0)">외출(자리 비움)</button>
                <button v-bind:disabled="processing" class="clock-in" v-if="state == '외출중'" @click="changeCommutingState('RESTART', 0)">외출 복귀</button>
            </div>
            <div class="records">
                <h3>현재 상태 : <span style="color: #685e57;">{{ state }}</span></h3>
                {{ now }}
            </div>
        </div>
        <div class="dashboard" >
            <h4 style="margin: 0; color: #514e4c;">출퇴근 인원 검색</h4>
            <hr style="background:#867e78; height:1px; border:0; margin-top: 0; ">
            <div class="search">
                <input type="text" v-model="keyword" placeholder="이름으로 검색"/>
                <button v-bind:disabled="processing" class="search-btn" @click="search(0)"> 검색 </button>
            </div>
            <div class="search-result" v-html="list">

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
    import { chkSession, refreshSession } from '@/modules/SessionModule';

    export default defineComponent({
        name: 'MainComponent',
        data(){
            return { 
                now:'',
                serverUrl: conf.server,
                state:"", 
                keyword:'',
                processing: false,
                list: ''
            }
        },
        async created() {
            this.setTime()
            setInterval(()=>{
                this.setTime()
            },1000)
            this.keyword='';
            this.list = '';
            this.processing= false
            // const chkRes = await chkSession(this.serverUrl)
            // if(chkRes != 1) this.$router.push("/login");
            this.getTodayCommuting (0);
            
        },
        methods: {
            async getTodayCommuting (retry: number){
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
                        if(this.state.indexOf('오후') != -1 || this.state.indexOf('종일') != -1) return;
                        this.state = res.data.data.commuting.state;
                    }
                    
                    if(!this.state)this.state = '업무전'
                    else {
                        this.state =  this.state == 'START' ? '업무중' : this.state == 'END' ? '업무 종료' : this.state == 'OUTING' ? '외출중' : this.state
                    }
                }).catch( async (err) =>{
                    console.log(err)
                    if(err.response.status == 401 && retry != 1 ){
                        if(await refreshSession(this.serverUrl) == 1){
                            await this.getTodayCommuting(1);
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
            async changeCommutingState(commutingState: string, retry:number){
                this.processing = true;
                const token = sessionStorage.getItem('token')
                const userInfo = sessionStorage.getItem('userInfo')
                const parsedUserInfo: any = qs.parse(userInfo ?? '');
                const reqestPath = this.serverUrl + (commutingState == 'START' ? '/api/commute/clockIn' : commutingState == 'END' ? '/api/commute/clockOut' : commutingState == 'OUTING' ? '/api/commute/outing' : '/api/commute/restart')
                let confirm = await swal.fire({
                    text: commutingState == 'START' ? '업무를 시작합니다.' : commutingState == 'END' ? '업무를 종료합니다.' : commutingState == 'OUTING' ? '외출합니다.' : '외출에서 복귀합니다.',
                    icon: 'question',
                    confirmButtonText : "OK",
                    cancelButtonText : "NO",
                    showCancelButton : true,
                })
                if(!confirm.isConfirmed) {
                    this.processing = false;
                    return;
                }
                return await axios.post(
                    reqestPath,"",
                    {
                        headers: { 
                            'content-type': 'application/x-www-form-urlencoded' 
                            , 'accountId' : parsedUserInfo['accountId']
                            , 'Authorization': token
                        }
                    }
                ).then( async (res)=>{
                    if(res.data.result == 1){
                        this.processing = false;
                        this.state = commutingState == 'START' ? '업무중' : commutingState == 'END' ? '업무종료' : commutingState == 'OUTING' ? '외출중' : '업무중'
                       
                    }else {
                        this.processing = false;
                        await swal.fire({
                            text:'에러가 발생했습니다. 다시 시도해 주세요',
                            icon: 'error'
                        });
                        location.reload()
                    }
                }).catch( async (err) =>{
                    console.log(err)
                    if(err.response.status == 401 && retry != 1 ){
                        if(await refreshSession(this.serverUrl) == 1){
                            await this.changeCommutingState(commutingState, 1);
                            this.processing = false;
                            return;
                        }
                    }
                    this.processing = false;
                    await swal.fire({
                            text:'에러가 발생했습니다. 다시 시도해 주세요',
                            icon: 'error'
                        });
                
                    this.$router.push("/login");
                })
            },
            async search(retry: number){
                const token = sessionStorage.getItem('token')
                const userInfo = sessionStorage.getItem('userInfo')
                const parsedUserInfo: any = qs.parse(userInfo ?? '');
                this.processing = true;
                return await axios.get(
                    `${this.serverUrl}/api/commute/todayByName`,
                    {
                        headers: { 
                            'content-type': 'application/x-www-form-urlencoded' 
                            , 'accountId' : parsedUserInfo['accountId']
                            , 'Authorization': token
                        },
                        params:{
                            'name': this.keyword
                        }
                    }
                ).then( async (res)=>{
                    if(res.data.result == 1){
                        let html = '';
                        let list: { 
                            email: string,
                            name: string,
                            team: string,
                            position: string
                        }[] = res.data.data
                        list.map(ele => {
                            html += `${ele.name} (${ele.team}, ${ele.position}, ${ele.email}) <br/>`
                        });
                        this.list = html;
                    }else{
                        await swal.fire({
                            text:'에러가 발생했습니다. 다시 시도해 주세요',
                            icon: 'error'
                        });
                        location.reload()
                    }
                    this.processing = false;
                    
                }).catch( async (err) =>{
                    if(err.response.status == 401 && retry != 1){
                        if(await refreshSession(this.serverUrl) == 1){
                            await this.search(1);
                            this.processing = false;
                            return;
                        }
                    }
                    await swal.fire({
                        text:'에러가 발생했습니다. 다시 시도해 주세요',
                        icon: 'error'
                    });
                    
                    this.processing = false;
                    this.$router.push("/login");
                })
            },
            setTime(){
                const now = new Date();
                const options: Intl.DateTimeFormatOptions = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZone: 'Asia/Seoul',
                    hourCycle: 'h23'
                };
                const koreanTimeFormatter = new Intl.DateTimeFormat('ko-KR', options);

                const formattedTime = koreanTimeFormatter.format(now);
                
                this.now = `${formattedTime} KST` ;
            }
        
        },
        
    });
</script>
<style>
@import "../../css/MainStyle.css";
</style>