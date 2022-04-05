<template>
  <div class="home-page">
    <navbar> </navbar>
    <card-post> </card-post>
    <card-create-post> </card-create-post>
    <card-footer> </card-footer> 
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import CardPost from '../components/Card-post.vue'
import CardCreatePost from '../components/Card-create-post.vue'
import CardFooter from '../components/Card-footer.vue'

export default {
  name: 'Profile',
  components: { Navbar, CardFooter, CardPost, CardCreatePost }, 
}
</script>

<style lang="scss">
@import '../assets/scss/scss'; 

.home-page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
} 

</style>