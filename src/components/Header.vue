<template>
  <div class="container">
    <div class="navbar shadowBox navbar-fixed-top">
      <div class="grid-container" style="height: inherit">
        <!-- Logo -->
        <div class="">
          <a
            class="navbar-brand"
            href="#"
            @click.prevent="onClickMenu(menus[0])"
          >
            <img
              src="assets/logo.png"
              @click="dashbaordClicked"
              height="38"
              alt="logo"
            />
          </a>
        </div>
        <!-- Menu Content -->
        <div class="alignButtons">
          <div
            v-for="(element, i) in menus"
            :key="i"
            :class="{ onlyLeftBorder: i != 0, buttonDiv: i == 0 }"
            @click="addFocusCss(i)"
          >
            <SNavButton
              v-if="i !== 0"
              v-on:clicked-menu-item="
                (item) => {
                  onClickMenu(element, item);
                }
              "
              id="navbarBtn"
              :title="element.name"
              :dropdownOptions="element.tabs ? element.tabs : []"
              :dropdown="element.tabs ? true : false"
              :class="{ selected: i == selectedIndex }"
            />
          </div>
        </div>
        <!-- Avatar  -->
        <div class="avatar-wrapper">
          <div
            :class="{
              'avatar-border': true,
              'avatar-border-select': showDropdown,
            }"
            id="avatarBorder"
          >
            <img
              src="assets/avatar.png"
              id="avatar-img"
              width="40"
              height="40"
              alt="avatar"
              class="avatar"
              @click="avatarClicked"
            />
          </div>
          <div
            id="avatr-drpdwn"
            :class="{
              'avatar-dropdown': showDropdown,
              'dropdown-hide': showDropdown == false,
            }"
            v-click-outside-el="closeDropdown"
          >
            <div class="user-name">
              <span>{{ userName ? userName : "User Name" }}</span>
            </div>
            <!-- <div class="dropdown-item" @click="profileClicked">
              <img src="assets/user.png" alt="" />
              <span>Profile</span>
            </div> -->
            <div class="dropdown-item" @click="settingsClicked">
              <img src="assets/help.png" alt="" />
              <span>Profile</span>
            </div>
            <div class="dropdown-item" @click="logoutClick">
              <img src="assets/exit.png" alt="" />
              <span class="logout-text">Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SHeader",

  data() {
    return {
      currentUserDetails: "",
      userName: "",
      disableButtonFlag: false,
      selectedIndex: null,
      showNotifications: false,
      showDropdown: false,
      notificationsCount: "",
      search: false,
      menus: [
        {
          id: 0,
          uuid: null,
          name: "dashboard",
          url: "dashboard",
        },
        // {
        // 	id: 1,
        // 	uuid: null,
        // 	name: "Inspection",
        // 	url: "",

        // },
        {
          id: 2,
          uuid: null,
          name: "Inspection",
          url: "",
          tabs: [
            { id: 0, uuid: null, name: "Inspection", route: "inspection" },
            {
              id: 1,
              uuid: null,
              name: "Templates",
              route: "inspection-templates",
            },
            {
              id: 2,
              uuid: null,
              name: "Service Request",
              route: "service-requests",
            },
          ],
        },
        { id: 111, uuid: null, name: "Scheduler", url: "scheduler" },
        {
          id: 3,
          uuid: null,
          name: "Issues",
          url: "issues",
        },
        {
          id: 4,
          uuid: null,
          name: "Work Order",
          url: "work-order",
        },
        // {
        //   id: 5,
        //   uuid: null,
        //   name: "Assets",
        //   url: "assets",
        // },
        {
          id: 5,
          uuid: null,
          name: "Assets",
          url: "",
          
          tabs: [
            {
              id: 0,
              uuid: null,
              name: "Asset",
              route: "assets",
            },
            {
              id: 1,
              uuid: null,
              name: "Asset Category Templates",
              route: "asset-category-templates",
            },
                        {
              id: 2,
              uuid: null,
              name: "Asset Categories",
              route: "asset-category",
            },
          ],
        },
        {
          id: 6,
          uuid: null,
          name: "Usage",
          url: "usage",
        },
        {
          id: 7,
          uuid: null,
          name: "Consumption",
          url: "consumption",
        },
        {
          id: 8,
          uuid: null,
          name: "Reports",
          url: "reports",
        },
        {
          id: 9,
          uuid: null,
          name: "Calendar",
          url: "",
           tabs: [
             { id: 0, uuid: null, name: "Calendar", route: "calendar" }
             ],
        },
        {
          id: 10,
          uuid: null,
          name: "User",
          url: "",
          tabs: [{ id: 0, uuid: null, name: "Wallets", route: "wallets" },{ id: 1, uuid: null, name: "Users", route: "user-management" }],
        },
        // {
        // 	id: 10,
        // 	uuid: null,
        // 	name: "Create",
        // 	tabs: [
        // 		{ id: 0, uuid: null, name: "User", url: "user-management" },
        // 		{ id: 1, uuid: null, name: "User Group", url: "user-management" },
        // 		{ id: 2, uuid: null, name: "Create Asset", url: "create-asset" },
        // 		{ id: 3, uuid: null, name: "Asset Group", url: "assets" },
        // 		{ id: 4, uuid: null, name: "Work Order", url: "create-work-order" },
        // 		{ id: 5, uuid: null, name: "S R", url: "service-requests" },
        // 		{ id: 6, uuid: null, name: "Wallet", url: "create-wallet" },
        // 	],
        // },
      ],
    };
  },

  mounted() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.userName =
      this.currentUserDetails.profile.firstName +
      " " +
      this.currentUserDetails.profile.lastName;
  },

  methods: {
    onClickMenu: function (event, item) {
      //	console.log(index);
      //	console.log(event);
      if (item) {
        event.clickedChild = item;
        this.$router.push({ name: event.url }).catch((error) => {
          if (error.name != "NavigationDuplicated") {
            throw error;
          }
        });
      }
      // console.log(event);
      if (event.tabs !== undefined) {
        for (let index = 0; index < event.tabs.length; index++) {
          if (event.clickedChild === event.tabs[index].route) {
            this.$router
              .push({ name: event.tabs[index].route })
              .catch((error) => {
                if (error.name != "NavigationDuplicated") {
                  throw error;
                }
              });
          }
        }
      }
    },

    addFocusCss(i) {
      this.selectedIndex = i;
    },
    avatarClicked() {
      // console.log("AVATAR IS CLICKED")
      this.showDropdown = !this.showDropdown;
      let dropdown = document.getElementById("avatr-drpdwn");
      // var bell = document.getElementById("bell");

      // console.log(bell.offsetLeft)
      if (this.showDropdown) {
        dropdown.style.display = "grid";
      }
      if (!this.showDropdown) {
        dropdown.style.display = "none";
      }

      this.$emit("avatar-click", true);
    },
    logoutClick() {
      // this.$router.push({
      // 	name: "login",
      // });

      let id_token = JSON.parse(
        localStorage.getItem("currentUserDetails")
      ).id_token;
      localStorage.removeItem("currentUserDetails");
      localStorage.removeItem("isAuthenticated");
      window.location.href =
        "https://" +
        process.env.VUE_APP_DOMAIN +
        ":9443/oidc/logout?id_token_hint=" +
        id_token +
        "&post_logout_redirect_uri=" +
        process.env.VUE_APP_AUTH_REDIRECT_URL;
    },
    profileClicked() {
      this.$router.push({
        name: "user-management",
      });
    },
    settingsClicked() {
      this.$router.push({
        name: "settings",
      });
    },
    dashbaordClicked() {
      this.$router.push({
        name: "dashboard",
      });
    },
    closeDropdown() {
      if (event.target.id === "avatar-img") {
        return;
      } else {
        if (this.showDropdown) {
          let dropdown = document.getElementById("avatr-drpdwn");
          // let border = document.getElementById("avatarBorder");
          this.showDropdown = !this.showDropdown;
          dropdown.style.display = "none";
        }
      }
    },
  },

  props: {},

  components: {},
};
</script>

<style lang="scss" scoped>
#navbarBtn:hover {
  border-bottom: 4px solid var(--primary) !important;
  color: #000000 !important;
}

.selected {
  border-bottom: 4px solid var(--primary) !important;
  outline: none !important;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  position: absolute;
  //    top: 12px;
  // left: 20px;
  opacity: 0.8;
  cursor: pointer;
}
.avatar-border {
  position: relative;
  top: 12px;
  left: 20px;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  border: 2px solid transparent;
  z-index: 1;
}
.avatar-border:hover {
  border: 2px solid var(--primary);
}
.avatar-border-select {
  border: 2px solid var(--primary);
}
.avatar:hover {
  opacity: 1;
}
.search-btn {
  position: relative;
  top: 22px !important;
  left: 34px;
  opacity: 0.8;
  cursor: pointer;
  width: 24px !important;
}
.search-btn:hover {
  opacity: 1;
}
.dropdown-hide {
  display: none;
}
.avatar-dropdown {
  cursor: pointer;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  position: absolute;
  top: 75px;
  left: -62px;
  width: 160px;
  height: 168px;
  background: #ffffff;
  box-shadow: 0 8px 25px 0 var(--very-light-pink);
  -moz-box-shadow: 0 8px 25px 0 var(--very-light-pink);
  -webkit-box-shadow: 0 8px 25px 0 var(--very-light-pink);
  z-index: 1;
  font-family: Euclid Circular B;
  font-size: 14px;
  // line-height: 1;
  // background: #f4f4f4;
  align-items: center;
  .dropdown-item {
    display: grid;
    grid-template-columns: 16px 1fr;
    column-gap: 16px;
    padding: 16px;
    // height: 56px;

    img {
      height: 16px;
      width: 16px;
    }
    .logout-text {
      font-weight: bold;
    }
  }
  .dropdown-item:hover {
    // background: var(--very-light-pink);
    background: #f4f4f4;
  }
  .col-left {
    justify-self: center;
    .header {
      font-size: 16px;
      font-weight: bold;
      line-height: 1;
      letter-spacing: 0.38;
    }
    .icon-grid {
      cursor: pointer;
      display: grid;
      grid-template-columns: 20px 1fr;
      column-gap: 4px;
      font-size: 14px;
      line-height: 1;
      font-weight: bold;
      align-items: center;
      opacity: 0.8;
      transition: 0.2s all;
      .icon {
        width: 20px;
        height: 20px;
      }
    }
    .icon-grid:hover {
      opacity: 1;
    }
    .icon-grid:active {
      color: #979797;
    }
  }

  .separator {
    border-right: solid 1px #e1e1e1;
  }

  .col-right {
    justify-self: center;
    .s-avatar {
      position: relative;
      top: 0px;
    }
    .username {
      font-size: 14;
      line-height: 1;
      font-weight: bold;
    }
    .btn {
      height: 24px;
      // width: 72px;
    }
  }
}

.bellDiv {
  position: inherit;
  text-align-last: end;
}

.bell {
  position: relative;
  top: 14px;
  right: -48px;
  cursor: pointer;
}

.bellFocus {
  background-color: var(--very-light-pink);
  border-radius: 50%;
}

.shadowBox {
  height: 72px;
  box-shadow: 0 0 50px 0 var(--very-light-pink);
  background-color: #ffffff;
}

.alignButtons {
  display: flex;
  justify-content: stretch;
  width: -webkit-fill-available;
  height: inherit;
}

.buttonDiv {
  width: 80px !important;
  max-height: 72px;
  // border-left: 1px solid #e1e1e154;
  border-right: 1px solid #e1e1e154;
}

.onlyLeftBorder {
  width: inherit;
  max-height: 72px;
  border-right: 1px solid #e1e1e154;
}

.grid-container {
  display: grid;
  grid-template-columns: 150px 8fr 100px;
  column-gap: 45px;
}

/* notifications dropdown */
.dropdown-content {
  display: none;
  position: relative;
  background-color: #ffffff;
  box-shadow: 0 0 11px 0 var(--very-light-pink);
  text-align: start;
  margin: -5px;
  margin-top: 13px;
}

.dropdown-content {
  display: block;
  width: 360px;
  position: relative;
  top: 16px;
  right: 190px;
  height: 370px;
  overflow-y: scroll;
}

.dropdown-content::-webkit-scrollbar {
  width: 5px;
}

.dropdown-content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.dropdown-content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #adacac6e;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.377);
}

.dropdown-content li {
  list-style: none;
  padding: 16px;
  cursor: pointer;
}

ul {
  padding-left: 0px;
  margin: 0px;
  text-align-last: left;
  width: -webkit-fill-available;
}

.dropdown-content ul:hover {
  background-color: #f4f4f4;
}
.buttonDiv {
  width: inherit;
  border-bottom: 1px solid #e1e1e154;
}

.onlyBottom {
  width: inherit;
  border-bottom: 1px solid #e1e1e154;
}

.notiLabel {
  margin: 0px;
  text-align-last: start;
  font-size: 16px;
  font-family: Euclid Circular B;
  font-weight: bold;
}

.notiDiv {
  width: -webkit-fill-available;
  display: inline-flex;
  justify-content: space-between;
  padding: 16px;
  padding-bottom: 10px;
}

.notification {
  /* justify-content: space-between; */
  display: inline-flex;
  align-items: center;
  width: -webkit-fill-available;
  justify-content: flex-start;
  margin-top: -12px;
}

.time {
  margin: 0px;
  margin-left: 46px;
  margin-top: -2px;
  position: relative;
  bottom: 10px;
  float: left;
  font-weight: bold;
  font-family: Euclid Circular B;
  font-size: 10px;
  color: #979797;
}

.more {
  margin-right: 17px;
  align-self: flex-start;
  margin-top: 14px;
  cursor: pointer;
}

.notiBadge {
  z-index: 99;
  position: relative;
  bottom: 15px;
  left: 86px;
  padding: 4px !important;
  font-weight: bold !important;
  font-size: 12px !important;
  padding-left: 5px !important;
  padding-right: 3px !important;
}
.mtb-8 {
  margin-top: 8px;
  margin-bottom: 8px;
}
.mb-8 {
  margin-bottom: 8px;
}
.search-custom-icon {
  .dropdown-content {
    margin-top: 0;
  }
}
.user-name {
  text-align: center;
  padding: 5px;
  font-size: 14px;
  border-bottom: 2px solid #d8d8d8;
  color: #b7b2b2;
}
li.onlyBottom.dropdownLabel {
    white-space: nowrap;
}
</style>