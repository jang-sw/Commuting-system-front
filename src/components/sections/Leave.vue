<template>
    <main>
        <div class="dashboard" >
            <button @click="leaveModalOpen()" >휴가 신청</button><br/><br/>
            금월 사용휴가: 1일<br/>
            금년 사용휴가: 1일<hr/>
            <table >
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Reason</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>연가(오전)</td>
                        <td>2024-07-25</td>
                        <td>2024-07-25</td>
                        <td>개인사유</td>
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










            <div class="modal-background" id="modal-background"></div>
            <div class="request-container" id="leave-modal">
                <form id="leaveRequestForm" class="request-form">
                    <h2>Leave Request <span style="float: right; color:darkgray; cursor: pointer;" @click="leaveModalCloase()">X</span></h2>
             
                    <div class="input-group">
                        <label for="category">휴가 구분</label>
                        <select type="text" id="category" name="category" required>
                            <option>연가(오전)</option>
                            <option>병가(오전)</option>
                            <option>공가(오전)</option>
                            <option>연가(오후)</option>
                            <option>병가(오후)</option>
                            <option>공가(오후)</option>
                            <option>연가(종일)</option>
                            <option>병가(종일)</option>
                            <option>공가(종일)</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="name">Name</label>
                        <input style="background-color: lightgrey;" type="text" id="name" name="name" readonly required>
                    </div>
                    <div class="input-group">
                        <label for="startDate">Start Date</label>
                        <input type="date" id="startDate" name="startDate" required>
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

        </div> 
    </main>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'LeaveComponent',
        data(){
            return {
            
            }
        },
        methods: {
            leaveModalOpen(){
                const modal = document.getElementById('leave-modal');
                const background = document.getElementById('modal-background');
                modal!.style.display = 'block';
                background!.style.display = 'block';
            },
            leaveModalCloase(){
                const modal = document.getElementById('leave-modal');
                const background = document.getElementById('modal-background');
                modal!.style.display = 'none';
                background!.style.display = 'none';
            }
        }
    });
</script>
<style>
@import "../../css/LeaveStyle.css";

</style>