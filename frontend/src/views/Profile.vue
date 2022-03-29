<template>
    <div class="card">
        <div class="card_aside">
            <div class="card_aside_logo">
                <img class="logo" src="../images/icon-above-font-red.svg" alt="Logo Groupomania">
            </div>
        </div>
        <div class="card_main">
            <h1 class="card_main_title">Mon profil</h1>
            <p class="card_main_text">Bienvenue <span>{{user.firstname}}</span> <span>{{user.lastname}}</span></p>
            <button @click="logout()" class="btn-dc">Déconnexion</button>
        </div>
    </div>
</template>

<script>

import { mapState } from 'vuex';

export default {
  name: 'Profile',

  mounted: function () {
    if (this.$store.state.user.userId == -1) {
      this.$router.push('/');
      return ;
    }
    this.$store.dispatch('getUserInfos');
  },
  computed: {
    ...mapState({
      user: 'userInfos',
    })
  },
  methods: {
    logout: function () {
      this.$store.commit('logout');
      this.$router.push('/');
    }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/scss'; 


.card {
    display: flex;
    flex-direction: column;

    &_aside {
        position: relative;
        height: $height-card-aside;
        padding: $space-medium;
        padding-bottom: $space-medium + $dimension-recovery-card;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        gap: $space-XXsmall;
        background: $color-secondary;
        background: $background-gradient;

        &_logo {
            display: flex;
            justify-content: center;

            .logo {
                width: 100%;
                max-width: 250px;
            }
        }
    }

    &_main {
        position: absolute;
        top: calc($height-card-aside - $dimension-recovery-card);
        width: 100%;
        background-color: #ffffff;
        padding: 40px;
        border-top-left-radius: $dimension-recovery-card;
        border-top-right-radius: $dimension-recovery-card;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: $space-small;

        &_title {
            text-align: center;
            font-weight: 600;
            font-size: $font-XXXlarge;
        }

        &_text {
            text-align: center;
        }

        .btn-dc {
        color: $color-white;
        background-color: $color-primary;
        border: 1px solid $color-primary;
        border-radius: $space-small;
        font-size: $font-medium;
        cursor: pointer;
        padding: 15px 25px;
        margin: $space-XXsmall $space-XXsmall;

            &:hover, &focus, &click {
                color: $color-primary;
                background-color: $color-secondary;
            }
        }
    }
}   

</style>