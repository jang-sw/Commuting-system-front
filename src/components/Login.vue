<template>
    <div class="login-body">
        <div class="login-container">
            <form id="loginForm" class="login-form">
                <h2>Login</h2>
                <div class="input-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit">Login</button>
                <div id="error-message"></div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        name: 'LoginComponent',
        data(){
            return {
            
            }
        }
    }
</script>
<style>
@import "../css/LoginFormStyle.css";
</style>