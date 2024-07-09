<template>
    <main>
        <div class="dashboard">
            <h2>근무 내역</h2>
            <div class="search">
                <input placeholder="이름으로 검색" v-model="name">
                <button v-bind:disabled="isProcessing" class="search-btn" @click="getHistory(0)"> 검색 </button>
            </div>
            
            <hr/>
            <table>
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>팀</th>
                        <th>날짜</th>
                        <th>출근</th>
                        <th>퇴근</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, i) in list" :key="i">
                        <td >{{data.name}}</td>
                        <td >{{data.team}}</td>
                        <td >{{data.date}}</td>
                        <td>{{data.start}} </td>
                        <td>{{data.end}} </td>
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
        name: 'AdminHistoryComponent',
        data(){
            return {
                isProcessing: false,
                serverUrl: conf.server,
                list: [] as {
                    date: string,
                    start: string,
                    end: string,
                    name: string,
                    position: string,
                    team: string,
                    email: string
                }[],
                page: 1,
                pages: [] as number[],
                maxPage: 1,
                name:''
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
                    date: string,
                    start: string,
                    end: string,
                    name: string,
                    position: string,
                    team: string,
                    email: string
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
                    `${this.serverUrl}/adminApi/commute/history`,
                    {
                        headers: { 
                            'content-type': 'application/x-www-form-urlencoded' 
                            , 'accountId' : parsedUserInfo['accountId']
                            , 'Authorization': token
                        },
                        params:{
                            page: this.page,
                            name: this.name
                        }
                    }
                ).then( async (res)=>{
                    this.list =  [] as {
                        date: string,
                        start: string,
                        end: string,
                        name: string,
                        position: string,
                        team: string,
                        email: string
                    }[];

                    console.log(res.data.data)
                    let hist:  {
                        end : string, 
                        start: string,
                        name: string,
                        position: string,
                        team: string,
                        email: string
                    }[] = res.data.data.hist;
                    hist.map( el => { 
                        let date = el.start.split(' ')[0]
                       
                        this.list.push({
                            date: date,
                            start: el.start,
                            end: el.end,
                            name: el.name,
                            position: el.position,
                            team: el.team,
                            email: el.email
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
                console.log(this.maxPage)
                console.log(page)
                if(this.maxPage < page || page < 1){
                    return
                }
                this.$router.push(`/admin/history?page=${page}`);
            }
        }
    });
</script>
<style>
</style>