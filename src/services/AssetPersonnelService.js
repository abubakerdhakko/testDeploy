import axios from 'axios';
import EndPoints from './EndPoints';

export const AssetPersonnelService = {

    async saveUserToken(body) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/tokens';
        try {
            return await axios.post(url, JSON.stringify(body))
                .then((responseJson) => {
                    if (responseJson.data.responseCode === '200') {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => { throw error });
        } catch (e) {
            // debugger;
            throw e
        }
    },

    async deleteUserToken(useruuid) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/tokens?useruuid=' + useruuid + "&clienttype=web";
        try {
            return await axios.delete(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e
        }
    },

    async getOrgConfigs(tenantuuid, configType) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/orgConfig?orgUUID=' + tenantuuid + '&configType=' + configType;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        // console.log('sssssssssssssss',responseJson)
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },

    async getAllUsers(tenantuuid) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users/all?tenantuuid=' + tenantuuid;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },

    async getUserNameAndUUID(tenantuuid) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users/name?tenantUUID=' + tenantuuid;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },




    async getPaginatedUsersForSDT(requestObject) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users/sdt';
        try {
            return await axios.post(url, requestObject)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },

    async getAllUsersManagement(offset, limit, tenantuuid) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users?offset=' + offset + '&limit=' + limit + '&tenantuuid=' + tenantuuid;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async getNameOfUsersByUUIDS(uuids) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users/issues/tableview';
        try {
            return await axios.post(url, uuids)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async getAssignedUsersOfAsset(assetuuid) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/assignments?assetuuid=' + assetuuid;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async deletePostAssignmentByUUID(uuid) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/post/assignment?uuid=' + uuid;
        try {
            return await axios.delete(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async unassignAsset(DeleteAssignmentRecordRequest) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/assignments';
        try {
            return await axios.put(url, DeleteAssignmentRecordRequest)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async getUserDetailByAssetIdAndUserId(assetuuid, useruuid) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/assignments/user?assetuuid=' + assetuuid + '&useruuid=' + useruuid;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },
    async addAssignmentRecord(addAssignmentRecordRequest) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/assignments';
        try {
            return await axios.post(url, addAssignmentRecordRequest)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async sendNotificationToAssignedUsers(addAssignmentRecordRequest) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/notifications/assignment';
        try {
            return await axios.post(url, addAssignmentRecordRequest)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async editAssignmentRecord(addAssignmentRecordRequest) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/assignment';
        try {
            return await axios.put(url, addAssignmentRecordRequest)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async getAssignmentHistoryByAsset(assetuuid, offset, limit) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/assignments/history?assetuuid=' + assetuuid + '&offset=' + offset + '&limit=' + limit;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async getUser(uuid) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users?id=' + uuid;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async getRole(roleName, orgId) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/roles?name=' + roleName + '&organizationUUID=' + orgId;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async createRole(createRoleRequest) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/roles';
        try {
            return await axios.post(url, createRoleRequest)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async createCompany(company) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/register';
        try {
            return await axios.post(url, company)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async createCurrency(body) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/company/currency';
        try {
            return await axios.post(url, JSON.stringify(body))
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async deleteCompany(uuid) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/company?id=' + uuid;
        try {
            return await axios.delete(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },

    async getAssignmentCount(assetNumber) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/assignments/count?assetUUID=' + assetNumber;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async getCompany(uuid) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/company?id=' + uuid;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async getCompanyCurrency(uuid) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/company/currency?tenantuuid=' + uuid;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {

            throw e;
        }
    },

    async updateUser(body) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users';
        try {

            return await axios.put(url, JSON.stringify(body))
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            console.error(JSON.stringify(e));
            throw e;
        }
    },

    async updateCompany(body) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/company';
        // console.log(body)
        try {

            return await axios.put(url, JSON.stringify(body))
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            console.error(JSON.stringify(e));
            throw e;
        }
    },

    async createUser(body) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users';
        try {

            return await axios.post(url, JSON.stringify(body))
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            console.error(JSON.stringify(e));
            throw e;
        }
    },

    async createGroup(body) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users/group';
        try {
            return await axios.post(url, JSON.stringify(body))
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            console.error(JSON.stringify(e));
            throw e;
        }
    },
    async updateGroup(body) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users/groups';
        try {
            return await axios.put(url, JSON.stringify(body))
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            console.error(JSON.stringify(e));
            throw e;
        }
    },

    async getUserGroupNameAndUUID(tenantUUID, offset, limit) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users/group/page';
        const params = {
            tenantuuid: tenantUUID,
            offset: offset,
            limit: limit
        };
        try {
            return await axios.get(url, { params: params }).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedUserGroupsForSDT(requestObj) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/groups/sdt';

        try {
            return await axios.post(url, requestObj).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },
    async getPaginatedNotifications(useruuid, offset, limit) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/notifications';
        const params = {
            useruuid: useruuid,
            offset: offset,
            limit: limit
        };
        try {
            return await axios.get(url, { params: params }).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async getAllUserGroup(tenantUUID) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users/group';
        const params = {
            tenantuuid: tenantUUID,
        };
        try {
            return await axios.get(url, { params: params }).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async getUserAssetsByUserUuid(uuid) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/assets/user';
        const params = {
            uuid: uuid,
        };
        try {
            return await axios.get(url, { params: params }).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },
    async getUserGroupAssetsByUserGroupUuid(uuid) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/assets/user-group';
        const params = {
            uuid: uuid,
        };
        try {
            return await axios.get(url, { params: params }).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async checkAssignmentOfAnAssetByUUID(uuid) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/asset/assignment?uuid=' + uuid;
        // const params = {
        //     uuid: uuid,
        // };
        try {
            return await axios.get(url).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async getUserGroupByUUID(groupUUID) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users/group';
        const params = {
            uuid: groupUUID,
        };
        try {
            return await axios.get(url, { params: params }).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async addUsersToGroup(groupUUID, userUUIDs) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users/group';
        const body = {
            groupUUID: groupUUID,
            userUUIDs: userUUIDs,
        };
        try {
            return await axios.put(url, JSON.stringify(body)).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async deleteUsersFromGroup(groupUUID, userUUIDs) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users/groups';
        const body = {
            groupUUID: groupUUID,
            userUUIDs: userUUIDs,
        };
        try {
            return await axios.post(url, JSON.stringify(body)).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async getAllRoles(organizationUUID) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/roles/all?organizationUUID=' + organizationUUID;
        try {
            return await axios.get(url).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },
    async saveAllRoles(roles) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/roles/update/all';
        try {
            return await axios.post(url, roles).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },
    async deleteRole(roleName, organizationUUID) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/roles?name=' + roleName + '&organizationUUID=' + organizationUUID;
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

    async createIssueNotifciation(assetuuid, issueNumber) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/issues/notifications?assetuuid=' + assetuuid + '&issueNumber=' + issueNumber;
        try {
            return await axios.post(url).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async copyParentOrgConfigsToCustomerOrgConfigs(parentOrgUUID, customerOrgUUID) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/orgConfig/targetOrgConfig?parentOrgUUID=' + parentOrgUUID + '&targetOrgUUID=' + customerOrgUUID;
        try {
            return await axios.post(url).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async updateOrgConfig(request) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/orgConfig'
        try {
            return await axios.put(url, request)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },

    async markAllNotificationAsRead(userUUID) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/notifications/mark';
        const params = {
            useruuid: userUUID,
        };
        try {
            return await axios.get(url, { params: params }).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async markNotificationAsRead(notificationUUID) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/notifications/mark';
        const params = {
            uuid: notificationUUID,
        };
        try {
            return await axios.get(url, { params: params }).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async updatePreferencesNotifcation(request) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users/preferences'
        try {
            return await axios.put(url, request)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },

    async addPostAssignmentOrUnAssignment(request) {
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/post/assignment'
        try {
            return await axios.post(url, request)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },

    async getUsersNameAndUUIDByTenantUUID(tenantUUID) {
        const params = {
            tenantUUID: tenantUUID
        }
        const url = EndPoints.assetPersonnelService.assetPersonnel + '/users'
        try {
            return await axios.get(url, { params: params })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    }
};

export default AssetPersonnelService