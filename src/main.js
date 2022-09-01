import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from 'axios';

import 'shark-fe';
import 'shark-fe/dist/shark-fe.css';
import 'shark-fe/src/styles/global.scss';
import 'shark-fe/src/shared/CustomFilters';
import 'shark-fe/src/shared/CustomDirectives';

import Vuelidate from 'vuelidate'
import VueGtag from "vue-gtag";

Vue.prototype.$title_case = value => {
    if (value) {
        value = value.toString();
        value = value.replace(/_/g, " ");
        return value.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}

Vue.use(VueGtag, {

    config: {
        id: "G-537XHFJSJ4"
    },
    params: {
        debug: true,
    }
});

// Require dependencies
var VueCookie = require('vue-cookie');
// Tell Vue to use the plugin
Vue.use(VueCookie);


require('@/styles/global.scss')
Vue.config.productionTip = false;

Vue.use(Vuelidate)


import {
    DateRangePickerPlugin, DateTimePickerPlugin
} from "@syncfusion/ej2-vue-calendars";
Vue.use(DateRangePickerPlugin);
Vue.use(DateTimePickerPlugin);

import {
    SchedulePlugin
} from "@syncfusion/ej2-vue-schedule";
Vue.use(SchedulePlugin);
require('@/styles/syncFusion.scss')


axios.defaults.timeout = 400000;
axios.interceptors.request.use(request => {
        if (!request.headers.responseType) {
            request.headers['Content-Type'] = 'application/json';
        }
        const currentUser = JSON.parse(localStorage.getItem('currentUserDetails'));
        if (currentUser) {
            request.headers.Authorization = 'Bearer ' + currentUser.access_token;

        } else {
            // not logged in, set basic token
            request.headers.Authorization =
                'Basic ' + process.env.VUE_APP_BASIC_AUTH_TOKEN;
        }

        return request;
    },
    error => {
        window.console.log('failed to intercept request');
        Promise.reject(error);
    });

axios.interceptors.response.use(response => {
    return response;
}, error => {
    console.log(error.message)
    if (error && error.message === 'Request failed with status code 401') {
        console.log(router.currentRoute.path)

        let id_token = (JSON.parse(localStorage.getItem("currentUserDetails"))).id_token;
        localStorage.removeItem("currentUserDetails");
        localStorage.removeItem("isAuthenticated");
        window.location.href = "https://" + process.env.VUE_APP_DOMAIN + ":9443/oidc/logout?id_token_hint=" + id_token + "&post_logout_redirect_uri=" + process.env.VUE_APP_AUTH_REDIRECT_URL;

    }
    return Promise.reject(error);
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");