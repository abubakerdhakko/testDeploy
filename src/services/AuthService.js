import axios from 'axios';
import EndPoints from './EndPoints';

export const AuthService = {

    async signIn(email, password) {
        const url = EndPoints.authService.auth + '/oauth/token?grant_type=password&scope=webclient&username=' + email + '&password=' + password;
        
        try {
            return await axios.post(url, null)
                .then((responseJson) => {

                    if (responseJson.status === 200) {
                        return responseJson;
                    }
                    else {
                        return null;
                    }
                })
                .catch((error) => { return error });
        }
        catch (e) {
            return e;
        }

    },

    async getUserDetail() {
        
        const url = EndPoints.authService.auth + "/user";
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => console.error(error));
        }
        catch (e) {
            console.error(e);
        }
    },

    async saveAllRoles(roles) {
        let currentUser = JSON.parse(localStorage.getItem('currentUserDetails'));
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.access_token
        };
        const url = EndPoints.authService.auth + "/role/bulk";
        try {
            return await axios.put(url, roles, { headers: headers })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => console.error(error));
        }
        catch (e) {
            console.error(e);
        }
    },

    async deleteRole(roleName, organizationUUID) {
        const url = EndPoints.authService.auth + '/roles?name=' + roleName + '&organizationUUID=' + organizationUUID;
        try {
            return await axios.delete(url).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async verifyPassword(password) {
        let currentUser = JSON.parse(localStorage.getItem('currentUserDetails'));

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.access_token
        };
        let username = JSON.parse(localStorage.getItem('currentUserDetails')).user.username;
        const url = EndPoints.authService.auth + "/users/verify";
        try {
            return await axios.put(url, { userName: username, password: password }, { headers: headers })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => console.error(error));
        }
        catch (e) {
            console.error(e);
        }
    },

    async signOut() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserDetails');
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("themeConfigs");
        // firebase.messaging().deleteToken(localStorage.getItem("fbToken"));
    },

    async updatePassword(newPassword) {
        let currentUser = JSON.parse(localStorage.getItem('currentUserDetails'));
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.access_token
        };
        const url = EndPoints.authService.auth + "/users/password";
        try {
            return await axios.put(url, newPassword, { headers: headers })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => console.error(error));
        }
        catch (e) {
            console.error(e);
        }
    },

    async updateOtherUsersPassword(updateUserPassword) {
        let currentUser = JSON.parse(localStorage.getItem('currentUserDetails'));

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.access_token
        };
        const url = EndPoints.authService.auth + "/users/password/update";
        try {
            return await axios.put(url, updateUserPassword, { headers: headers })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error; });
        }
        catch (e) {
            throw e;
        }
    },

    async getOrganizationUsers(organizationId) {
        let currentUser = JSON.parse(localStorage.getItem('currentUserDetails'));

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.access_token
        };
        const url = EndPoints.authService.auth + "/users?organizationId=" + organizationId;
        try {
            return await axios.get(url, { headers: headers })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error; });
        }
        catch (e) {
            throw e;
        }
    },

    async updatePreferences(preferences) {
        const url = EndPoints.authService.auth + '/users/preferences';
        try {
            let currentUserDetails = JSON.parse(localStorage.getItem("currentUserDetails"));

            let request = {
                'preferences': preferences,
                'userUUID': currentUserDetails.profile.userid
            }

            return await axios.put(url, JSON.stringify(request))
                .then((responseJson) => {
                    // console.log("CHECK",responseJson)
                    if (responseJson.data.responseCode === '200') {
                        return responseJson;
                    }
                    else {
                        return null;
                    }

                })
                .catch((error) => console.error(error));
        } catch (e) {
            // debugger;
            console.error(e);
        }
    },

    async getUserImagesByUserUUIDs(userUUIDs) {
        const url = EndPoints.authService.auth + '/users/images';
        let body = {
            userUUIDs: userUUIDs
        };
        try {
            return await axios.post(url, JSON.stringify(body)).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            })
        } catch (e) {
            throw e;
        }
    },

    async getAllRoles(orgUUID) {
        const url = EndPoints.authService.auth + '/role/org?organizationUUID=' + orgUUID;

        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                }).catch((error) => { throw error })
        } catch (e) {
            throw e;
        }
    },

    async createUser(createUserRequest) {

        const url = EndPoints.authService.auth + '/register/user';

        try {
            return await axios.post(url, createUserRequest)
                .then((responseJson) => {
                    return responseJson;
                }).catch((error) => { throw error })
        } catch (e) {
            throw e;
        }

    },

    async getRolesByUserNameAndOrganizationId(userName, organizationId) {

        const url = EndPoints.authService.auth + '/register/user/roles?userName=' + userName + '&organizationId=' + organizationId;

        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                }).catch((error) => { throw error })
        } catch (e) {
            throw e;
        }
    },

    async updateUser(updateUserRequest) {

        const url = EndPoints.authService.auth + '/register/user';

        try {
            return await axios.put(url, updateUserRequest)
                .then((responseJson) => {
                    return responseJson;
                }).catch((error) => { throw error })
        } catch (e) {
            throw e;
        }

    },

    async getRole(name, organizationUuid) {

        const url = EndPoints.authService.auth + '/role/one?name=' + name + '&organizationUuid=' + organizationUuid;

        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                }).catch((error) => { throw error })
        } catch (e) {
            throw e;
        }
    },

    async createRole(createRoleRequest) {
        let currentUser = JSON.parse(localStorage.getItem('currentUserDetails'));
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentUser.access_token
        };
        const url = EndPoints.authService.auth + '/role';
        try {
            return await axios.post(url, createRoleRequest, { headers: headers })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async deleteUser(email, organizationUUID) {

        const url = EndPoints.authService.auth + '/register/user?email=' + email + '&organizationuuid=' + organizationUUID;

        try {
            return await axios.delete(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error })
        } catch (e) {
            throw e;
        }
    },

    async getWso2ISToken(code,redirectUrl){        

        let data = {
            grant_type: "authorization_code",
            code:code,
            redirect_uri:redirectUrl            
        }
        
        const url='https://'+process.env.VUE_APP_DOMAIN+':9443/oauth2/token';
        try {
            return await axios.post(url,data)
            .then((response)=>{
                return response;
            }).catch((error)=>{
                throw error;
            });
        }catch (e) {
            throw e;
        }
    },  

};

export default AuthService;

