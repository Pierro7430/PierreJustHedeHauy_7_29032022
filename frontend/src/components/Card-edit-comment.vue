<template>
  <div class="create-comment">
        <div class="create-comment_header">
            <h2 class="create-comment_header_title" >Modifier son commentaire</h2>
        </div>
        <div class="create-comment_form">

            <div class="form-row">
                <p>Description</p>
                <textarea v-model="comment.description" @click="checkFormIsValid()" @blur="checkFormIsValid()" class="form-row_input" rows="10"/>
            </div>

            <div class="form-img">
                <p>Image</p>
                <div v-if="!comment.image && !comment.urlImg" class="form-img_preview"></div>
                <div v-else-if="!comment.image" class="form-img_preview">
                    <img :src="comment.urlImg" />
                </div>
                <div v-else class="form-img_preview">
                    <img :src="comment.image" />
                </div>
               
                <div v-if="!comment.image && !comment.urlImg" class="form-img_upload">
                    <input id="file" @click="checkFormIsValid()" @blur="checkFormIsValid()" @change="onFileChange" type="file" />
                    <label for="file">
                        <img class="upload-icon" src="../images/icones/upload-red.svg" alt="Edit profil" />
                    </label>
                </div>

                <div v-else class="form-img_edit">
                    <input id="file" @click="checkFormIsValid()" @blur="checkFormIsValid()" @change="onFileChange" type="file" />
                    <label for="file">
                        <img class="edit-icon" src="../images/icones/edit-red.svg" alt="Edit profil" />
                    </label>
                    <div @click="deleteImg(), checkFormIsValid()" @blur="checkFormIsValid()">
                        <img class="trash-icon" src="../images/icones/trash-red.svg"/>
                    </div> 
                </div>
            </div>  
        </div>
        <div class="create-comment_btn">
            <button @click="cancelComment()" class="btn-basic btn-basic--submit-B">Annuler</button>
            <button @click="updateComment()" :disabled="!comment.formValidated" class="btn-basic btn-basic--submit-A" :class="{'btn-basic--disabled' : !comment.formValidated}">Modifier</button>
        </div>
        <div class="create-comment_delete">
            <button @click="deleteComment()" class="btn-basic btn-basic--submit-A">Supprimer le commentaire</button>
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
    name: 'Card-edit-comment',
    props: {
        comment : {
            type: Object,
            required: true
        },
    },

    methods: {
        checkFormIsValid: function () {

            if(this.comment.title != ''){
                if(this.comment.urlImg != '' || this.comment.image!='' || this.comment.commentDescription != ''){
                    this.comment.formValidated = true;
                }
                else {
                    this.comment.formValidated = false;
                }
            } 
            else {
                this.comment.formValidated = false;
            }
        },

        onFileChange(event) {
            var files = event.target.files || event.dataTransfer.files;
            if (!files.length) return;           
            this.comment.infoImg = files[0];
            this.createImage(files[0]);
        },

        createImage(file) {
            var image = new Image();
            var reader = new FileReader();
            var vm = this;

            reader.onload = (event) => {
                vm.comment.image = event.target.result;
            };

            reader.readAsDataURL(file);
        },
        
        deleteImg: function () {
            this.comment.image = '';
            this.comment.urlImg = '';
        },


        updateComment: function () {
            // récupération de l'id et du token dans le localstorage
            let user = localStorage.getItem("user");
            user = JSON.parse(user);
            const token = user.token;
            const self = this;
            const postId = window.location.href.split('=')[1];

            

            // récupération des informations du Post
            const commentInfo = {
                commentDescription: this.comment.description,
                commentImgUrl: this.comment.urlImg,
                commentCreator: user.userId,
                commentPostId: postId,
            };
            console.log(commentInfo);
            // ces informartions sont stockés au format JSON dans une variable
            const dataComment = JSON.stringify(commentInfo);

            // Utilisation de la méthode formData.append pour stocker les data sous forme de clé-value
            const formData = new FormData();
            formData.append( "createComment", dataComment);

            const commentId = this.comment.commentId;

            if(this.comment.image) {
                // On ajoute la nouvelle image à upload sous forme de clé-value à formData
                formData.append("image", this.comment.infoImg, this.comment.infoImg.name);
                
            }

            instance.put("/comment/:" + commentId, formData, {headers: { 'Authorization': `Bearer ${token}`},
                }).then(function (response) {
                    console.log(response)
                }).catch(function (error) {
                    console.log(error);
                }).finally(function () {
                    self.$router.go("/comment/:" + postId)
                });
        },

        deleteComment: function () {
            // récupération de l'id et du token dans le localstorage
            let user = localStorage.getItem("user");
            user = JSON.parse(user);
            const token = user.token;
            const self = this;
            const postId = window.location.href.split('=')[1];

            const commentInfo = {
                commentCreator: user.userId,
                commentPostId: postId,
            };
            // ces informartions sont stockés au format JSON dans une variable
            const dataComment = JSON.stringify(commentInfo);

            // Utilisation de la méthode formData.append pour stocker les data sous forme de clé-value
            const formData = new FormData();
            formData.append( "createComment", dataComment);

            const commentId = this.comment.commentId;
            console.log(commentId);

            instance.delete("/comment/:" + commentId, {headers: { 'Authorization': `Bearer ${token}`},
                }).then(function (response) {
                    console.log(response)
                }).catch(function (error) {
                    console.log(error);
                }).finally(function () {
                    self.comment.isEditing = false;
                    self.$router.go("/comment/:" + postId)
                });
        },

        cancelComment: function () {
            this.comment.isEditing = false;
            this.comment.image = '';
        },
    },
}

</script>

<style lang="scss">

@import '../assets/scss/scss';

.create-comment {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: $color-white;
    padding: $space-regular;
    gap: $space-Xsmall;
    border-radius: 15px;

    &_header {
        display: flex;
        justify-content: center;

    }
    &_form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: $space-Xsmall;

        .form-row {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: $space-XXXsmall;

            &_input {
            padding: 8px;
            border: 1px solid $color-grey-light;
            border-radius: 8px;
            background:$color-grey-light;
            font-weight: 500;
            font-size: $font-medium;

                &:focus, &:hover {
                    background: $color-white;
                    outline: none;
                    border: 1px solid $color-primary;
                    box-shadow: 0px 0px 10px 1px $color-secondary;
                }
            }
            

            &_input--error {
            background:$color-secondary;

                &:focus, &:hover {
                    background: $color-secondary;
                    outline: none;
                    border: 1px solid $color-primary;
                    box-shadow: 0px 0px 10px 1px $color-secondary;
                }
            }
            
        }

        .form-img {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: $space-XXXsmall;
            position: relative;


            &_preview {
                width: 100%;
                min-height: 80px;
                max-height: 300px;
                border: 1px solid $color-secondary;
                border-radius: 8px;
                display: flex;
                justify-content: center;

                > img {
                    max-width: 100%;
                    max-height: 100%;
                    border-radius: 100%;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                }
            }

            &_upload {
                position: absolute;
                display: flex;
                justify-content: center;
                top: 50px;
                width: 100%;
                z-index: 1;

                .upload-icon {
                    width: 100%;
                    height: 100%;
                }

                input {
                    display: none;

                    + label {
                        display: inline-block;
                        width: 50px;
                        height: 50px;
                        cursor: pointer;
                        font-weight: normal;
                        transition: all 0.2s ease-in-out;

                        &:focus,
                        &:hover {
                            background: $color-secondary;
                        }
                    }
                }
            }

            &_edit {
                position: absolute;
                right: 10px;
                top: 50px;
                z-index: 1;

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
                    right: 0px;
                    top: 70px;
                    z-index: 1;
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

                
        }
    }


    &_btn {
        display: flex;
        justify-content: space-between;

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

                &:hover, &focus, &click {
                    color: $color-primary;
                    background-color: $color-secondary;
                }
        }

        .btn-basic--disabled {
            color: $color-grey-dark;
            background-color: $color-grey-light;
            border-color: $color-grey-light;

            &:hover, &focus, &click {
                color: $color-grey-dark;
                background-color: $color-grey-light;
            }
        }
    }

    &_delete {
        display: flex;
        justify-content: center;
        .btn-basic {
            font-size: $font-medium;
            padding: $space-XXsmall $space-small;
            border: 1px solid;
            border-radius: $space-small;
            cursor: pointer;
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