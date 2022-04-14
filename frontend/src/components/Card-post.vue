<template>
    <div :id="post.postId" class="card">
        <div v-if="post.isEditing">
            <card-edit-post  v-model="post" :key="post.postId" :post="post"></card-edit-post>
        </div>
        <div v-else class="post-card">
            <div class="post-card_header" :class="{'header-mypost' : post.myPost}">    
                <div class="profil">
                    <img v-if="post.urlAvatar" class="profil_img" :src="post.urlAvatar" alt="Image avatar" />
                </div>
                <div class="divers">
                    <div class="divers_info">
                        <h2 class="divers_info_title" > {{ post.title }} </h2>
                        <div class="divers_info_body">
                            <p>Posté par <span>{{ post.fullname }}</span></p>
                        </div> 
                    </div>
                   
                    <div v-if="post.myPost || this.$parent.isAdmin" @click="toEdit()" class="divers_edit">
                        <img class="edit-icon" src="../images/icones/edit-red.svg" alt="Edit profil" />
                    </div>
                </div>
            </div>

            <div class="post-card_body">
                <p v-if="post.description"> {{ post.description }} </p>
                <div v-if="post.urlImg" class="post-card_body_img">
                    <img :src="post.urlImg" alt="">
                </div> 
            </div>
            <div class="post-card_footer">
                <p v-if="post.updated == 0" > Posté le <span>{{ post.dateCreated }}</span> <br></p>
                <p v-else>  Mis à jour le <span>{{ post.dateUpdated }}</span></p>
            </div>
            <div class="post-card_btns">
                <div class="like">
                    <div @click="addLike" class="like_btn">
                        <img  v-if="post.myLike === true" class="like_btn_up" src="../images/icones/left-arrow-red.svg" alt="Icone like">
                        <img  v-else class="like_btn_up" src="../images/icones/left-arrow-black.svg" alt="Icone like">
                    </div>
                    <p v-if="!post.likeCount" class="like_compt">0</p>
                    <p v-else class="like_compt">{{ post.likeCount }}</p>
                    <div @click="addDislike" class="like_btn">
                        <img v-if="post.myDislike === true"  class="like_btn_down" src="../images/icones/left-arrow-red.svg" alt="Icone dislike">
                        <img v-else  class="like_btn_down" src="../images/icones/left-arrow-black.svg" alt="Icone dislike">
                    </div>
                </div>
                <div class="comment">
                    <a :href="post.url" class="comment_btn">
                        <img  v-if="post.myComment === true" src="../images/icones/comment-red.svg" alt="Icone commentaire">
                        <img  v-else src="../images/icones/comment-black.svg" alt="Icone commentaire">
                    </a>
                    <p v-if="!post.commentCount" class="comment_compt">0</p>
                    <p v-else class="comment_compt">{{ post.commentCount }}</p>
                </div>
            </div>
        </div> 
    </div>
</template>

<script>
import axios from "axios";

    const instance = axios.create({
        baseURL: "http://127.0.0.1:3000/api/auth/",
    });

import CardEditPost from './Card-edit-post.vue';

export default {
    components: { CardEditPost },
    name: 'Card-post',
    props: {
        post : {
            type: Object,
            required: true
        }
    },

    methods: {

        // Permet d'afficher le composant pour éditer le post
        toEdit: function () {
            return this.post.isEditing = true;
        },

        // Gère l'ajout du like
        addLike: function() {
            if(!this.post.myLike && !this.post.myDislike) {
                this.post.myLike = true;
                this.post.likeType = 1;
                this.post.likeCount++;
            }
            else if(!this.post.myLike && this.post.myDislike) {
                this.post.myLike = true;
                this.post.myDislike = false;
                this.post.likeType = 1;
                this.post.likeCount+= 2;
            }
            else{
                this.post.myLike = false;
                this.post.myDislike = false;
                this.post.likeType = 0;
                this.post.likeCount--;
            }
            return this.sendMyLike();
        },

        // Gère l'ajout du dislike
        addDislike: function() {
            if(!this.post.myDislike && !this.post.myLike) {
                this.post.myDislike = true;
                this.post.likeType = -1;
                this.post.likeCount--;    
            }
            else if(!this.post.myDislike && this.post.myLike) {          
                this.post.myDislike = true;
                this.post.myLike = false;
                this.post.likeType = -1;
                this.post.likeCount+= -2;
            }
            else{
                this.post.myDislike = false;
                this.post.myLike = false; 
                this.post.likeType = 0;
                this.post.likeCount++;             
            }          
            return this.sendMyLike();
        },

        // Envoie le like dans le backend
        sendMyLike: function () {
            console.log("hop")
            console.log(this.post.likeType); 
            // récupération de l'id et du token dans le localstorage
            let user = localStorage.getItem("user");
            user = JSON.parse(user);
            const token = user.token;
            const self = this;
            
            // récupération des informations du like
            const dataLike = {
                userId: user.userId,
                postId: self.post.postId,
                type: self.post.likeType,
            };
            instance.post("/like/post", dataLike, {headers: { 'Authorization': `Bearer ${token}`},
                }).then(function (response) {
                   console.log(response);
                }).catch(function (error) {
                    console.log(error);
                });
        },
    },
}

</script>

<style lang="scss">

@import '../assets/scss/scss';

    .post-card {
        display: flex;
        flex-direction: column;
        border-radius: 15px;
        background-color: $color-white;

        &_header {
            display: flex;
            align-items: center;
            gap: $space-XXXsmall;
            padding: $space-XXsmall;

            .profil {
                min-width: 50px;
                height: 50px;
                border-radius: 50%;
                background: $color-secondary;

                &_img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    border-radius: 100%;
                }
            }

            .divers {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            
                &_info {
                    &_title {
                        font-size: $font-large;
                        font-weight: 600;
                    }

                    &_body {
                        font-size: $font-small;
                        font-weight: 400;
                        line-height: 1;
                        color: $color-grey-dark;

                        .moderate {
                            font-weight: 500;
                            color: $color-primary;
                        }
                        
                    }
                }

                &_edit {
                    min-width: 50px;
                    display: flex;
                }
            }   
        }

        .header-mypost {
                background-color: $color-secondary;
                border-radius:  15px 15px 0 0 ;
            }

        &_body {
            padding: $space-XXsmall;

            &_img {
                display: flex;
                justify-content: center;
                width: 100%;
                max-height: 400px;

                >img {
                    max-width: 100%;
                    max-height: 100%;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;                   
                }
            }
        }

        &_footer{
            font-size: $font-small;
            font-weight: 400;
            line-height: 1;
            color: $color-grey-dark;
            text-align: right;
            padding: 0 $space-XXsmall $space-XXsmall $space-XXsmall; 
        }

        &_btns {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: $space-XXsmall;
            border-top: 3px solid $color-grey-light;
          
            .like {
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1 1 0;
                
                &_btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 50px;
                    cursor: pointer;          
                    
                    &_up {
                        width: 100%;
                        height: 100%;
                        transform: rotateZ(90deg);
                    }

                    &_down {
                        width: 100%;
                        height: 100%;
                        transform: rotateZ(-90deg);
                    }
                }
            }

            .comment {
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1 1 0;
                gap: $space-XXXsmall;
                
                &_btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 25px;
                    cursor: pointer; 
                }
            }
        }
    }

</style>