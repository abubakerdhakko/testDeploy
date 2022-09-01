let host = window.location.hostname;
if (process.env.VUE_APP_ENV === "prod") {
  host = "app.erohal.io";
}

if (process.env.VUE_APP_ENV === "acc") {
  host = "acc.erohal.io";
}

if (process.env.VUE_APP_SSL === "1") {
  host = "https://" + host;
} else {
  host = "http://" + host;
}
// create base urls

const authServiceUrl = host + process.env.VUE_APP_AUTH_SERVICE_URL;
const assetManagementServiceUrl = host + process.env.VUE_APP_ASSET_MANAGEMENT_URL;
const assetPersonnelServiceUrl = host+process.env.VUE_APP_ASSET_PERSONNEL_SERVICE_URL;
const inspectionServiceUrl = host+process.env.VUE_APP_INSPECTION_SERVICE_URL;
const workOrderServiceUrl = host+process.env.VUE_APP_WORKORDER_SERVICE_URL;
const preferenceServiceUrl = host+process.env.VUE_APP_PREFERENCE_SERVICE_URL;
const schedulerServiceUrl = host+process.env.VUE_APP_ASSET_PERSONNEL_SERVICE_URL;  // for schedulerService

const auth = authServiceUrl;
const assetManagement = assetManagementServiceUrl;
const assetPersonnel = assetPersonnelServiceUrl;
const inspection = inspectionServiceUrl;
const workOrder = workOrderServiceUrl;
const preference = preferenceServiceUrl;
const  scheduler = schedulerServiceUrl
export default {
  authService: {
    auth: auth,
    oauthToken: auth + "/oauth/token",
    userDetails: auth + "/user",
  },
  schedulerService: {
    scheduler: scheduler
  },
  assetManagementService: {
    assetManagement: assetManagement
  },
  assetPersonnelService: {
    assetPersonnel: assetPersonnel
  },
  inspectionService: {
    inspection: inspection
  },
  workOrderService: {
    workOrder: workOrder
  },
  preferenceService: {
    preference: preference
  }
};
