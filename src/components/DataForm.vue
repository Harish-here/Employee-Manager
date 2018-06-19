<template>
  <div id="DataForm">
    <transition name='fade'>
     <div class='absolute self-center pa2 bg-light-red br2 white' :class="AlertCls" v-show='ShowAlert'>{{AlertMsg}}</div>
    </transition>
    <div class="head bb b--light-silver flex justify-center items-center pa2">
      <div class='f4' @click='ShowAlert = !ShowAlert'>
        {{ SubViewType }} {{ ViewType }}
      </div>
    </div>
    
    <div class="middle">
      <form>
        <!-- Employee Form View -->
       <ul v-if='ViewType === "Employee"'>
        <li v-for='(i,index) in EmployeeForm.data' :key='index' v-if="EmployeeForm.label[index].label !== undefined && EmployeeForm.label[index].label !== ''" class='pa2'> 
          <span class='flex' >
            <label class='w-40 pa1'>{{ EmployeeForm.label[index].label }}</label>
            <div class='w-60 flex flex-column'>
              <input class='pa1' :placeholder="EmployeeForm.label[index].label" v-if='index !== "department" && index !== "designation" && index !== "hierarchyId" && index !== "benefitBundle"' 
                    v-model='EmpData[index]' 
                    :type='EmployeeForm.label[index].type'
                    @blur='Validate(index,EmployeeForm.label[index])'
                    :class='{"ba b--red" : Error.includes(EmployeeForm.label[index].label)}'
                      />
              <select  class='pa1'
                      v-model='EmpData[index]'
                      @change='CheckForDep(EmpData[index],index)'
                      v-else>
                <option value='' selected disabled>{{ EmployeeForm.label[index].label }}</option>
                <option v-if='index === "department"' v-for='j in DeptData' :value='j' :key='j.departmenId'>{{ j.departmentName }}</option>
                <!-- <option v-else value='{}'>1</option> -->
                <option v-if='index === "designation"' v-for='j in DesignList' :value="j" :key='j.value'>{{ j.label }}</option>
                <option v-if='index === "benefitBundle"' v-for='j in BundleList' :value="j" :key='j.value'>{{ j.label }}</option>
                <option v-if='index === "hierarchyId"' v-for='j in SetHierachy' :value="j" :key='j'>{{ j }}</option>
              </select>
              <!-- Error msg-->
               <transition name='fade'>
                <span class='red pv1' style="font-size:10px;" 
                      v-if='Error.includes(EmployeeForm.label[index].label)'
                      >
                      Provide a valid {{EmployeeForm.label[index].label}}
                  </span>
                </transition>
            </div>

          </span>
         </li>
         <li class='gray tc pa1'>OR</li>
         <li class='pa2 flex flex-column items-center'>
           <label class='pa1 w-40'>Import Employees</label>
           <div class='pa1 w-60'>
             <form id='fileUpload' enctype='multipart/form-data'>
               <input  name='file' type="file" accept=".csv" @change="SetUpload">
             </form>
           </div>
         </li>
       </ul>

        <!-- Department Form View -->
       <ul v-if='ViewType === "Department"'>
        <li v-for='(i,index) in DepartmentForm.data' :key='index' v-if="DepartmentForm.label[index].label !== undefined && DepartmentForm.label[index].label !== ''" class='pa2'> 
          <span class='flex' >
            <label class='w-40 pa1'>{{ DepartmentForm.label[index].label }}</label>
            <div class='w-60 flex flex-column'>
              <input class='pa1' 
                     :placeholder="DepartmentForm.label[index].label"  
                     v-model='DepData[index]' 
                     :type='DepartmentForm.label[index].type'
                     @blur='Validate(index,DepartmentForm.label[index])'
                     :class='{"ba b--red" : Error.includes(DepartmentForm.label[index].label)}'
                     required='required' />
              <!-- Error msg-->
               <transition name='fade'>
                <span class='red pv1' style="font-size:10px;" 
                      v-if='Error.includes(DepartmentForm.label[index].label)'
                      >
                      Provide a valid {{DepartmentForm.label[index].label}}
                  </span>
                </transition>
            </div>


          </span>
          </li>
       </ul>
       <!-- Designation Form View -->
       <ul v-if='ViewType === "Designation"'>
        <li v-for='(i,index) in DesignationForm.data' :key='index' v-if="DesignationForm.label[index].label !== undefined && DesignationForm.label[index].label !== ''" class='pa2'> 
          <span class='flex' >
            <label class='fl w-40 pa1'>{{ DesignationForm.label[index].label }}</label>
            <input v-if='index === "designationCode" || index === "designationName"' 
                   class='fl w-60 pa1'
                   :placeholder="DesignationForm.label[index].label"  
                   v-model='DesData[index]' 
                   type='text' />
            <select class='fl w-60 pa1' 
                    v-if='index !== "bookingTool" && index !== "designationCode" && index !== "designationName"'
                    v-model='DesData[index]'>
              <option value='' selected disabled>{{ DesignationForm.label[index].label }}</option>
              <option v-if='index === "department"' v-for='j in DeptData' :value='j' :key='j.departmenId'>{{ j.departmentName }}</option>
              <option v-if='index === "role"' v-for='k in Role' :value='k' :key='k.value'>{{ k.label }}</option>
              <option v-if='index === "rightsHotel"' v-for='j in Rights' :value='j' :key='j.value'>{{ j.label }}</option>
              <option v-if='index === "bookRoomPersion"' v-for='j in Permission' :value='j' :key='j.value'>{{ j.label }}</option>
              <option v-if='index === "overBudget"' v-for='j in OverBudget' :value='j' :key='j.value'>{{ j.label }}</option>
              <option v-if='index === "reservHandle"' v-for='j in Reserve' :value='j' :key='j.value'>{{ j.label }}</option>
              <option v-if='index === "hierarchyId"' v-for='j in SetHierachy' :value='j' :key='j'>{{ j }}</option>
              <option v-if='index === "dayCount"' v-for='j in SetHierachy' :value='j' :key='j'>{{ j }}</option>
              <option v-if='index === "approval"' v-for='j in SetHierachy' :value='j' :key='j'>{{ j }}</option>
              <option v-if='index === "benefitBundle"' v-for='j in BundleList' :value='j' :key='j.value'>{{ j.label }}</option>
              <!-- <option  v-else value=''>Sample</option> -->
            </select>
            <div class='fl w-60 pa1 flex flex-wrap items-baseline' v-if='index === "bookingTool"'>
              <span class='pa1 flex items-baseline'><input class='pa1 self-baseline' value='1' type='checkbox' v-model='DesData[index]'><span  class='pa1 self'>Book Now</span></span>
              <span class='pa1 flex items-baseline'><input  class='pa1' value='2' type='checkbox' v-model='DesData[index]'><span  class='pa1'>Enquiry</span></span>
              <span class='pa1 flex items-baseline'><input  class='pa1' value='3' type='checkbox' v-model='DesData[index]'><span  class='pa1'>Trip Scheduler</span></span>
            </div>

          </span>
        </li>
       </ul>
       </form>
    </div>
    <div class="footer bt b--light-silver flex justify-center items-center">
      <button class='btn-spl' v-if="SubViewType === 'Create'" @click='CreateData'>Add</button>&nbsp;&nbsp;&nbsp;
      <button class='btn-spl' v-if="File !== null" @click='FileUpload'>Upload</button>
      <button class='btn-spl' v-if="SubViewType === 'Update'" @click='UpdateData'>Update</button>&nbsp;&nbsp;&nbsp;
      <button class='btn-spl' v-if="SubViewType === 'Update'" @click='$emit("CancelViewType")' >Cancel</button>&nbsp;&nbsp;&nbsp;
      <button class='btn-spl btn-dlt' v-if="SubViewType === 'Update'" @click='DeleteData' >Delete</button>
      
    </div>
    
  </div>
</template>

<script>
import axios from 'axios'
import struct from '../assets/formData'
import api from '../assets/api'

export default {
  name: 'DataForm',
  props: {
    ViewType : {
        type: String,
        default: 'Employee'
    },
    SubViewType : {
        type: String,
        default: 'Create'
    },
    ActiveData : {
        type: Object,
        default: function(){
           return {}
        }
    },
    DeptData : {
      type: Array,
      default: function(){
        return []
      }
    },
    DefaultDeptData : {
      type: Array,
      default: function(){
        return []
      }
    },
   },

   data: function(){
    //  var self = this
     return {
       EmployeeForm : { 
         data: struct.employee.data,
         label: struct.employee.label
       },
       DesignationForm : struct.designation,
       DepartmentForm : {
         data : struct.department.data,
         label: struct.department.label, 
       },
       SetHierachy : ['1','2','3','4','5','6','7','8','9','10'],
       Role: struct.role,
       Rights: struct.rights,
       Permission: struct.permission,
       OverBudget: struct.overbudget,
       Reserve: struct.reserve,
       DesignList: [],
       BundleList: [],
       ShowAlert:false,
       AlertMsg: 'Alert Message',
       AlertCls : 'bg-green',
       Error: [],
       File: null

     }
   },

   computed : {
     EmpData(){
       if(this.SubViewType === 'Create'){
        
         return this.EmployeeForm.data
       }else{
         if(this.ActiveData.virtualName !== undefined){
            //err to be flushed when view changes
         //this is done bcoz when emp obj matches with  model design dropdwon & bundle need to be populated
          if(this.ActiveData.department !== null && this.ActiveData.designation !== null){ //avoid null conflict if it the obj has null
             this.GetDesignation(this.ActiveData.department.departmentId);
            this.GetBundle(this.ActiveData.designation.value);
          }
           
            
            return this.ActiveData
         }
       }
     },
     DepData(){
       if(this.SubViewType === 'Create'){
         return this.DepartmentForm.data
       }else{
         
         return this.ActiveData
       }
     },
     DesData(){
       if(this.SubViewType === 'Create'){
         return this.DesignationForm.data
       }else{

         return this.ActiveData
       }
     },

     CreateUrl(){
      if(this.ViewType === 'Employee') return api.emp.create
      if(this.ViewType === 'Department') return api.depart.create
      if(this.ViewType === 'Designation') return api.design.create
     },
     UpdateUrl(){
       if(this.ViewType === 'Employee') return api.emp.update
      if(this.ViewType === 'Department') return api.depart.update
      if(this.ViewType === 'Designation') return api.design.update
     },
     DeleteUrl(){
       if(this.ViewType === 'Employee') return api.emp.delete
      if(this.ViewType === 'Department') return api.depart.delete
      if(this.ViewType === 'Designation') return api.design.delete
     },
     SendData(){
       if(this.ViewType === 'Employee') return this.EmpData
      if(this.ViewType === 'Department') return this.DepData
      if(this.ViewType === 'Designation') return this.DesData
     },
    
   },

   watch: {
       'ViewType': function(){
         this.Error.length = 0;
       },
       'SubViewType': function(){
         this.Error.length = 0;
       }
     },

  created : function(){
      this.GetBundle(1);
  },

   methods : {
     flush: function(){
       if(this.ViewType === 'Employee') this.EmployeeForm.data = JSON.parse(JSON.stringify(struct.employee.data))
       if(this.ViewType === 'Department') this.DepartmentForm.data = JSON.parse(JSON.stringify(struct.department.data))
       if(this.ViewType === 'Employee') this.DesignationForm.data = JSON.parse(JSON.stringify(struct.designation.data))
     },

     CheckForDep: function(obj,index){
       if(this.ViewType === 'Employee' && index === 'department'){
         this.GetDesignation(obj.departmentId);
       }
     },
      SetUpload: function(el){
          this.File = el.target.files[0];
      },
      FileUpload: function(){
        var self = this;
        if(confirm('Are you sure to upload')){
          var send = new FormData();
          for(var i in self.File){
            send.append(i,self.File[i]);
          }

          // axios.post(api.fileUpload,send,{
          //   headers: {
          //       'Content-Type': 'multipart/form-data'
          //   }
          // }).then(data => {
          //   if(data.toString().includes('true')){
          //           self.ActionDone();
          //           self.flush();
          //           self.File = null;
          //           self.ThroughAlert('Woow ! Done..!','bg-green');
          //         }else{
          //           self.ThroughAlert('Sorry we meesed up! try again Pls','bg-light-red');
          //         }
          //       self.File = null;
          //   }).catch(err => console.log(err));
          
          // $.post(api.fileUpload,{file:send}).done(function(data){
          //     if(data.toString().includes('true')){
          //     self.ActionDone();
          //     self.flush();
          //     self.File = null;
          //     self.ThroughAlert('Woow ! Done..!','bg-green');
          //   }else{
          //     self.ThroughAlert('Sorry we meesed up! try again Pls','bg-light-red');
          //   }
          // }).fail(x =>{
          //   self.ThroughAlert('Something terribly gone wrong! try again Pls','bg-light-red');
          // });
          var input = document.querySelector('#fileUpload');
            console.log(new FormData(input));
          $.ajax({
              url: api.fileUpload,
              type: 'POST',
              data: new FormData(input),
              cache: false,
              processData: false, // Don't process the files
              contentType: false, // Set content type to false as jQuery will tell the server its a query string request
              success: function(data, textStatus, jqXHR){
                if(data.toString().includes('true')){
                    self.ActionDone();
                    self.flush();
                    self.File = null;
                    self.ThroughAlert('Woow ! Done..!','bg-green');
                  }else{
                    self.ThroughAlert('Sorry we meesed up! try again Pls','bg-light-red');
                  }
               },
              error: function(jqXHR, textStatus, errorThrown)
              {
                  self.ThroughAlert('Sorry we meesed up! try again Pls','bg-light-red');
              }
        });
            
          // fetch(api.fileUpload,{
          //   type: 'POSt',
          //   body: input.files[0]
          // }).then(data => {
          //   if(data.toString().includes('true')){
          //           self.ActionDone();
          //           self.flush();
          //           self.File = null;
          //           self.ThroughAlert('Woow ! Done..!','bg-green');
          //         }else{
          //           self.ThroughAlert('Sorry we meesed up! try again Pls','bg-light-red');
          //         }
          //       self.File = null;
          //   }).catch(err => console.log(err));
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
     
     Validate: function(index,obj){
       //validating the field on their rules set
       var emailreg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'g')
       var self = this;
       switch(obj.type){
         case 'number': if(!(self.SendData[index].toString().length === 10) ||
                            self.SendData[index] === '' ||
                            self.SendData[index] === ' '){
                            // console.log(self.SendData[index].toString().length)
                          self.Error.push(obj.label)
                          return
                        } ;
                        break;
         case 'email': if(!emailreg.test(self.SendData[index])) {self.Error.push(obj.label); return}  ; break;
         case 'text': if(self.SendData[index] === '' || self.SendData[index] === ' ') {self.Error.push(obj.label); return};break;  ;break;
       }
       self.Error.splice(self.Error.indexOf(obj.label),1);
     },
      //data sending functions
     CreateData: function(){ //general create operation
       var self = this;
       //error checking code when onblur is not at fired
        if(self.Error.length === 0){
          for(var i in self.SendData){
            if(self.SendData[i] === '') {
              self.ThroughAlert('None of the fields should be Empty!','bg-light-red');
              return
            }
          }
        }
       //error checking
       if(self.Error.length > 0){
         self.ThroughAlert('Rectify the erros,then submit.. cheers!','bg-light-red');
         return
       }
      $.post(this.CreateUrl,this.SendData).done(function(data){
          if(data.toString().includes('true')){
            self.ActionDone();
            self.flush();
            self.ThroughAlert('Woow ! Done..!','bg-green');
          }else{
            self.ThroughAlert('Sorry we meesed up! try again Pls','bg-light-red');
          }
         //flag need to be shown from the backend
        }).fail(function(x,s,err){
          self.ThroughAlert('Something terribly gone wrong! try again Pls','bg-light-red');
        });
     },

     UpdateData: function(){
       var self = this;
       if(self.Error.length > 0){
         self.ThroughAlert('Rectify the erros,then submit.. cheers!','bg-light-red');
         return
       }
      $.post(this.UpdateUrl,this.SendData).done(function(data){
          if(data.toString().includes('true')){
            self.ActionDone();
            self.$emit("CancelViewType");
            self.ThroughAlert('Woow ! Done..!','bg-gold');
          }else{
            self.ThroughAlert('Sorry we meesed up! try again Pls','bg-light-red');
          }
        }).fail(function(x,s,err){
          self.ThroughAlert('Something terribly gone wrong! try again Pls','bg-light-red');
        });
     },

     DeleteData: function(){
       var self = this;
       if(confirm('Are you sure to Delete..?')){

         $.post(this.DeleteUrl,this.SendData).done(function(data){
            if(data.toString().includes('true')){
              self.ActionDone();
              self.$emit("CancelViewType");
              self.ThroughAlert('Woow ! Done..!','bg-light-red');
            }else{
                self.ThroughAlert('Sorry we meesed up! try again Pls','bg-light-red');
            }
          }).fail(function(x,s,err){
            self.ThroughAlert('Something terribly gone wrong! try again Pls','bg-light-red');
          });
       }
        
     },

     ActionDone: function(){ //to brodcast a action is done inside this component
       this.$emit('ActionDone');
     },

     GetDesignation: function(id){ //dropdown for the Design
       var self = this
       
      $.post(api.dropdown.design,{"dataId":id}).done(function(data){
         try{
           self.DesignList = JSON.parse(data);
         }catch(e){
           alert('something went wrong try again');
         }
         
       }).fail(x => alert(x));
     },

     GetBundle: function(id){ //dropdown for the Bundle
       var self = this
      $.post(api.dropdown.bundle,{"dataId":id}).done(function(data){
         try{
           self.BundleList = JSON.parse(data);
         }catch(e){
           alert('something went wrong try again');
         }
         
       }).fail(x => alert(x));
     },



   }
  
}
</script>

<style>
#DataForm{
 display: flex;
 flex-direction: column;
 height: 100%;
}
.head{ height: 55px; }
.middle{ 
    flex: 1 0 0;
    overflow-y: auto;
  }
.footer{ height: 55px; }
#DataForm  ul li { margin-bottom: 5px;}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
