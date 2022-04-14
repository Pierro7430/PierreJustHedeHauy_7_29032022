<template>
  <div class="card-login">

    <div class="card-login_aside">
      <div class="card-login_aside_logo">
        <img class="logo-login" src="../images/logo/icon-above-font-red.svg" alt="Logo Groupomania">
      </div>
      <div class="card-login_aside_txt" >
        <p v-if="mode == 'login'">Bon retour parmi nous</p>
        <p v-else>Prêt à échanger et discuter ?</p>
      </div>
    </div>

    <div class="card-login_main">
      <h1 class="card-login_main_h1" v-if="mode == 'login'">Connexion</h1>
      <h1 class="card-login_main_h1" v-else>Inscription</h1>
      <form class="card-login_main_form">

        <div class="form-row" v-if="mode == 'create'">
          <p>Adresse mail</p>
          <input v-on:input="checkFormMail() && checkFormIsValid()" @focus="errorEmail = false" v-model="email" class="form-row_input" :class="{'form-row_input--error' : errorEmail} " type="text" autocomplete ="email" />
          <p v-if="errorEmail" class="form-row_error">{{errors.emailIsNotValid}} {{errors.emailDoesntExist}} {{errors.emailExistAlready}}</p>
        </div>

        <div class="form-row" v-if="mode == 'login'">
          <p>Adresse mail</p>
          <input v-on:input="checkFormMail()" @focus="errorEmail = false" v-model="email" class="form-row_input" :class="{'form-row_input--error' : errorEmail} " type="text" autocomplete ="email" />
          <p v-if="errorEmail" class="form-row_error">{{errors.emailIsNotValid}} {{errors.emailDoesntExist}} {{errors.emailExistAlready}}</p>
        </div>

        <div class="form-row" v-if="mode == 'create'">
          <p>Nom</p>
          <input v-on:input="checkFormLastname() && checkFormIsValid()" @focus="errorLastname = false" v-model="lastname" class="form-row_input" :class="{'form-row_input--error' : errorLastname}" type="text" autocomplete ="family-name"/>
          <p  v-if="errorLastname" class="form-row_error">{{errors.lastnameIsNotValid }}</p>        
        </div>

        <div class="form-row" v-if="mode == 'create'">
          <p>Prénom</p>
          <input v-on:input="checkFormFirstname() && checkFormIsValid()" @focus="errorFirstname = false" v-model="firstname" class="form-row_input" :class="{'form-row_input--error' : errorFirstname}" type="text" autocomplete ="given-name"/>
          <p  v-if="errorFirstname" class="form-row_error">{{errors.firstnameIsNotValid }}</p>
        </div>

        <div class="form-row" v-if="mode == 'create'">
          <p>Mot de passe</p>
          <input v-on:input="checkFormPassword() && checkFormIsValid()" @focus="errorPassword = false" v-model="password" class="form-row_input" :class="{'form-row_input--error' : errorPassword}" type="password" autocomplete ="current-password"/>
          <p  v-if="errorPassword" class="form-row_error">{{errors.passwordIsNotValid }}</p>
        </div>

        <div class="form-row" v-if="mode == 'login'">
          <p>Mot de passe</p>
          <input @focus="errorPassword = false" v-model="password" class="form-row_input" :class="{'form-row_input--error' : errorPassword}" type="password" autocomplete ="current-password"/>
          <p  v-if="errorPassword" class="form-row_error">{{errors.passwordDoesntMatch }}</p>
        </div>
      </form>

      <div class="card-login_main_btn" v-if="mode == 'login'">
        <button  @click="login()" class="btn-login">Se connecter</button>
      </div>
      <div class="card-login_main_btn" v-else>
        <button :disabled="!formValidated" @click="createAccount()" class="btn-login" :class="{'btn-login--disabled' : !formValidated}">Créer le compte</button>
      </div>

      <div class="switch-login">
        <div v-if="mode == 'login'">
          <p class="switch-login_txt">Vous n'avez pas encore de compte ?</p>
          <p class="switch-login_btn" @click="switchToCreateAccount()">Créer un compte</p>
        </div>
        <div v-else>
          <p class="switch-login_txt">Vous n'avez pas encore de compte ?</p>
          <p class="switch-login_btn" @click="switchToLogin()">Se connecter</p>
        </div>
      </div>
      
    </div>

  </div>

</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'Login',
  data: function () {
    return {
      mode: 'login',
      email: '',
      lastname: '',
      firstname: '',
      password: '',
      formValidated: false,
			errorEmail: false,
			errorLastname: false,
			errorFirstname: false,
			errorPassword: false,
      errors : {
        emailIsNotValid: '',
				emailExistAlready: '',
				emailDoesntExist: '',
        lastnameIsNotValid: '',
        firstnameIsNotValid: '',
        passwordIsNotValid: '',
				passwordDoesntMatch: '',
      }
    }
  },


  mounted: function () {
    if (this.$store.state.user.userId != -1) {
      this.$router.push('/');
      return ;
    }
  },

  computed: {
    ...mapState(['status'])
  },

  
  methods: {
    
    // Vérification si leform est OK
		checkFormIsValid: function () {
			if (this.mode == 'create') {
				if(this.checkFormMail() && this.checkFormLastname() && this.checkFormFirstname() && this.checkFormPassword()) {
          this.formValidated = true;
			  }
				else{
					this.formValidated = false;
				}
			}
			else {
				if(this.checkFormMail() && this.checkFormPassword() ) {
          this.formValidated = true;
			  }
				else{
					this.formValidated = false;
				}
			}
		},

    // Vérification de la regex email
    checkFormMail: function () {
      const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const checkMail = regexEmail.test(this.email);
      if(!this.email) {
				this.errorEmail = false;
				this.errors.emailIsNotValid = '';
				return false;
      }
      else {
        if(!checkMail) {
					this.errorEmail = true;
          this.errors.emailIsNotValid = 'Vote email n\'est pas valide';
					return false;
        }
        else {
					this.errorEmail = false;
          this.errors.emailIsNotValid = '';
					return true;
        } 
      }
    },

    // Vérification de la regex lastname
		checkFormLastname: function () {
      const regexLastname = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\-]+$/;
      const checkLastname = regexLastname.test(this.lastname);
      if(!this.lastname) {
				this.errorLastname = false;
				this.errors.lastnameIsNotValid = '';
				return false;
      }
      else {
        if(!checkLastname) {
					this.errorLastname = true;
            this.errors.lastnameIsNotValid = 'Les caractères spéciaux ainsi que les chiffres ne sont pas autorisés';
						return false;
          }
        else {
					this.errorLastname = false;
          this.errors.lastnameIsNotValid = '';
					return true;
        } 
      }
    },

    // Vérification de la regex firstname
		checkFormFirstname: function () {
      const regexFirstname = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\-]+$/;
      const checkFirstname = regexFirstname.test(this.firstname);
      if(!this.firstname) {
				this.errorFirstname = false;
				this.errors.firstnameIsNotValid = '';
				return false;
      }
      else {
        if(!checkFirstname) {
					this.errorFirstname = true;
            this.errors.firstnameIsNotValid = 'Les caractères spéciaux ainsi que les chiffres ne sont pas autorisés';
						return false;
          }
        else {
					this.errorFirstname = false;
          this.errors.firstnameIsNotValid = '';
					return true;
        } 
      }
    },

    // Vérification de la regex password
    checkFormPassword: function () {
      const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
      const checkPassword = regexPassword.test(this.password);
      if(!this.password) {
				this.errorPassword = false;
				this.errors.passwordIsNotValid = '';
				return false;
      } 
			else {
				if (!checkPassword) {
					this.errorPassword = true;
					this.errors.passwordIsNotValid = 'Le mot de passe doit contenir au minimum : 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial';
				  return false;
				}
				else {
					this.errorPassword = false;
					this.errors.passwordIsNotValid = '';
					return true;
				}
			}  
    },

    // reset du form au switch
    resetForm: function () {
      this.email = '';
      this.lastname = '';
      this.firstname = '';
      this.password = '';
      this.formValidated = false;
			this.errorEmail = false;
			this.errorLastname = false;
			this.errorFirstname = false;
			this.errorPassword = false;
    },

    // switch create
    switchToCreateAccount: function () {
      this.mode = 'create';
      this.resetForm();
    },
    
    // switch login
    switchToLogin: function () {
      this.mode = 'login';
      this.resetForm();
    },

    login: function () {
      const self = this;
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password,
      }).then(function () {
        self.$router.push('/home');
      }, function (error) { 
				if(error.response.status == 404) {
					self.errorEmail = true;
					self.errors.emailDoesntExist = 'Ce mail n\'existe pas';
				}
				if(error.response.status == 401) {
					self.errorPassword = true;
				  self.errors.passwordDoesntMatch = 'Mauvais mot de passe';
			  }
				console.log(error);
			})
    },

    createAccount: function () {
      const self = this;
      this.$store.dispatch('createAccount', {
        email: this.email,
        lastname: this.lastname,
        firstname: this.firstname,
        password: this.password,
      }).then(function () {
        self.login();
      }, function (error) {
				if(error.response.status == 401) {
					self.errorEmail = true;
					self.errors.emailExistAlready = 'Cette adresse mail est déjà utilisée';
				}
        console.log(error);
      })
    },

  }
}


</script>


<style lang="scss">
@import '../assets/scss/scss'; 

  .card-login {
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

        .logo-login {
          width: 100%;
          max-width: 250px;
        }
      }

      &_txt {
        font-size: $font-XXlarge;
        text-align: center;
      }
      
    }

    &_main {
      position: absolute;
      top: calc($height-card-aside - $dimension-recovery-card);
      width: 100%;
      background-color: $color-white;
      padding: 40px;
      border-top-left-radius: $dimension-recovery-card;
      border-top-right-radius: $dimension-recovery-card;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: $space-small;

      &_h1 {
        text-align: center;
        font-weight: 600;
        font-size: $font-XXXlarge;
      }

      &_form {
        display: flex;
        flex-direction: column;
        gap: $space-Xsmall;


        .form-row {
          display: flex;
          flex-direction: column;
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

          &_error {
            color: $color-primary;
            font-size: $font-small;
          }
        }
      }

      &_btn {
        display: flex;
        justify-content: center;
      }


      .btn-login {
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

        &--disabled {
          color: $color-grey-dark;
          background-color: $color-grey-light;
          border: 1px solid $color-grey-light;
          cursor: default;

          &:hover, &focus, &click {
            color: $color-grey-dark;
            background-color: $color-grey-light;
          }
        } 
      } 
    }

    .switch-login {
      display: flex;

      &_txt {
        font-size: $font-small;
      }

      &_btn {
        color: $color-primary;
        cursor: pointer;

        &:hover, &focus, &click{
          text-decoration: underline;
        }
      } 
    }
  }

</style>