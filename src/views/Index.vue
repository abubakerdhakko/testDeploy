<template>
  <div id="main-page">
    <!-- Add Navigation Bar here -->
    <Header v-if="showHeader" />
    <div class="page">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Header from "../components/Header";
import { AuthService } from "../services/AuthService";

export default {
  components: {
    Header,
  },
  data: function () {
    return {
      showHeader: false,
    };
  },
  props: {},
  methods: {
    authorize() {
      if (window.location.search.includes("code")) {
        let authCode = window.location.search.substring(6, 42);

        AuthService.getWso2ISToken(
          authCode,
          process.env.VUE_APP_AUTH_REDIRECT_URL
        )
          .then((tokenResponse) => {
            let token = tokenResponse.data.access_token;
            let id_token = tokenResponse.data.id_token;

            localStorage.setItem(
              "currentUserDetails",
              JSON.stringify({
                access_token: token,
                id_token: id_token,
              })
            );

            localStorage.setItem("isAuthenticated", "yes");

            AuthService.getUserDetail().then((response) => {
              // console.log(response);
              let user = JSON.stringify(
                localStorage.getItem("currentUserDetails")
              );
              // token = tokenResponse.data.access_token;
              let organizationId = response.data.profile.organizationId;
              let username = response.data.profile.username;
              let currency = response.data.profile.currency;
              let unit = response.data.profile.unitPreferences;
              let profile = response.data.profile;
              let portalAccess = response.data.portalAccess;
              let authorities = response.data.authorities;

              localStorage.setItem(
                "currentUserDetails",
                JSON.stringify({
                  id_token: id_token,
                  access_token: token,
                  organizationId: organizationId,
                  username: username,
                  currency: currency,
                  unit: unit,
                  profile: profile,
                  portalAccess: response.data.portalAccess,
                  authorities: authorities,
                })
              );

              if (portalAccess === false) {
                localStorage.removeItem("isAuthenticated");
              } else {
                // this.$router.push("dashboard");
                this.showHeader = true;
                this.$router.push("dashboard");

                return tokenResponse;
              }
            });
          })
          .catch((error) => {
            console.log("An Error occurred while requesting Token", error);
          });
      } else {
        window.location.href =
          "https://" +
          process.env.VUE_APP_DOMAIN +
          ":9443/oauth2/authorize?redirect_uri=" +
          process.env.VUE_APP_AUTH_REDIRECT_URL +
          "&response_type=code&client_id=" +
          process.env.VUE_APP_AUTH_CLIENT_ID +
          "&scope=internal_application_mgt_view internal_login internal_user_mgt_create internal_role_mgt_update internal_role_mgt_view internal_user_mgt_list internal_user_mgt_view internal_user_mgt_update openid";
      }
    },
  },
  created() {
    if (localStorage.currentUserDetails) {
      this.showHeader = true;
      if (this.$router.currentRoute.name === "index") {
        this.$router.push("dashboard");
      }
    } else {
      // this.$router.replace({ name: "login" });
      this.authorize();
    }
  },
  computed: {
    isAuthenticated: function () {
      return localStorage.isAuthenticated;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
