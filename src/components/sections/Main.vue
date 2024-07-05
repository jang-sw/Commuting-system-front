<template>
    <main>
        <div class="dashboard">
            <div class="actions">
                <button id="clockInBtn" class="clock-in">Clock In</button>
                <button id="clockOutBtn" class="clock-out">Clock Out</button>
            </div>
            <div class="records">
                <h3>Recent Attendance Records</h3>
                <ul id="attendanceRecords"></ul>
            </div>
        </div>
        <div class="dashboard" >
            <h4 style="margin: 0; color: #514e4c;">출퇴근 인원 검색</h4>
            <hr style="background:#867e78; height:1px; border:0; margin-top: 0; ">
            <div class="search">
                <input type="text"/>
                <button class="search-btn"> 검색 </button>
            </div>
        </div>
    </main>
</template>

<script lang="ts">
    export default {
        name: 'MainComponent',
        data(){
            return {
            
            }
        }
    }
</script>
<style>
@import "../../css/MainStyle.css";
</style>