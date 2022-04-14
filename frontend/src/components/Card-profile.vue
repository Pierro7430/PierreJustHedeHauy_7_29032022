<template>
    <div v-if="!deleteMyAccount" class="card-profile">
        <h1 class="card-profile_title">Mon profil</h1>
        <div v-if="!urlAvatar" class="card-profile_img"></div>
        <div v-else class="card-profile_img">
            <img class="profil-imgXL" :src="urlAvatar" alt="Image avatar">
        </div>
        <p class="card-profile_name">Bonjour <span>{{this.firstname}}</span> <span>{{this.lastname}}</span></p>
        <div class="card-profile_info"> 
            <p v-if="!birthDate">Age : <span class="italic">Non renseigné</span></p>
            <p v-else><span>{{ getAge }}</span> ans</p>
            <p v-if="!location">Localisation : <span class="italic">Non renseignée</span></p>
            <p v-else>{{ this.location }} </p>
            <p> Inscrit depuis le <span>{{ this.signupDate }}</span></p>
        </div>
        <button @click="goToEditMyProfile()" class="btn-modify">Modifier mon profil</button>
        <button @click="this.deleteMyAccount = true" class="btn-delete">Supprimer mon compte</button>
    </div>
    <div v-else class="delete-account">
        <div class="delete-account_body">
            <h2>Voulez-vous vraiment supprimer votre compte ?</h2>
            <p>Si vous valider la suppression de votre compte, toutes vos données ainsi que vos messages seront supprimées.</p>
        </div>
        <div class="delete-account_btn">
            <button @click="this.deleteMyAccount = false" class="btn-basic btn-basic--submit-B">ANNULER</button>
            <button @click="remove()" class="btn-basic btn-basic--submit-A">SUPPRIMER</button>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
const instance = axios.create({
    baseURL: 'http://127.0.0.1:3000/api/auth/'
  });

import moment from "moment";
const timestamp = moment.unix(1634726212);


export default {
    name: 'Card-profile',
    data: function () {
        return {
            lastname : '',
            firstname : '',
            signupDate :'',
            location : '',
            birthDate : '',
            age: '',
            urlAvatar : '',
            deleteMyAccount: false,  
        }
    },

    computed: {    
        // Fonction qui perlet de calculer l'age à partir de la date de naissance et de la date du jour
        getAge: function () {
            const today = new Date();
            const dateBirth = new Date(this.birthDate);
            let age = today.getFullYear() - dateBirth.getFullYear();
            const m = today.getMonth() - dateBirth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            this.age = age;
            return this.age;
        },
    },

    // Récupération des informations dynamiques
    mounted: function () {
        if (this.$store.state.user.userId == -1) {
            this.$router.push('/');
            return ;
        }       
        const self = this;
        let user = localStorage.getItem('user');
        user = JSON.parse(user);
        const token = user.token;
        
        instance.get('/profile/:' + user.userId, { headers: {"Authorization" : `Bearer ${token}`} })
            .then(function (response) {
                console.log(response);
                self.lastname = response.data.results[0].lastname;
                self.firstname = response.data.results[0].firstname;
                self.signupDate = moment(response.data.results[0].signup_date).format("DD-MM-YYYY");
                self.location = response.data.results[0].location;
                self.birthDate = response.data.results[0].birth_date;
                self.urlAvatar = response.data.results[0].photo_url;
                self.isAdmin = response.data.results[0].is_admin;
            })
            .catch(function (error) {
                console.log(error)
            });  
    },


    methods: {

        // Permet d'aller editer son profil
        goToEditMyProfile: function () {
            this.$router.push('/profile-edit')
        },

        // Permet de supprimer son compte
        remove: function () {
            if (this.$store.state.user.userId == -1) {
            this.$router.push("/");
            return;
        }
        const self = this;
        let user = localStorage.getItem("user");
        user = JSON.parse(user);
        const token = user.token;
        instance.delete("/profile/:" + user.userId,  {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(function (response) {
                self.$store.commit("logout");
                self.$router.push("/");
            })
            .catch(function (error) {
                console.log(error);
            });

        },
    }
}

</script>

<style lang="scss">

    @import '../assets/scss/scss'; 
    .card-profile {
        width: 100%;
        background-color: $color-white;
        padding: $space-medium;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: $space-small;

        &_img {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: $color-secondary;

            .profil-imgXL {
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 100%;     
            }
        }

        &_title {
            font-weight: 400;
            font-size: $font-large;
        }

        &_name {
            font-weight: 600;
            text-align: center;
            font-size: $font-XXlarge;
        }

        &_info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: $space-XXsmall;
            font-weight: 500;

        }

        .btn-modify {
            color: $color-primary;
            background-color: $color-white;
            border: 1px solid $color-primary;
            border-radius: $space-small;
            font-size: $font-medium;
            cursor: pointer;
            padding: $space-XXXsmall $space-Xsmall;

                &:hover, &focus, &click {
                    color: $color-primary;
                    background-color: $color-secondary;
                }
            }

        .btn-delete {
            color: $color-primary;
            background: none;
            font-weight: 400;
            border: none;

            &:hover, &focus, &click {
                text-decoration: underline;
            }
        }
    }
    

    .delete-account {
        background-color: $color-white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: $space-medium;
        padding: $space-Xlarge $space-medium;
            
        &_body{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: $space-XXsmall;
            text-align: center;

            > h2 {
                font-size: $font-large;
            }
        }

        &_btn {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: $space-regular;

            .btn-basic {
                font-size: $font-medium;
                padding: $space-XXsmall $space-Xsmall;
                border: 1px solid;
                border-radius: $space-small;
                cursor: pointer;
            }

            .btn-basic--submit-B {
                color: $color-primary;
                background-color: $color-white;
                border-color: $color-primary;

                &:hover, &focus, &click {
                    color: $color-primary;
                    background-color: $color-secondary;
                }
            }

            .btn-basic--submit-A {
                color: $color-white;
                background-color: $color-primary;
                border-color: $color-primary;

                &:hover, &focus, &click {
                    color: $color-primary;
                    background-color: $color-secondary;
                }
            } 
        }
    }





</style>