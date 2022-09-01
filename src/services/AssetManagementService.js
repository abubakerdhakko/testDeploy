import axios from 'axios';
import EndPoints from './EndPoints';

export const AssetManagementService = {


    async getPaginatedAssets(offset, limit, tenantuuid) {

        const url = EndPoints.assetManagementService.assetManagement + '/assets?offset=' + offset + '&limit=' + limit + '&tenantuuid=' + tenantuuid;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    // console.log('getPaginatedAssets 1',responseJson)
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedAssetsForSDT(requestObj) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/sdt';

        try {
            return await axios.post(url, requestObj)
                .then((responseJson) => {
                    // console.log('getPaginatedAssets 2',responseJson)
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedUsagesForSDT(requestObj) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/usages/sdt';
        try {
            return await axios.post(url, requestObj)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedConsumptionsForSDT(requestObj) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/consumptions/sdt';
        try {
            return await axios.post(url, requestObj)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedAssetsGroupForSDT(requestObj) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/assets/group/sdt';
        try {
            return await axios.post(url, requestObj)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getNameAndTypeOfAssetsByUUIDS(uuids) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/inspections/listview';
        try {
            return await axios.post(url, uuids)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async downloadSelectedPDF(obj) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/multiple';
        try {
            return await axios.post(url, obj)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getAssetsNameByUUIDS(uuids) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/inspections/assetName';
        try {
            return await axios.post(url, uuids)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },
    async getAssetNameAndNumberByTenantUUID(tenantUUID) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/name?tenantUUID=' + tenantUUID;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },
    async getNameAndUUIDOfAssetByTenantUUID(tenantUUID) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets';
        const params = {
            tenantuuid: tenantUUID
        };
        try {
            return await axios.get(url, {
                params: params
            })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getAllAssetCategories(tenantuuid) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/categories?tenantuuid=' + tenantuuid;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getCategoriesList(tenantUUID) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/categories/list?tenantUUID=' + tenantUUID;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                }).catch((error) => {
                    throw error;
                });
        } catch (e) {
            throw e;
        }

    },

    async getAssetGroupsAndAssetsByCategoryUUID(categoryUUID, tenantUUID) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/categories/asset/asset-group';
        const params = {
            categoryUUID: categoryUUID,
            tenantUUID: tenantUUID
        }
        try {
            return await axios.get(url, {
                params: params
            })
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async uploadFileTos3(files) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/files';
        let formData = new FormData();
        formData.append('file', files);
        try {
            return await axios.post(url, formData)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async addAsset(asset) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets';
        try {
            return await axios.post(url, JSON.stringify(asset), null)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async editAsset(asset) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets';
        try {
            return await axios.put(url, JSON.stringify(asset), null)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async deleteAssetImage(id) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/image';
        const params = {
            id: id
        }
        try {
            return await axios.delete(url, {
                params: params
            })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },
    async deleteAssetAttachment(id) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/attachment';
        const params = {
            id: id
        }
        try {
            return await axios.delete(url, {
                params: params
            })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async deleteConsumptionImage(id) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/consumption/image';
        const params = {
            id: id
        }
        try {
            return await axios.delete(url, {
                params: params
            })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async addCategory(category) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/categories';
        try {
            return await axios.post(url, JSON.stringify(category), null)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    }
                })
                .catch(({
                    response
                }) => {
                    throw response
                });
        } catch (e) {
            throw e;
        }
    },

    async editCategory(category) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/categories';
        try {
            return await axios.put(url, JSON.stringify(category), null)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch(({
                    response
                }) => {
                    throw response
                });
        } catch (e) {
            throw e;
        }
    },

    async getCategory(uuid) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/categories?id=' + uuid;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getAllAssets(tenantuuid) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/basicinfo?tenantuuid=' + tenantuuid;

        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getAsset(uuid) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets?id=' + uuid;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedAssetGroupsForSDT(requestObject) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/assets/group/sdt';
        try {
            return await axios.post(url, requestObject)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getAssetImagesByUuid(assetUUID) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/images?uuid=' + assetUUID;
        try {
            return await axios.get(url)
                .then(responseJson => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getAssetWithDetails(assetUUID, assetFields, assetCategory, assetImages, attachment, activityWall, usages, consumptions) {
        let body = {
            uuid: assetUUID,
            assetFields: assetFields,
            category: assetCategory,
            assetImages: assetImages,
            attachments: attachment,
            activityWall: activityWall,
            usages: usages,
            consumptions: consumptions
        };

        const url = EndPoints.assetManagementService.assetManagement + '/assets/detail';

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

    async getConsumptionsByAsset(uuid, offset, limit) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/consumption?uuid=' + uuid + '&offset=' + offset + '&limit=' + limit;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getUsagesByAsset(uuid, offset, limit) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/usages?assetuuid=' + uuid + '&offset=' + offset + '&limit=' + limit;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedUsages(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/usages/filter';
        try {
            return await axios.post(url, request)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getUsageById(id) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/usages?id=' + id;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedConsumptions(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/consumption/filter';
        try {
            return await axios.post(url, request)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getConsumptionById(id) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/consumption?id=' + id;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async addConsumption(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/consumption';
        try {
            return await axios.post(url, request)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async editConsumption(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/consumption';
        try {
            return await axios.put(url, request)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },
    async addNewMessage(body) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/activitywall/messages';
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

    async addReplyToMessage(body) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/activitywall/reply';

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

    async removeFileFromS3(fileName) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/files';
        let params = {
            filename: fileName
        };
        try {
            return await axios.delete(url, {
                params: params
            })
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },
    async getPaginatedWalletForSDT(requestObject) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/wallet/sdt';
        try {
            return await axios.post(url, requestObject)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },
    async updateAssetFields(assetFields) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/fields';

        try {
            return await axios.put(url, assetFields)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getAssetFields(assetUUIDs) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/fields';

        try {
            return await axios.post(url, assetUUIDs)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null
                    }

                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async generateCodes(type, quantity) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/codes?type=' + type + '&quantity=' + quantity;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getFieldTemplateByUUID(id) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/fieldtemplate?id=' + id;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedInventoryAsset(assetUUID, offset, limit) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/inventory/asset?assetUUID=' + assetUUID + '&offset=' + offset + '&limit=' + limit;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedReceivings(orgUUID, offset, limit, isReceived) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/receiving/inventory/asset?tenantUUID=' + orgUUID + '&offset=' + offset + '&limit=' + limit + '&isReceived=' + isReceived;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedReceivingOrderItems(orgUUID, offset, limit) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/receiving/inventory/asset/items?tenantUUID=' + orgUUID + '&offset=' + offset + '&limit=' + limit;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getReceivingDetail(receivingNumber) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/receiving/inventory/asset/number?receivingNumber=' + receivingNumber;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async markInventoryAssetsForAssignment(articleNumber) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/inventory/asset/mark?articleNumber=' + articleNumber;
        try {
            return await axios.put(url)
                .then((responseJson) => {
                    return responseJson
                })
                .catch(error => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    // async updateInventoryAssetsLocation(requestObject) {
    //     const url = EndPoints.assetManagementService.assetManagement + '/inventory/asset/locationr';
    //     try {
    //         return await axios.put(url, requestObject)
    //             .then((responseJson) => {
    //                 return responseJson
    //             })
    //             .catch(error => { throw error });
    //     } catch (e) {
    //         throw e;
    //     }
    // },

    async updateReceiving(receivingNumber) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/receiving/inventory/asset?receivingNumber=' + receivingNumber;
        try {
            return await axios.put(url)
                .then((responseJson) => {
                    return responseJson
                })
                .catch(error => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getInventoryAssetCountByLocation(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/inventory/asset/location/count';
        try {
            return await axios.post(url, request)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getInventoryAssetIotData(token) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/inventory/asset/iot';
        try {
            return await axios.get(url, {
                cancelToken: token
            })
                .then((responseJson) => {
                    return responseJson
                })
                .catch(error => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },

    async deleteInventoryAssetByArticleNumber(articleNumber) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/asset?articleNumber=' + articleNumber;

        try {
            return await axios.delete(url)
                .then((responseJson) => {
                    return responseJson
                })
                .catch(error => {
                    throw error
                })
        } catch (e) {
            throw e
        }
    },

    async addAndAssignInventoryAssets(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/inventory/asset/addAssign';

        try {
            return await axios.post(url, request)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch(error => {
                    throw error
                })
        } catch (e) {
            throw e
        }
    },

    async deleteMarkInventoryItems(articleNumber) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/inventory/asset/mark?articleNumber=' + articleNumber;

        try {
            return await axios.delete(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch(error => {
                    throw error
                })
        } catch (e) {
            throw e
        }
    },

    // async updateInventoryAssetsLocation(request) {
    //     const url = EndPoints.assetManagementService.assetManagement + '/assets/inventory/asset/location';
    //     try {
    //         return await axios.put(url, request)
    //             .then((responseJson) => {
    //                 return responseJson;
    //             })
    //             .catch(error => { throw error });
    //     } catch (e) {
    //         throw e
    //     }
    // },

    async getPaginatedBulkOrSingleAssets(request, tenantuuid, offset, limit, isBulk) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/bulk?tenantuuid=' + tenantuuid + '&offset=' + offset + '&limit=' + limit + '&isBulk=' + isBulk;
        try {
            return await axios.put(url, request)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e
        }
    },

    async getPaginatedCodesDataForSDT(request, nameCode) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/inventory/definition/sdt?nameCode=' + nameCode;
        try {
            return await axios.post(url, request)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedCodes(tenantUUID, offset, limit, nameCode) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/inventory/definition?tenantuuid=' + tenantUUID + '&offset=' + offset + '&limit=' + limit + '&nameCode=' + nameCode;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async addInventoryItemDefinition(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/inventory/definition';
        try {
            return await axios.post(url, request)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getAllOptionsForAssetCodeCreation(nameCodes, tenantUUID, type) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/inventory/definition/options?nameCode=' + nameCodes + '&tenantUuid=' + tenantUUID + '&type=' + type;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getFieldsValues(assetCode) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/inventory/definition/values?inventoryItemCode=' + assetCode;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async updateGenericFieldValue(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/inventory/definition';
        try {
            return await axios.put(url, request)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedInventoryAssetsForSDT(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/inventory/assets/sdt'
        try {
            return await axios.post(url, request)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },

    async getLinenAgingStatus(organizationId) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/aging/status?orgId=' + organizationId;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },
    async createWallet(walletObj) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/wallets'
        try {
            return await axios.post(url, walletObj)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },
    async GetWalletByWalletUUID(walletUUID) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/wallet/get/wallet?walletUUID=' + walletUUID;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },
    async editWallet(walletObj) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/wallets'
        try {
            return await axios.put(url, walletObj)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },
    async archiveOrDeleteWalletByUUID(uuid, types) {
        let params = {
            uuid: uuid,
            type: types
        }
        const url = EndPoints.assetManagementService.assetManagement + '/assets/wallet/archive-delete'
        try {

            return await axios.delete(url, {
                params: params
            })
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },
    async addAssetGroup(assetObj) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/assets/group'
        try {
            return await axios.post(url, assetObj)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },
    async editAssetGroup(assetObj) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/assets/group'
        try {
            return await axios.put(url, assetObj)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },
    async archiveAssetGroup(uuid, types) {
        let params = {
            id: uuid,
            type: types
        }
        const url = EndPoints.assetManagementService.assetManagement + '/assets/assets/group'
        try {

            return await axios.delete(url, {
                params: params
            })
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },
    async deleteAssetGroup(uuid, types) {
        let params = {
            id: uuid,
            type: types
        }
        const url = EndPoints.assetManagementService.assetManagement + '/assets/assets/group'
        try {

            return await axios.delete(url, {
                params: params
            })
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },
    async getPaginatedAssetGroups(tenantUUID, offset, limit) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/assets/group/filter';
        const body = {
            tenantUUID: tenantUUID,
            offset: offset,
            limit: limit
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
    /*async getAssetGroup(groupUUID) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/assets/group';
        const params = {
            uuid: groupUUID
        };
        try {
            return await axios.get(url, { params: params })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },*/

    async getAssetGroup(groupuuid) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/assets/group?uuid=' + groupuuid;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },
    async archiveOrDeleteAsset(uuid, types) {
        let params = {
            uuid: uuid,
            type: types
        }
        const url = EndPoints.assetManagementService.assetManagement + '/assets/archive-delete'
        try {

            return await axios.delete(url, {
                params: params
            })
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },

    async restoreArchivedAsset(uuid, types) {

        const url = EndPoints.assetManagementService.assetManagement + '/assets/restore?uuid=' + uuid + "&type=" + types
        try {

            return await axios.put(url)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },

    async getAssetNameAndNumberAndCategoryByAssetUUID(uuid) {
        let params = {
            uuid: uuid
        }
        const url = EndPoints.assetManagementService.assetManagement + '/assets/detail'
        try {

            return await axios.get(url, {
                params: params
            })
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },


    async getAssetGroupsNameAndUUIDByTenantUUID(tenantUUID) {
        let params = {
            tenantUUID: tenantUUID
        }
        const url = EndPoints.assetManagementService.assetManagement + '/assets/group'
        try {
            return await axios.get(url, {
                params: params
            })
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },

    async getAssetsNameAndUUIDByTenantUUID(tenantUUID) {
        let params = {
            tenantUUID: tenantUUID
        }
        const url = EndPoints.assetManagementService.assetManagement + '/assets/name'
        try {
            return await axios.get(url, {
                params: params
            })
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },

    async exportExcelFile(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/export/excel'
        try {
            return await axios.post(url, request)
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },

    async importExcelFile(files, category) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/import/excel';
        let formData = new FormData();
        formData.append('file', files);
        const params = {
            category: category
        }
        try {
            return await axios.post(url, formData, {
                params: params
            })
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async exportAssetDetails(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/export/details'
        try {
            return await axios.post(url, request)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getCategoriesFieldsListByTenantUUID(tenantUUID) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/categories/fields?uuid=' + tenantUUID;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch(error => {
                    throw error;
                })
        } catch (e) {
            throw e;
        }
    },

    async getImportTemplateListByUserUUIDAndTenantUUID(userUUID, tenantUUID) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/import/templates?userUUID=' + userUUID + '&tenantUUID=' + tenantUUID
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch(error => {
                    throw error;
                })
        } catch (e) {
            throw e;
        }
    },

    async addImportTemplate(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/import/template'
        try {
            return await axios.post(url, request)
                .then(responseJson => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch(error => {
                    throw error;
                })
        } catch (e) {
            throw e;
        }
    },

    async downloadAssetImportTemplate(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/download/template'
        try {
            return await axios.post(url, request)
                .then(responseJson => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch(error => {
                    throw error;
                })
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedAssetImportTemplatesForSDT(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/import/templates'
        try {
            return await axios.post(url, request)
                .then(responseJson => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch(error => {
                    throw error;
                })
        } catch (e) {
            throw e;
        }
    },

    async importBulkAssetByCSV(files, request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/import/csv';
        let formData = new FormData();
        formData.append('file', files);
        const params = {
            tenantUUID: request.tenantUUID,
            userUUID: request.userUUID,
            userName: request.userName,
            importType: request.importType
        }
        try {
            return await axios.post(url, formData, {
                params: params
            })
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }

                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async downloadFailureImports(importUUID) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/download/failures?importUUID=' + importUUID;
        try {
            return await axios.get(url)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch(error => {
                    throw error;
                })
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedLastAssetImportsForSDT(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/import/last'
        try {
            return await axios.post(url, request)
                .then(responseJson => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch(error => {
                    throw error;
                })
        } catch (e) {
            throw e;
        }
    },

    async exportAssetsInBulk(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/export/detail'
        try {
            return await axios.post(url, request)
                .then(responseJson => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch(error => {
                    throw error;
                })
        } catch (e) {
            throw e;
        }
    },
    async addUsages(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/usages'
        try {
            return await axios.post(url, request)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },
    async editUsages(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/usages'
        try {
            return await axios.put(url, request)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getFile(file) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/files'
        const params = {
            url: file
        }
        try {
            return await axios.get(url, {
                params: params
            })
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    async getTransaction(walletUUID, offset, limit) {
        const params = {
            walletUUID: walletUUID,
            offset: offset,
            limit: limit
        };
        const url = EndPoints.assetManagementService.assetManagement + '/assets/wallet/transaction';
        try {
            return await axios.get(url, {
                params: params
            }).then((responseJson) => {
                if (responseJson.status === 200) {
                    return responseJson;
                } else {
                    return null;
                }
            }).catch((error) => {
                throw error
            });
        } catch (e) {
            throw e;
        }
    },
    // ********* category template start ************ //

    async getPaginatedAssetCateTemplate(requestObj) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/category/templates/sdt';
        try {
            return await axios.post(url, requestObj)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },
    async addCategoryTemplate(asset) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/category/templates';
        try {
            return await axios.post(url, JSON.stringify(asset))
                .then((responseJson) => {
                    if (responseJson.status === 200) {

                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },
    // edit get data
    async getAssetCateTemplate(uuid) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/category/templates?uuid=' + uuid;
        try {
            return await axios.get(url).then((responseJson) => {
                if (responseJson.status === 200) {
                    return responseJson;
                } else {
                    return null;
                }
            }).catch((error) => {
                throw error
            });
        } catch (e) {
            throw e;
        }
    },
    async editAssetCateTemplate(request) {
        const url = EndPoints.assetManagementService.assetManagement + '/assets/categories/templates'
        try {
            return await axios.put(url, JSON.stringify(request))
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    } else {
                        return null;
                    }
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },
    // 

    async archiveOrDeleteAssetCateTemplate(uuid,types) {
        let params = {
            uuid: uuid,
            type: types
        }
        const url = EndPoints.assetManagementService.assetManagement + '/assets/category/template/archive-delete'
        try {

            return await axios.delete(url, {
                params: params
            })
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },

    async DeleteArchivedAssetCateTemplate(uuid,types) {
        let params = {
            uuid: uuid,
            type: types
        }
        const url = EndPoints.assetManagementService.assetManagement + '/assets/categories'
        try {

            return await axios.delete(url, {
                params: params
            })
                .then((responseJson) => {
                    return responseJson
                })
                .catch((error) => {
                    throw error
                })
        } catch (e) {
            throw e;
        }
    },
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Asset catagories %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5


async getPaginatedAssetCate(requestObj) {
    const url = EndPoints.assetManagementService.assetManagement + '/assets/category/sdt';
    try {
        return await axios.post(url, requestObj)
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                throw error
            });
    } catch (e) {
        throw e;
    }
},

async addAssetsCategory(Cate) {
    const url = EndPoints.assetManagementService.assetManagement + '/assets/category';
    try {
        return await axios.post(url, JSON.stringify(Cate))
            .then((responseJson) => {
                if (responseJson.status === 200) {

                    return responseJson;
                } else {
                    return null;
                }
            })
            .catch((error) => {
                throw error
            });
    } catch (e) {
        throw e;
    }
},
async getAssetCate(id) {
    const url = EndPoints.assetManagementService.assetManagement + '/assets/categories?id=' + id;
    try {
        return await axios.get(url).then((responseJson) => {
            if (responseJson.status === 200) {
                return responseJson;
            } else {
                return null;
            }
        }).catch((error) => {
            throw error
        });
    } catch (e) {
        throw e;
    }
},
async editAssetCate(request) {
    const url = EndPoints.assetManagementService.assetManagement + '/assets/categories/asset'
    try {
        return await axios.put(url, JSON.stringify(request))
            .then((responseJson) => {
                if (responseJson.status === 200) {
                    return responseJson;
                } else {
                    return null;
                }
            })
            .catch((error) => {
                throw error
            });
    } catch (e) {
        throw e;
    }
},

async archiveOrDeleteAssetCate(uuid,types) {
    let obj = {
        uuid: uuid,
        type: types
    }
    const url = EndPoints.assetManagementService.assetManagement + '/assets/category/archive-delete?uuid='+uuid+'&type='+types
    try {

        return await axios.delete(url)
            .then((responseJson) => {
                return responseJson
            })
            .catch((error) => {
                throw error
            })
    } catch (e) {
        throw e;
    }
},
async deleteArchivedAssetCate(uuid,types) {
    let obj = {
        uuid: uuid,
        type: types
    }
    

    const url = EndPoints.assetManagementService.assetManagement + '/assets/category/archive-delete?uuid='+uuid+'&type='+types
    try {

        return await axios.delete(url)
            .then((responseJson) => {
                return responseJson
            })
            .catch((error) => {
                throw error
            })
    } catch (e) {
        throw e;
    }
},

async DeleteAssetCate(uuid,types) {
    let params = {
        uuid: uuid,
    }
    const url = EndPoints.assetManagementService.assetManagement + '/assets/categories/asset'
    try {

        return await axios.delete(url, {
            params: params
        })
            .then((responseJson) => {
                return responseJson
            })
            .catch((error) => {
                throw error
            })
    } catch (e) {
        throw e;
    }
},


async getAssetbyCate(id,offset, limit) {
    const url = EndPoints.assetManagementService.assetManagement +'/assets/getassetsbycategoryuuid?offset='+offset+'&limit='+limit+'&uuid='+id;
    try {
        return await axios.get(url).then((responseJson) => {
            if (responseJson.status === 200) {
                return responseJson;
            } else {
                return null;
            }
        }).catch((error) => {
            throw error
        });
    } catch (e) {
        throw e;
    }
},

};

export default AssetManagementService;