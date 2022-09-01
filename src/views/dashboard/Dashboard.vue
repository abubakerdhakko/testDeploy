<template>
  <div>
    <div class="center-content">
      <img src="https://erohal.io/wp-content/uploads/2019/10/logoMain.png" alt="">
    </div>
  </div>
</template>


<script>


import assetPersonnelService from "../../services/AssetPersonnelService";
export default {
  data () {
    return {};
  },
  created() {
       document.title = this.$route.meta.title;
     let currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );

    let uuid = currentUserDetails.profile.organizationId;

    assetPersonnelService.getOrgConfigs(uuid,'tableConfigs')
    .then((response) => {
     //  console.log(response.data.dropDownConfigs)
        localStorage.setItem("dropDownConfigs", response.data.dropDownConfigs);
    }).catch((e=>{
        console.log(e)
    }))
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.center-content {
  // padding-top: 100px;
  width: 100%;
}
img {
  display: block;
  margin: 100px auto;
  text-align: center;
}
</style>
