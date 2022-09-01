<template>
  <div class="grid-wrapper">
    <div class="col-left">
      <!-- <img src="../../assets/login.jpg" /> -->
    </div>
    <div class="col-right">
      <div class="row-2">
        <!-- <img :src="'/assets/' + tenant + '/images/primary.png'" /> -->

        <img src="../../assets/primary.png" />
        <div class="title">Your Assets our care</div>
        <div class="sub-title">
          Enter your details below to get started
        </div>
        <div class="input">
          <SInput
            :label="'Enter Username'"
            type="email"
            v-model="email"
            :error="$v.email.$error ? 'invalid' : ''"
          />
        </div>
        <div class="input mt-20">
          <SInput
            :label="'Enter Password'"
            type="password"
            v-model="password"
            :error="$v.password.$error ? 'invalid' : ''"
          />
        </div>
        <div class="btn" @click="login" to="/dashboard">
          <div class="btn-text">ENTER</div>
          <div class="arrow">
            <i id="caret" class="fa fa-angle-right img"></i>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { AuthService } from "../../services/AuthService";
import { required } from "vuelidate/lib/validators";

export default {
  data: () => ({
    email: "",
    password: "",

  }),
  name: "Login",
  components: {},
  validations() {
    return {
      email: { required },
      password: { required },
    };
  },
  methods: {
    login: function() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      AuthService.signIn(this.email, this.password)
        .then((responseJson) => {
          if (responseJson.status === 200) {
            localStorage.setItem("currentUser", JSON.stringify(responseJson.data));
            AuthService.getUserDetail().then((response) => {
                localStorage.setItem(
                  "currentUserDetails",
                  JSON.stringify(response.data)
                );
                localStorage.setItem(
                  "currentUserRoles",
                  JSON.stringify(response.data.roles)
                );

                  this.$router.push({name:'dashboard'});
                  // AssetPersonnelService.getOrgConfigs(response.data.profile.organizationId,"tableConfigs").then(response=>{
                  //   console.log(response);
                  //   		localStorage.setItem('tableConfigs',response.data.tableConfigs)

                  // }).catch(error=>{

                  // })
              })
              .catch((error) => {

                  console.log(error.error_description);
              });
          }
        })
        .catch((error) => {
           // alert("Wrong Credentials Invalid Username or Password")
          // if (error.response.status === 400) {
          // }
          throw error;
        });
    },
  },
  mounted() {
    localStorage.removeItem("currentUserDetails");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentUserRoles");
    document.title = this.$route.meta.title;
  },

};
</script>
<style lang="scss" scoped>
.grid-wrapper {
  display: grid;
  height: 100vh;
  grid-template-columns:  6fr 4fr;
  font-family: Euclid Circular B;
  line-height: 1.13;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #000000;
  overflow: hidden;
  // column-gap: 80px;
  .col-left {
    background-image: url("../../assets/login.jpg");
    width: 100%;
    // height: 100vh;
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;

  }
  .col-right {
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    padding: 0px 80px;
    .input {
      max-width: 255px;
    }
    .btn {
      display: grid;
      width: 160px;
      height: 40px;
      grid-template-columns: 115px 45px;
      margin-top: 50px;
      cursor: pointer;
      font-family: Euclid Circular B;
      font-size: 10px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.4;
      letter-spacing: normal;
      color: #000000;
      overflow: hidden;
      .btn-text {
        padding: 12px 19px 13px 18px;
        background-color: #979797;
        height: 40px;
        width: 115px;
        transition: all 0.2s;
      }
      .arrow {
        background-color: #000000;
        padding: 9px 19px 12px 18px;
        color: white;
        font-size: 16px;
        height: 40px;
        width: 45px;
        transition: all 0.2s;
      }
    }
    .btn-text:hover {
      background-color: #d8d8d8;
    }
    .btn-text:hover + .arrow {
      background-color: var(--primary);
    }

    img {
      height: 65px;
      // width: 65px;
    }
    .title {
      font-size: 32px;
      font-weight: bold;
      line-height: 1.13;
      padding-top: 42px;
    }
    .sub-title {
      font-size: 16px;
      font-weight: normal;
      padding-top: 10px;
      padding-bottom: 50px;
    }
  }
}
.mt-20 {
  margin-top: 20px;
}
</style>
