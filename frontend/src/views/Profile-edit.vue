<template>
    <div class="profile-edit-page">
        <navbar></navbar>
        <card-profile-edit></card-profile-edit>
        <card-footer></card-footer>   
    </div>
</template>

<script>
import CardProfileEdit from '../components/Card-profile-edit.vue';
import Navbar from '../components/Navbar.vue';
import CardFooter from '../components/Card-footer.vue'

export default {
  name: 'Profile',
  components: { Navbar, CardProfileEdit, CardFooter }, 
}

</script>

<style lang="scss">
@import '../assets/scss/scss'; 

.profile-edit-page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}   

</style>