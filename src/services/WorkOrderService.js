import axios from 'axios';
import EndPoints from './EndPoints';

export const WorkOrderService = {
    workorderUUID: '',
    async addWorkOrder(requestBody, tenantuuid) {
        const url = EndPoints.workOrderService.workOrder + '/workorders?tenantUUID=' + tenantuuid;

        try {
            return await axios.post(url, requestBody)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },
    async getPaginatedWorkOrders(offset, limit, tenantuuid) {
        const url = EndPoints.workOrderService.workOrder + '/workorders?offset=' + offset + '&limit=' + limit + '&tenantuuid=' + tenantuuid;
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
    async getPaginatedWorkOrdersReport(requestBody) {
        const url = EndPoints.workOrderService.workOrder + '/workOrderReport/sdt';
        try {
            return await axios.post(url,requestBody)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;

        }
    },
    async getImageVoicesByIssueUUIDSOrFieldUUIDS(uuids) {
        const url = EndPoints.workOrderService.workOrder + '/imagevoices';
        try {
            return await axios.post(url, { uuids: uuids })
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    }
                    else {
                        return null;
                    }

                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },
    async getImageVoicesByFieldUUIDS(uuid) {
        const url = EndPoints.workOrderService.workOrder + '/imagevoices?uuid=' + uuid;
        try {
            return await axios.post(url)
                .then((responseJson) => {
                    if (responseJson.status === 200) {
                        return responseJson;
                    }
                    else {
                        return null;
                    }

                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },

    async getPaginatedWorkOrderForSDT(requestObject) {
        const url = EndPoints.workOrderService.workOrder + '/workOrder/sdt';
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
    async getWorkOrdersCount(uuids) {
        const url = EndPoints.workOrderService.workOrder + '/assets/workorders';
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
    async getWorkOrdersReports(request) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/report';
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
    async getPaginatedWorkOrdersByAsset(offset, limit, assetuuid) {
        const url = EndPoints.workOrderService.workOrder + '/assets/workorders?offset=' + offset + '&limit=' + limit + '&assetuuid=' + assetuuid;
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
    async getAllWorkOrdersByAsset(assetuuid) {
        const url = EndPoints.workOrderService.workOrder + '/assets/workorders?assetuuid=' + assetuuid;
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
    async getAssetMaintenanceCostByAssetUUID(assetUuid) {
        const url = EndPoints.workOrderService.workOrder + '/assets/maintenance/cost?assetUuid=' + assetUuid;
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
    async getAssetsMaintenanceCostForSDT(uuids) {
        const url = EndPoints.workOrderService.workOrder + '/assets/maintenance/cost/sdt';
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
    async getInspectionReportByWorkOrderuuid(workOrderUUID) {
        const url = EndPoints.workOrderService.workOrder + '/inspectionreport?workorderUUID=' + workOrderUUID;
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

    async getWorkOrderPool(workOrderUUID) {
        const url = EndPoints.workOrderService.workOrder + '/pool?workOrderUUID=' + workOrderUUID;
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

    async deleteWorkOrderByUUID(workOrderUUID,type) {
        const url = EndPoints.workOrderService.workOrder + '/workorders';
        let params = {
            uuid: workOrderUUID,
            type:type
        }
        try {
            return await axios.delete(url,{ params: params })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },

    async getPartsByIssueUUID(issueUUID) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/parts/issueuuid';

        let params = {
            issueuuid: issueUUID
        }
        try {
            return await axios.get(url, { params: params })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },

    async getCostsByIssueUUID(issueUUID) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/costs/issueuuid';

        let params = {
            issueuuid: issueUUID
        }
        try {
            return await axios.get(url, { params: params })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },

    async assignWorkPool(requestBody) {
        const url = EndPoints.workOrderService.workOrder + '/assign';
        try {
            return await axios.put(url, requestBody)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },

    async addIssuesInWorkOrder(requestBody) {
        const url = EndPoints.workOrderService.workOrder + '/assets/workorders/issues';
        // console.log(requestBody);
        try {
            return await axios.post(url, requestBody)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },
    async getWorkOrderByUUID(uuid) {
        const url = EndPoints.workOrderService.workOrder + '/workorders?uuid=' + uuid;
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
    async updateIssueInWorkOrder(requestBody) {
        const url = EndPoints.workOrderService.workOrder + '/assets/workorders/issues';
        // console.log(requestBody);
        try {
            return await axios.put(url, requestBody)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },
    async updateWorkOrder(requestBody) {
        const url = EndPoints.workOrderService.workOrder + '/workorders';
        try {
            return await axios.put(url, requestBody)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },
    async getWorkOrderInspectionTemplates(tenantUUID) {
        const url = EndPoints.workOrderService.workOrder + '/inspectiontemplate/all';
        let params = {
            tenantuuid: tenantUUID
        }
        try {
            return await axios.get(url, { params: params })
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => { throw error });
        } catch (e) {
            throw e;
        }
    },

    async addUserTime(body) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/assignee/duration';

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

    async getResolutionByUUID(uuid) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/issues/resolutions';

        let params = {
            uuid: uuid,
        }

        try {
            return await axios.get(url, { params: params }).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            })
        } catch (e) {
            throw e;
        }
    },

    async getResolutionsByWorkOrderUUID(workOrderUUID) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/issues/resolutions';

        let params = {
            workorderuuid: workOrderUUID,
        };

        try {
            return await axios.get(url, { params: params }).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            })
        } catch (e) {
            throw e;
        }
    },

    async addPart(body) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/parts';

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
    async updatePart(body) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/parts';

        try {
            return await axios.put(url, JSON.stringify(body)).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            })
        } catch (e) {
            throw e;
        }

    },

    async deletePart(partsUUID) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/parts';
        let params = {
            uuid: partsUUID,
        };

        try {
            return await axios.delete(url, { params: params }).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            })
        } catch (e) {
            throw e;
        }

    },

    async addCost(body) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/costs';

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
    async updateCost(body) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/costs';
        try {
            return await axios.put(url, JSON.stringify(body)).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            })
        } catch (e) {
            throw e;
        }

    },
    async deleteCost(costUUID) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/costs';
        let params = {
            uuid: costUUID,
        };

        try {
            return await axios.delete(url, { params: params }).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            })
        } catch (e) {
            throw e;
        }

    },

    async getWorkOrderWallByWorkOrderUUID(workOrderUUID) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/wall';
        const params = {
            workorderuuid: workOrderUUID
        };
        try {
            return await axios.get(url, { params: params }).then((response) => {
                return response
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async addReplyToMessage(body) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/wall/reply';

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

    async addNewMessage(body) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/wall/messages';

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

    async getWorkOrderByDate(body) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/calender/events';

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
    async getWorkOrderDates(tenantUUID) {
        const url = EndPoints.workOrderService.workOrder + '/workorders/calender/dates?tenantUUID=' + tenantUUID;
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
    async getWorkOrderByissueUUID(uuid) {
        const url = EndPoints.workOrderService.workOrder + '/issue/workorder';
          let params={
            uuid:uuid
        };
        try {
            return await axios.get(url,{params:params}).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async getInspectionTemplateByInspectionUUID(uuid){
        const url = EndPoints.workOrderService.workOrder + '/inspectiontemplate/inspectionuuid';
        let params={
            inspectionUUID:uuid
        };
        try {
            return await axios.get(url,{params:params}).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async getImageVoicesByInspectionItemUUID(uuid) {
        const url = EndPoints.workOrderService.workOrder + '/imagesvoices/inspection-item?uuid=' + uuid;
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
    /*async getWorkOrderPool(workOrderUUID) {
        const url = EndPoints.workOrderService.workOrder + '/pool?workOrderUUID=' + workOrderUUID;
        try {
            return await axios.get(url).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    }*/

};

export default WorkOrderService;