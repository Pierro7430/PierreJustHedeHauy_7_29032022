<template>
  <div class="card-login">

    <div class="card-login_aside">
      <div class="card-login_aside_logo">
        <img class="logo" src="../images/icon-above-font-red.svg" alt="Logo Groupomania">
      </div>
      <div class="card-login_aside_txt" >
        <p v-if="mode == 'login'">Bon retour parmi nous</p>
        <p v-else>Prêt à échanger et discuter ?</p>
      </div>
    </div>

    <div class="card-login_main">
      <h1 class="card-login_main_h1" v-if="mode == 'login'">Connexion</h1>
      <h1 class="card-login_main_h1" v-else>Inscription</h1>
      <div class="card-login_main_form">
        <div class="form-row">
          <p>Adresse mail</p>
          <input @blur="checkFormMail() && checkFormIsValid()"  @focus="errorEmail = false" v-model="email" class="form-row_input" :class="{'form-row_input--error' : errorEmail} " type="text"/>
          <p v-if="errorEmail" class="form-row_error">{{errors.emailIsNotValid}} {{errors.emailDoesntExist}} {{errors.emailExistAlready}}</p>
        </div>

        <div class="form-row" v-if="mode == 'create'">
          <p>Nom</p>
          <input @blur="checkFormLastname() && checkFormIsValid()" @focus="errorLastname = false" v-model="lastname" class="form-row_input" :class="{'form-row_input--error' : errorLastname}" type="text"/>
          <p  v-if="errorLastname" class="form-row_error">{{errors.lastnameIsNotValid }}</p>        
        </div>

        <div class="form-row" v-if="mode == 'create'">
          <p>Prénom</p>
          <input @blur="checkFormFirstname() && checkFormIsValid()" @focus="errorFirstname = false" v-model="firstname" class="form-row_input" :class="{'form-row_input--error' : errorFirstname}" type="text"/>
          <p  v-if="errorFirstname" class="form-row_error">{{errors.firstnameIsNotValid }}</p>
        </div>

        <div class="form-row">
          <p>Mot de passe</p>
          <input @blur="checkFormPassword() && checkFormIsValid()" @focus="errorPassword = false" v-model="password" class="form-row_input" :class="{'form-row_input--error' : errorPassword}" type="password"/>
          <p  v-if="errorPassword" class="form-row_error">{{errors.passwordIsNotValid }} {{errors.passwordDoesntMatch }}</p>
        </div>
      </div>

      <div class="card-login_main_btn" v-if="mode == 'login'">
        <button :disabled="!formValidated" @click="login()" class="btn-login" :class="{'btn-login--disabled' : !formValidated}">Se connecter</button>
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
      this.$router.push('/profile');
      return ;
    }
  },

  computed: {
    ...mapState(['status'])
  },

  
  methods: {
    
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

		checkFormLastname: function () {
      const regexLastname = /^[a-zA-Z\-]+$/;
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

		checkFormFirstname: function () {
      const regexFirstname = /^[a-zA-Z\-]+$/;
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

    switchToCreateAccount: function () {
      this.mode = 'create';
      this.resetForm();
    },
    
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
        self.$router.push('/profile');
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

        .logo {
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
      background-color: #ffffff;
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

.card {
    display: flex;
    background:white;
    border-radius: 14px;
    box-shadow: 0px 0px 20px -10px #000000;
  }

  .card_main {
    min-width: 300px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 40px;
  }

  .card_aside {
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: 32px;
    background: #ffd6d6;
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
  }

  

  .logo {
    max-width: 250px;
  }

  

  .card_main_h1 {

    font-weight: 600;
    font-size: 32px;
  }

  .card_main_form {
    padding-top: 20px;
  }

  .switch {
    display: flex;
    justify-content: center;
  }

  .btn {
    border: 1px solid #fd2d01;
    border-radius: 30px;
    background-color: #ffd6d6;
    color: #fd2d01;
    font-size: 18px;
    cursor: pointer;
    margin: 0;
    padding: 15px 25px;
  }

  .btn:hover {
    color: #ffffff;
    background-color: #fd2d01;
  }

  .card__action:hover {
    cursor:pointer;
  }

  .card_main_form {
    display: flex;
    flex-direction: column;
    padding: 0;
    gap: 20px;
  }

  .form-row {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .form-row__input {
    padding: 8px;
    border: none;
    border-radius: 8px;
    background:#f2f2f2;
    font-weight: 500;
    font-size: 16px;
    color: black;
    
  }

  .form-row__input:focus {
    background:#ffffff;
    outline: none;
    border: 1px #eb7278;
    box-shadow: 0px 0px 10px 1px #ffd7d7;
  }

  .form-row__input:hover {
    background:#ffffff;
    outline: none;
    border: 1px #eb7278;
    box-shadow: 0px 0px 10px 1px #ffd7d7;
  }

  .card_main_btn {
    display: flex;
    justify-content: center;
  }
  .btn-red {
    color: #ffffff;
    background-color: #fd2d01;
    margin-top: 10px;
  }

  .btn-red:hover {
    color: #fd2d01;
    background-color: #ffd6d6;
    margin-top: 10px;
  }