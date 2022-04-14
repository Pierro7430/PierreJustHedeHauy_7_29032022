import { createWebHistory, createRouter } from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import Profile from "@/views/Profile.vue";
import ProfileEdit from "@/views/Profile-edit.vue";
import CreatePost from "@/views/Create-post.vue";
import Post from "@/views/Post.vue";
import Users from "@/views/Users.vue";


const routes = [
  { 
    name: 'login',
    path: '/', 
    component: Login,
  },

  { 
    name: 'home',
    path: '/home', 
    component: Home, 
    props:true 
  },

  { 
    name: 'post',
    path: '/postId=:id', 
    component: Post, 
    props:true 
  },

  { 
    name: 'create-post',
    path: '/create-post', 
    component: CreatePost, 
    props:true 
  },

  { 
    name: 'profile',
    path: '/profile', 
    component: Profile, 
    props:true 
  },
  

  { 
    name: 'profile-edit',
    path: '/profile-edit', 
    component: ProfileEdit, 
    props:true 
  },

  { 
    name: 'users',
    path: '/users', 
    component: Users, 
    props:true 
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;