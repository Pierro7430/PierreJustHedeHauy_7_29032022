<template>
        <div class="user-card">  
            
                <div class="header" :class="{'admin' : user.isAdmin === true}">
                    <div class="header_img">
                        <img v-if="user.photoUrl" :src="user.photoUrl" alt="Image avatar" />
                    </div>
                    <div class="header_names">
                        <div class="profil"> 
                            <p class="firstname"> {{ user.firstname }} </p>
                            <p class="lastname" >{{ user.lastname }} </p>
                        </div>
                        
                        <div v-if="!user.isAdmin" @click="deleteUser()" class="delete" >
                            <img class="trash-icon" src="../images/icones/trash-red.svg"/>
                        </div>
                    </div>
                    
                </div>
                <div class="infos">
                    <p class="infos_email" > {{ user.email }} </p>
                    <p class="infos_signupDate" > Inscrit le' : {{ user.signupDate }} </p>
                    <p class="infos_location" > Lieu : {{ user.location }} </p>
                    <p class="infos_birthDate" > Age : {{ user.birthDate }} </p>
                </div>

            
             
        </div>
</template>

<script>
import axios from "axios";

    const instance = axios.create({
        baseURL: "http://127.0.0.1:3000/api/auth/",
    });

    import moment from "moment";
    const timestamp = moment.unix(1634726212);

export default {
    name: 'Card-info-user',
    props: {
        user : {
            type: Object,
            required: true
        }
    },

    methods: {

        // Suppression d'un compte utilisateur
        deleteUser: function () {
            // récupération de l'id et du token dans le localstorage
            let user = localStorage.getItem("user");
            user = JSON.parse(user);
            const token = user.token;
            const self = this;
            const userIdToDelete = this.user.id;
            

            instance.delete("/profile/:"+ userIdToDelete, {headers: { 'Authorization': `Bearer ${token}`},
                }).then(function (response) {
                   self.$router.go('/Users')
                }).catch(function (error) {
                    console.log(error);
                });
        },
    },


    



}

</script>

<style lang="scss">

@import '../assets/scss/scss';

    .user-card {
        display: flex;
        flex-direction: column;
        border-radius: 15px;
        background-color: $color-white;
        margin: $space-XXXsmall;

        .header {
            display: flex;
            align-items: center;
            padding: $space-XXXsmall $space-small;
            gap: $space-XXXsmall;
            border:  1px solid $color-primary;
            border-radius: 15px 15px 0 0;

            &_img {
            display: flex;
            align-items: center;
            min-width: 50px;
            height: 50px;
            border-radius: 100%;
            background: $color-secondary;

                >img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    border-radius: 100%;
                }
            }
            &_names {
                display: flex;
                align-items: center;
                width: 100%;
                justify-content: space-between;
                
                .profil {
                    display: flex;

                    flex-direction: column;
                }
                .delete {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                }
            }
        }
        .admin {
            background-color : $color-secondary;
            border-radius: 15px 15px 0 0;
        }

        
        .infos   {
            display: flex;
            flex-direction: column;
            padding: $space-XXXsmall $space-small;
            border-bottom:  1px solid $color-primary;
            border-left:  1px solid $color-primary;
            border-right:  1px solid $color-primary;
            border-radius:  0 0 15px 15px;
        }

        .trash-icon {

            display: inline-block;
            width: 50px;
            height: 50px;
            margin-bottom: 0;
            cursor: pointer;
            font-weight: normal;
            transition: all 0.2s ease-in-out;
            
            &:focus,
            &:hover {
                background: $color-secondary;
            }
        }    
    }
    
    

</style>