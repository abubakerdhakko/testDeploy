(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[28],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/wallet/EditWallet.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/views/wallet/EditWallet.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_WalletForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/WalletForm */ \"./src/views/wallet/components/WalletForm.vue\");\n/* harmony import */ var _services_AssetManagementService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/AssetManagementService */ \"./src/services/AssetManagementService.js\");\n/* harmony import */ var _services_InspectionService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/InspectionService */ \"./src/services/InspectionService.js\");\n/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ \"./node_modules/moment/moment.js\");\n/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _components_Loader_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/components/Loader.vue */ \"./src/components/Loader.vue\");\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: \"name\",\n  components: {\n    WalletForm: _components_WalletForm__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n    loader: _components_Loader_vue__WEBPACK_IMPORTED_MODULE_4__[\"default\"]\n  },\n\n  data() {\n    return {\n      loaderFlag: false,\n      walletInfo: {},\n      walletKey: 0,\n      currentUserDetails: \"\",\n      users: [],\n      assets: [],\n      transactions: [],\n      page_type: \"Edit\",\n      stateDisable: false\n    };\n  },\n\n  methods: {\n    assetCategorySelected(value) {\n      if (value) {\n        this.walletInfo.assetCategory = value.selectedObject.categoryUUID;\n      }\n    },\n\n    assetSelected(val) {\n      if (val) {\n        this.walletInfo.assetName = val.name;\n        this.walletInfo.assetUUID = val.uuid;\n      }\n    },\n\n    userSelected(val) {\n      if (val) {\n        this.walletInfo.userName = val.name;\n        this.userUUID = val.uuid;\n      }\n    },\n\n    submitChange() {\n      this.loaderFlag = true;\n      _services_AssetManagementService__WEBPACK_IMPORTED_MODULE_1__[\"AssetManagementService\"].editWallet(this.walletInfo).then(response => {\n        if (response.data.responseCode === \"F200\") {\n          this.loaderFlag = false;\n          this.$router.push({\n            name: \"wallets\",\n            params: {\n              toastFlag: true,\n              toastSuccess: \"success\",\n              message: response.data.description\n            }\n          });\n        }\n      }).catch(error => {\n        if (error) {\n          this.loaderFlag = false;\n          this.showToast(error.response.data.description, \"error\");\n        }\n      });\n    },\n\n    getWallet() {\n      _services_AssetManagementService__WEBPACK_IMPORTED_MODULE_1__[\"AssetManagementService\"].GetWalletByWalletUUID(this.$route.params.walletUUID).then(res => {\n        this.walletInfo = res.data.wallet;\n        this.walletInfo.categoryName = res.data.assetCategoryName;\n        _services_InspectionService__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getInspectionTemplateByUUID(\"none\", this.currentUserDetails.organizationId).then(response => {\n          let data = response.data;\n\n          for (let asset of data.assetAndGroupsNameResponse.assetDTOS) {\n            if (asset && this.walletInfo.assetUUID === asset.uuid) {\n              this.walletInfo.assetName = asset.name;\n              break;\n            }\n          }\n\n          for (let user of data.userAndGroupResponse.userDTOS) {\n            if (user && this.walletInfo.userUUID === user.uuid) {\n              this.walletInfo.userName = user.name;\n              this.walletInfo.fullName = user.name;\n              break;\n            }\n          }\n\n          this.walletKey++;\n          this.loaderFlag = false;\n        }).catch(e => {\n          console.log(e);\n        });\n      }).catch(e => {\n        console.log(e);\n      });\n    },\n\n    getAsset() {\n      _services_AssetManagementService__WEBPACK_IMPORTED_MODULE_1__[\"AssetManagementService\"].getAllAssets(this.currentUserDetails.organizationId).then(response => {\n        this.assets = response.data.assets;\n        this.getWallet();\n      }).catch(e => {\n        console.log(e);\n      });\n    },\n\n    showToast(message, type) {\n      this.toastMessage = message;\n      this.toastType = type;\n      this.toastFlag++;\n    },\n\n    getTransaction() {\n      _services_AssetManagementService__WEBPACK_IMPORTED_MODULE_1__[\"AssetManagementService\"].getTransaction(this.$route.params.walletUUID, 0, 10000).then(response => {\n        this.transactions = response.data.factList;\n        this.transactions.forEach(element => {\n          element.dateTime = moment__WEBPACK_IMPORTED_MODULE_3___default()(element.dateTime).format(\"DD MMM YYYY\");\n        });\n      }).catch(e => {\n        console.log(e);\n      });\n    }\n\n  },\n\n  created() {\n    this.currentUserDetails = JSON.parse(localStorage.getItem(\"currentUserDetails\"));\n    this.loaderFlag = true;\n    document.title = this.$route.meta.title;\n\n    if (this.$route.params.type) {\n      this.page_type = this.$route.params.type;\n      this.stateDisable = true;\n    }\n\n    this.getWallet();\n    this.getAsset();\n    this.getTransaction();\n  },\n\n  computed: {}\n});\n\n//# sourceURL=webpack:///./src/views/wallet/EditWallet.vue?./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"1facbfc4-vue-loader-template\"}!./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/wallet/EditWallet.vue?vue&type=template&id=5107d76f&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"1facbfc4-vue-loader-template"}!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/views/wallet/EditWallet.vue?vue&type=template&id=5107d76f&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function render() {\n  var _vm = this,\n      _c = _vm._self._c;\n\n  return _c(\"div\", {\n    staticClass: \"pt-32 pb-80\"\n  }, [_c(\"span\", {\n    staticClass: \"head-title\"\n  }, [_vm._v(_vm._s(`${_vm.page_type} Wallet`))]), _c(\"br\"), _c(\"span\", {\n    staticClass: \"subtitle\"\n  }, [_vm._v(\"Edit the details of an existing wallet\")]), _c(\"WalletForm\", {\n    key: _vm.walletKey,\n    attrs: {\n      walletData: _vm.walletInfo,\n      stateDisable: _vm.stateDisable,\n      transactions: _vm.transactions\n    },\n    on: {\n      submit: _vm.submitChange,\n      \"asset-category-select\": _vm.assetCategorySelected,\n      \"asset-selected\": _vm.assetSelected,\n      \"user-selected\": _vm.userSelected,\n      showToast: _vm.showToast\n    }\n  }), _vm.loaderFlag ? _c(\"loader\") : _vm._e()], 1);\n};\n\nvar staticRenderFns = [];\nrender._withStripped = true;\n\n\n//# sourceURL=webpack:///./src/views/wallet/EditWallet.vue?./node_modules/cache-loader/dist/cjs.js?%7B%22cacheDirectory%22:%22node_modules/.cache/vue-loader%22,%22cacheIdentifier%22:%221facbfc4-vue-loader-template%22%7D!./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./src/views/wallet/EditWallet.vue":
/*!*****************************************!*\
  !*** ./src/views/wallet/EditWallet.vue ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _EditWallet_vue_vue_type_template_id_5107d76f_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EditWallet.vue?vue&type=template&id=5107d76f&scoped=true& */ \"./src/views/wallet/EditWallet.vue?vue&type=template&id=5107d76f&scoped=true&\");\n/* harmony import */ var _EditWallet_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EditWallet.vue?vue&type=script&lang=js& */ \"./src/views/wallet/EditWallet.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _EditWallet_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _EditWallet_vue_vue_type_template_id_5107d76f_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _EditWallet_vue_vue_type_template_id_5107d76f_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  \"5107d76f\",\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/views/wallet/EditWallet.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./src/views/wallet/EditWallet.vue?");

/***/ }),

/***/ "./src/views/wallet/EditWallet.vue?vue&type=script&lang=js&":
/*!******************************************************************!*\
  !*** ./src/views/wallet/EditWallet.vue?vue&type=script&lang=js& ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditWallet_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js??ref--13-0!../../../node_modules/babel-loader/lib!../../../node_modules/cache-loader/dist/cjs.js??ref--1-0!../../../node_modules/vue-loader/lib??vue-loader-options!./EditWallet.vue?vue&type=script&lang=js& */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/wallet/EditWallet.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditWallet_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./src/views/wallet/EditWallet.vue?");

/***/ }),

/***/ "./src/views/wallet/EditWallet.vue?vue&type=template&id=5107d76f&scoped=true&":
/*!************************************************************************************!*\
  !*** ./src/views/wallet/EditWallet.vue?vue&type=template&id=5107d76f&scoped=true& ***!
  \************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_1facbfc4_vue_loader_template_node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditWallet_vue_vue_type_template_id_5107d76f_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"1facbfc4-vue-loader-template\"}!../../../node_modules/cache-loader/dist/cjs.js??ref--13-0!../../../node_modules/babel-loader/lib!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ref--6!../../../node_modules/cache-loader/dist/cjs.js??ref--1-0!../../../node_modules/vue-loader/lib??vue-loader-options!./EditWallet.vue?vue&type=template&id=5107d76f&scoped=true& */ \"./node_modules/cache-loader/dist/cjs.js?{\\\"cacheDirectory\\\":\\\"node_modules/.cache/vue-loader\\\",\\\"cacheIdentifier\\\":\\\"1facbfc4-vue-loader-template\\\"}!./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/wallet/EditWallet.vue?vue&type=template&id=5107d76f&scoped=true&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_1facbfc4_vue_loader_template_node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditWallet_vue_vue_type_template_id_5107d76f_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_1facbfc4_vue_loader_template_node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_loaders_templateLoader_js_ref_6_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditWallet_vue_vue_type_template_id_5107d76f_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./src/views/wallet/EditWallet.vue?");

/***/ })

}]);