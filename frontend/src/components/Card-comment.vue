<template>
    <div class="card"> 
        <div v-if="comment.isEditing">
            <card-edit-comment  v-model="comment" :key="comment.comment_id" :comment="comment"></card-edit-comment>
        </div>
        <div v-else class="comment-card">
            <div class="comment-card_header" :class="{'header-mypost' : comment.myComment}">    
                <div class="profil">
                    <img v-if="comment.urlAvatar" class="profil_img" :src="comment.urlAvatar" alt="Image avatar" />
                </div>
                <div class="divers">
                    <div class="divers_info">
                        <h2 class="divers_info_title" > {{ comment.title }} </h2>
                        <div class="divers_info_body">
                            <p>Posté par <span>{{ comment.fullname }}</span></p>
                        </div> 
                    </div>
                   
                    <div v-if="comment.myComment || this.$parent.isAdmin" @click="toEdit()" class="divers_edit">
                        <img class="edit-icon" src="../images/icones/edit-red.svg" alt="Edit profil" />
                    </div>
                </div>
            </div>

            <div class="comment-card_body">
                <p v-if="comment.description"> {{ comment.description }} </p>
                <div v-if="comment.urlImg" class="comment-card_body_img">
                    <img :src="comment.urlImg" alt="">
                </div> 
            </div>
            <div class="comment-card_footer">
                <p v-if="comment.updated == 0" > Posté le <span>{{ comment.dateCreated }}</span> <br></p>
                <p v-else>  Mis à jour le <span>{{ comment.dateUpdated }}</span></p>
            </div>
            <div class="comment-card_btns">
                <div class="like">
                    <div @click="addLike" class="like_btn">
                        <img  v-if="comment.myLike === true" class="like_btn_up" src="../images/icones/left-arrow-red.svg" alt="Icone like">
                        <img  v-else class="like_btn_up" src="../images/icones/left-arrow-black.svg" alt="Icone like">
                    </div>
                    <p v-if="!comment.likeCount" class="like_compt">0</p>
                    <p v-else class="like_compt">{{ comment.likeCount }}</p>
                    <div @click="addDislike" class="like_btn">
                        <img v-if="comment.myDislike === true"  class="like_btn_down" src="../images/icones/left-arrow-red.svg" alt="Icone dislike">
                        <img v-else  class="like_btn_down" src="../images/icones/left-arrow-black.svg" alt="Icone dislike">
                    </div>
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

import CardEditComment from "./Card-edit-comment.vue";

export default {
    components: { CardEditComment },
    name: 'Card-comment',
    props: {
        comment : {
            type: Object,
            required: true
        }
    },

    methods: {

        // Permet de faire apparaître le composant card-edit-comment
        toEdit: function () {
            return this.comment.isEditing = true;
        },

        // Permet d'ajouter ou retirer un like
        addLike: function() {     
            if(!this.comment.myLike && !this.comment.myDislike) {
                this.comment.myLike = true;
                this.comment.likeType = 1; 
                this.comment.likeCount++;
            }
            else if(!this.comment.myLike && this.comment.myDislike) {
                this.comment.myLike = true;
                this.comment.myDislike = false;
                this.comment.likeType = 1;
                this.comment.likeCount+= 2;
            }
            else{
                this.comment.myLike = false;
                this.comment.myDislike = false;
                this.comment.likeType = 0;
                this.comment.likeCount--;
            }
            return this.sendMyLike();
        },

        // Permet d'ajouter ou retirer un dislike
        addDislike: function() {
            if(!this.comment.myDislike && !this.comment.myLike) {
                this.comment.myDislike = true;
                this.comment.likeType = -1;
                this.comment.likeCount--;
                
            }
            else if(!this.comment.myDislike && this.comment.myLike) {          
                this.comment.myDislike = true;
                this.comment.myLike = false;
                this.comment.likeType = -1;
                this.comment.likeCount+= -2;
            }
            else{
                this.comment.myDislike = false;
                this.comment.myLike = false; 
                this.comment.likeType = 0;
                this.comment.likeCount++;            
            }
            return this.sendMyLike();
        },

        // Envoie du like/dislike dans le backend
        sendMyLike: function () {
            // récupération de l'id et du token dans le localstorage
            let user = localStorage.getItem("user");
            user = JSON.parse(user);
            const token = user.token;
            const self = this;
            
            // récupération des informations du like
            const dataLike = {
                userId: user.userId,
                commentId: self.comment.commentId,
                type: self.comment.likeType,
            };

            instance.post("/like/comment", dataLike, {headers: { 'Authorization': `Bearer ${token}`},
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

    .comment-card {
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

        &_body{
            display: flex;
            flex-direction: column;
            gap: $space-small;;
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