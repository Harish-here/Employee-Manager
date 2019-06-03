<template>
  <div id="DataTable" class='relative flex flex-column'>
      <transition name='fade'>
        <div class='absolute self-center pa2 bg-light-red br2 white' style='margin-left:50%;z-index:1000;' :class="AlertCls" v-show='ShowAlert'><span>{{AlertMsg}}</span></div>
      </transition>
      <table class='w-100 relative'>
        <thead class='bb b--light-silver'>
            <tr class='flex'>
              <th v-for='(i,index) in TableHead'
                  :key='i'
                  class='tl' 
                  :class='{"_flx_15" : index <=3,"_flx_1" : index >3,"-mod": (ViewType === "Department" || ViewType === "Team") && index === 2,"tr mr3": i == "Actions" }'>
                 <span v-if='List.length > 0 && ViewType === "Employee" && i === "Traveller"'>
                     <input type="checkbox" class='mr2' v-model='SelectAll' :value="List.filter(x => x.department !== null &&  x.department.departmentName != 'Master Admin').map(y => y.travelAgencyUsersId)">&nbsp;&nbsp;&nbsp;</span>
                       {{i}}
              </th> 
            </tr>
           <!-- <transition name='fade'> -->

           <!-- </transition> -->
        </thead>
        <thead v-if="ToDelete.length > 0 && ViewType === 'Employee'">
            <tr id='applyAll' class='bg-white flex'>
                <!-- <div class='flex w-100 justify-between items-baseline'> -->
                    <td class='_flx_15'>
                      Apply to <span v-if='ToDelete.length > 0' class='badge'>{{ToDelete.length}}</span> Traveller(s)
                    </td>
                    <td class='_flx_15'>
                        <select class='w-20' v-model='Department'>
                            <option value='0' selected disabled>Team</option>
                            <option v-for='i in TeamOption["departments"].filter(x => x.parent !== "0")'
                                    v-if='i.departmentName !== "Master Admin"'
                                    :value='i.departmentId' :key='i.departmentId'>{{ i.departmentName}}</option>
                        </select>
                    </td>
                    <td class='_flx_15'>
                        <select class='w-20' v-model='Design'>
                            <option value='0' selected disabled>Designation</option>
                            <option v-for='i in DesignList' v-if='i.label !== "Master Admin"' :value='i' :key='i.value'>{{ i.label }}</option>
                        </select>                        
                    </td>
                    <td class="_flx_1">
                        <select class='w-20' v-model='Policy'>
                            <option value='0' selected disabled>Policy</option>
                            <option v-for='i in BundleList' v-if='i.label !== "Master Admin"' :value='i' :key='i.value'>{{ i.label }}</option>
                        </select>
                    </td>
                    <td class="_flx_1 flex justify-around">
                        <select  v-model='Account'>
                            <option value='null' selected disabled>Account</option>
                            <option  value='1'>Enable</option>
                            <option  value='0'>Disable</option>
                        </select>
                    </td>
                    <td class='flex items-center justify-center'>
                        <div class='flex w-75 justify-between'>
                            <button @click='MultipleAssign' class='btn btn-xs btn-primary fr'
                                    :disabled='(Department === "0") && Design === "0" && Policy === "0" && (Account === null || Account === "null")'>
                                <!-- <i class="fa fa-check-square-o" aria-hidden="true"></i>  -->save
                            </button>
                            <button @click='ToDelete =[],Account=null,Policy="0",Design="0",Department="0"' class='btn btn-xs btn-default fr'>
                                <!-- <i class="fa fa-check-square-o" aria-hidden="true"></i>  -->Clear
                            </button>
                        </div>
                    </td>
                    
     
                <!-- </div> -->
            </tr>
        </thead>
        <tbody v-if='ViewType === "Employee"'>
            <tr class='flex bb b--light-silver'
                v-for='(i,index) in List'
                :key='index'
                :class='{"no-app":i.approverList.length === 0,"bg-light-reds":(i.resign == "1"),"act-row" : i === ActiveRow, "opa" : (i.department !== null && i.department.departmentName === "Master Admin") || i.resign == "1" || i.status == "0" }'
                >
                <td class='_flx_15 flex justify-evenly items-center'>
                    <input  type='checkbox' v-if='i.department.departmentName !== "Master Admin"' :value='i.travelAgencyUsersId' v-model='ToDelete'>&nbsp;&nbsp;&nbsp;
                    <span>
                        {{i.travelAgencyNameTemp}} {{ i.virtualName }}
                    </span>
                </td>
                <td class='_flx_15' :class='{"light-red": i.department === null}'>{{ (i.department === null || i.department == "") ? "-" : (i.department.departmentName || "") }}</td>
                <td class='_flx_15' :class='{"light-red": i.designation === null}'>{{ (i.designation !== null ) ? i.designation.label : 'Unassigned' }}</td>
                <td class='_flx_15' :class='{"light-red": i.benefitBundle === null}'>{{ (i.benefitBundle !== null) ? i.benefitBundle.label : 'Unassigned' }}</td>
                <!-- <td class='_flx_1 tc' :class='{"light-red": i.hierarchyId === null}'>{{ (i.hierarchyId !== null) ? i.hierarchyId : 'Unassigned' }}</td> -->
                <td class='_flx_1'>{{(i.travelDeskResr !== null && i.travelDeskResr.length > 0) ? (i.travelDeskResr.split('|')[1] == "yes") ? "Yes" : "No" : ""}}</td>
                <td class='_flx_1'>{{(function(){
                        switch(i.role){
                            case '1': return "Travel Desk";break;
                            case '2': return "Finance";break;
                            case '3': return "Traveller"; break;
                        }
                    })()}}</td>
                <td class='_flx_1 tr'>
                    <button class="btn-spl"
                            v-if='i.department !== null && i.department.departmentName !== "Master Admin"'
                            @click='sendThis(i,"Update")'>
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                        
                    </button>
                    <button class="btn-spl"
                            
                            @click='sendThis(i,"Display")'>
                        <i class="fa fa-eye" aria-hidden="true"></i>
                        
                    </button>
                    <!-- <input type="checkbox" :checked='(i.active === "1")' data-toggle="toggle" data-on="active" data-off='disabled' data-size='mini'> -->
                </td>
            </tr>
            <tr class='flex justify-center bb b--light-silver' v-if='List.length === 0'>
                <td colspan='6' class='gray tc w-100'>No Travellers Available </td>
            </tr>
        </tbody>
        <tbody v-if='ViewType === "Team"'>
            <tr class='flex bb b--light-silver'
                v-for='(i,index) in List'
                v-if='i.parent != "0"'
                :key='index'
                :class='{"opa" : i.active === "0" || i.departmentName === "Master Admin"}'
                >
                <td class="_flx_15">{{ i.departmentName }}</td>
                <td class="_flx_15">{{ i.departmentCode }}</td>
                <td class="_flx_15">{{ GetTheLabel("travelDesk",i.travelDesk)  }}</td>
                <td class="_flx_1">{{ GetTheLabel("budgetApprover",i.budgetApprover)  }}</td>
                <td class="_flx_1">{{ GetTheLabel("financeApprover",i.financeApprover)  }}</td>
                <td class='_flx_1 tr'>
                   <button class="btn-spl"
                           v-if='i.departmentName !== "Master Admin"'
                           @click='sendThis(i,"Update")'>
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                        
                    </button>
                   <button class="btn-spl"
                           v-if='i.departmentName !== "Master Admin"'
                           @click='sendThis(i,"Display")'>
                        <i class="fa fa-eye" aria-hidden="true"></i>
                        
                    </button>                    
                </td>
             </tr>
             <tr class='flex justify-center bb b--light-silver' v-if='List.length === 0'>
                <td colspan='6' class='gray tc w-100'>No Teams Available</td>
            </tr>
        </tbody>
        <tbody v-if='ViewType === "Department"'>
            <tr class='flex bb b--light-silver'
                v-for='(i,index) in List'
                v-if='i.parent == "0"'
                :key='index'
                :class='{"opa" : i.active === "0" || i.departmentName === "Master Admin"}'
                >
                <td class="_flx_15">{{ i.departmentName }}</td>
                <td class="_flx_15">{{ i.departmentCode }}</td>
                <td class="_flx_1">{{ GetTheLabel("financeApprover",i.financeApprover)  }}</td>
                <td class='_flx_15 tr'>
                   <button class="btn-spl"
                           v-if='i.departmentName !== "Master Admin"'
                           @click='sendThis(i,"Update")'>
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                        
                    </button>
                   <button class="btn-spl"
                           v-if='i.departmentName !== "Master Admin"'
                           @click='sendThis(i,"Display")'>
                        <i class="fa fa-eye" aria-hidden="true"></i>
                        
                    </button>                    
                </td>
             </tr>
             <tr class='flex justify-center bb b--light-silver' v-if='List.length === 0'>
                <td colspan='6' class='gray tc w-100'>No Departments Available</td>
            </tr>
        </tbody>
        <!-- Designation -->
        <tbody v-if='ViewType === "Designation"'>
            <tr class='flex bb b--light-silver'
                v-for='(i,index) in List'
                :key='index'
                :class='{"opa" : i.designationName === "Master Admin"}'
                >
                <td class="_flx_15">{{ i.designationName }}</td>
                <td class="_flx_15">{{ i.designationCode }}</td>
                <!-- <td class="_flx_15">{{ i.department.departmentName || "" }}</td>                 -->
                <td class="_flx_15">{{ i.benefitBundle.label }}</td>
                <td class="_flx_1">{{ i.role.label || "" }}</td>
                <td class="_flx_1">{{ i.reservHandle.label || "" }}</td>
                <td class='_flx_1 tr'>
                    <button class="btn-spl"
                            v-if="i.designationName !== 'Master Admin'"
                            @click='sendThis(i,"Update")'>
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                        
                    </button>
                    <button class="btn-spl"
                            
                            @click='sendThis(i,"Display")'>
                        <i class="fa fa-eye" aria-hidden="true"></i>
                        
                    </button>
                </td>
             </tr>
             <tr class='flex justify-center bb b--light-silver' v-if='List.length === 0'>
                <td colspan='6' class='gray tc w-100'>No Designation Available</td>
            </tr>
        </tbody>

      </table>
  </div>
</template>

<script>

import api from '../assets/api'
//https://api.myjson.com/bins/xn8bm
export default {
  name: 'DataTable',
  props : {
      ListData : {
          type: Array,
          default: function(){
              return []
          }
      },
      subView: {
          type: String,
          default: 'Create'
      },
      ViewType : {
          type: String,
          default: 'Employee'
      },
      Query: {
          type: String,
          default: ''
      },
      Extra:{
          type: Array,
          default: function(){
              return []
          }
      }
  },
  created: function(){
      this.GetBundle(1);
      this.GetTeamOptions();
      this.GetDesignation()
  },
  data(){
      return {
        EmployeeHeading: ['Traveller','Team','Designation','Travel Policy','Approver','Role','Actions'],
        TeamHeading: ['Team','Code',"Travel Desk","Budget Approver","Finance Approver",'Actions'],
        DesignationHeading: ['Designation','Code','Travel Policy',"Role","Approver",'Actions'],
        DepartmentHeading: ['Department','Code',"Finance Approver",'Actions'],
        ToDelete:[],
        ActiveRow: {},
        Department:'0',
        Design: '0',
        Policy: '0',
        TeamOption: {},
        DesignList: [],
        ShowAlert: false,
        AlertMsg: 'Alert Message',
        AlertCls: 'bg-green',
        SelectAll: [],
        BundleList: [],
        Account: null
      }
  },

  watch : {
      'ViewType' : function(val){
                this.ActiveRow = {};
                
      },
    //   'Department': function(val){
          
    //   },
      'SelectAll': function(val,old){
          if(val.length > 0 && val[0].length > 0){
              this.ToDelete = [...this.ToDelete,...val[0]];
          }else{
            
              for(let c=0;c < old[0].length;c++){
                  this.ToDelete.splice(this.ToDelete.indexOf(old[0][c]),1);
              }
              this.Department = '0';
              this.Design = '0';
              this.Policy = '0';
              this.Account = null;
          }
      },
      'subView': function(val){
          if(val == 'Create'){
              this.ActiveRow = {};
          }
          
      },
      'List':{
          immediate: true,
          handler:  function(arr){
                    this.$emit('ListChanged',arr.length);
                //emitting the new value array length
            }
      }
  },

  computed : {
      List(){
          if(this.Query !== '' && this.Query.length > 0){
          
          var self = this;
          return this.ListData.filter(x => {
              if(self.ViewType === 'Employee'){
                  return ( x['travelAgencyNameTemp'] +' ' + x[self.SearchProperty]+' '+x['department'].departmentName+' '+x['benefitBundle'].label+' '+x['designation'].label).toLowerCase().includes(self.Query.toLowerCase())
              }else{
                  if(self.ViewType === 'Department' || self.ViewType === 'Team')
                  return x[self.SearchProperty].toLowerCase().includes(self.Query.toLowerCase())
                  else{
                      return (x[self.SearchProperty]+' '+x['benefitBundle'].label).toLowerCase().includes(self.Query.toLowerCase())
                  }
              }
             
          });
          }else{
              return this.ListData
          }
      },
        //to find right property search for each separate meta obj
      SearchProperty(){
          const self = this;
        if(self.ViewType === 'Employee') return 'virtualName'
        if(self.ViewType === 'Department' || this.ViewType === 'Team') return 'departmentName'
        if(self.ViewType === 'Designation') return 'designationName'
      },

      TableHead(){
          if(this.ViewType === 'Employee') return this.EmployeeHeading
          if(this.ViewType === 'Department') return this.DepartmentHeading
          if(this.ViewType === 'Designation') return this.DesignationHeading
          if(this.ViewType === 'Team') return this.TeamHeading

      },
  },

  methods: {
      sendThis: function(data,type){
          type = type || 'Display';
          this.ActiveRow = data; 
          this.$emit('rowClicked',{data:JSON.parse(JSON.stringify(data)),view: type});
      },
      GetTheLabel:  function(label,id){
        let a =  this.TeamOption[label].filter(x => {
            return (label === "parent") ? 
                            (x["departmentId"] == id) :
                            (x["value"] == id)
        });

        return (a.length > 0) ? (label === 'parent') ?  a[0]['departmentName'] : a[0]['label'] : "NA"
      },
      GetTeamOptions: function(){
            const self = this;
            $.post(api.teamOptions,{data: ""})
            .done(function(data){
                try{
                self.TeamOption = JSON.parse(data);
                }catch(e){
                alert('An unexpected error occurred. Please refresh or login again.');
                console.log("Wrong JSON"+e)
                }
            })
      },
      DeleteAll: function(){
          var self = this;
          if(confirm('Are you Sure to delete the Selected Travellers?')){
            $.post(api.deleteAll,{dataId : self.ToDelete}).done(function(data){
                if(data.toString().includes('true')){
                    self.ToDelete = [];
                    self.ThroughAlert('Selected records got deleted successfully.','bg-light-red');
                    self.$emit('ActionDone')
                }else{
                    self.ThroughAlert('An unexpected error occurred. Please refresh or login again.','bg-light-red');
                }
            }).fail(x=> {
                self.ThroughAlert('It seems service not available due to network issue. Please refresh or login again.','bg-red');
            });
          }
      },
     GetBundle: function(id){ //dropdown for the Bundle
       var self = this
      $.post(api.dropdown.bundle,{"dataId":id}).done(function(data){
         try{
           self.BundleList = JSON.parse(data);
         }catch(e){
           self.ThroughAlert('An unexpected error occurred. Please refresh or login again.','bg-light-red');
         }
         
       }).fail(x => self.ThroughAlert('It seems service not available due to network issue. Please refresh or login again.','bg-red'));
     },
      GetDesignation: function(){ //dropdown for the Design
       var self = this
       
      $.post(api.dropdown.design,{"dataId":""}).done(function(data){
         try{
           self.DesignList = JSON.parse(data);
         }catch(e){
           self.ThroughAlert('An unexpected error occurred. Please refresh or login again.','bg-light-red');
         }
         
       }).fail(x => self.ThroughAlert('It seems service not available due to network issue. Please refresh or login again.','bg-light-red'));
     },
     MultipleAssign: function(){
         const self = this;
         if(confirm('Warning! Applying changes is permanent and cannot be undone. Are you sure you want to proceed?')){
            var delay = alertify.get('notifier','delay');
            alertify.set('notifier','delay', 200);
            alertify.warning('Assigning to the selected People');
            alertify.set('notifier','delay', delay);
            var dataToSend = {
                employee:self.ToDelete,
                 department:self.Department,
                 designation:self.Design,
                 policy:self.Policy,
                 account:self.Account
                 };
                if(dataToSend["designation"] == "0"){
                    delete dataToSend.designation
                }
                if(dataToSend["policy"] == "0"){
                    delete dataToSend.policy
                }
             $.post(api.updateBulk,{...dataToSend}).done(function(data){
                 if(data.includes("true")){
                     self.ToDelete = [];
                     self.SelectAll = [];
                     self.Department = '0';
                     self.Design = '0';
                     self.Policy = '0';
                     self.Account = null;
                     self.ThroughAlert('Successfully Assigned','bg-green');
                     self.$emit('ActionDone');
                 }else{
                      self.ThroughAlert('An unexpected error occurred. Please refresh or login again.','bg-light-red');
                 }
                 alertify.dismissAll();
             }).fail(x => {
                 alertify.dismissAll();
                 self.ThroughAlert('It seems service not available due to network issue. Please refresh or login again.','bg-light-red');

             });
         }
     },
     ThroughAlert: function(msg,cls){
    //    var self = this;
    //    this.AlertMsg = msg;
    //    this.AlertCls = cls;
    //    this.ShowAlert = true;
    //    setTimeout(function(){ 
    //      self.ShowAlert=false;
    //       },2500)
       if(cls === 'bg-green'){
           alertify.success(msg);
       }else{
           alertify.error(msg);
       }
     },
  }
}
</script>

<style>
#applyAll{
    background-color: #f9f9f9;
}
#DataTable{
 flex:1 0 0;
}
table{
    flex:1 0 0;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
}
thead{ height : auto; flex: 0 0 0 ;}

tbody{
flex: 1 0 0 ; 
overflow-y:auto;
/* height: calc(100% - 130px); */
}
td,th{
    padding: 10px;
    text-align: left;
}
tr > th, tr > td { flex:1 1 0; align-self: baseline;}
.assign{
    position: absolute;
    top:40px;
}
.act-row{
    background-color: #00a0c20f;
}
.--mod{
    text-align: right;
    padding-right: 40px;
}
</style>
