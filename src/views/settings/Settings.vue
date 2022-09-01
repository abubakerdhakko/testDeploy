<template>
    <div class="pt-32">
        <div>
            <div class="head-title">Settings</div>
        <div class="subtitle pt-8">Manage your profile settings below</div>
        </div>
        <div class="page-content">
            <SToggle
                v-model="selectedTab"
                :options="options"
                :tabs="true"
                :background="'#ffffff'"
                @selected="selectedTabFunc"
            />
            <div v-if="selectedTab == 'profile'" v-margin-top="32">
                <Profile/>
            </div>

            <div v-if="selectedTab == 'rolesPermissions'" v-margin-top="32">
                <Roles/>
            </div>
        </div>

    </div>
</template>

<script>
import Roles from "./components/Roles"
import Profile from "./Profile.vue"
export default {
    name: "Settings",

    components: {
        Roles,
        Profile,
    },

    data() {
        return {
            selectedTab: "profile",
            buttonTitle: "Location",
            options: [
                {
                    label: "Profile",
                    value: "profile",
                },
                {
                    label: "Roles & Permissions",
                    value: "rolesPermissions",
                },
            ],
            items: [1,2,3,4,5,6,7,8,9],
            nextNum: 10,
            roles:[
                {
                    center: [],
                    displayName: "Admin",
                    iconUrl: null,
                    id: 131,
                    name: "ROLE_ADMIN",
                    organizationUUID: "TEST-ORG",
                },
                {
                    center: [],
                    displayName: "test",
                    iconUrl: null,
                    id: 131,
                    name: "WORKORDERS_UPDATE_WEB",
                    organizationUUID: "TEST-ORG",
                },
            ]
        };
    },

    methods: {
        selectedTabFunc(value) {
            // console.log("Selected Tab : ",value.value)
        },
        
    },

    created() {
         document.title = this.$route.meta.title;
    },

    validations: function() {
        return {

        };
    },

    computed: {

    }

};
</script>

<style lang="scss" scoped>
.page-content{
    
    margin-top: 40px;
}

</style>