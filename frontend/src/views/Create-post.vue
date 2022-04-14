<template>
    <div>
        <navbar> </navbar>
        <card-admin  @user-admin="admin"></card-admin>
        <div class="create-post"> 
            <card-create-post></card-create-post>
        </div>
        <card-footer></card-footer>
        
    </div>
    
    
  
</template>

<script>
import axios from "axios";
const instance = axios.create({
    baseURL: "http://127.0.0.1:3000/api/auth/",
});
import moment from "moment";
const timestamp = moment.unix(1634726212);

import Navbar from '../components/Navbar.vue';
import CardCreatePost from '../components/Card-create-poste.vue';
import CardFooter from '../components/Card-footer.vue';
import CardAdmin from '../components/Card-admin.vue';


export default {
    name: 'Create-post',
    components: { Navbar, CardAdmin, CardCreatePost, CardFooter },
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
.create-post {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}   


</style>