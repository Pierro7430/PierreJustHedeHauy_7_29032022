<template>
    <div class="profile-edit">
        <h1 class="profile-edit_h1">Editer mon profil</h1>

        <div class="profile-edit_form">
            <div class="avatar" @click="checkFormIsValid()">
                 <div v-if="!image && !urlAvatar" class="avatar_preview">
                </div>
                <div v-else-if="!image" class="avatar_preview">
                    {{checkFormIsValid()}}
                    <img :src="urlAvatar" />
                </div>
                <div v-else class="avatar_preview">
                    {{checkFormIsValid()}}
                    <img :src="image" />
                </div>
               
                <div class="avatar_edit">
                    <input id="file" @change="onFileChange" type="file" />
                    <label for="file">
                        <img class="edit-icon" src="../images/icones/edit-red.svg" alt="Edit profil" />
                    </label>
                    <div @click="deleteImg() && checkFormIsValid()">
                        <img class="trash-icon" src="../images/icones/trash-red.svg"/>
                    </div>         
                </div>
            </div>

            <div class="form-row">
                <p>Nom</p>
                <input v-on:input="checkFormIsValid()" @focus="errorLastname = false" v-model="lastname" class="form-row_input" :class="{ 'form-row_input--error': errorLastname }" type="text"/>
                <p v-if="errorLastname" class="form-row_error">{{ errors.lastnameIsNotValid }}</p>
            </div>

            <div class="form-row">
                <p>Prénom</p>
                <input v-on:input="checkFormIsValid()" @focus="errorFirstname = false" v-model="firstname" class="form-row_input" :class="{ 'form-row_input--error': errorFirstname }" type="text"/>
                <p v-if="errorFirstname" class="form-row_error">{{ errors.firstnameIsNotValid }}</p>
            </div>

            <div class="form-row">
                <p>Localisation</p>
                <input  @focus="errorLocation = false" v-model="location" class="form-row_input" :class="{ 'form-row_input--error': errorLocation }" type="text"/>
                <p v-if="errorLocation" class="form-row_error">{{ errors.locationIsNotValid }}</p>
            </div>

            <div class="form-row">
                <p>Date de naissance</p>
                <input v-on:input="checkFormIsValid()" v-model="birthDate" class="form-row_input" type="date" />
            </div>
        </div>

        <div class="profile-edit_btn">
           
            
            <button :disabled="!formValidated" @click="editProfile()" class="btn-basic btn-basic--submit-A" :class="{'btn-basic--disabled' : !formValidated}">Mettre à jour le compte</button>
            <button @click="cancelPost()" class="btn-basic btn-basic--submit-B">Annuler</button>
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
    name: "Card-profile-edit",
    data: function () {
        return {
            lastname: "",
            firstname: "",
            location: "",
            birthDate: "",
            urlAvatar: "",
            image: "",
            infoImg: "",
            formValidated: false,
            errorLastname: false,
            errorFirstname: false,
            errorLocation: false,
            errors: {
                lastnameIsNotValid: "",
                firstnameIsNotValid: "",
                locationIsNotValid: "",
            },
        };
    },

    // Récupération des infos dynamiques
    mounted: function () {
        if (this.$store.state.user.userId == -1) {
            this.$router.push("/");
            return;
        }

        const self = this;
        let user = localStorage.getItem("user");
        user = JSON.parse(user);
        const token = user.token;

        instance.get("/profile/:" + user.userId, {
                headers: { Authorization: `Bearer ${token}` },
        })
        .then(function (response) {
            self.lastname = response.data.results[0].lastname;
            self.firstname = response.data.results[0].firstname;
            self.location = response.data.results[0].location;
            self.urlAvatar = response.data.results[0].photo_url;
            if(response.data.results[0].birth_date != null) {
                self.birthDate = moment(response.data.results[0].birth_date).format("YYYY-MM-DD");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    },

    methods: {
        // Vérification si le form est OK
		checkFormIsValid: function () {
            if(this.lastname && this.firstname) {
                this.formValidated = true;
            }
            else{
                if(!this.lastname){
                    this.errorLastname = true;
                    this.errors.lastnameIsNotValid = "Votre nom de famille est obligatoire";
                }
                if(!this.firstname){
                    this.errorFirstname = true;
                    this.errors.firstnameIsNotValid = "Votre prénom est obligatoire";
                }
                this.formValidated = false;
            }  
        },

        // Annulation des modifications et retour sur le profil
        cancelPost: function () {
            this.$router.push("/profile/")
        },


         // Suppression de l'image
        deleteImg: function () {
            this.image = '';
            this.urlAvatar = '';
        },

         // modification de l'image
        onFileChange(event) {
            var files = event.target.files || event.dataTransfer.files;
            if (!files.length) return;
            this.urlAvatar = '';
            this.infoImg = files[0];
            this.createImage(files[0]);
        },

        createImage(file) {
            var image = new Image();
            var reader = new FileReader();
            var vm = this;

            reader.onload = (event) => {
                vm.image = event.target.result;
            };

            reader.readAsDataURL(file);
        },

        // Envoie de l'update au backend
        editProfile: function () {

            // récupération de l'id et du token dans le localstorage
            let user = localStorage.getItem("user");
            user = JSON.parse(user);
            const token = user.token;
            const self = this;

            // récupération des informations du profil
            const userProfile = {
                lastname: this.lastname,
                firstname: this.firstname,
                location: this.location,
                birth_date: this.birthDate,
                photo_url: this.urlAvatar,
            };

            // ces informartions sont stockés au format JSON dans une variable
            const dataUser = JSON.stringify(userProfile);

            // Utilisation de la méthode formData.append pour stocker les data sous forme de clé-value
            const formData = new FormData();
            formData.append( "userProfile", dataUser);


            if (this.image) {
                // On ajoute la nouvelle image à upload sous forme de clé-value à formData
                formData.append("image", this.infoImg, this.infoImg.name);
            }

            instance.put("/profile/:" + user.userId, formData, {headers: { 'Authorization': `Bearer ${token}`},
                }).then(function (response) {
                    self.$router.push("/profile");
                }).catch(function (error) {
                    console.log(error);
                });
        },
    },
};
</script>

<style lang="scss">
@import "../assets/scss/scss";

    .profile-edit {
        width: 100%;
        background-color: $color-white;
        padding: $space-medium;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: $space-small;

        &_h1 {
            text-align: center;
            font-weight: 600;
            font-size: $font-XXXlarge;
        }

        &_form {
            display: flex;
            flex-direction: column;
            gap: $space-Xsmall;

            .avatar {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;

                .avatar_edit {
                    position: absolute;
                    right: 12px;
                    z-index: 1;
                    top: 10px;

                    .edit-icon {
                        width: 100%;
                        height: 100%;
                    }

                    input {
                        display: none;

                        + label {
                            display: inline-block;
                            width: 50px;
                            height: 50px;
                            margin-bottom: 0;
                            border-radius: 100%;
                            background: $color-white;
                            border: 1px solid red;
                            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
                            cursor: pointer;
                            font-weight: normal;
                            transition: all 0.2s ease-in-out;

                            &:focus,
                            &:hover {
                                background: $color-secondary;
                            }
                        }
                    }

                    .trash-icon {
                        position: absolute;
                        left: 15px;
                        z-index: 1;
                        top: 70px;
                        display: inline-block;
                        width: 50px;
                        height: 50px;
                        margin-bottom: 0;
                        border-radius: 100%;
                        background: $color-white;
                        border: 1px solid red;
                        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
                        cursor: pointer;
                        font-weight: normal;
                        transition: all 0.2s ease-in-out;
                        
                        &:focus,
                        &:hover {
                            background: $color-secondary;
                        }
                    }
                }

                .avatar_preview {
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    background: $color-secondary;
                    position: relative;

                    > img {
                        width: 100%;
                        height: 100%;
                        border-radius: 100%;
                        background-size: cover;
                        background-repeat: no-repeat;
                        background-position: center;
                    }
                }
            }

            .form-row {
                display: flex;
                flex-direction: column;
                gap: $space-XXXsmall;

                &_input {
                    padding: 8px;
                    border: 1px solid $color-grey-light;
                    border-radius: 8px;
                    background: $color-grey-light;
                    font-weight: 500;
                    font-size: $font-medium;

                    &:focus,
                    &:hover {
                        background: $color-white;
                        outline: none;
                        border: 1px solid $color-primary;
                        box-shadow: 0px 0px 10px 1px $color-secondary;
                    }
                }

                &_input--error {
                    background: $color-secondary;

                    &:focus,
                    &:hover {
                        background: $color-secondary;
                        outline: none;
                        border: 1px solid $color-primary;
                        box-shadow: 0px 0px 10px 1px $color-secondary;
                    }
                }

                &_error {
                    color: $color-primary;
                    font-size: $font-small;
                }
            }
        

         
        }     


        &_btn {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: $space-small;


            .btn-basic {
                font-size: $font-medium;
                padding: $space-XXsmall $space-small;
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

                &:hover,
                &focus,
                &click {
                    color: $color-primary;
                    background-color: $color-secondary;
                }
            }

            .btn-basic--disabled {
                color: $color-grey-dark;
                background-color: $color-grey-light;
                border-color: $color-grey-light;

                &:hover,
                &focus,
                &click {
                    color: $color-grey-dark;
                    background-color: $color-grey-light;
                }
            }
        }
    }


    

</style>