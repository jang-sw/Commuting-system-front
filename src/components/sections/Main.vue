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