<template>  
    <div>
        <navbar></navbar>
        <card-admin  @user-admin="admin"></card-admin>
        <div class="post">
            <card-post  v-model="post" :key="post.post_id" :post="post"></card-post>
            <div class="post_create-answer">
                <div class="form-row">
                    <input  v-if="!isWriting" @click="toAnswer()" class="form-row_input" type="text" placeholder="Répondre"/>
                    <textarea v-else v-model="description"  v-on:input="checkFormIsValid()" class="form-row_input" rows="5"/>
                </div>
                <div v-if="!isWriting" ></div>
                    <div @click="checkFormIsValid()" v-else class="form-img">
                        <div v-if="!image && !urlImg" class="form-img_preview"></div>
                        <div v-else-if="!image" class="form-img_preview">
                            {{checkFormIsValid()}}
                            <img :src="urlImg" />
                        </div>
                        <div v-else class="form-img_preview">
                            {{checkFormIsValid()}}
                            <img :src="image" />
                        </div>
                    
                        <div v-if="!image && !urlImg" class="form-img_upload">
                            <input id="file" @change="onFileChange" @blur="checkFormIsValid()" type="file" />
                            <label for="file">
                                <img class="upload-icon" src="../images/icones/upload-red.svg" alt="Edit profil" />
                            </label>
                        </div>

                        <div v-else class="form-img_edit">
                            <input id="file" @change="onFileChange" @blur="checkFormIsValid()" type="file" />
                            <label for="file">
                                <img class="edit-icon" src="../images/icones/edit-red.svg" alt="Edit profil" />
                            </label>
                            <div @click="deleteImg() && checkFormIsValid()">
                                <img class="trash-icon" src="../images/icones/trash-red.svg"/>
                            </div> 
                        </div>
                        <div class="answer_btn">
                        <button @click="cancelComment()" class="btn-basic btn-basic--submit-B">Annuler</button>
                        <button @click="createComment()" :disabled="!formValidated" class="btn-basic btn-basic--submit-A" :class="{'btn-basic--disabled' : !formValidated}">Créer</button>
                    </div> 
                </div>
            </div>
            <div class="list-comments">
                <card-comment v-for="comment in allComments" :key="comment.comment_id" :comment="comment"> </card-comment>
            </div>
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
import CardPost from '../components/Card-post.vue';
import CardFooter from '../components/Card-footer.vue';
import CardComment from '../components/Card-comment.vue';
import CardAdmin from '../components/Card-admin.vue';


export default {
    name: 'Post',
    components: { Navbar, CardAdmin, CardPost, CardFooter, CardComment },

    data : function () {
        return {
            comment: {},
            allComments: [],                         
            post: {},
            isWriting : false,
            description: "",
            urlImg: "",
            image: "",
            infoImg: "",
            formValidated: false,
            isAdmin: false,
        }
    },

    // au chargement de la page, on va récupérer toutes les informations dynamiques dans le back-end
    mounted:  function () {

        // Vérification si si le user est correctement authentifié
        if (this.$store.state.user.userId == -1) {
            this.$router.push("/");
            return;
        }
        const self = this;
        let user = localStorage.getItem("user");
        user = JSON.parse(user);
        const token = user.token;
        const postId = window.location.href.split('=')[1];

        axios.all([
            instance.get("/post/:" + postId, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            instance.get("/like/post/:" + user.userId, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            instance.get("/one-count-comment/:" + postId, {
                headers: { Authorization: `Bearer ${token}` },
            }),

        ])            
            .then(axios.spread((response1, response2, response3) => {
                console.log(response3);
                const dataPost = response1.data.results[0];      
                // if (!dataPost.postId) {
                //     self.$router.push('/home/');
                // }
                    
                self.post = {
                    postId: '',
                    url: '',
                    title: '',
                    description: '',
                    urlImg: '',
                    urlAvatar: '',
                    creator: '',
                    fullname: '',
                    dateCreated: '',
                    dateUpdated: '',
                    updated:'',
                    likeCount: '',
                    myLike: '',
                    myDislike: '',
                    likeType: '',
                    commentCount: '',
                    myPost: false,
                },
                
                self.post.postId = dataPost.post_Id;
                self.post.url = "/post/:" + dataPost.post_Id;
                self.post.title = dataPost.post_title;
                self.post.description = dataPost.post_description;
                self.post.urlImg = dataPost.post_imgUrl;
                self.post.creator = dataPost.post_creator;
                self.post.fullname = dataPost.fullName;
                self.post.urlAvatar = dataPost.photo_url;
                self.post.dateCreated = moment(dataPost.post_date_created).format("DD-MM-YYYY");
                self.post.dateUpdated = moment(dataPost.post_date_updated).format("DD-MM-YYYY");
                self.post.updated = dataPost.post_updated;
                self.post.likeCount = dataPost.likePostCount;
                self.post.myLike = false;
                self.post.myDislike = false;

    
                if(self.post.creator == user.userId) {
                    self.post.myPost = true;
                }
    
                const dataMyLikes = response2.data.results[0];

                if(dataMyLikes != null && self.post.postId == dataMyLikes.post_Id){
                    if(dataMyLikes.like_post_type == 0){
                        self.post.myLike = false;
                        self.post.myDislike = false;     
                    }
                    if(dataMyLikes.like_post_type == 1){
                        self.post.myLike = true;
                        self.post.myDislike =  false;
                    }
                    if(dataMyLikes.like_post_type == -1){
                        self.post.myLike = false;
                        self.post.myDislike = true;
                    }
                } 
                self.post.commentCount = response3.data.results[0].commentCount;


                self.getComments();
                
            
            }))
            .catch(function (error) {
                console.log(error);
            })
        },

    methods : {
        // Une fois le post chargé, on récupère les infos des commentaires
        getComments : function () {
            if (this.$store.state.user.userId == -1) {
                this.$router.push("/");
                return;
            }
            const self = this;
            let user = localStorage.getItem("user");
            user = JSON.parse(user);
            const token = user.token;
            const postId = window.location.href.split('=')[1];

            axios.all([
                instance.get("/comment/:" + postId, {
                        headers: { Authorization: `Bearer ${token}` },
                }),
                instance.get("/like/comment/:" + user.userId, {
                    headers: { Authorization: `Bearer ${token}` },
                }),

            ])
                .then(axios.spread((response1, response2) => {

                     response1.data.results.forEach(element => {
                        
                        self.comment = {
                            commentId: '',
                            description: '',
                            urlImg: '',
                            urlAvatar: '',
                            creator: '',
                            dateCreated: '',
                            dateUpdated: '',
                            updated:'',
                            likeCount: '',
                            myLike: '',
                            myDislike: '',
                            likeType: '',
                            myComment: false,
                            isEditedByAdmin : false,
                        },

                        self.comment.commentId = element.comment_Id;
                        self.comment.description = element.comment_description;
                        self.comment.urlImg = element.comment_imgUrl;
                        self.comment.creator = element.comment_creator;
                        self.comment.fullname = element.fullname;
                        self.comment.urlAvatar = element.photo_url;
                        self.comment.dateCreated = moment(element.comment_date_created).format("DD-MM-YYYY");
                        self.comment.dateUpdated = moment(element.comment_date_updated).format("DD-MM-YYYY");
                        self.comment.updated = element.comment_updated;
                        self.comment.likeCount = element.likeCommentCount;
                        self.comment.myLike = false,
                        self.comment.myDislike = false,

                        response2.data.results.forEach(element2 => {
                            if(self.comment.commentId == element2.comment_Id){
                                if(element2.like_comment_type == 0){
                                    self.comment.myLike = false;
                                    self.comment.myDislike = false;     
                                }
                                if(element2.like_comment_type == 1){
                                    self.comment.myLike = true;
                                    self.comment.myDislike =  false;
                                }
                                if(element2.like_comment_type == -1){
                                    self.comment.myLike = false;
                                    self.comment.myDislike = true;
                                }
                            }     
                        })

                        if(element.comment_edit_byAdmin = 1) {
                            self.comment.isEditedByAdmin = true;
                        }

                        if(self.comment.creator == user.userId) {
                            self.comment.myComment = true;
                        }

                        self.allComments.push(self.comment);                 
                    })
                }))
                .catch(function (error) {
                    console.log(error);
                });
        },
        
        // Indique que le compte est bien admin
        admin: function () {
            this.isAdmin = true;
        },

        // Active le form permetttant de repondre
        toAnswer : function () {
            this.isWriting = true;
        },
        
        // Annule commmentaire
        cancelComment : function () {
            this.isWriting = false;
            this.description = "";
            this.urlImg = "";
            this.image = "";
        },

        // Chargement d'une image dans la réponse
         onFileChange(event) {
            var files = event.target.files || event.dataTransfer.files;
            if (!files.length) return;
            this.urlImg = '';
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

        // Suppression de l'image dans la réponse
        deleteImg: function () {
            this.image = '';
            this.urlImg = '';
        },

        // Le form est valide car il n'est pas vide (txt ou image)
        checkFormIsValid: function () {
            if(this.description || this.urlImg || this.image){
                    this.formValidated = true;
                }
                else {
                    this.formValidated = false;
                }
        },

        // Envoie de la réponse dans le backend
        createComment: function () {
            // récupération de l'id et du token dans le localstorage
            let user = localStorage.getItem("user");
            user = JSON.parse(user);
            const token = user.token;
            const self = this;
            const postId = window.location.href.split('=')[1];

            // récupération des informations du Post
            const commentInfo = {
                commentDescription: this.description,
                commentImgUrl: this.urlImg,
                commentCreator: user.userId,
                commentPostId: postId,
            };

            // ces informartions sont stockés au format JSON dans une variable
            const dataComment = JSON.stringify(commentInfo);

            // Utilisation de la méthode formData.append pour stocker les data sous forme de clé-value
            const formData = new FormData();
            formData.append( "createComment", dataComment);

            if(this.image) {
                // On ajoute la nouvelle image à upload sous forme de clé-value à formData
                formData.append("image", this.infoImg, this.infoImg.name);
            }

            instance.post("/comment", formData, {headers: { 'Authorization': `Bearer ${token}`},
                }).then(function (response) {
                    self.cancelComment();
                    self.getComments();
                }).catch(function (error) {
                    console.log(error);
                });  
        },
    }
}
    


</script>

<style lang="scss">

@import '../assets/scss/scss';
.post {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: $space-Xsmall;

    &_create-answer {
        display: flex;
        justify-content: center;
        flex-direction: column;
        background-color: $color-white;
        padding:  $space-Xsmall; 
        border-bottom: 1px solid $color-secondary;
        border-top: 3px solid $color-grey-light;
        border-bottom: 3px solid $color-grey-light;
        border-radius: 0 0 15px 15px;
        width: 100%;

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
        }
        .form-img {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: $space-XXXsmall;
            position: relative;


            &_preview {
                width: 100%;
                min-height: 50px;
                max-height: 150px;
                border: 1px solid $color-secondary;
                border-radius: 8px;
                display: flex;
                justify-content: center;

                > img {
                    max-width: 100%;
                    max-height: 100%;
                    border-radius: 100%;
                    object-fit: contain;
                    
                }
            }

            &_upload {
                position: absolute;
                display: flex;
                justify-content: center;
                top: 10px;
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
                        width: 30px;
                        height: 30px;
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
                top: 20px;
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
    

        .answer_btn {
            display: flex;
            justify-content: space-between;
            padding-top: $space-small;
            

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
    }
    .list-comments  {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: $space-Xsmall; 
        gap: $space-Xsmall;

    } 
}

   


</style>