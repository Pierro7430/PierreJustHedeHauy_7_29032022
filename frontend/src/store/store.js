import { createStore } from 'vuex';

const axios = require('axios');

const instance = axios.create({
    baseURL: 'http://127.0.0.1:3000/api/auth/'
  });

  
let user = localStorage.getItem('user');
    if (!user) {
    user = {
        userId: -1,
        token: '',
    }; 
    } else {
    try {
        user = JSON.parse(user);
        instance.defaults.headers.common['Authorization'] = user.token;
    } catch (ex) {
        user = {
        userId: -1,
        token: '',
        };
    }
}





const store = createStore({

    state: {
        status: '',
        user: user,
        userInfos: {
            lastname:'',
            firstname: '',
            email: '',
        },
    },


    mutations: {
        setStatus: function (state, status) {
            state.status = status;
        },
        logUser: function (state, user) {
            instance.defaults.headers.common['Authorization'] = user.token;
            localStorage.setItem('user', JSON.stringify(user));
            state.user = user;
            console.log (user);
        },
        userInfos: function (state, userInfos) {
            state.userInfos = userInfos;
        },
        logout: function (state) {
            state.user = {
                userId: -1,
                token: '',
            }
            localStorage.removeItem('user');
        }
    },

    actions: {
        login: ({commit}, userInfos) => {
            commit('setStatus', 'loading');
            console.log(userInfos);
            return new Promise((resolve, reject) => {
                instance.post('/login', userInfos)
                .then(function (response) {
                    commit('setStatus', '');
                    commit('logUser', response.data);
                    resolve(response);
                })
                .catch(function (error) {
                    commit('setStatus', 'error_login');
                    reject(error);
                });
            });
        },
          
        createAccount: ({commit}, userInfos) => {
            commit('setStatus', 'loading');
            return new Promise((resolve, reject) => {
                commit;
                instance.post('/signup', userInfos)
                .then(function (response) {
                    commit('setStatus', 'created');
                    resolve(response);
                })
                .catch(function (error) {
                    commit('setStatus', 'error_create');
                    reject(error);
                });
            });
        },

        // getUserInfos: ({commit}) => {
            
        //     let user = localStorage.getItem('user');
        //     user = JSON.parse(user);
        //     const token = user.token;
        //     console.log(token);
        //     instance.get('/profile/:' + user.userId, { headers: {"Authorization" : `Bearer ${token}`} })
        //     .then(function (response) {
        //         console.log(response.data.results[0]);
        //         commit('userInfos', response.data.results[0]); 
        //     })
            
        //     .catch(function () {
        //     });
        // }
    }
})
export default store;
