const Employee = {
    travelAgencyUserId: null,
    companyId: null,
    companyName: null,
    virtualName: "",
    email: "",
    mobile: "",
    department: "",
    designation: "",
    hierarchyId: "",
    // benefitBundle: '',
    personalEmail: "",
    startDate: ""
};
const EmployeeLabel = {
    travelAgencyUserId: "",
    companyId: "",
    companyName: "",
    virtualName: { label: "Employee Name", type: 'text' },
    email: { label: "Company Email", type: 'email' },
    mobile: { label:"Mobile Number", type: 'number' },
    department: { label: "Department",type: 'select' },
    designation: { label: "Designation", type: 'select'},
    hierarchyId: {label: "Set Hierachy", type: 'select'},
    // benefitBundle: { label: '', type:'select' },
    personalEmail: { label: "Personal Email",type:'email'},
    startDate: {label: "Join Date", type:'text' },
};
const Department = {
    departmentId: null,
    departmentName: "",
    departmentCode: "",
    travelAgencyMasterId: null,
}

const DepartmentLabel = {
    departmentId: "",
    departmentName: { label:"Department Name", type: 'text'},
    departmentCode: { label: "Department Code", type:'text'},
    travelAgencyMasterId: "",
}

const Designation = {
    department: '',
    designationId:null,
    designationName: '',
    designationCode:'' ,
    hierarchyId: '',
    travelAgencyMasterId: null,
    benefitBundle: '',
    approval: '',
    rightsHotel: '',
    dayCount: '',
    reservHandle: '',
    bookRoomPersion: '',
    overBudget: '',
    bookingTool:[],
    role: '',
    travldesk: null,
};

const DesignationLabel = {
    travelAgencyMasterId: '',
    designationId:'',
    department: {label:'Department', type: 'select'},
    designationName: { label:'Designation',type:'text'},
    designationCode: { label:'Designation Code', type:'text'},
    hierarchyId: {label :'Set hierarchy',type:'select'},
    benefitBundle: { label:'Benefit Bundle',type:'select' },
    approval: { label:'No of Approval',type:'select' },
    role: {label:'Role',type:'select'},
    rightsHotel: { label:'Rights to choose hotel',type:'select'},
    dayCount: { label :'No of day to approval',type:'select'},
    reservHandle: { label:'Should the travel desk handle the all reservation?',type:'select'},
    bookRoomPersion: {label:'Who will book the Room?',type:'select'},
    overBudget: {label:'Over Budget Policy can be approved by',type:'select'},
    bookingTool:{label:'Booking Tool',type:'checkbox'},
    travldesk: '',
}

const Role = [
    {label: 'Travel Desk',value:'1'},
    {label: 'Finance Approval Team',value:'2'},
    {label: 'Others',value:'3'},
];

const Reserve = [
    {label:'Yes',value:'1|yes'},
    {label:'No',value:'2|no'},
    {label:'Approval',value:'3|approval'},
];

const Rights = [
    {label:"Yes",value: "1"},
    {label:"No",value: "0"}
];

const Permission = [
    {label:"Employee After Approval",value:"1|employee"},
    {label:"Approvar",value:"2|approvar"},
    {label:"Travel Desk",value:"3|travel desk"},
];

const OverBudget = [
    {label:"Employee",value:"1|employee"},
    {label:"Approvar",value:"2|approvar"},
    {label:"Travel Desk",value:"3|travel desk"},
];

export default {
    employee: {
        data: Employee,
        label: EmployeeLabel
    },
    department: { 
        data: Department,
        label: DepartmentLabel
     },
     designation : {
         data : Designation,
         label: DesignationLabel
     },
     role : Role,
     rights : Rights,
     permission : Permission,
     overbudget: OverBudget,
     reserve : Reserve,
}