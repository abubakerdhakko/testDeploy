<template>
  <div class="roles-tab">
    <div id="list-demo" class="roles-list">
      <div class="role-header">
        <span class="bold">Roles</span>
        <img
          src="../../../assets/icons/Add.png"
          class="icon"
          alt=""
          @click="clickAddRole"
        />
      </div>
      <transition-group name="list" tag="div">
        <div
          v-for="(role, index) in roles"
          :key="role + index"
          class="list-item"
          @click="roleSelected(role)"
        >
          {{ role.displayName }}
          <div style="display: contents">
            <img
              src="../../../assets/icons/Edit.png"
              class="icon"
              @click="clickEdit(role)"
              alt=""
              v-if="role.displayName != 'Admin'"
            />
            <img
              src="../../../assets/icons/Subtract.png"
              class="icon"
              @click="clickRemove(role)"
              alt=""
              v-if="role.displayName != 'Admin'"
            />
          </div>
        </div>
      </transition-group>
      <SButton
        title="Submit"
        @click="UpdateRole"
      />
    </div>
    <div class="empty-sec"></div>
    <div class="view-perissions">
      <span v-if="selectedRole == null"
        >Select a role to view its permissions.</span>

        <div v-else v-for="(permission,i) in permissions" :key="i" class="accordion">
            <div class="accordion-wrapper">
              <SAccordion
                :title="changeCase(permission)"
                expandIcon="arrows"
                :open="i==0?true:false"
                padding="48"
                :ref="permission+'Accordion'"
                @state="accordionFunction(permission)"
                :shadow="true"
                :border="false"

            >
                <div class="selection-type acc-padding" :key="accordionReRender">

                    <span class="bold selection-title">Selection Type</span>
                    <SCheckBox
                        :value="checkboxSelection(permission,'none')"
                        label="None"
                        @input="checkboxInput(permission,'none',$event)"
                        class="selection"
                    />

                    <SCheckBox
                        :value="checkboxSelection(permission,'custom')"
                        label="Custom"
                        @input="checkboxInput(permission,'custom',$event)"
                        class="selection"
                    />

                    <SCheckBox
                        :value="checkboxSelection(permission,'all')"
                        label="All"
                        @input="checkboxInput(permission,'all',$event)"
                        class="selection"
                    />
                </div>

                <div class="permission-header acc-padding">
                  <div class="permission-title bold">Set Permissions</div>
                  <div class="permission">Web</div>
                  <div class="permission">Mobile</div>
                </div>

                <div v-for="(value,key) in getPermissionObject(permission)" :key="key" :class="{'permission-header':true, 'permission-row':true}" >
                  <div class="permission-title bold">{{ changeCase(key) }}</div>
                  <div class="permission">
                    <img :src="getPermissionValue(permission,key,'web')"    class="icon" @click="setPermission(permission,key,'web')"    alt="">
                  </div>
                  <div class="permission">
                    <img :src="getPermissionValue(permission,key,'mobile')" class="icon" @click="setPermission(permission,key,'mobile')" alt="">
                  </div>
                </div>
            </SAccordion>
            </div>
        </div>
    </div>
    <AddRole v-if="addRoleFlag" @get-role-name="roleNameFunc" @close="close" />
    <AddRole v-if="addRoleEditFlag && selectedRole != null" @get-role-name="roleNameEditFunc" :edit="true" :title="selectedRole.displayName" @close="closeEdit" />

    <!-- Loader Component -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component -->

    <SToast
      :message="toastMessage"
      :time-out="3000"
      :type="toastType"
      :key="toastFlag"
    />

  </div>
</template>

<script>
import { AuthService } from "../../../services/AuthService.js"
import loader from "@/components/Loader.vue"
import AddRole from "./AddRole";
export default {
  name: "Roles",

  components: {
    AddRole,
    loader
  },

  data() {
    return {
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      loaderFlag: false,
      roles: [],
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10,

      selectedRole: null, // Used as a flag to show if a role is selected or not

      addRoleFlag: false,
      addRoleEditFlag: false,
      permissions:['users','assets','inspections','workOrders','inventoryAssets','iOT','locations','invoices'],

      users:{
        // selectAll:"",
        rolesAndPermissions:"",
        read:"",
        create:"",
        update:"",
        delete:"",
        selectionType:'none',

      },
      assets:{
        // selectAll:"",
        read:"",
        create:"",
        update:"",
        delete:"",
        category:"",
        selectionType:'none',
      },
      inspections:{
        // selectAll:"",
        read:"",
        create:"",
        update:"",
        delete:"",
        selectionType:'none',
      },
      workOrders:{
        // selectAll:"",
        read:"",
        create:"",
        update:"",
        delete:"",
        selectionType:'none',
      },
      inventoryAssets:{
        // selectAll:"",
        read:"",
        create:"",
        update:"",
        delete:"",
        selectionType:'none',
      },
      iOT:{
        // selectAll:"",
        read:"",
        create:"",
        update:"",
        delete:"",
        selectionType:'none',
      },
      locations:{
        // selectAll:"",
        read:"",
        create:"",
        update:"",
        delete:"",
        selectionType:'none',
      },
      invoices:{
        // selectAll:"",
        read:"",
        create:"",
        update:"",
        delete:"",
        selectionType:'none',
      },
      accordionReRender:0,
      updateWeb:0,
      updateMobile:0,
      organizationUUID:''

    };
  },

  methods: {

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
    
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length);
    },

    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++);
    },

    remove: function () {
      this.items.splice(this.randomIndex(), 1);
    },

    accordionFunction(ref){
      let str = ref+"Accordion";
      // console.log(ref,this.$refs[str][0].openFlag);
      if(this.$refs[str][0].openFlag === true){
        for(let i=0; i < this.permissions.length; i++){
          // console.log(this.permissions[i]+'Accordion',this.$refs[this.permissions[i]+'Accordion'],this.$refs[this.permissions[i]+'Accordion'][0].openFlag)
          if(this.permissions[i] !== ref){
            this.$refs[this.permissions[i]+'Accordion'][0].openFlag = false;
          }
        }
      }
    },

    clickAddRole() {
      // console.log("Add Clicked");
      this.addRoleFlag = true;
    },

    clickEdit(role) {
      // console.log(role);
      this.addRoleEditFlag = true;
    },

    clickRemove(role) {
      // console.log(role);
      this.deleteRole(role.displayName);
    },

    roleNameFunc(val) {
      // console.log(val);
      this.addRoleFlag = false;
      let Obj = {
        center: null,
        description: " ",
        displayName: val,
        organizationUUID: this.organizationUUID,
        permissions: []
      };
      this.roles.push(Obj);
      this.roleSelected(Obj);
    },

    roleNameEditFunc(val) {
      // console.log(val);
      this.addRoleEditFlag = false;
      for(let i=0; i < this.roles.length; i++){
        if(this.selectedRole.displayName === this.roles[i].displayName){
          this.roles[i].displayName = val;
          return;
        }
      }
    },

    close() {
      this.addRoleFlag = false;
    },

    closeEdit() {
      this.addRoleEditFlag = false;
    },

    resetObjects(){
      this.permissions.forEach(permission => {
        for(let [key,value] of Object.entries(this[permission])){
          // console.log(key,value);
          if(key === 'selectionType'){
            this[permission][key] = 'custom';
          }else{

            this[permission][key] = ""
          }
          // console.log(key,value,this[permission]);
        }
      });
    },

    roleSelected(role) {
      this.resetObjects();
      this.selectedRole = role;
      // console.log(this.selectedRole);
      for(let i=0; i < this.selectedRole.permissions.length; i++){
        let str = this.selectedRole.permissions[i].value.toLowerCase();
        str = str.replace(/\s/g, '');
        this.mapPermission(str);
        // console.log(str,this.selectedRole.permissions[i].value.indexOf("inventoryAssets"));
        // console.log(this.selectedRole.permissions[i].value,this.selectedRole.permissions[i].value.indexOf('Web'),this.selectedRole.permissions[i].value.indexOf('Mobile'));

        // console.log()
      }
      this.accordionReRender++;
    },

    mapPermission(str){
      // console.log(str);
      if(str.indexOf('users') > -1){
        this.mapToObject(str,'users')
      }
      else if(str.indexOf('inventoryassets') > -1){
        this.mapToObject(str,'inventoryAssets')
      }
      else if(str.indexOf('inspections') > -1){
        this.mapToObject(str,'inspections')
      }
      else if(str.indexOf('workOrders') > -1){
        this.mapToObject(str,'workOrders')
      }
      else if(str.indexOf('assets') > -1){
        this.mapToObject(str,'assets')
      }
      else if(str.indexOf('iot') > -1){
        this.mapToObject(str,'iOT')
      }
      else if(str.indexOf('locations') > -1){
        this.mapToObject(str,'locations')
      }
      else if(str.indexOf('invoices') > -1){
        this.mapToObject(str,'invoices')
      }
    },

    mapToObject(str,objectName){
        // console.log(str,objectName);
        // console.log("MApping")

        if(str.indexOf('read')>-1){
          // this[objectName].read="";
          if(str.indexOf('web') > -1 && this[objectName].read.indexOf('w') === -1){
            this[objectName].read += 'w';
          }
          if(str.indexOf('mobile') > -1 && this[objectName].read.indexOf('m') === -1){

            this[objectName].read += 'm';
          }

        }

        if(str.indexOf('create')>-1){
          // this[objectName].create="";
          if(str.indexOf('web') > -1 && this[objectName].create.indexOf('w') === -1){
            this[objectName].create += 'w';
          }
          if(str.indexOf('mobile') > -1 && this[objectName].create.indexOf('m') === -1){

            this[objectName].create += 'm';
          }
        }

        if(str.indexOf('delete')>-1){
          // this[objectName].delete="";
          // this[objectName].delete += str.indexOf('web') > -1 ? 'w' :str.indexOf('mobile') > -1 ?'m':"";
          if(str.indexOf('web') > -1 && this[objectName].delete.indexOf('w') === -1){
            this[objectName].delete += 'w';
          }
          if(str.indexOf('mobile') > -1 && this[objectName].delete.indexOf('m') === -1){

            this[objectName].delete += 'm';
          }

        }
        if(str.indexOf('update')>-1){
          // this[objectName].update="";
          // this[objectName].update += str.indexOf('web') > -1 ? 'w' :str.indexOf('mobile') > -1 ?'m':"";
          if(str.indexOf('web') > -1 && this[objectName].update.indexOf('w') === -1){
            this[objectName].update += 'w';
          }
          if(str.indexOf('mobile') > -1 && this[objectName].update.indexOf('m') === -1){

            this[objectName].update += 'm';
          }
        }
        if(str.indexOf('category')>-1){
          // this.assets.category="";
          // this.assets.category += str.indexOf('web') > -1 ? 'w' :str.indexOf('mobile') > -1 ?'m':"";
          if(str.indexOf('web') > -1 && this.assets.category.indexOf('w') === -1){
            this.assets.category += 'w';
          }
          if(str.indexOf('mobile') > -1 && this.assets.category.indexOf('m') === -1){

            this.assets.category += 'm';
          }
        }
        if(str.indexOf('rolespermissions')>-1){
          // this.users.rolesAndPermissions="";
          // console.log(this.users.rolesAndPermissions);
          if(str.indexOf('web') > -1  && this.users.rolesAndPermissions.indexOf('w') === -1){

            this.users.rolesAndPermissions +=  'w';
          }
          if(str.indexOf('mobile') > -1 && this.users.rolesAndPermissions.indexOf('m') === -1){

            this.users.rolesAndPermissions += 'm';
          }
        }

        // console.log("Mapped OBJ : ",this[objectName]);
    },

    changeCase(val){
      let str = val;
      if(str === "iOT"){

        str = str.replace(/([A-Z])/g,'$1');
      }
      else{
        str = str.replace(/([A-Z])/g,' $1');

      }
      str = str.charAt(0).toUpperCase()+str.slice(1);
      return str;
    },

    checkboxInput(permission,selection,$event){
      // console.log(permission,selection,$event);
      this[permission].selectionType = selection;

      if(selection === 'all'){
        for(let key of Object.keys(this[permission])){
          if(key !== 'selectionType'){
            this[permission][key] = "wm";
          }
        }
      }
      if(selection === 'none'){
        for(let [key,val] of Object.entries(this[permission])){
          if(key !== 'selectionType'){
            this[permission][key] = "";
          }
        }
      }
      // console.log(this[permission]);
      this.accordionReRender++;
      this.$forceUpdate();
    },

    checkboxSelection(permission,selection){
      // console.log(permission);
      // console.log(this[permission].selectionType);
      if(this[permission].selectionType === selection){
        return true;
      }
      else{
        return false;
      }
    },

    getPermissionObject(permission){
      // console.log(permission);

      // THESE TWO LINES ARE A WORK ARROUND FOR NOT INVOKING VUE'S REACTIVITY FOR THE OBJECT BELOW.
      let Obj = JSON.stringify(this[permission]);
      Obj = JSON.parse(Obj);

      delete Obj.selectionType; //removing selectionType entry because it is not needed for permissions.

      // console.log(Obj);
      return Obj;
    },

    //medium in below funcs refers to the platform i.e. Web/Mobile

    getPermissionValue(permission,key,medium){
      let temp = medium==='web'?'w':'m'
      if(this[permission][key].indexOf(temp) !== -1){
        return require('../../../assets/icons/Checked.svg')
      }else{
        return require('../../../assets/icons/Unchecked.svg')
      }
    },

    setPermission(permission,key,medium){
      let temp = medium==='web'?'w':'m';


      // console.log(this[permission][key],permission,key,temp);
      if(this[permission][key].indexOf(temp) === -1){
        this[permission][key] += temp;
        // console.log(this[permission][key]);
      }else{
        this[permission][key] = this.removeChar(permission,key,temp);
        // console.log(this[permission][key]);
      }
    },

    removeChar(permission,key,chr){
      var tmp = this[permission][key];
      let pos = this[permission][key].indexOf(chr);// finding the index of the char (permission value)
      tmp = tmp.split(''); // convert to an array
      tmp.splice(pos, 1);  // remove 1 element from the array (adjusting for non-zero-indexed counts)
      return tmp.join(''); // reconstruct the string
    },

    getAllRoles(){
      this.roles = [];
      this.selectedRole = null;
      AuthService.getAllRoles(this.organizationUUID)
      .then(res => {
        this.roles = res.data;
      })
      .catch(err => {
        console.log(err)
      });
    },

    deleteRole(roleName){
      AuthService.deleteRole(roleName,this.organizationUUID)
      .then(res => {
        this.resetObjects();
        this.getAllRoles();
      })
      .catch( err => {
        console.log(err);
      }

      );
    },

    editRole(){},

    createRole(roles){
      this.loaderFlag = true
      AuthService.saveAllRoles(roles)
      .then(res =>{
        this.loaderFlag = false
        if(res.status === 200 && res.data.responseIdentifier === "Success"){
          this.resetObjects();
          this.getAllRoles();
        }else{
          this.showToast(res.data.description,"warning")
        }
        
      })
      .catch(err => {
        console.log(err);
      });
    },

    UpdateRole(){
      // console.log("Update",this.selectedRole);
      for(let i=0; i < this.permissions.length; i++){
        // console.log("********************************",this.permissions[i]);
        for(let [key,value] of Object.entries(this[this.permissions[i]])){
            // console.log(key,value);
            if(key !== 'selectionType'){
              for(let j=0; j < value.length; j++){
                // console.log(value[j]);
                if(value[j] === 'm' || value[j] === 'w'){

                  this.pushPermission(this.permissions[i], key, value[j]);
                }

              }
              if(value.length === 1){
                let temp = value[0] === 'm'?'w':'m';
                this.deletePermission(this.permissions[i], key, temp);
              }
              if(value.length === 0){

                this.deletePermission(this.permissions[i], key, 'w');
                this.deletePermission(this.permissions[i], key, 'm');

              }
            }
        }
      }
      // console.log(this.selectedRole,this.roles);
      this.createRole(this.roles);

    },

    pushPermission(objectName, objectKey, medium){
      // console.log(objectName, objectKey, medium);
      let str = objectName==='iOT'?'Iot':objectName.replace(objectName.charAt(0),objectName.charAt(0).toUpperCase());
      str += objectKey==='rolesAndPermissions'?' RolesPermissions':' '+objectKey.replace(objectKey.charAt(0),objectKey.charAt(0).toUpperCase());
      str += medium==='w'?' Web':' Mobile'
      // console.log(this.selectedRole);
      for(let i=0; i < this.selectedRole.permissions.length; i++){
          // console.log(this.selectedRole.permissions[i].value,':',str);
        if(this.selectedRole.permissions[i].value === str){
          return;
        }
      }
      this.selectedRole.permissions.push({displayName:str, value:str});
    },

    deletePermission(objectName, objectKey, medium){

      let str = objectName==='iOT'?'Iot':objectName.replace(objectName.charAt(0),objectName.charAt(0).toUpperCase());
      str += objectKey==='rolesAndPermissions'?' RolesPermissions':' '+objectKey.replace(objectKey.charAt(0),objectKey.charAt(0).toUpperCase());
      str += medium==='w'?' Web':' Mobile'
      // console.log(this.selectedRole);
      for(let i=0; i < this.selectedRole.permissions.length; i++){
          // console.log(this.selectedRole.permissions[i].value,':',str);
        if(this.selectedRole.permissions[i].value === str){
          this.selectedRole.permissions.splice(i,1);
          return;
        }
      }
    }

  },

  created() {
    this.organizationUUID = JSON.parse(localStorage.getItem("currentUserDetails")).profile.organizationId
    this.getAllRoles();
  },

  validations: function () {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.roles-tab {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.role-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding:8px;
  border-bottom: 1px solid var(--very-light-pink);
  .icon {
    cursor: pointer;
    opacity: 0.5;
    margin-left: 80px;
    width: 24px;
    background-color: transparent;
    transition: all 0.3s;
    float: right;
  }
  .icon:hover {
    opacity: 1;
    background-color: var(--secondary);
  }
  .icon:active {
    opacity: 0.3;
  }
}

.roles-list {
  flex: 2;
  border: 1px solid var(--very-light-pink);
  box-shadow: 0 0 10px var(--very-light-pink);
}

.empty-sec{
    flex: 1;
}

.view-perissions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  flex: 7;
//   width: 60%;
}

.selection-type{
    display: flex;
    // flex-direction: column;
    justify-content: space-between;
    border-top: 1px solid var(--very-light-pink);
    font-size: 14px;
    line-height: 1.13;
    border-bottom: 1px solid var(--very-light-pink);

    .selection-title{
      flex: 2;
    }

    .selection{
      flex: 1;
    }
}

.permission-header{
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 1.13;

    .permission-title{
      flex: 2;
    }

    .permission{
      flex: 1.5;
      position: relative;
    }

    .icon{
      width: 20px;
      height: 20px;
      position: absolute;
      cursor: pointer;
      // top: 0;
      left: 0;
    }
}

.acc-padding{
  padding: 24px 48px;
}

.permission-row{
  padding: 12px 48px;
}
.permission-row:last-child{
  padding: 12px 48px 32px 48px;
}

.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.list-item {
  //   display: inline-block;
  //   margin-right: 10px;
  cursor: default;
  font-size: 16px;
//   margin-top: 8px;
  padding: 8px 8px 8px 8px;

  text-transform: capitalize;
  .icon {
    cursor: pointer;
    width: 16px;
    float: right;
    opacity: 0.7;
    transition: all 0.3s;
  }
  .icon:first-child {
    margin-left: 8px;
  }
  .icon:hover {
    opacity: 1;
    background-color: var(--very-light-pink);
  }
  .icon:active {
    //   opacity: 0.3;
    width: 17px;
  }
}

.accordion-wrapper{
  margin-bottom: 24px;
}

.list-item:hover {
  background-color: var(--very-light-pink);
}

.accordion{
    width: 100%;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s;
}

.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>