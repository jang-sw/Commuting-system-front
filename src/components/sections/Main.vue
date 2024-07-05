<template>
    <main>
        <div class="dashboard">
            <div class="actions">
                <button class="clock-in">업무 시작</button>
                <button class="clock-out">업무 종료</button>
                <button class="ooo">외출(자리 비움)</button>
            </div>
            <div class="records">
                <h3>현재 상태 : <span style="color: #685e57;">업무 전</span></h3>
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