<template>
    <header>
        <div class="navbar">
            <div class="navbar_logo">
                <a href="/Home" title="Accueil">
                    <img class="logo-navbar" src="../images/logo/icon-left-font-transp.svg" alt="Logo Groupomania"/>
                </a>
            </div>
            <div v-if="!urlAvatar" @click="checkMenu()" class="navbar_profil">

            </div>

            <div v-else @click="checkMenu()" class="navbar_profil">
                <img class="profil-img" :src="urlAvatar" alt="Image avatar" />
            </div>
        </div>

        <nav v-if="menuOpen" class="menu">
            <ul class="menu_list">
                <li>
                    <a class="menu_list_btn" href="/Home" title="Accueil">Accueil</a>
                </li>
                <hr class="menu_list_line" />
                <li>
                    <a class="menu_list_btn" href="/Profile" title="Mon profil">Mon profil</a>
                </li>
                <hr class="menu_list_line" />
                <li v-if="isAdmin">
                    <a  class="menu_list_btn" href="/Users" title="Gérer les utilisateurs">Gérer les utilisateurs</a>
                </li>
                <hr v-if="isAdmin" class="menu_list_line" />
                <li @click="logout()" class="menu_list_btn">Me déconnecter</li>
            </ul>
            <div @click="checkMenu()" class="menu_opacity"></div>
        </nav>
    </header>
</template>

<script>
import axios from "axios";
const instance = axios.create({
    baseURL: "http://127.0.0.1:3000/api/auth/",
});

export default {
    name: "Navbar",
    data: function () {
        return {
            mode: "Navbar",
            menuOpen: false,
            urlAvatar: "",
            isAdmin: false,
        };
    },

    // Récupération de l'image profil ansi que du statut admin ou non
    mounted: function () {
        if (this.$store.state.user.userId == -1) {
            this.$router.push("/");
            return;
        }

        const self = this;
        let user = localStorage.getItem("user");
        user = JSON.parse(user);
        const token = user.token;
        axios.all([
            instance.get("/profile/:" + user.userId, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            instance.get("/admin/:" + user.userId, {
                headers: { Authorization: `Bearer ${token}` },
            })
        ])
            .then(axios.spread((response1, response2) => {
                self.urlAvatar = response1.data.results[0].photo_url;
                if(response2.data.results[0].is_admin == 1){
                    self.isAdmin = true;
                }
                else {
                    self.isAdmin = false;
                }
            }))
            .catch(function (error) {
                console.log(error);
            });
    },

    
    methods: {

        // Fonction qui permet de se déconnecter
        logout: function () {
            this.$store.commit("logout");
            this.$router.push("/");
        },
        // Permet de se d'aller voir son profil
        goToMyProfile: function () {
            this.$router.push("/profile");
        },
        // Permet d'ouvrir ou fermer le menu
        checkMenu: function () {
            if (!this.menuOpen) {
                this.menuOpen = true;
            } else {
                this.menuOpen = false;
            }
        },
    },
};
</script>

<style lang="scss">

    @import "../assets/scss/scss";

    .navbar {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $space-Xsmall;
        background-color: $color-white;
        border-bottom: 2px solid $color-secondary;

        &_logo {
            display: flex;
            align-items: center;

            >a {
                display: flex;

                .logo-navbar {
                    width: 200px;
                }
            }
        }

        &_profil {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: $color-secondary;

            .profil-img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 100%;
            }
        }
    }

    .menu {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: $space-Xsmall;
        background-color: $color-white;
        position: absolute;
        width: 100%;
        right: 0;
        z-index: 10;

        &_list {
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            gap: $space-XXsmall;
            width: 100%;
            padding: 0 $space-large;

            &_line {
                border: none;
                height: 2px;
                background-color: $color-secondary;
            }

            &_btn:hover,
            :active {
                color: $color-primary;
            }
        }
        
        &_opacity {
            position: absolute;
            top: 100%;
            right: 0;
            width: 100vw;
            min-height: calc(100vh - 100%);
            background-color: $color-grey-dark;
            opacity: 0.5;
            z-index: 5;
        }
    }
</style>
