<template>
    <div>
        <div v-if="isAdmin" class="card-admin">
            <p class="card-admin_text">Je suis en mode administrateur</p>
        </div>        
    </div>
</template>

<script>
import axios from "axios";
const instance = axios.create({
    baseURL: "http://127.0.0.1:3000/api/auth/",
});

export default {
    name: "Card-admin",
    data: function () {
        return {
            isAdmin: false,
        };
    },

    mounted: function () {
        const self = this;
        let user = localStorage.getItem("user");
        user = JSON.parse(user);
        const token = user.token;
        instance
            .get("/admin/:" + user.userId, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(function (response) {
                if(response.data.results[0].is_admin == 1){
                    self.isAdmin = true;
                    self.$emit('user-admin', {isAdmin: true}); 
                }
                else {
                    self.isAdmin = false;
                }
            })
            .catch(function (error) {
                console.log(error)             
            });
    },

    
};
</script>

<style lang="scss">
@import "../assets/scss/scss";

.card-admin {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $space-Xsmall;
    background-color: $color-primary;

    &_text {
        font-size: $font-large;
        color: $color-white;
    }
}

</style>
