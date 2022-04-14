<template>
    <div class="profile-edit-page">
        <navbar></navbar>
        <card-admin  @user-admin="admin"></card-admin>
        <card-profile-edit></card-profile-edit>
        <card-footer></card-footer>   
    </div>
</template>

<script>
import CardProfileEdit from '../components/Card-profile-edit.vue';
import Navbar from '../components/Navbar.vue';
import CardFooter from '../components/Card-footer.vue'
import CardAdmin from '../components/Card-admin.vue';

export default {
  name: 'Profile',
  components: { Navbar, CardAdmin, CardProfileEdit, CardFooter },
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

.profile-edit-page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}   

</style>