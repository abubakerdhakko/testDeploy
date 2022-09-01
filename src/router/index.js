import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [{
    path: "/login",
    name: "login",
    component: () => import("../views/auth/Login.vue"),
    meta: {
      title: 'Sign in to your account',
    }
  },
  {
    path: "/",
    name: "index",
    component: () => import("../views/Index.vue"),
    children: [{
        path: "/dashboard",
        name: "dashboard",
        component: () => import("../views/dashboard/Dashboard.vue"),
        meta: {
          title: 'Erohal - Your Assets, Our Care',
        }
      },
      {
        path: "/inspection",
        component: () =>
          import("../views/inspection/Index.vue"),
        children: [{
            path: "",
            name: "inspection",
            component: () =>
              import("../views/inspection/Inspection.vue"),
            meta: {
              title: 'Erohal - Inspections',
            }
          },
          // /:inspectionChild/:parentUUID/:serviceRequestChild
          {
            path: "inspection-details/:inspectionUUID",
            name: "inspection-details",
            component: () =>
              import("../views/inspection/InspectionDetails.vue"),
            meta: {
              title: 'Erohal - (Inspection#)',
            }
          },
        ]
      },
      {
        path: "/work-order",
        name: "work-order",
        component: () => import("../views/work-orders/Index.vue"),
        children: [{
            path: "",
            name: "work-order",
            component: () => import("../views/work-orders/WorkOrders.vue"),
            meta: {
              title: 'Erohal - Workorders',
            }
          },
          {
            path: "/work-order/create-work-order",
            name: "create-work-order",
            component: () => import("../views/work-orders/CreateWorkOrder.vue"),
            meta: {
              title: 'Erohal - Create WorkOrder',
            }
          },
          {
            path: "work-order-details/:workuuid",
            name: "work-order-details",
            component: () => import("../views/work-orders/WorkOrderDetails.vue"),
            meta: {
              title: '| Erohal',
            }
          },
          {
            path: "edit-work-order-details/:workuuid",
            name: "edit-work-order-details",
            component: () => import("../views/work-orders/WorkOrderDetails.vue"),
            meta: {
              title: '| Erohal',
            }
          },
        ],
      },
      {
        path: "/issues",
        component: () => import("../views/issues/Index.vue"),
        children: [{
            path: "",
            name: "issues",
            component: () =>
              import("../views/issues/Issues.vue"),
            meta: {
              title: 'Erohal - Issues',
            }
          },
          {
            path: "issue-detail/:issueID",
            name: "issue-detail",
            component: () =>
              import("../views/issues/IssuesDetail.vue"),
            meta: {
              title: 'Erohal - (issue #) details',
            }
          },
          {
            path: "edit-issue-detail/:issueID",
            name: "edit-issue",
            component: () =>
              import("../views/issues/IssuesDetail.vue"),
            meta: {
              title: 'Erohal - (issue #) details',
            }
          }

        ],
      },
      {
        path: "/assets",
        component: () =>
          import("../views/assets/Index.vue"),
        children: [{
            path: "",
            name: "assets",
            component: () =>
              import("../views/assets/Assets.vue"),
            meta: {
              title: 'Erohal - Assets',
            }
          },
          {
            path: "create-asset/:assetCateID/:slug",
            name: "create-asset-by-category",
            component: () =>
              import("../views/assets/CreateAsset.vue"),
            meta: {
              title: 'Erohal - Create Assets',
            }
          },
          {
            path: "create-asset",
            name: "create-asset",
            component: () =>
              import("../views/assets/CreateAsset.vue"),
            meta: {
              title: 'Erohal - Create Assets',
            }
          },
          {
            path: "edit-asset/:assetID",
            name: "edit-asset",
            component: () =>
              import("../views/assets/CreateAsset.vue"),
            meta: {
              title: 'Erohal - Create Assets',
            }
          },
          {
            path: "view-asset/:assetID",
            name: "view-asset",
            component: () =>
              import("../views/assets/AssetDetails.vue"),
            meta: {
              title: 'Erohal - Assets Detail',
            }
          },
          {
            path: "existing/templates",
            name: "existing-templates",
            component: () =>
              import("../views/assets/components/ExistingTemplates.vue"),
            meta: {
              title: 'Erohal - Import Asset Templates',
            }
          },
          {
            path: "last/records",
            name: "last-import-records",
            component: () =>
              import("../views/assets/components/LastImportRecord.vue"),
            meta: {
              title: 'Erohal - Last Imports',
            }
          }
        ]
      },
      {
        path: "/wallets",
        component: () =>
          import("../views/wallet/Index.vue"),
        children: [{
            path: "",
            name: "wallets",
            component: () =>
              import("../views/wallet/Wallet.vue"),
            meta: {
              title: 'Erohal - Wallets',
            }
          },
          {
            path: "create-wallet",
            name: "create-wallet",
            component: () =>
              import("../views/wallet/CreateWallet.vue"),
            meta: {
              title: 'Erohal - Create Wallets',
            }
          },
          {
            path: ":type/:walletUUID",
            name: "view-wallet",
            component: () =>
              import("../views/wallet/EditWallet.vue"),
            meta: {
              title: 'Erohal - View Wallets',
            }
          },
          {
            path: "edit-wallet/:walletUUID",
            name: "edit-wallet",
            component: () =>
              import("../views/wallet/EditWallet.vue"),
            meta: {
              title: 'Erohal - Edit Wallets',
            }
          },
        ]
      },
      {
        path: "/service-requests",
        component: () =>
          import("../views/service-requests/Index.vue"),
        children: [{
            path: "",
            name: "service-requests",
            component: () =>
              import("../views/service-requests/ServiceRequests.vue"),
            meta: {
              title: 'Erohal - Service Requests',
            }
          },
          {
            path: "service-requests-details/:serviceRequestUUID",
            name: "service-requests-details",
            component: () =>
              import("../views/service-requests/ServiceRequestDetails.vue"),
            meta: {
              title: 'Erohal - Service Requests Detail',
            }
          },
          {
            path: "service-requests-edit/:serviceRequestUUID",
            name: "service-requests-edit",
            component: () =>
              import("../views/service-requests/ServiceRequestDetails.vue"),
            meta: {
              title: 'Erohal - Service Requests Detail',
            }
          }
        ]
      },
      {
        path: "/consumption",
        component: () =>
          import("../views/consumption/Index.vue"),
        children: [{
          path: "",
          name: "consumption",
          component: () =>
            import("../views/consumption/Consumption.vue"),
          meta: {
            title: 'Erohal - Consumptions',
          }
        }, ]
      },
      {
        path: "/settings",
        component: () =>
          import("../views/settings/Index.vue"),
        children: [{
          path: "",
          name: "settings",
          component: () =>
            import("../views/settings/Settings.vue"),
          meta: {
            title: 'Erohal - Settings',
          }
        }, ]
      },
      {
        path: "/usage",
        component: () =>
          import("../views/usage/Index.vue"),
        children: [{
            path: "",
            name: "usage",
            component: () =>
              import("../views/usage/Usage.vue"),
            meta: {
              title: 'Erohal - Usages',
            }
          }, 
          {
            path: "/usage/create-usage",
            name: "create-usage",
            component: () =>
              import("../views/usage/components/CreateUsages"),
            meta: {
              title: 'Erohal - Create Usages',
            }
          },
          {
            path: "/usage/:type/:usageID",
            name: "usage-detail",
            component: () =>
              import("../views/usage/components/CreateUsages"),
            meta: {
              title: 'Erohal - Usage',
            },
          },
          {
            path: "/usage/edit-usage/:usageID",
            name: "edit-usage",
            component: () =>
              import("../views/usage/components/CreateUsages"),
            meta: {
              title: 'Erohal - Edit Usages',
            }
          }
        ]
      },
      {
        path: "/user-management",
        component: () =>
          import("../views/user-management/Index.vue"),
        children: [{
          path: "",
          name: "user-management",
          component: () =>
            import("../views/user-management/UserManagement.vue"),
          meta: {
            title: 'Erohal - User Management',
          }
        }]
      },
      {
        path: "/reports",
        component: () =>
          import("../views/reports/Index.vue"),
        children: [{
          path: "",
          name: "reports",
          component: () =>
            import("../views/reports/Reports.vue"),
          meta: {
            title: 'Erohal - Reports',
          }
        }]
      },
      {
        path: "/calendar",
        component: () =>
          import("../views/calendar/Index.vue"),
        children: [{
          path: "",
          name: "calendar",
          component: () =>
            import("../views/calendar/Calendar.vue"),
          meta: {
            title: 'Erohal - Calendar',
          }
        },
          {
            path: "/scheduler",
            name: "scheduler",
            component: () =>
              import("../views/calendar/Scheduler.vue"),
            meta: {
              title: 'Erohal - Scheduler',
            }
          }]
      },
      {
        path: "/inspection-templates",
        component: () =>
          import("../views/manage-inspection-templates/Index.vue"),
        children: [{
            path: "",
            name: "inspection-templates",
            component: () =>
              import("../views/manage-inspection-templates/InspectionTemplate.vue"),
            meta: {
              title: 'Erohal - Inspection Templates',
            }
          },
          {
            path: "/inspection-templates/create-inspection-templates",
            name: "create-inspection-template",
            component: () =>
              import("../views/manage-inspection-templates/CreateInspectionTemplate.vue"),
            meta: {
              title: 'Erohal - Create Inspection Templates',
            }
          },
          {
            path: "/inspection-templates/inspection-templates-detail/:templateUUID",
            name: "inspection-template-detail",
            component: () =>
              import("../views/manage-inspection-templates/inspectionTemplateDetails.vue"),
            meta: {
              title: 'Erohal - Detail Inspection Templates',
            }
          },
          {
            path: "/inspection-templates/edit-inspection-templates-detail/:templateUUID",
            name: "edit-inspection-template-detail",
            component: () =>
              import("../views/manage-inspection-templates/inspectionTemplateDetails.vue"),
            meta: {
              title: 'Erohal - Detail Inspection Templates',
            }
          },
          {
            path: "/inspection-templates/view-assigned-template/:templateUUID",
            name: "view-assigned-template",
            component: () =>
              import("../views/manage-inspection-templates/viewAssignedTemplate.vue"),
            meta: {
              title: 'Erohal - View Assigned Template',
            }
          }
        ]
      },
      // asset Cate templates
      {
        path: "/asset-category-templates",
        component: () =>
          import("../views/manage-asset-category-template/Index.vue"),
        children: [{
            path: "",
            name: "asset-category-templates",
            component: () =>
              import("../views/manage-asset-category-template/AssetCategoryTemplate.vue"),
            meta: {
              title: 'Erohal - Asset category Templates',
            }
          },
          {
            path: "/asset-category-template",
            name: "asset-category-template",
            component: () =>
              import("../views/manage-asset-category-template/CreateAssetTemplate.vue"),
            meta: {
              title: 'Erohal - Create Asset  Category Templates',
            }
          },
          {
            path: "/create-asset-category-template",
            name: "create-asset-category-template",
            component: () =>
              import("../views/manage-asset-category-template/CreateAssetTemplate.vue"),
            meta: {
              title: 'Erohal - Create Asset  Category Templates',
            }
          },
          {
            path: "/edit-asset-category-template/:assetCateTemplateID",
            name: "edit-asset-category-template",
            component: () =>
              import("../views/manage-asset-category-template/CreateAssetTemplate.vue"),
            meta: {
              title: 'Erohal - Create Asset  Category Templates',
            }
          },
          {
            path: "/detail-asset-category-template/:assetCateTemplateID",
            name: "detail-asset-category-template",
            component: () =>
              import("../views/manage-asset-category-template/CreateAssetTemplate.vue"),
            meta: {
              title: 'Erohal - Create Asset  Category Templates',
            }
          },
        ]
      },
      // asset Category
      {
        path: "/asset-category",
        component: () =>
          import("../views/manage-asset-category/Index.vue"),
        children: [{
            path: "",
            name: "asset-category",
            component: () =>
              import("../views/manage-asset-category/AssetCategory.vue"),
            meta: {
              title: 'Erohal - Asset category ',
            }
          },
          {
            path: "/asset-categories/:assetCateID",
            name: "asset-categories",
            component: () =>
              import("../views/manage-asset-category/CreateAssetCategory.vue"),
            meta: {
              title: 'Erohal - Create Asset  Category ',
            }
          },
          // edit asset cate
          {
            path: "/edit-asset-category/:assetCateID",
            name: "edit-asset-category",
            component: () =>
              import("../views/manage-asset-category/CreateAssetCategory.vue"),
            meta: {
              title: 'Erohal - Create Asset  Category ',
            }
          },
          // detail asset cate
          {
            path: "/detail-asset-category/:assetCateID",
            name: "detail-asset-category",
            component: () =>
              import("../views/manage-asset-category/CreateAssetCategory.vue"),
            meta: {
              title: 'Erohal - Create Asset  Category ',
            }
          },
          // Create Asset cate
          {
            path: "/create-asset-category",
            name: "create-asset-category",
            component: () =>
              import("../views/manage-asset-category/CreateAssetCategory.vue"),
            meta: {
              title: 'Erohal - Create Asset  Category ',
            }
          },
          
        ]
      },
    ]
  },

];
// asset-categories
// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("../views/Error404.vue"),
  });
}

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;