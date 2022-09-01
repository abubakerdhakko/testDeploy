import axios from 'axios';
import EndPoints from './EndPoints';

export const InspectionService = {
    async getPaginatedInspectionReports(offset, limit, tenantuuid) {
        // debugger;
        const url = EndPoints.inspectionService.inspection + '/inspectionreport?offset=' + offset + '&limit=' + limit + '&tenantuuid=' + tenantuuid;
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
    // submitted
    async getPaginatedAdditonalInspections(offset, limit, tenantuuid, parentInspectionUUID) {
        // debugger;
        const url = EndPoints.inspectionService.inspection + '/inspectionreport?offset=' + offset + '&limit=' + limit + '&tenantuuid=' + tenantuuid + '&parentInspectionUUID=' + parentInspectionUUID;
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
    async getPaginatedInspectionReportsForServiceRequest(offset, limit, tenantuuid, serviceRequestUUID) {
        // debugger;
        const url = EndPoints.inspectionService.inspection + '/inspectionreport?offset=' + offset + '&limit=' + limit + '&tenantuuid=' + tenantuuid + '&serviceRequestUUID=' + serviceRequestUUID;
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
    async getPaginatedInspectionTemplatesForServiceRequest(offset, limit, tenantuuid, serviceRequestUUID) {
        // debugger;
        const url = EndPoints.inspectionService.inspection + '/inspectiontemplate?offset=' + offset + '&limit=' + limit + '&tenantUUID=' + tenantuuid + '&serviceRequestUUID=' + serviceRequestUUID + '&newAdditional=true';
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
    //pending...
    async getPaginatedInspectionTemplatesForInspection(offset, limit, tenantuuid, parentInspectionUUID) {
        // debugger;
        const url = EndPoints.inspectionService.inspection + '/inspectiontemplate?offset=' + offset + '&limit=' + limit + '&tenantUUID=' + tenantuuid + '&parentInspectionUUID=' + parentInspectionUUID + '&newAdditional=true';
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

    async getPaginatedIssues(requestBody) {
        const url = EndPoints.inspectionService.inspection + '/issues/sdt';
        try {
            return await axios.post(url,requestBody)
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

    async getPaginatedIssuesReport(requestBody) {
        const url = EndPoints.inspectionService.inspection + '/issueReport/sdt';
        try {
            return await axios.post(url, requestBody)
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
    async getPaginatedServiceRequestReport(requestBody) {
        const url = EndPoints.inspectionService.inspection + '/serviceRequestReport/sdt';
        try {
            return await axios.post(url, requestBody)
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
    async getPaginatedInspectionReport(requestBody) {
        const url = EndPoints.inspectionService.inspection + '/inspectionReport/sdt';
        try {
            return await axios.post(url, requestBody)
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
    async getPaginatedServiceRequests(requestObject) {
        const url = EndPoints.inspectionService.inspection + '/service-requests/sdt';
        try {
            return await axios.post(url,requestObject)
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
    async getPaginatedInspectionTemplatesForSDT(requestObject) {
        const url = EndPoints.inspectionService.inspection + '/inspectionTemplate/sdt';
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

    async getPaginatedArchivedTemplatesForSDT(requestObject) {
        const url = EndPoints.inspectionService.inspection + '/archive/inspection-templates/sdt';
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

    async getPaginatedArchivedIssuesForSDT(requestObject) {
        const url = EndPoints.inspectionService.inspection + '/archived/issues/sdt';
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

    async getPaginatedArchivedInspectionsForSDT(requestObject) {
        const url = EndPoints.inspectionService.inspection + '/archive/inspection-report/sdt';
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

    async getPaginatedPendingInspectionReportsForSDT(requestObject) {
        const url = EndPoints.inspectionService.inspection + '/pending/inspection-report/sdt';
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

    async getPaginatedInspectionReportsForSDT(requestObject) {
        const url = EndPoints.inspectionService.inspection + '/inspection-report/sdt';
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

    async getFile(fileUrl) {
        const url = EndPoints.inspectionService.inspection + '/files?url=' + fileUrl;
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

    async getIssuesDetailByIssuesUUID(issueUUIDs) {
        const url = EndPoints.inspectionService.inspection + '/issuedetails';
        try {
            return await axios.post(url, issueUUIDs)
                .then((responseJson) => {
                    return responseJson;
                })
        } catch (e) {
            throw e;
        }
    },
    async getImageVoicesByIssueUUIDSOrFieldUUIDS(uuids) {
        const url = EndPoints.inspectionService.inspection + '/imagevoices';
        try {
            return await axios.post(url, {
                    uuids: uuids
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

    async getIssuesReports(request) {
        const url = EndPoints.inspectionService.inspection + '/issues/report';
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
    async getInspectionReports(request) {
        const url = EndPoints.inspectionService.inspection + '/issues/inspectionreport';
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

    async getServiceRequestReports(request) {
        const url = EndPoints.inspectionService.inspection + '/issues/servicereport';
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

    async getImageVoicesByIssueUUIDOrFieldUUID(uuid) {
        const url = EndPoints.inspectionService.inspection + '/imagevoices';
        const params = {
            uuid: uuid,
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

    async getOpenInspectionReportsByAssetUUID(assetuuid) {
        const url = EndPoints.inspectionService.inspection + '/inspectionreport?assetuuid=' + assetuuid;
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
    async getPaginatedInspectionTemplates(offset, limit) {
        const url = EndPoints.inspectionService.inspection + '/inspectiontemplate?offset=' + offset + '&limit=' + limit;
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
    async addInspectionTemplateOfMultipleAssets(requestBody) {
        const url = EndPoints.inspectionService.inspection + '/inspectiontemplate/bulk';
        try {
            return await axios.post(url, requestBody)
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
    async addInspectionTemplateOfServiceRequest(requestBody) {
        const url = EndPoints.inspectionService.inspection + '/inspectiontemplate';
        try {
            return await axios.post(url, requestBody)
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

    async assignScheduleInspectionTemplate(requestBody) {
        const url = EndPoints.inspectionService.inspection + '/inspection-template/assign';
        try {
            return await axios.post(url, requestBody)
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
    async updateAssignScheduleInspectionTemplate(requestBody) {
        const url = EndPoints.inspectionService.inspection + '/inspection-template/assign';
        try {
            return await axios.put(url, requestBody)
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
    async uploadFile(MultipartFiles) {
        const url = EndPoints.inspectionService.inspection + '/files';
        let formData = new FormData();
        formData.append('file', MultipartFiles);
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
    async addInspectionTemplateOfInspectionRequest(requestBody) {
        const url = EndPoints.inspectionService.inspection + '/inspectiontemplate';
        try {
            return await axios.post(url, requestBody)
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

    async updateInspectionTemplateOfMultipleAssets(requestBody) {
        const url = EndPoints.inspectionService.inspection + '/inspectiontemplate/bulk';
        try {
            return await axios.put(url, requestBody)
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

    async updateIssue(requestBody) {
        // console.log(requestBody);
        const url = EndPoints.inspectionService.inspection + '/issues';
        try {
            return await axios.put(url, requestBody)
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

    async updateServiceRequest(requestBody) {
        // console.log(requestBody);
        const url = EndPoints.inspectionService.inspection + '/service-request';
        try {
            return await axios.put(url, requestBody)
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
    async servicerequestRelatedIssues(uuid, limit, offset) {
        // console.log(requestBody);
        const url = EndPoints.inspectionService.inspection + '/service-request/issues?uuid=' + uuid + '&limit=' + limit + '&offset=' + offset;
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

    async addIssue(requestBody) {
        // console.log(requestBody);
        const url = EndPoints.inspectionService.inspection + '/issues';
        try {
            return await axios.post(url, requestBody)
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

    async filterIssuesByAssetUUID(assetuuid, status = "any") {
        const url = EndPoints.inspectionService.inspection + '/issues/filter?assetuuid=' + assetuuid + '&status=' + status;
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

    async getPaginatedIssuesByAsset(assetuuid, status = "any", offset, limit) {
        const url = EndPoints.inspectionService.inspection + '/issues/asset?assetuuid=' + assetuuid + '&status=' + status + '&offset=' + offset + '&limit=' + limit;
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

    async linkIssues(request) {
        const url = EndPoints.inspectionService.inspection + '/issues/link';
        try {
            return await axios.put(url, request)
                .then((responseJson) => {
                    return responseJson;
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
    async getLinkedIssues(issueUUID) {
        const url = EndPoints.inspectionService.inspection + '/issues/link?issueuuid=' + issueUUID;
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
    async deleteIssueImage(issueUUID) {
        const url = EndPoints.inspectionService.inspection + '/image/?uuid=' + issueUUID;
        try {
            return await axios.delete(url)
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
    async getIssueCount(uuids) {
        const url = EndPoints.inspectionService.inspection + '/assets/issues';
        try {
            return await axios.post(url, uuids)
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
    async getInspectionTempaltesByAsset(assetuuid) {
        const url = EndPoints.inspectionService.inspection + '/assets/inspectiontemplates/all?assetuuid=' + assetuuid;
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

    async getServiceRequestByUUID(uuid) {
        const url = EndPoints.inspectionService.inspection + '/servicerequests?uuid=' + uuid;
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

    async getInspectionTemplateNameAndUUID(assetUUID, tenantUUID) {
        let params = {
            tenantuuid: tenantUUID,
            assetuuid: assetUUID,
        };
        const url = EndPoints.inspectionService.inspection + '/inspectiontemplate/all';
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

    async getInspectionTemplateNameAndUUIDByCategoryUUID(categoryUUID) {
        let params = {
            categoryuuid: categoryUUID,
        };
        const url = EndPoints.inspectionService.inspection + '/inspectiontemplate/all';
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

    async getInspectionTemplateByUUID(templateUUID, tenantUUID) {
        let params = {
            uuid: templateUUID,
            tenantUUID: tenantUUID
        };
        const url = EndPoints.inspectionService.inspection + '/inspectiontemplate';
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

    async ignoreInspectionItems(requestBody) {
        const url = EndPoints.inspectionService.inspection + '/issues/ignoreInspectionItems';
        try {
            return await axios.put(url, requestBody)
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

    async getImageVoicesByInspectionItemUUID(uuid) {
        const url = EndPoints.inspectionService.inspection + '/imagesvoices/inspection-item?uuid=' + uuid;
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
    
    async deleteInspectionTemplateByUUID(templateUUID, type) {
        let params = {
            id: templateUUID,
            type: type
        };
        const url = EndPoints.inspectionService.inspection + '/inspectiontemplate';
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

    async restoreInspectionTemplate(uuid) {
        const url = EndPoints.inspectionService.inspection + '/restore/inspection-template?uuid=' + uuid;
        try {
            return await axios.put(url)
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

    async restoreInspection(uuid) {
        const url = EndPoints.inspectionService.inspection + '/restore/inspection-report?uuid=' + uuid;
        try {
            return await axios.put(url)
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

    async restoreIssue(uuid) {
        const url = EndPoints.inspectionService.inspection + '/restore/issues?uuid=' + uuid;
        try {
            return await axios.put(url)
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

    async deleteInspectionByUUID(templateUUID, type) {
        let params = {
            id: templateUUID,
            type: type
        };
        const url = EndPoints.inspectionService.inspection + '/inspectionreport';
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

    async deleteIssues(uuid, type) {
        let params = {
            uuid: uuid,
            type: type
        };
        const url = EndPoints.inspectionService.inspection + '/issues';
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

    async getInspectionWallByInspectionReportUUID(inspectionReportUUID) {
        const url = EndPoints.inspectionService.inspection + '/inspectionreport/wall';
        const params = {
            inspectionreportuuid: inspectionReportUUID
        };
        try {
            return await axios.get(url, {
                params: params
            }).then((response) => {
                return response
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async getInspectionReportByUUID(uuid) {
        const url = EndPoints.inspectionService.inspection + '/inspectionreport';
        const params = {
            id: uuid
        };
        try {
            return await axios.get(url, {
                params: params
            }).then((response) => {
                return response
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async addReplyToMessage(body) {
        const url = EndPoints.inspectionService.inspection + '/inspectionreport/wall/reply';

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
        const url = EndPoints.inspectionService.inspection + '/inspectionreport/wall/messages';

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

    async getIssueByUUID(issueUUID) {
        const url = EndPoints.inspectionService.inspection + '/issues';

        let params = {
            id: issueUUID
        };
        try {
            return await axios.get(url, {
                params: params
            }).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },
    async getInspectionbyIssueUUID(issueuuid) {
        const url = EndPoints.inspectionService.inspection + '/issues/inspection';

        let params = {
            issueuuid: issueuuid
        };
        try {
            return await axios.get(url, {
                params: params
            }).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async getIssueWallByIssueUUID(uuid) {
        const url = EndPoints.inspectionService.inspection + '/issues/wall';
        const params = {
            issueuuid: uuid
        };
        try {
            return await axios.get(url, {
                params: params
            }).then((response) => {
                return response
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async addReplyToIssueMessage(body) {
        const url = EndPoints.inspectionService.inspection + '/issues/wall/reply';

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

    async addNewIssueMessage(body) {
        const url = EndPoints.inspectionService.inspection + '/issues/wall/messages';

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

    async getInspectionReportByDate(body) {
        const url = EndPoints.inspectionService.inspection + '/inspectionreport/calender/events';

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

    async getInspectionDates(tenantUUID) {
        const url = EndPoints.inspectionService.inspection + '/inspections/calender/dates';
        const params = {
            tenantUUID: tenantUUID
        };
        try {
            return await axios.get(url, {
                params: params
            }).then((response) => {
                return response;
            }).catch((error) => {
                throw error;
            });
        } catch (e) {
            throw e;
        }
    },

    async getInspectionTemplatesPendingandSubmitted(GetPaginatedAdditionalInspectionRequest) {
        // debugger;
        const url = EndPoints.inspectionService.inspection + '/additional/inspection';


        try {
            return await axios.post(url, GetPaginatedAdditionalInspectionRequest)
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

    async getPaginatedAssetRelatedIssues(request) {

        const url = EndPoints.inspectionService.inspection + '/issues/asset';

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

    async getPaginatedIssueCategoryRelatedIssues(request) {

        const url = EndPoints.inspectionService.inspection + '/issues/issue-category';

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

    async deleteOrArchiveServiceRequest(uuid, processType) {

        const url = EndPoints.inspectionService.inspection + '/service-requests?uuid=' + uuid + '&processType=' + processType;

        try {

            return await axios.delete(url)
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

    async getAllInspectionTemplates(tenentUUID) {
        const url = EndPoints.inspectionService.inspection + '/inspectionTemplate/all';
        const params = {
            tenantUUID: tenentUUID,
        }
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

};

export default InspectionService;