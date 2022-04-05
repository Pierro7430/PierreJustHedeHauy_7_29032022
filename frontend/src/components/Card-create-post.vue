<template>
  <div class="create-post">
        <div class="create-post_header">
            <h2 class="create-post_header_title" >Créer un post</h2>
        </div>
        <div class="create-post_form">
            <div class="form-row">
                <p>Titre</p>
                <input  @blur="checkFormIsValid()" @click="checkFormIsValid()" v-model="postTitle" class="form-row_input" :class="{'form-row_input--error' : errorTitle} " type="text"/>
                <p v-if="errorTitle" class="form-row_error"></p>
            </div>

            <div class="form-row">
                <p>Image</p>
                <input @blur="checkFormIsValid()" @click="checkFormIsValid()" v-model="postImg" class="form-row_input" :class="{'form-row_input--error' : errorImg}" type="url"/>
                <p  v-if="errorImg" class="form-row_error"></p>        
            </div>

            <div class="form-row">
                <p>Description</p>
                <textarea @blur="checkFormIsValid()" @click="checkFormIsValid()" v-model="postDescription" class="form-row_input" :class="{'form-row_input--error' : errorText}" rows="10"/>
                <p  v-if="errorText" class="form-row_error">}</p>
            </div>
        </div>
        <div class="create-post_btn">
            <button @click="cancelPost()" class="btn-basic btn-basic--submit-B">Annuler</button>
            <button @click="createPost()" :disabled="!formValidated" class="btn-basic btn-basic--submit-A" :class="{'btn-basic--disabled' : !formValidated}">Créer</button>

        </div>

       

  </div>
  
</template>

<script>

export default {
    name: 'Card-create-post',
    data: function () {
        return {
            postTitle: '',
            postImg: '',
            postDescription: '',
            formValidated: false,
        }
    },

    methods: {
        checkFormIsValid: function () {

            if(this.postTitle != ''){
                if(this.postImg != '' || this.postDescription != ''){
                    this.formValidated = true;
                }
                else {
                    this.formValidated = false;
                }
            } 
            else {
                this.formValidated = false;
            }
        },

        createPost: function () {
        const self = this;
        this.$store.dispatch('createPost', {
            postTitle: this.postTitle,
            postImg: this.postImg,
            postDescription: this.postDescription,
            }).then(function () {
                self.$router.push('/home');
            }, function (error) {
                console.log(error);
            })
        },
    },
}

</script>

<style lang="scss">

@import '../assets/scss/scss';

.create-post {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: $color-white;
    padding: $space-regular;
    gap: $space-Xsmall;

    &_header {
        display: flex;
        justify-content: center;

        &_title {
            font-weight: 400;
            font-size: $font-large;
        }

    }
    &_form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: $space-Xsmall;

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
            

            &_input--error {
            background:$color-secondary;

                &:focus, &:hover {
                    background: $color-secondary;
                    outline: none;
                    border: 1px solid $color-primary;
                    box-shadow: 0px 0px 10px 1px $color-secondary;
                }
            }
            
        }
    }


    &_btn {
        display: flex;
        justify-content: space-between;

        .btn-basic {
            font-size: $font-medium;
            padding: $space-XXsmall $space-small;
            border: 1px solid;
            border-radius: $space-small;
            cursor: pointer;
        }

        .btn-basic--submit-B {
        color: $color-primary;
        background-color: $color-white;
        border-color: $color-primary;

            &:hover, &focus, &click {
                color: $color-primary;
                background-color: $color-secondary;
            }
        }

        .btn-basic--submit-A {
            color: $color-white;
            background-color: $color-primary;
            border-color: $color-primary;

                &:hover, &focus, &click {
                    color: $color-primary;
                    background-color: $color-secondary;
                }
        }

        .btn-basic--disabled {
            color: $color-grey-dark;
            background-color: $color-grey-light;
            border-color: $color-grey-light;

            &:hover, &focus, &click {
                color: $color-grey-dark;
                background-color: $color-grey-light;
            }
        }
    }
    
}

</style>