<template>
  <div id="DataForm">
    <transition name='fade'>
     <div class='absolute self-center pa2 bg-light-red br2 white' :class="AlertCls" v-show='ShowAlert'>{{AlertMsg}}
        &nbsp;&nbsp;<span @click='ShowAlert = false' class='fr'><i class="fa fa-times" aria-hidden="true"></i></span>
    </div>
    </transition>
    <div class="head bb b--light-silver flex justify-center items-center pa2">
      <div class='f4'>
        {{ (SubViewType != 'Display') ? SubViewType : "" }} {{ (ViewType === 'Employee') ? "Travellers" : ViewType }} {{(SubViewType == 'Display') ? "Details" : ""}}
      </div>
    </div>
    
    <div class="middle">
      <!-- <form> -->
        <!-- Employee Form View -->
       <!-- <ul class="w100 flex pointer" v-if='ViewType === "Employee" && (SubViewType ==="Create")'>
         <li class="w-50 pa2 tc bb b--light-gray ul-trans"
             @click='EmpSub = "create"'
             :class='{"act-tab" : EmpSub === "create"}'>Create</li>
         <li class="w-50 pa2 tc bb b--light-gray ul-trans"
             @click='EmpSub = "import"'
             :class='{"act-tab" : EmpSub === "import"}'>Import</li>
       </ul> -->
       <!-- Basic text  -->
       <div class="pa3 tc gray" v-if='SubViewType !== "Display" && SubViewType !== "Create" && SubViewType !== "Update"'>Manage your {{(ViewType === 'Employee') ? "Travellers" : ViewType}} Details here</div>
       <!--Employee display view display view-->
       <ul v-if='ViewType === "Employee" && SubViewType ==="Display"' class='pa3'>
        <li v-for='(i,index) in EmployeeForm.label' :key='index' v-if="i !== null" class='pa1'> 
          <span class='flex flex-column'>
            <label class='w-70'>{{ i.label }}</label>
            <div class='w-100 flex flex-column fw6'>
              <span v-if='index !== "department" && index !== "designation" && index !== "approverList" && index !=="travelDesk" && index !== "status"'>{{EmpData[index]}}</span>
              <span v-if='index === "department"'>{{ EmpData[index].departmentName || '' }}</span>
              <span v-if='index === "designation"'>{{ EmpData[index].label || '' }}</span>
              <!-- <span v-if='index ==="travelDesk"'>{{ (EmpData[index].label !== undefined ) ? EmpData[index].label : "" }}</span> -->
              <span v-if='index === "status"'> {{ (EmpData[index] === '1') ? 'Enable' : 'Disable'}}</span>
              <div v-if="index === 'approverList'"><!-- approver select -->
                  <!-- <v-select v-model='EmpData[index]' :options='ApproverData.filter(x => x.value != EmpData["travelAgencyUsersId"])' multiple></v-select> -->
                  <span v-if='EmpData[index].length > 0'>
                    <ul class='ba b--light-gray pa1 mt1'>
                      <li class='gray'>Your approval tree</li>
                      <li v-for='(i,index) in EmpData[index]' :key="i.value"> {{ index + 1 }} - {{ i.label }}</li>
                    </ul>
                  </span>
                  <span v-else>No approval tree</span>
              </div>
            </div>
          </span>
        </li>
        <!-- Resign details -->
        <li v-if='EmpData["resign"] == "1"' class='pa1'>
          <span class="flex  flex-column">
            <label for="" class="w-40">Resigned</label>
            <div class="w-60 flex fw6">Yes</div>
          </span>
        </li>
        <li v-if='EmpData["resign"] == "1"' class='pa1'>
          <span class="flex  flex-column">
            <label for="" class="w-70">Resigned Date</label>
            <div class="w-100 flex fw6">{{ EmpData['resignDate'] }}</div>
          </span>
        </li>
        <!-- <li v-if='EmpData["resign"] == "1"' class='pa1'>
          <span class="flex">
            <label for="" class="w-70">Resigned Time</label>
            <div class="w-100 flex fw6">{{ EmpData['resignTime'] }}</div>
          </span>
        </li> -->
       </ul>
       <!-- Employee create && Employee update -->
       <ul v-if='ViewType === "Employee" &&( SubViewType ==="Create" || SubViewType === "Update" )' class='pa3'>
        <li v-for='(i,index) in EmployeeForm.label'
            :key='index'
            v-if="i !== null" class='pa1'> 
          <span class='flex flex-column items-baseline' >
            <label class='w-40'>{{ EmployeeForm.label[index].label }} <sup class='b6' v-if='index !== "approverList"'>*</sup></label>
            <div class='w-100 flex flex-column'>
              <input class='pa1'
                      v-if='index !=="travelDesk" && index !== "approverList" && index !== "status" && index !== "department" && index !== "designation" && index !== "hierarchyId" && index !== "benefitBundle"' 
                      v-model='EmpData[index]' 
                      :type='EmployeeForm.label[index].type'
                      @blur='Validate(index,EmployeeForm.label[index])'
                      :class='{"ba b--red" : Error.includes(EmployeeForm.label[index].label)}'
                      min='1970-01-01'
                      max='2038-01-01'
                      />
              
              <select class='pa1'
                      v-model='EmpData[index]'
                      
                      v-if='index ==="travelDesk" || index === "department" || index === "designation" || index === "benefitBundle" || index === "hierarchyId"'>
                <!-- <option value='' selected disabled>{{ EmployeeForm.label[index].label }}</option> -->
                <option v-for='j in TeamOption["departments"]'  v-if='index === "department" && j.departmentName !== "Master Admin" && j.parent != 0' :value='j' :key='j.departmenId'>{{ j.departmentName }}</option>
                <!-- <option v-else value='{}'>1</option> -->
                <option  v-for='j in DesignList' v-if='index === "designation" && j.label !== "Master Admin"' :value="j" :key='j.value'>{{ j.label }}</option>
                <option v-for='j in BundleList' v-if='index === "benefitBundle" && j.label !== "Master Admin"' :value="j" :key='j.value'>{{ j.label }}</option>
                <option v-if='index === "hierarchyId"' v-for='j in SetHierachy' :value="j" :key='j'>{{ j }}</option>
                <option  v-for='j in TravelDeskList' v-if='index === "travelDesk" && j.value !== EmpData["travelAgencyUsersId"]' :value="j" :key='j.value'>{{ j.label }}</option>
              </select>
              <div v-if='index === "status"' class='flex justify-evenly items-baseline'>
                <span class='flex justify-evenly w-50'><input type='radio' name='active'  value='1' v-model='EmpData[index]' >&nbsp;Enable </span>
                <span class='flex justify-evenly w-50'><input type='radio' name='active' value='0' v-model='EmpData[index]' >&nbsp;Disable</span>
              </div>
              <div v-if="index === 'approverList'"><!-- approver select -->
                  <multiselect :multiple="true" v-model='EmpData[index]' :options='ApproverData.filter(x => x.value != EmpData["travelAgencyUsersId"])' 
                      :close-on-select="false" :clear-on-select="false" :preserve-search="true" :searchable='false' 
                      selectLabel='Choose'  label="label" track-by="value" >
                          <!-- <template slot="selection" slot-scope="{ options }">
                          </template> -->
                  </multiselect>
                  <span v-if='EmpData[index].length > 0'>
                    <ul class='ba b--light-gray pa1 mt1'>
                      <li class='gray'>Your approval tree (drag Travellers to reorder)</li>
                      <draggable v-model="EmpData[index]" :options="{group:'people'}" @start="drag=true" @end="drag=false">
                        <li v-for='(i,index) in EmpData[index]' :key="i.value" class='pa1 drag-cur'><i class="fa fa-bars" aria-hidden="true"></i> {{ i.label }} <span class='fr badge badge-primary'>{{ index + 1 }}</span></li>
                      </draggable>
                    </ul>
                  </span>
              </div>
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
        <!-- <pre>{{EmpData}}</pre><pre>{{ApproverData}}</pre> -->
        <li class="pa1" v-if="SubViewType !== 'Create'">
          <span class="flex flex-column items-baseline">
            <label for="" class="w-40">Employment Status</label>
            <div class="w-60 flex">
              <span class='w-50 pa1 flex justify-around'><input v-model='EmpData.resign' type="radio" value='0'><span> On-roll</span></span>
              <span class='w-50 flex justify-around pa1'><input v-model='EmpData.resign' type="radio" value='1'><span> Resigned</span></span>
            </div>
          </span>
        </li>
        <li class='pa1' v-if='EmpData.resign == "1"'>
          <span class='flex flex-column items-baseline'>
            <label class="w-40">Resignation Date <sup class='b6'>*</sup></label>
            <div class="w-60 flex ">
              <input v-model='EmpData.resignDate' type="date" name='resignDate' />
            </div>
          </span>
        </li>
        <li class='pa1' v-if='false'>
          <span class='flex flex-column items-baseline'>
            <label class="w-40 pa1">Resignation Time</label>
            <div class="w-60 flex">
              <input v-model='EmpData.resignTime' type='text' name='resignTime' />
            </div>
          </span>
        </li>
       </ul>
       <!-- <div class='upload-contanier tc pa1 relative' v-if='ViewType === "Employee" && EmpSub ==="import" && (SubViewType ==="Create")'>
          <div>
            <a target="_blank" :href='Global + "/public_html/csv_template/employee_csv_format.csv"'><span class='absolute top-1 right-1'>Format <i class="fa fa-download" aria-hidden="true"></i></span></a>
            <form id='fileUpload' enctype='multipart/form-data' class='flex flex-column' @submit.prevent='FileUpload'>
              <label class='pa3' for='file'>Import Employees</label>
              <input  name='file' id='fileUploadField' type="file" accept=".csv" @change="SetUpload">
              <div class='flex justify-center items-center pa2' v-if="File !== null && ViewType === 'Employee'">
                <button class='btn-spl --not-ghost' type='submit' :disabled='DisableAction'>Upload <i v-if='DisableAction' class="fa fa-spinner fa-pulse" aria-hidden="true"></i></button>
                <button class='btn-spl ml2' @click='ResetUpload' type='reset' title='Remove the selected files' :disabled='DisableAction'>Cancel Upload</button>
              </div>
            </form>

          </div>
       </div> -->
        <!-- End of employee -->
        <!-- Team Form View -->
       <ul v-if='ViewType === "Team" && (SubViewType ==="Create" || SubViewType === "Update" )' class='pa3'>
        <li v-for='(i,index) in TeamForm.label' :key='index' v-if="i !== null && TeamForm.label[index].label !== ''" class='pa1'> 
          <span class='flex flex-column items-baseline' >
            <label class='w-70'>{{ TeamForm.label[index].label }} <sup class='b6' v-if='index !== "budgetApprover" && index !== "financeApprover"'>*</sup></label>
            <div class='w-100 flex flex-column'>
              <input class='pa1'
                     v-if='TeamForm.label[index].type === "text"' 
                     v-model='TeamData[index]' 
                     :type='TeamForm.label[index].type'
                     @blur='Validate(index,TeamForm.label[index])'
                     :class='{"ba b--red" : Error.includes(TeamForm.label[index].label)}'
                     required='required' />
              <select class='pa1'
                      v-if='TeamForm.label[index].type === "select"'
                      v-model='TeamData[index]'
                      @change='SetFinApprover'
                      @blur='Validate(index,TeamForm.label[index])'
                     :class='{"ba b--red" : Error.includes(TeamForm.label[index].label)}'>
                 <option class='gray' value='0' v-if='["budgetApprover","financeApprover"].includes(index)'>Select {{TeamForm.label[index].label}}</option>
                 <option v-for='j in TeamOption["departments"]'
                         v-if='index === "parent" && j.departmentName !== "Master Admin"'
                         :key='j.departmentId' :value='j.departmentId'>
                         {{ j.departmentName}}
                  </option>
                 <option v-for='j in TeamOption[index]'
                         v-if='index !== "parent" && j.label !== "Master Admin"'
                         :key='j.value'
                         :value='j.value'>
                         {{j.label}}
                  </option>
              </select>
              <!-- Error msg-->
               <transition name='fade'>
                <span class='red pv1' style="font-size:10px;" 
                      v-if='Error.includes(TeamForm.label[index].label)'
                      >
                      Provide a valid {{TeamForm.label[index].label}}
                  </span>
                </transition>
            </div>
          </span>
        </li>
        <!-- <li class='pa2 tc mt3' v-if="SubViewType === 'Create'"><button class='btn-spl --not-ghost'  @click='CreateData' :disabled='DisableAction'>Add <i v-if='DisableAction' class="fa fa-spinner fa-pulse" aria-hidden="true"></i> </button></li>
        <li class='pa2 tc mt3' v-if="SubViewType === 'Update'">
          <button class='btn-spl --not-ghost' @click='UpdateData' :disabled='DisableAction'>Update <i v-if='DisableAction' class="fa fa-spinner fa-pulse" aria-hidden="true"></i></button>
          <button class='btn-spl'  @click='$emit("CancelViewType")' :disabled='DisableAction'><span v-if='SubViewType === "Update"'>Cancel</span><span v-else>Back to create</span></button>
          <button class='btn-spl btn-dlt' @click='DeleteData' :disabled='DisableAction'>Delete </button>
        </li> -->
       </ul>
       <!--- end of team form --->
        <!-- Team Display View -->
       <ul v-if='ViewType === "Team" && SubViewType === "Display"' class='pa3'>
        <li v-for='(i,index) in TeamForm.label' :key='index' v-if="i !== null && TeamForm.label[index].label !== ''" class='pa1'> 
          <span class='flex flex-column items-baseline' >
            <label class='w-70'>{{ TeamForm.label[index].label }}</label>
            <div class='w-100 flex flex-column pa1' v-if='index === "departmentName" || index === "departmentCode"'>
              {{TeamData[index]}}
            </div>
            <div v-else class="w-100 flex flex-column pa">
              {{ (function(){
                let lookUpIndex = (index === "parent") ? "departments" : index;
                  let a = TeamOption[lookUpIndex].filter(x => {
                    return (index === "parent") ? 
                            (x["departmentId"] == TeamData[index]) :
                            (x["value"] == TeamData[index])
                  })
                  return (a.length > 0) ? (index === 'parent') ?  a[0]['departmentName'] : a[0]['label'] : "NA"
              })() 
              }}
            </div>
          </span>
        </li>
       </ul>
        <!-- Department Form View -->
       <ul v-if='ViewType === "Department" && (SubViewType ==="Create" || SubViewType === "Update" )' class='pa3'>
        <li v-for='(i,index) in DepartmentForm.label' :key='index' v-if="i !== null && DepartmentForm.label[index].label !== ''" class='pa1'> 
          <span class='flex flex-column items-baseline' >
            <label class='w-70'>{{ DepartmentForm.label[index].label }} <sup class='b6'>*</sup></label>
            <div class='w-100 flex flex-column'>
              <input class='pa1'
                      v-if='DepartmentForm.label[index].type !== "select"'
                     v-model='DepData[index]' 
                     :type='DepartmentForm.label[index].type'
                     @blur='Validate(index,DepartmentForm.label[index])'
                     :class='{"ba b--red" : Error.includes(DepartmentForm.label[index].label)}'
                     required='required' />
              <select class='pa1'
                      v-if='DepartmentForm.label[index].type === "select"'
                      v-model='DepData[index]'
                      @blur='Validate(index,DepartmentForm.label[index])'
                     :class='{"ba b--red" : Error.includes(DepartmentForm.label[index].label)}'>
                 <option v-for='j in TeamOption["financeApprover"]'
                         v-if='j.value !== "Master Admin"'
                         :key='j.value' :value='j.value'>
                         {{ j.label}}
                  </option>
              </select>
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
        <li class='pa2 tc mt3' v-if="SubViewType === 'Create'"><button class='btn-spl --not-ghost'  @click='CreateData' :disabled='DisableAction'>Add <i v-if='DisableAction' class="fa fa-spinner fa-pulse" aria-hidden="true"></i> </button></li>
        <li class='pa2 tc mt3' v-if="SubViewType === 'Update'">
          <button class='btn-spl --not-ghost' @click='UpdateData' :disabled='DisableAction'>Update <i v-if='DisableAction' class="fa fa-spinner fa-pulse" aria-hidden="true"></i></button>
          <button class='btn-spl'  @click='$emit("CancelViewType")' :disabled='DisableAction'><span v-if='SubViewType === "Update"'>Cancel</span><span v-else>Back to create</span></button>
          <button class='btn-spl btn-dlt' @click='DeleteData' :disabled='DisableAction'>Delete </button>
        </li>
       </ul>
        <!-- Department Display View -->
       <ul v-if='ViewType === "Department" && SubViewType === "Display"' class='pa3'>
        <li v-for='(i,index) in DepartmentForm.label' :key='index' v-if="i !== null && DepartmentForm.label[index].label !== ''" class='pa1'> 
          <span class='flex flex-column items-baseline' >
            <label class='w-70'>{{ DepartmentForm.label[index].label }}</label>
            <div class='w-100 flex flex-column pa1' v-if='index !== "financeApprover"'>
              {{DepData[index]}}
            </div>
            <div class='w-100 flex flex-column pa1' v-if='index === "financeApprover"'>
              {{
                 (function(){
                  let lookUpIndex = (index === "parent") ? "departments" : index;
                  let a = TeamOption[lookUpIndex].filter(x => {
                    return (index === "parent") ? 
                            (x["departmentId"] == DepData[index]) :
                            (x["value"] == DepData[index])
                  })
                  return (a.length > 0) ? (index === 'parent') ?  a[0]['departmentName'] : a[0]['label'] : "NA"
              })() 
              
              }}
            </div>
          </span>
        </li>
       </ul>

       <!-- Designation Form View -->
       <ul v-if='ViewType === "Designation" && (SubViewType ==="Create" || SubViewType === "Update" )' class='pa3'>
        <li v-for='(i,index) in DesignationForm.label' :key='index' v-if="i !== null && DesignationForm.label[index].label !== ''" class='pa1'> 
          <span class='flex flex-column' >
            <label class='fl w-90'>{{ DesignationForm.label[index].label }} <sup class='b6'>*</sup></label>
            <div class='w-100 flex flex-column'>
              <input v-if='index === "designationCode" || index === "designationName"' 
                    class='fl pa1'
                    @blur='Validate(index,DesignationForm.label[index])'
                    :class='{"ba b--red" : Error.includes(DesignationForm.label[index].label)}'
                    v-model='DesData[index]' 
                    type='text' />
              
              <select class='fl pa1' 
                      v-if='index !== "bookingTool" && index !== "designationCode" && index !== "designationName" && index !== "reservHandle"'
                      v-model='DesData[index]'>
                <!-- <option value='' selected disabled>{{ DesignationForm.label[index].label }}</option> -->
                <!-- <option v-for='j in DeptData' v-if='index === "department" && j.departmentName !== "Master Admin"' :value='j' :key='j.departmenId'>{{ j.departmentName }}</option> -->
                <option v-if='index === "role"' v-for='k in Role' :value='k' :key='k.value'>{{ k.label }}</option>
                <option v-if='index === "rightsHotel"' v-for='j in Rights' :value='j' :key='j.value'>{{ j.label }}</option>
                <option v-if='index === "bookRoomPersion"' v-for='j in Permission' :value='j' :key='j.value'>{{ j.label }}</option>
                <option v-if='index === "overBudget"' v-for='j in OverBudget' :value='j' :key='j.value'>{{ j.label }}</option>
                <!-- <option v-if='index === "reservHandle"' v-for='j in Reserve'  :value='j' :key='j.value'>{{ j.label }}</option> -->
                <option v-if='index === "hierarchyId"' v-for='j in SetHierachy' :value='j' :key='j'>{{ j }}</option>
                <option v-if='index === "dayCount"' v-for='j in SetHierachy' :value='j' :key='j'>{{ j }}</option>
                <option v-if='index === "approval"' v-for='j in SetHierachy' :value='j' :key='j'>{{ j }}</option>
                <option  v-for='j in BundleList' v-if='index === "benefitBundle" && j.label !== "Master Admin"' :value='j' :key='j.value'>{{ j.label }}</option>
                <!-- <option  v-else value=''>Sample</option> -->
              </select>
              <!-- exception -->
              <select class="fl pa1"  v-if='index === "reservHandle"' :disabled='DesData["role"].value !== undefined && (DesData["role"].value == 1 || DesData["role"].value == 2)' v-model='TempRole'>
                <option v-for='j in Reserve'  :value='j' :key='j.value'>{{ j.label }}</option>
              </select>
              <!-- <div class='pa1 flex flex-wrap items-baseline' v-if='index === "bookingTool"'>
                <span class='pa1 flex items-baseline'><input class='pa1 self-baseline' value='1' type='checkbox' v-model='DesData[index]'><span  class='pa1 self'>Book Now</span></span>
                <span class='pa1 flex items-baseline'><input  class='pa1' value='2' type='checkbox' v-model='DesData[index]'><span  class='pa1'>Enquiry</span></span>
                <span class='pa1 flex items-baseline'><input  class='pa1' value='3' type='checkbox' v-model='DesData[index]'><span  class='pa1'>Trip Scheduler</span></span>
              </div> -->
              <!-- Error msg-->
               <transition name='fade'>
                <span class='red pv1' style="font-size:10px;" 
                      v-if='Error.includes(DesignationForm.label[index].label)'
                      >
                      Provide a valid {{DesignationForm.label[index].label}}
                  </span>
                </transition>
            </div>

          </span>
        </li>
       </ul>
       <!-- Designation display view -->
       <ul v-if='ViewType === "Designation" && SubViewType === "Display"' class='pa3'>
        <li v-for='(i,index) in DesignationForm.label' :key='index' v-if="i !== null && DesignationForm.label[index].label !== ''" class='pa1'> 
          <span class='flex flex-column' >
            <label class='fl w-90'>{{ DesignationForm.label[index].label }} <sup class='b6'>*</sup></label>
            <div class='w-100 flex'>
              <span v-if='index !== "department" && index !== "benefitBundle" && index !== "role"
                     && index !== "reservHandle" && index !== "bookRoomPersion" && index !== "rightsHotel"'>{{DesData[index]}}</span>
              <span v-if='index === "department"'>{{ DesData[index].departmentName}}</span>
              <span v-if='index === "benefitBundle" || index === "role"
                    || index === "reservHandle" || index === "bookRoomPersion" || index === "rightsHotel" '>{{ DesData[index].label}}</span>
              
            </div>
          </span>
        </li>
       </ul>
       <!-- </form> -->
    </div>
    <!-- button section -->
    <div class="footer bt b--light-silver flex justify-center items-center">
      <button class='btn-spl --not-ghost' v-if="SubViewType === 'Create' && ViewType !== 'Employee' && ViewType !== 'Department' " @click='CreateData' :disabled='DisableAction'>Add <i v-if='DisableAction' class="fa fa-spinner fa-pulse" aria-hidden="true"></i> </button>
      <button class='btn-spl --not-ghost' v-if="SubViewType === 'Create' && ViewType === 'Employee' && File === null && EmpSub ==='create'" @click='CreateData' :disabled='DisableAction'>Add <i v-if='DisableAction' class="fa fa-spinner fa-pulse" aria-hidden="true"></i></button>
      <button class="btn-spl --not-ghost" @click='ResignEmployee' v-if='ShowResign && SubViewType !== "Create"'>Resign this Traveller</button>
      <button class='btn-spl --not-ghost' v-if="ViewType !== 'Department' && SubViewType === 'Update' && !ShowResign" @click='UpdateData' :disabled='DisableAction'>Update <i v-if='DisableAction' class="fa fa-spinner fa-pulse" aria-hidden="true"></i></button>
      <button class='btn-spl' v-if="ViewType !== 'Department' && (SubViewType === 'Update'   || SubViewType === 'Display') && !ShowResign" @click='$emit("CancelViewType")' :disabled='DisableAction'><span v-if='SubViewType === "Update"'>Cancel</span><span v-else>Back to create</span></button>
      <button class='btn-spl btn-dlt' v-if="ViewType !== 'Department' && SubViewType === 'Update' && !ShowResign" @click='DeleteData' :disabled='DisableAction'>Delete </button>
      
    </div>
    <!-- <pre>{{EmployeeForm.label}}</pre> -->
  </div>
</template>

<script>
// import axios from 'axios'
import struct from '../assets/formData'
import api from '../assets/api'
// import vSelect from 'vue-select'
// import multi from 'vue-select'
import Multiselect from 'vue-multiselect'
import draggable from 'vuedraggable'
// import { fail } from 'assert';
import vSelect from 'vue-select'

// var userType = 3;

export default {
  name: 'DataForm',
  components: { draggable, Multiselect},
  props: {
    ViewType : {
        type: String,
        default: 'Employee'
    },
    SubViewType: {
      type: String,
      default: ''
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
    ApproverData: {
      type: Array,
      default: function(){
        return []
      },
    },
    EmpSub: {
      type: String,
      default: "create"
    }
    
   },

   data: function(){
    //  var self = this
     return {
      //  SubViewType: 'Create',
       userType: userType,
        // userType: 3, 
       sam: true,
       Global: global_url,
       EmployeeForm : { 
         data: JSON.parse(JSON.stringify(struct.employee.data)),
         label: struct.employee.label
       },
       DesignationForm : JSON.parse(JSON.stringify(struct.designation)),
       DepartmentForm : {
         data : JSON.parse(JSON.stringify(struct.department.data)),
         label: struct.department.label, 
       },
       TeamForm: {
         label: JSON.parse(JSON.stringify(struct.team.label)),
         data: JSON.parse(JSON.stringify(struct.team.data))
       },
       SetHierachy : ['1','2','3','4','5','6','7','8','9','10'],
       Role: struct.role,
       Rights: struct.rights,
       Permission: struct.permission,
       OverBudget: struct.overbudget,
       Reserve: struct.reserve,
       DesignList: [],
       BundleList: [],
       approvarList:[],
       ShowAlert:false,
       AlertMsg: 'Alert Message',
       AlertCls : 'bg-green',
       Error: [],
       File: null,
       DisableAction: false,
       Resign: false,
       ResignDate: '',
       ResignTime: '',
       TravelDeskList: [],
       TempRole: "",
       TempApp: [],
       TeamOption: {},
       propToSkip: ["budgetApprover","financeApprover"],
       skip: {
         "Employee" : ["approverList"],
         "Department": [],
         "Team": ["budgetApprover","financeApprover"],
         "Designation": [] 
       }

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
     Option(){
       if(this.ViewType ===  'Employee' && "travelAgencyUsersId" in  this.EmpData){
        return this.ApproverData.filter(x => x.value != this.EmpData["travelAgencyUsersId"])

       }else{
         return []
       }
     },
     DepData(){
       if(this.SubViewType === 'Create'){
         return this.DepartmentForm.data
       }else{
         
         return this.ActiveData
       }
     },
     TeamData(){
       if(this.SubViewType === 'Create'){
         return this.TeamForm.data
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
     //check to show the resign
     ShowResign(){
       if(this.ViewType === 'Employee' && this.SubViewType === 'Update'){
         return this.SendData.hasOwnProperty('resign') && this.SendData.resign == '1';
       }else{
         return false;
       }
     },

     CreateUrl(){
      if(this.ViewType === 'Employee') return api.emp.create
      if(this.ViewType === 'Department' || this.ViewType === 'Team') return api.depart.create
      if(this.ViewType === 'Designation') return api.design.create
     },
     UpdateUrl(){
       if(this.ViewType === 'Employee') return api.emp.update
      if(this.ViewType === 'Department' || this.ViewType === 'Team') return api.depart.update
      if(this.ViewType === 'Designation') return api.design.update
     },
     DeleteUrl(){
       if(this.ViewType === 'Employee') return api.emp.delete
      if(this.ViewType === 'Department' || this.ViewType === 'Team') return api.depart.delete
      if(this.ViewType === 'Designation') return api.design.delete
     },
     SendData(){
       if(this.ViewType === 'Employee') return this.EmpData
      if(this.ViewType === 'Department') return this.DepData
      if(this.ViewType === 'Designation') return this.DesData
      if(this.ViewType === 'Team') return this.TeamData
     },
    
   },

   watch: {
       'ViewType': function(){
         this.Error.length = 0;
       },
       'SubViewType': function(val){
         this.Error.length = 0;
       },
       DesData: {
         deep: true,
         handler: function(val){
           if(this.SubViewType === 'Create'){
              if( val['role'].value !== undefined && (val['role'].value == '1' || val['role'].value == '2') ){
                this.TempRole = { label: 'Yes', value: '1|yes' };
              }else{
                this.TempRole = "";
              }
           }else{
             if( val['role'].value !== undefined && (val['role'].value == '1' || val['role'].value == '2') ){
                this.TempRole = { label: 'Yes', value: '1|yes' };
              }else{
                this.TempRole = JSON.parse(JSON.stringify(this.ActiveData['reservHandle']));
              }
             
           }

         }
       },
       
     },

  created(){
    const self = this;
      this.GetBundle(1);
      this.GetTravelDesk();
      this.GetTeamOptions();
      this.GetDesignation();
  },

   methods : {
     SetFinApprover: function(){
       if(this.ViewType === "Team"){

         let id = this.TeamOption['departments'].find(x => this.TeamData['parent'] == x['departmentId']);
         this.TeamData['financeApprover'] = id['financeApprover'] || 0;

       }
     },
     flush: function(){
       if(this.ViewType === 'Employee'){
          this.EmployeeForm.data = {};
          this.EmployeeForm.data = JSON.parse(JSON.stringify(struct.employee.data));
          
       }
       if(this.ViewType === 'Department'){
          this.DepartmentForm.data = {};
          this.DepartmentForm.data = JSON.parse(JSON.stringify(struct.department.data));
          
          }
      if(this.ViewType === 'Team'){
          this.TeamForm.data = {};
          this.TeamForm.data = JSON.parse(JSON.stringify(struct.department.data));
          
       }
      if(this.ViewType === 'Designation'){ 
        this.DesignationForm.data = {};
        this.DesignationForm.data = JSON.parse(JSON.stringify(struct.designation.data))
        }
      },

     
     ResignEmployee: function(){
       const self = this;
       if(self.EmpData.resignDate === null ||  self.EmpData.resignDate === ''){
         self.ThroughAlert('Please fill in Resignation Date','bg-light-red');
         return
       }
       $.post(api.resignEmployee,{employee:self.SendData,resignDate: self.SendData.resignDate,resignTime: self.SendData.resignTime}).done(function(data){
         if(data.includes('true')){
           self.ResignDate = '';
          //  self.ResignTime = '';
          //  self.Resign = false;
           self.flush();
           self.ActionDone();
          self.$emit("CancelViewType");
           self.ThroughAlert('Employment status updated successfully','bg-green');
         }else{
           self.ThroughAlert('An unexpected error has occurred. Please try again.','bg-light-red');
         }
       }).fail(() => { self.ThroughAlert('An unexpected error has occurred. Please try again.','bg-light-red'); })
     },
      SetUpload: function(el){
          this.File = el.target.files[0];
      },
      ResetUpload: function(){
        var obj = $('#fileUploadField');
        obj.val(null);
        this.File = null;
      },
      FileUpload: function(){  
        var self = this;
        if(confirm('Are you sure to upload?')){
          var send = new FormData();
          for(var i in self.File){
            send.append(i,self.File[i]);
          }

          var input = document.querySelector('#fileUpload');
          var delay = alertify.get('notifier','delay');
          alertify.set('notifier','delay', 200);
          alertify.warning('Processing the CSV...');
          alertify.set('notifier','delay', delay);
            
          $.ajax({
              url: api.fileUpload,
              type: 'POST',
              data: new FormData(input),
              cache: false,
              processData: false, // Don't process the files
              contentType: false, // Set content type to false as jQuery will tell the server its a query string request
              success: function(data, textStatus, jqXHR){
                  self.File = null;
                  self.ResetUpload();
                  let datas = data.toString();
                if(datas.includes('true')){
                    self.ActionDone();
                    self.flush();
                    
                    self.ThroughAlert('File uploaded successfully','bg-green');
                  }else{
                    try{
                      var s = JSON.parse(data);
                      let csv = s.map(function(x){
                        return {
                          First_Name: x.firstName,
                          Last_Name: x.lastName,
                          Employee_Id: x.employeeId,
                          Company_Email: x.email,
                          Personal_Email: x.personalEmail,
                          Phone: x.phone,
                          Department: x.department,
                          Designation: x.designation,
                          Join_Date: x.joinDate,
                          Error: x.Error
                        }
                      });
                      self.ActionDone();
                      self.ThroughAlert('Error in imported CSV','bg-light-red');
                      self.createCSV(csv,"Rectify the Errors, upload this CSV",true);
                    }catch(e){
                     self.ActionDone();
                     self.ThroughAlert('An unexpected error has occurred. Please try again.','bg-light-red');
                    }
                      alertify.dismissAll();                    
                  }
               },
              error: function(jqXHR, textStatus, errorThrown)
              {
                      alertify.dismissAll();                    
                  self.ThroughAlert('An unexpected error has occurred. Please try again.','bg-light-red');
              }
        });
          
        }
      },
      createCSV: function(JSONData, ReportTitle, ShowLabel){
        //snippet from third party to create CSV
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
      
        var CSV = '';    
        //Set Report title in first row or line
        
        CSV += ReportTitle + '\r\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";
            
            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {
                
                //Now convert each value to string and comma-seprated
                row += index + ',';
            }

            row = row.slice(0, -1);
            
            //append Label row with line break
            CSV += row + '\r\n';
        }
        
        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            
            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }

            row.slice(0, row.length - 1);
            
            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV == '') {        
            alert("Invalid data");
            return;
        }   
        
        //Generate a file name
        var fileName = "CSV_import_ErrorReport_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g,"-");   
        
        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        
        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension    
        
        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");    
        link.href = uri;
        
        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        
        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
     ThroughAlert: function(msg,cls){
       var self = this;
      //  this.AlertMsg = msg;
      //  this.AlertCls = cls;
      //  this.ShowAlert = true;
      //  setTimeout(function(){ 
      //    self.ShowAlert=false;
      //     },4500)
      
      if(cls == 'bg-green'){
           alertify.success(msg);
       }else{
         if(cls == 'bg-light-red'){
           alertify.error(msg);
         }else{
           alertify.warning(msg);
         }
           
       }
       self.DisableAction = false;
     },
     
     Validate: function(index,obj){
       //null exception
       if(obj === null) return;


       //validating the field on their rules set
       var emailreg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'g')
       const self = this;
      //  if(obj === undefined){ console.log(index)}
       switch(obj.type){
         case 'number': if(!(self.SendData[index].toString().length === 10) ||
                            self.SendData[index].trim() === '' ||
                            self.SendData[index] === ' '){
                            // console.log(self.SendData[index].toString().length)
                          self.Error.push(obj.label)
                          return
                        } ;
                        break;
         case 'email': if(!emailreg.test(self.SendData[index])) {self.Error.push(obj.label); return}  ; break;
         case 'text': if(self.SendData[index].trim() === '' || self.SendData[index] === ' ' ) {
                          //to make departcode and designation optional need to skip their prop check
                          // if( index !== 'departmentCode' && index !== 'designationCode'){
                            self.Error.push(obj.label);
                            return
                          // }
                         
                           };
                           break;  
         case 'date' : if(self.SendData[index].trim() === '' || new Date(self.SendData[index]) === 'Invalid Date' || new Date(self.SendData[index]).getFullYear() > 2038 || new Date(self.SendData[index]).getFullYear() < 1970 ){self.Error.push(obj.label); return};break;
       }
       self.Error.splice(self.Error.indexOf(obj.label),1);
     },
      //data sending functions
     CreateData: function(){ //general create operation
       var self = this;
        if(self.ViewType === 'Designation' && self.SubViewType === 'Create'){
          //create
          this.DesignationForm.data['reservHandle'] = this.TempRole;
          // console.log(self.SendData);
          // return;
        }
        // if(self.ViewType === 'Employee' && self.SubViewType === 'Create'){
        //   this.EmployeeForm.data['approverList'] == this.TempApp;
        // }
       //emp join date
      //  if(this.ViewType === 'Employee'){
      //    let y = new Date(self.SendData['startDate']).getFullYear();
      //    if( y < 1950 || y >2050){
      //      self.Error.push(self.EmployeeForm.label['startDate']);
      //      return
      //    }
      //  }
      //   let label;
      //   if(this.ViewType === 'Employee'){ label = self.EmployeeForm.label;}
      //   if(this.ViewType === 'Department'){ label = self.DepartmentForm.label;}
      //   if(this.ViewType === 'Designation'){label = self.DesignationForm.label}
      //  //check the usual error stuff
      //  for(let w in self.SendData){
      //    if(this.ViewType === 'Employee'){ self.Validate(w,self.EmployeeForm.label[w]);}
      //    if(this.ViewType === 'Department'){ self.Validate(w,self.DepartmentForm.label[w]); }
      //    if(this.ViewType === 'Designation'){ self.Validate(w,self.DesignationForm.label[w]); }
      //  }


        //error checking
       if(self.Error.length > 0){
         self.ThroughAlert('Please fill in all required fields','bg-light-red');
         return
       }



       //error checking code when onblur is not at al fired
        // if(self.Error.length === 0){
          for(var i in self.SendData){
            // console.log( i + " - " +self.SendData[i] + " " +(self.SendData[i] === "")+" " + (self.SendData[i] == ""))
            if((self.userType === '4' && i === 'travelDesk')){
              continue //to skip the travel desk for travelagent
            }
            if(self.skip[self.ViewType].includes(i)){
              //to skipt he not manadatory field
              continue
            }
            //clear logic to validate the error and skip the prop
            // debugger;
            if(
               (self.SendData[i] === null || self.SendData[i] == ' ' || self.SendData[i] == '')) {
                 console.log( i + ' - ' + self.SendData[i])
                  self.ThroughAlert('Please fill in all required fields','bg-light-red');
                  return
              
            }
          }
          // console.log(self.SendData)
          
        // }
      self.DisableAction = true;
      $.post(this.CreateUrl,this.SendData).done(function(data){
          
          if(data.includes('true')){
            //added to flush the prevoius data
            // self.DepartmentForm.data = {};
            // self.EmployeeForm.data = {};
            // self.DesignationForm.data = {};
            self.$emit("CancelViewType");
            self.flush();
            self.ActionDone();
            self.GetTravelDesk();
            self.GetTeamOptions();
            self.GetDesignation();
            self.ThroughAlert(((self.ViewType === "Employee") ? "Traveller" : self.ViewType) + ' created successfully.','bg-green');
            
          }else{
            self.ThroughAlert(data.split('|')[1],'bg-light-red');
            
          }
          
         //flag need to be shown from the backend
        }).fail(function(x,s,err){
          self.ThroughAlert('An unexpected error has occurred. Please try again.','bg-light-red');
          
        });
     },

     UpdateData: function(){
       const self = this;

       if(this.ViewType == 'Designation'){
          //update
          this.ActiveData['reservHandle'] = this.TempRole;
        }

        //error checking
       if(self.Error.length > 0){
         self.ThroughAlert('Please fill in all required fields','bg-light-red');
         return
       }
       //error checking code when onblur is not at fired
          for(var i in self.SendData){
            if(i !== 'resignDate' && i !== 'resignTime' && i !== 'benefitBundle' && (self.SendData[i] === ' ' || self.SendData[i] === '' || self.SendData[i] === null)) {
              self.ThroughAlert('Please fill in all required fields','bg-light-red');
              return
            }
          }
        
      
      self.DisableAction = true;
      $.post(this.UpdateUrl,this.SendData).done(function(data){
          
          if(data.toString().includes('true')){
            self.flush();
            self.ActionDone();
            self.GetTravelDesk();
            self.GetTeamOptions();
            self.GetDesignation();
            self.$emit("CancelViewType");
            // self.GetTravelDesk();
            self.ThroughAlert(((self.ViewType === "Employee") ? "Traveller" : self.ViewType) + ' details updated successfully.','bg-green');
          }else{
            self.ThroughAlert(data.split('|')[1],'bg-light-red');
          }
           self.GetTravelDesk();
        }).fail(function(x,s,err){
          self.ThroughAlert('An unexpected error has occurred. Please try again.','bg-light-red');
         
        });
     },

     DeleteData: function(){
       var self = this;
       if(confirm('Are you sure to Delete..?')){
         self.DisableAction = true;
         $.post(this.DeleteUrl,this.SendData).done(function(data){
            
            if(data.toString().includes('true')){
              self.flush();
              self.ActionDone();
              self.$emit("CancelViewType");
              self.GetTravelDesk();
              self.GetTeamOptions();
              self.GetDesignation();
              self.ThroughAlert(((self.ViewType === "Employee") ? "Traveller" : self.ViewType) + ' deleted successfully.','bg-light-red');
            }else{
                self.ThroughAlert(data.split('|')[1],'bg-light-red');
            }
             self.flush();
             self.GetTravelDesk();
          }).fail(function(x,s,err){
            self.ThroughAlert('An unexpected error has occurred. Please try again.','bg-light-red');
            // self.flush();
          });
       }
        
     },

     ActionDone: function(){ //to brodcast a action is done inside this component to referesh data
       this.$emit('ActionDone');
     },

     GetDesignation: function(){ //dropdown for the Design
       var self = this
       
      $.post(api.dropdown.design,{"dataId":""}).done(function(data){
         try{
           self.DesignList = JSON.parse(data);
         }catch(e){
           alert('An Unexpected Error occurred. Please try again');
         }
         
       }).fail(x => alert('Service Not Available due to Network issuse. Please Refresh or Login again.!'));
     },
     GetTeamOptions: function(){
       const self = this;
       $.post(api.teamOptions,{data: ""})
       .done(function(data){
         try{
           self.TeamOption = JSON.parse(data);
         }catch(e){
           alert('An Unexpected Error occurred. Please try again');
           console.log("Wrong JSON"+e)
         }
       })
     },

     GetBundle: function(id){ //dropdown for the Bundle
       var self = this
      $.post(api.dropdown.bundle,{"dataId":id}).done(function(data){
         try{
           self.BundleList = JSON.parse(data);
         }catch(e){
           alert('An Unexpected Error occurred. Please try again');
         }
         
       }).fail(x => alert('Service Not Available due to Network issuse. Please Refresh or Login again.!'));
     },
     GetTravelDesk: function(){ //dropdown for the Bundle
       var self = this
      $.get(api.travelDeskList).done(function(data){
         try{
           self.TravelDeskList = JSON.parse(data);
         }catch(e){
           alert('An Unexpected Error occurred. Please try again');
         }
         
       }).fail(x => alert('Service Not Available due to Network issuse. Please Refresh or Login again.!'));
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
.footer{ height: 50px; }
.upload-contanier{ 
  height: auto;
  /* background-color: #f1f1f1; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
    }
#DataForm  ul li { margin-bottom: 5px;}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.v-select input[type=search], .v-select input[type=search]:focus{
  height:28px !important;
}
.dropdown-toggle{
  border-color:#a9a9a9 !important;
  border-radius: 0px !important;
}
/* this is to enlarge the scrolling space for better selection of the field */
.middle form{
  margin-bottom:50px;
}
.footer > button:not(:first-child){
  margin-left:5px;
}
.v-select .open-indicator{
  bottom:2px !important;
}
.act-tab{
  border-bottom: 3px solid #00a0c2 !important;
  background-color: #00a0c20f;
}
li.ul-trans {
  transition: all 250ms ease-in-out;
  border-bottom: 3px solid transparent;
}
.drag-cur{
  cursor: move;
}
.mt3{
  margin-top:5rem !important;
}
</style>
