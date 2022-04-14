<template>
    <div class="profile-page">
        <navbar></navbar>
        <card-admin  @user-admin="admin"></card-admin>
        <card-profile></card-profile>
        <card-footer></card-footer>   
    </div>
</template>

<script>
import CardProfile from '../components/Card-profile.vue';
import Navbar from '../components/Navbar.vue';
import CardFooter from '../components/Card-footer.vue'
import CardAdmin from '../components/Card-admin.vue';

export default {
  name: 'Profile',
  components: { Navbar, CardAdmin, CardProfile, CardFooter }, 
    data : function () {
        return {
            isAdmin: false,
        }
    },
    methods: {
        admin: function () {
                this.isAdmin = true;
        },
    }
}

</script>

<style lang="scss">
@import '../assets/scss/scss'; 

.profil-page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}   

</style>