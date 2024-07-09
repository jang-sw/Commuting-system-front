<template>
    <main>
        <div class="dashboard" >

            <form id="leaveRequestForm" class="request-form" >
                    <h2>Leave Request </h2>
             
                    <div class="input-group">
                        <label for="category">휴가 구분</label>
                        <select type="text" id="category" name="category" required >
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
                        <label for="name">Name</label>
                        <input style="background-color: lightgrey;" type="text" id="name" name="name" readonly required >
                    </div>
                    <div class="input-group">
                        <label for="startDate">Start Date</label>
                        <input type="date" id="startDate" name="startDate" required >
                    </div>
                    <div class="input-group">
                        <label for="endDate">End Date</label>
                        <input type="date" id="endDate" name="endDate" required>
                    </div>
                    <div class="input-group">
                        <label for="reason">Reason</label>
                        <input id="reason" name="reason" required>
                    </div>
                    <button type="submit">Submit</button>
                    <div id="success-message"></div>
                </form>
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
        name: 'UserComponent',
        data(){
            return {
               
            }
        }, 
        
    });
</script>
<style>
</style>