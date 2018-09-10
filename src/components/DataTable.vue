<template>
  <div id="DataTable" class='relative'>
      <transition name='fade'>
        <div class='absolute self-center pa2 bg-light-red br2 white' style='margin-left:50%;z-index:1000;' :class="AlertCls" v-show='ShowAlert'><span>{{AlertMsg}}</span></div>
      </transition>
      <table class='w-100 relative'>
        <thead class='bb b--light-silver'>
            <tr class='flex'>
              <th v-for='(i,index) in TableHead'
                  :key='i' 
                  :class='{"_flx_15" : index <3,"_flx_1" : index >3 }'>{{i}}</th> 
            </tr>
        </thead>
        <tbody v-if='ViewType === "Employee"'>
            <tr class='flex bb b--light-silver'
                v-for='(i,index) in List'
                :key='index'
                >
                <td class='_flx_15 flex justify-evenly items-center'>
                    <input  type='checkbox' v-if='!i.hasOwnProperty("master")' :value='i.travelAgencyUsersId' v-model='ToDelete'>&nbsp;&nbsp;&nbsp;
                    <span>
                        {{ i.virtualName }}
                    </span>
                </td>
                <td class='_flx_15' :class='{"light-red": i.department === null}'>{{ (i.department !== null ) ? i.department.departmentName : 'Unassigned' }}</td>
                <td class='_flx_15' :class='{"light-red": i.designation === null}'>{{ (i.designation !== null ) ? i.designation.label : 'Unassigned' }}</td>
                <td class='_flx_1' :class='{"light-red": i.benefitBundle === null}'>{{ (i.benefitBundle !== null) ? i.benefitBundle.label : 'Unassigned' }}</td>
                <td class='_flx_1 tc' :class='{"light-red": i.hierarchyId === null}'>{{ (i.hierarchyId !== null) ? i.hierarchyId : 'Unassigned' }}</td>
                <td class='_flx_1'>
                    <button class="btn btn-xs btn-primary"
                            v-if="!i.hasOwnProperty('master')"
                            @click='sendThis(i)'>
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                        Edit
                    </button>
                    <!-- <input type="checkbox" :checked='(i.active === "1")' data-toggle="toggle" data-on="active" data-off='disabled' data-size='mini'> -->
                </td>
            </tr>
            <tr class='flex justify-center bb b--light-silver' v-if='List.length === 0'>
                <td colspan='6' class='gray tc w-100'>No Employees Available </td>
            </tr>
        </tbody>
        <tbody v-if='ViewType === "Department"'>
            <tr class='flex bb b--light-silver'
                v-for='(i,index) in List'
                :key='index'
                :class='{"opa" : i.active === "0"}'
                >
                <td class="_flx_15">{{ i.departmentName }}</td>
                <td class="_flx_15">{{ i.departmentCode }}</td>
                <td class='_flx_15'>
                   <button class="btn btn-xs btn-primary"
                           v-if="!i.hasOwnProperty('master')"
                           @click='sendThis(i)'>
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                        Edit
                    </button>
                </td>
             </tr>
             <tr class='flex justify-center bb b--light-silver' v-if='List.length === 0'>
                <td colspan='6' class='gray tc w-100'>No Departments Available</td>
            </tr>
        </tbody>
        <tbody v-if='ViewType === "Designation"'>
            <tr class='flex bb b--light-silver'
                v-for='(i,index) in List'
                :key='index'
                >
                <td class="_flx_15">{{ i.designationName }}</td>
                <td class="_flx_15">{{ i.department.departmentName }}</td>                
                <td class="_flx_15">{{ i.benefitBundle.label }}</td>
                <td class='_flx_1'>
                    <button class="btn btn-xs btn-primary"
                            v-if="!i.hasOwnProperty('master')"
                            @click='sendThis(i)'>
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                        Edit
                    </button>
                </td>
             </tr>
             <tr class='flex justify-center bb b--light-silver' v-if='List.length === 0'>
                <td colspan='6' class='gray tc w-100'>No Designation Available</td>
            </tr>
        </tbody>
        <transition name='fade'>
            <tfooter class='bg-white pa1' v-if='ToDelete.length > 0'>
                <div class='flex fl w-60 justify-between items-baseline'>
                    <select class='w-35' v-model='Department'>
                        <option value='0' selected disabled>Department</option>
                        <option v-for='i in Extra' :value='i.departmentId' :key='i.departmentId'>{{ i.departmentName}}</option>
                    </select>
                    <select class='w-35' v-model='Design'>
                        <option value='0' selected disabled>Designation</option>
                        <option v-for='i in DesignList' :value='i' :key='i.value'>{{ i.label }}</option>
                    </select>
                    <button @click='MultipleAssign' class='btn btn-xs btn-primary' :disabled='Department === "0" || Design === "0"'>Assign</button>
                </div>
                <div class='fr w-10 tc ba b--light-gray pa1' >
                    <button class='btn btn-xs btn-danger' @click='DeleteAll'  ><i class='fa fa-trash'></i></button>
                </div>
            </tfooter>
        </transition>
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
  data(){
      return {
        EmployeeHeading: ['Employee','Department','Designation','Policy','Hierarchy','Actions'],
        DepartmentHeading: ['Department','Code','Action'],
        DesignationHeading: ['Designation','Department','Policy','Actions'],
        ToDelete:[],
        ActiveRow: {},
        Department:'0',
        Design: '0',
        DesignList: [],
        ShowAlert: false,
        AlertMsg: 'Alert Message',
        AlertCls: 'bg-green'
      }
  },

  watch : {
      'ToDelete' : function(val){
              this.$emit('dataChecked',val);
      },
      'Department': function(val){
          this.GetDesignation(val)
      },
  },

  computed : {
      List(){
          if(this.Query !== ''){
          var regex =  new RegExp(this.Query.toLowerCase(),'');
          var self = this;
          return this.ListData.filter(x => {
             return regex.test(x[self.SearchProperty].toLowerCase())
          })
          }else{
              return this.ListData
          }
      },
        //to find right property search for each separate meta obj
      SearchProperty(){
          const self = this;
        if(self.ViewType === 'Employee') return 'virtualName'
        if(self.ViewType === 'Department') return 'departmentName'
        if(self.ViewType === 'Designation') return 'designationName'
      },

      TableHead(){
          if(this.ViewType === 'Employee') return this.EmployeeHeading
          if(this.ViewType === 'Department') return this.DepartmentHeading
          if(this.ViewType === 'Designation') return this.DesignationHeading

      },
  },

  methods: {
      sendThis: function(data){
          this.ActiveRow = data; 
          this.$emit('rowClicked',data);
      },

      DeleteAll: function(){
          var self = this;
          if(confirm('Are you Sure to delete the Selected employees?')){
            $.post(api.deleteAll,{dataId : self.ToDelete}).done(function(data){
                if(data.toString().includes('true')){
                    self.ToDelete = [];
                    self.ThroughAlert('Wow...Done..!','bg-light-red');
                    self.$emit('ActionDone')
                }
            }).fail(x=> {
                self.ThroughAlert('Sorry we messed up..','bg-red');
            });
          }
      },
      GetDesignation: function(id){ //dropdown for the Design
       var self = this
       
      $.post(api.dropdown.design,{"dataId":id}).done(function(data){
         try{
           self.DesignList = JSON.parse(data);
         }catch(e){
           alert('something went wrong please try again');
         }
         
       }).fail(x => alert('something went wrong please try again'));
     },
     MultipleAssign: function(){
         const self = this;
         if(confirm('Sure to Assign them all..?')){
             $.post(api.updateBulk,{employee:self.ToDelete,department:self.Department,designation:self.Design}).done(function(data){
                 if(data.toString().includes("true")){
                     self.ToDelete = [];
                     self.Department = '0';
                     self.Design = '0';
                     self.ThroughAlert('Wow...Done..!','bg-green');
                     self.$emit('ActionDone');
                 }else{
                      self.ThroughAlert('Sorry we Messed up.. try again pls..','bg-light-red');
                 }
             }).fail(x => {
                 self.ThroughAlert('Something went wrong try Again..','bg-light-red');
             });
         }
     },
     ThroughAlert: function(msg,cls){
       var self = this;
       this.AlertMsg = msg;
       this.AlertCls = cls;
       this.ShowAlert = true;
       setTimeout(function(){ 
         self.ShowAlert=false;
          },2500)
     },
  }
}
</script>

<style>
#DataTable{
 height: 100%;
}
table{
    height: 100%;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
}
thead{ height : 40px; flex: 0 0 0 ; }

tbody{
/* flex: 1 0 0 ;  */
overflow-y:auto;
height: calc(100% - 95px);
}
td,th{
    padding: 10px;
    text-align: left;
}
tr th, tr td { flex:1 0 0; align-self: baseline;}

</style>
