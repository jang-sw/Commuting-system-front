<template>
    <header>
        <button class="hamburger" id="hamburger" @click="toggleMenu()">&#9776;</button>
        <h2>Dashboard</h2>
        <div id="currentDateTime"></div>
    </header>
</template>

<script lang="ts">
    export default {
        name: 'HeaderComponent',
        data(){
            return {
            
            }
        },
        methods: {
            toggleMenu(){
                const sidebar = document.getElementById('sidebar');

                if (sidebar!.style.transform === 'translateX(0px)') {
					sidebar!.style.transform = 'translateX(-100%)';
				} else {
					sidebar!.style.transform = 'translateX(0px)';
				}
            }
        }
    }
</script>
<style>
@import "../../css/HeaderStyle.css";
</style>