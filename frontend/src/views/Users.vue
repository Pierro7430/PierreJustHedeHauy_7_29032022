<template>
    <div>
        <navbar> </navbar>
        <card-admin  @user-admin="admin"></card-admin>
        <div class="users"> 
            <card-info-user v-for="user in allUsers" :key="user.id" :user="user"></card-info-user>
            
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
import CardFooter from '../components/Card-footer.vue';
import CardAdmin from '../components/Card-admin.vue';
import CardInfoUser from '../components/Card-info-user.vue';

export default {
    name: 'Users',
    components: { Navbar, CardAdmin, CardInfoUser, CardFooter },
    data : function () {
        return {
            isAdmin: false,
            user : {
                
            },
            allUsers : [],
        }
    },

    mounted: function () {
        if (this.$store.state.user.userId == -1) {
            this.$router.push("/");
            return;
        }

        const self = this;
        let user = localStorage.getItem("user");
        user = JSON.parse(user);
        const token = user.token;
        instance
            .get("/admin/users/:" + user.userId, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(function (response) {
                console.log(response);
                response.data.results.forEach(element => {
                    self.user = {
                        id: '',
                        email: '',
                        lastname: '',
                        firstname: '',
                        birthDate: 'Non renseigné',
                        signupDate: '',
                        location: 'Non renseigné',
                        photoUrl: '',
                        isAdmin: '',
                    }
                    
                    self.user.id = element.id;
                    self.user.email = element.email;
                    self.user.lastname = element.lastname;
                    self.user.firstname = element.firstname;
                    self.user.photoUrl = element.photoUrl;
                    self.user.signupDate = moment(element.signup_date).format("DD-MM-YYYY");

                    if(element.birth_date != null){
                        self.user.birthDate = moment(element.birth_date).format("DD-MM-YYYY");
                    }
                    
                    if(element.location != null){
                        self.user.location = element.location;
                    }

                    if(element.is_admin == 1){
                        self.user.isAdmin = true;
                    } else {
                        self.user.isAdmin = false;
                    }

                    self.allUsers.push(self.user);
                })

            })
            .catch(function (error) {
                console.log(error);
            });
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
    .users {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: $space-XXXsmall; 
        gap: $space-Xsmall;

        
    }   


</style>