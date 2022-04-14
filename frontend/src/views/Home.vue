<template>
    <div class="home-page">
        <navbar> </navbar>
        <card-admin  @user-admin="admin"></card-admin>
        <div class="home-page_create">
            <div class="form-row">
                <input  @click="goToCreatePost()" class="form-row_input" type="text" placeholder="Créer un nouveau post"/>
            </div>
        </div>
        <div class="home-page_card-list">
            <card-post v-for="post in allPosts" :key="post.post_id" :post="post"></card-post>
        </div>
        
        <card-footer> </card-footer> 
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
    import CardPost from '../components/Card-post.vue'
    import CardFooter from '../components/Card-footer.vue'
    import CardAdmin from '../components/Card-admin.vue';

    export default {
    name: 'Home',
    components: { Navbar, CardAdmin, CardFooter, CardPost }, 
    data : function () {
        return {
            post: {},
            allPosts: [],
            isAdmin: false,
        }
    },

    mounted: function () {
            
        if (this.$store.state.user.userId == -1) {
            this.$router.push("/");
            return;
        }

        
        let user = localStorage.getItem("user");
        user = JSON.parse(user);
        const token = user.token;
        const self = this;

        axios.all([
            instance.get("/post", {
                headers: { Authorization: `Bearer ${token}` },
            }),
            instance.get("/like/post/:" + user.userId, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            instance.get("/all-counts-comment", {
                headers: { Authorization: `Bearer ${token}` },
            }),
            instance.get("/mycomment/:" + user.userId, {
                headers: { Authorization: `Bearer ${token}` },
            }),
        ])            
            .then(axios.spread((response1, response2, response3, response4) => {
                response1.data.results.forEach(element => {
                    
                    self.post = {
                        postId: '',
                        url: '',
                        title: '',
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
                        commentCount: '',
                        myComment: false,
                        myPost: false,
                        isEditing: false,
                        isEditedByAdmin: false,
                        
                    },

                    self.post.postId = element.post_Id;
                    self.post.url = window.location.search + 'postId=' + element.post_Id;
                    self.post.title = element.post_title;
                    self.post.description = element.post_description;
                    self.post.urlImg = element.post_imgUrl;
                    self.post.creator = element.post_creator;
                    self.post.fullname = element.fullname;
                    self.post.urlAvatar = element.photo_url;
                    self.post.dateCreated = moment(element.post_date_created).format("DD-MM-YYYY");
                    self.post.dateUpdated = moment(element.post_date_updated).format("DD-MM-YYYY");
                    self.post.updated = element.post_updated;
                    self.post.likeCount = element.likePostCount;
                    self.post.myLike = false;
                    self.post.myDislike = false;
                    self.post.commentCount = element.commentCount;

                    if(self.post.creator == user.userId) {
                        self.post.myPost = true;
                    }

                    if(element.post_edit_byAdmin = 1) {
                            self.post.isEditedByAdmin = true;
                    }

                    response2.data.results.forEach(element2 => {
                        if(self.post.postId == element2.post_Id){
                            if(element2.like_post_type == 0){
                                self.post.myLike = false;
                                self.post.myDislike = false;     
                            }
                            if(element2.like_post_type == 1){
                                self.post.myLike = true;
                                self.post.myDislike =  false;
                            }
                            if(element2.like_post_type == -1){
                                self.post.myLike = false;
                                self.post.myDislike = true;
                            }
                        }     
                    }),

                    response3.data.results.forEach(element3 => {
                        if(self.post.postId == element3.post_Id){
                            self.post.commentCount = element3.commentCount;
                        }
                    }),
                    
                    response4.data.results.forEach(element4 => {

                        if(self.post.postId == element4.comment_postId){
                            self.post.myComment = true;
                        }
                    }),
                    console.log(self.post)

                    self.allPosts.push(this.post);                 
                })            
            }))
            .catch(function (error) {
                console.log(error);
            })            
    },

    
    methods: {

        admin: function () {
            this.isAdmin = true;
        },

        goToCreatePost: function () {
            this.$router.push("/create-post");
        },

        
    }
}
</script>

<style lang="scss">
@import '../assets/scss/scss'; 

.home-page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: $color-grey-light;

    

    &_create {
        display: flex;
        justify-content: center;
        flex-direction: column;
        background-color: $color-white;
        padding:  $space-Xsmall; 
        border-bottom: 1px solid $color-secondary;

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
    }
    &_card-list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: $space-Xsmall; 
        gap: $space-Xsmall;
        

    }
} 

</style>