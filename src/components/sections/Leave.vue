<template>
    <main>
        <div class="dashboard" >
            <button @click="leaveModalOpen()" >휴가 신청</button><br/><br/>
            금월 사용휴가: {{thisMonthUse}}일<br/>
            금년 사용휴가: {{thisYearUse}}일<hr/>
            <table >
                <thead>
                    <tr>
                        <th>구분</th>
                        <th>시작일</th>
                        <th>종료일</th>
                        <th>사유</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, i) in list" :key="i">
                        <td >{{data.category}}</td>
                        <td>{{data.start}} </td>
                        <td>{{data.end}} </td>
                        <td>{{data.reason}} </td>
                        <td><button class="cancel-btn" v-bind:disabled="isProcessing" @click="cancelDayOff(0, data.dayOffId)">취소</button></td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination " id="pages">
                <button @click="goPage(Number(page) - 1)">Prev</button>
                <button v-for="(p, i) in pages" :key="i" @click="goPage(p)"> {{ p }}</button> 
                <button @click="goPage(Number(page) + 1)">Next</button>
            </div>










            <div class="modal-background" id="modal-background"></div>
            <div class="request-container" id="leave-modal">
                <form id="leaveRequestForm" class="request-form" @submit="saveDayOff($event, 0)">
                    <h2>Leave Request <span style="float: right; color:darkgray; cursor: pointer;" @click="leaveModalCloase()">X</span></h2>
             
                    <div class="input-group">
                        <label for="category">휴가 구분</label>
                        <select type="text" id="category" name="category" required v-model="category">
                            <option value="연가(오전)">연가(오전)</option>
                            <option value="병가(오전)">병가(오전)</option>
                            <option value="공가(오전)">공가(오전)</option>
                            <option value="연가(오후)">연가(오후)</option>
                            <option value="병가(오후)">병가(오후)</option>
                            <option value="공가(오후)">공가(오후)</option>
                            <option value="연가(종일)">연가(종일)</option>
                            <option value="병가(종일)">병가(종일)</option>
                            <option value="공가(종일)">공가(종일)</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="name">이름</label>
                        <input style="background-color: lightgrey;" type="text" id="name" name="name" readonly required v-model="userName">
                    </div>
                    <div class="input-group">
                        <label for="startDate">시작일</label>
                        <input type="date" id="startDate" name="startDate" required v-model="start">
                    </div>
                    <div class="input-group">
                        <label for="endDate">종료일</label>
                        <input type="date" id="endDate" name="endDate" required v-model="end">
                    </div>
                    <div class="input-group">
                        <label for="reason">사유</label>
                        <input id="reason" name="reason" required v-model="reason">
                    </div>
                    <button type="submit" v-bind:disabled="isProcessing">Submit</button>
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
    import conf from '../../conf/conf.json';
    import { refreshSession } from '@/modules/SessionModule';

    export default defineComponent({
        name: 'LeaveComponent',
        data(){
            return {
                serverUrl: conf.server,
                list: [] as {
                    category: string,
                    start: string,
                    end: string,
                    reason: string,
                    dayOffId: number
                }[],
                page: 1,
                pages: [] as number[],
                maxPage: 1,
                userName:'',
                isProcessing: false,
                start: '',
                end: '',
                reason:'',
                category:'연가(오전)',
                thisMonthUse: 0,
                thisYearUse: 0,
            }
        },
        async created() {
            const queryParam = this.$route.query.page; 
            this.page = queryParam ? Number(queryParam) : 1;
            console.log(queryParam)
            await this.getHistory(0)
        },
        watch: {
            async '$route.query' (newQuery, oldQuery) {
                this.list =  [] as {
                    category: string,
                    start: string,
                    end: string,
                    reason: string,
                    dayOffId: number
                }[];
                this.page = newQuery.page
                await this.getHistory(0)
            }
        },
        methods: {
            leaveModalOpen(){
                const modal = document.getElementById('leave-modal');
                const background = document.getElementById('modal-background');
                modal!.style.display = 'block';
                background!.style.display = 'block';
                const userInfo = sessionStorage.getItem('userInfo')
                const parsedUserInfo: any = qs.parse(userInfo ?? '');
                this.userName = parsedUserInfo.name

            },
            leaveModalCloase(){
                const modal = document.getElementById('leave-modal');
                const background = document.getElementById('modal-background');
                modal!.style.display = 'none';
                background!.style.display = 'none';
            },
            async getHistory (retry: number){
                const token = sessionStorage.getItem('token')
                const userInfo = sessionStorage.getItem('userInfo')
                const parsedUserInfo: any = qs.parse(userInfo ?? '');

                return await axios.get(
                    `${this.serverUrl}/api/dayOff/history`,
                    {
                        headers: { 
                            'content-type': 'application/x-www-form-urlencoded' 
                            , 'accountId' : parsedUserInfo['accountId']
                            , 'Authorization': token
                        },
                        params:{
                            page: this.page
                        }
                    }
                ).then( async (res)=>{
                    console.log(res)
                    this.list =  [] as {
                        category: string,
                        start: string,
                        end: string,
                        reason: string,
                        dayOffId: number
                    }[]
                    this.thisYearUse = res.data.data.thisYearUse
                    this.thisMonthUse = res.data.data.thisMonthUse
                    let hist:  {
                        dayOffId: number,
                        category: string,
                        start: string,
                        end: string,
                        reason: string
                    }[] = res.data.data.hist;

                    hist.map( el => { 
                        let reason = el.reason
                        let start = el.start;
                        let end = el.end;
                        let dayOffId = el.dayOffId;
                        let category = el.category;

                        this.list.push({
                            dayOffId: dayOffId,
                            category: category,
                            start: start,
                            end: end,
                            reason: reason
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
                            await this.getHistory(1);
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
            async saveDayOff(event: Event, isRetry: number){
                this.isProcessing = true;
                event.preventDefault();
                const token = sessionStorage.getItem('token')
                const userInfo = sessionStorage.getItem('userInfo')
                const parsedUserInfo: any = qs.parse(userInfo ?? '');


                let confirm = await swal.fire({
                    icon: 'question',
                    text: '휴가를 등록합니까?',
                    confirmButtonText : "OK",
                    cancelButtonText : "NO",
                    showCancelButton : true,
                })

                if(!confirm.isConfirmed){
                    this.isProcessing = false;
                    return;
                }
                if( new Date(this.start).getTime() > new Date(this.end).getTime()){
                    await swal.fire({
                        icon: 'warning',
                        text: '시작일이 종료일 보다 나중이 될 수 없습니다.'
                    })
                    this.isProcessing = false;
                    return;
                }
                await axios.post(
                    `${this.serverUrl}/api/dayOff/create`,
                    qs.stringify({
                        reason: this.reason,
                        start: this.start,
                        end: this.end,
                        category: this.category,
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
                        if(res.data.result == 1){
                            await swal.fire({
                                text: '등록하였습니다.',
                                icon: 'success',
                            })
                            this.leaveModalCloase();
                            await this.getHistory(0)
                        } else {
                            await swal.fire({
                                text: '등록에 실패했습니다. 다시 시도해 주세요',
                                icon: 'error',
                            });
                        }
                    }).catch(async (err) =>{
                        this.isProcessing = false;
                        console.log(err);
                        if(err.response.status == 401  && isRetry != 1){
                            await refreshSession(this.serverUrl)
                            this.saveDayOff(event, 1);
                            return;
                        }
                        await swal.fire({
                            html: '<span class="notranslate">Fail</span>',
                            icon: 'error'
                        });
                    })
            },
            async cancelDayOff(isRetry: number, dayOffId: number){
                this.isProcessing = true;
                const token = sessionStorage.getItem('token')
                const userInfo = sessionStorage.getItem('userInfo')
                const parsedUserInfo: any = qs.parse(userInfo ?? '');

                let confirm = await swal.fire({
                    icon: 'question',
                    text: '휴가를 취소합니까?',
                    confirmButtonText : "OK",
                    cancelButtonText : "NO",
                    showCancelButton : true,
                })

                if(!confirm.isConfirmed){
                    this.isProcessing = false;
                    return;
                }

                await axios.post(
                    `${this.serverUrl}/api/dayOff/cancel`,
                    qs.stringify({
                        dayOffId: dayOffId,
                    }),
                    {
                        headers: { 
                            'content-type': 'application/x-www-form-urlencoded'
                            , 'accountId': parsedUserInfo['accountId']
                            , 'Authorization': token
                        }
                    }).then(async (res)=>{
                        this.isProcessing = false;
                        if(res.data.result == 1){
                            await swal.fire({
                                text: '취소하였습니다.',
                                icon: 'success',
                            });
                            await this.getHistory(0)
                        } else {
                            await swal.fire({
                                text: '취소에 실패했습니다. 다시 시도해 주세요',
                                icon: 'error',
                            });
                        }
                    }).catch(async (err) =>{
                        this.isProcessing = false;
                        console.log(err);
                        if(err.response.status == 401  && isRetry != 1){
                            await refreshSession(this.serverUrl)
                            this.cancelDayOff(1, dayOffId);
                            return;
                        }
                        await swal.fire({
                            html: '<span class="notranslate">Fail</span>',
                            icon: 'error'
                        });
                    })
            },
            goPage(page: number){
                if(this.maxPage < page || page < 1){
                    return
                }
                this.$router.push(`/leave?page=${page}`);
            }
        }
    });
</script>
<style>
@import "../../css/LeaveStyle.css";

</style>