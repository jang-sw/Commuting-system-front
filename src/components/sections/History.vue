<template>
    <main>
        <div class="dashboard">
            <h2>업무 내역</h2>
            <hr/>
            <table>
                <thead>
                    <tr>
                        <th>날짜</th>
                        <th>구분</th>
                        <th>출근</th>
                        <th>퇴근</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2024-07-25</td>
                        <td>업무</td>
                        <td>09:00</td>
                        <td>18:00</td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination ">
                <button>Prev</button>
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <button>Next</button>
            </div>
        </div> 
    </main>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'HistoryComponent',
        data(){
            return {
            
            }
        },
        methods: {
          
        }
    });
</script>
<style>
</style>