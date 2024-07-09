<template>
    <main>
        <div class="dashboard" >
            <h2>휴가 내역</h2>
            <div class="search">
                <input placeholder="이름으로 검색" v-model="name">
                <button v-bind:disabled="isProcessing" class="search-btn" @click="getHistory(0)"> 검색 </button>
            </div>
            <hr/>
            <table style="table-layout: fixed">
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>팀</th>
                        <th>구분</th>
                        <th>시작</th>
                        <th>종료</th>
                        <th>사유</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, i) in list" :key="i">
                        <td >{{data.name}}</td>
                        <td >{{data.team}}</td>
                        <td >{{data.category}}</td>
                        <td>{{data.start}} </td>
                        <td>{{data.end}} </td>
                        <td style="overflow: scroll;">{{data.reason}} </td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination " id="pages">
                <button @click="goPage(Number(page) - 1)">Prev</button>
                <button v-for="(p, i) in pages" :key="i" @click="goPage(p)"> {{ p }}</button> 
                <button @click="goPage(Number(page) + 1)">Next</button>
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
    import { refreshSession } from '@/modules/SessionModule';

    export default defineComponent({
        name: 'AdminLeaveComponent',
        data(){
            return {
                serverUrl: conf.server,
                list: [] as {
                    name: string,
                    team: string,
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
                name:'',
                
            }
        },
        async created() {
            const queryParam = this.$route.query.page; 
            this.page = queryParam ? Number(queryParam) : 1;
            console.log(queryParam)
            // await this.getHistory(0)
        },
        watch: {
            async '$route.query' (newQuery, oldQuery) {
                this.list =  [] as {
                    name: string,
                    team: string,
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
           async getHistory (retry: number){
                const token = sessionStorage.getItem('token')
                const userInfo = sessionStorage.getItem('userInfo')
                const parsedUserInfo: any = qs.parse(userInfo ?? '');

                return await axios.get(
                    `${this.serverUrl}/adminApi/dayOff/history`,
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
                    console.log(res)
                    this.list =  [] as {
                        name: string,
                        team: string,
                        category: string,
                        start: string,
                        end: string,
                        reason: string,
                        dayOffId: number
                    }[]
                    this.thisYearUse = res.data.data.thisYearUse
                    this.thisMonthUse = res.data.data.thisMonthUse
                    let hist:  {
                        name: string,
                        team: string,
                        dayOffId: number,
                        category: string,
                        start: string,
                        end: string,
                        reason: string
                    }[] = res.data.data.hist;

                    hist.map( el => { 
                       
                        this.list.push({
                            name: el.name,
                            team: el.team,
                            dayOffId: el.dayOffId,
                            category: el.category,
                            start: el.start,
                            end: el.end,
                            reason: el.reason
                        })
                    });
                    this.pages = [];
                    this.maxPage = res.data.data.maxPage;
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
            goPage(page: number){
                if(this.maxPage < page || page < 1){
                    return
                }
                this.$router.push(`/admin/leave?page=${page}`);
            }
        }
    });
</script>
<style>
@import "../../../css/LeaveStyle.css";

</style>