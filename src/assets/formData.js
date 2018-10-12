const Employee = {
    travelAgencyUserId: 'null',
    companyId: 'null',
    companyName: 'null',
    virtualName: "",
    travelAgencyNameTemp: "",
    email: "",
    mobile: "",
    department: "",
    designation: "",
    hierarchyId: "1",//defalut value sending since we are gonna hide this shit
    approverList: [],
    // benefitBundle: '',
    employeeCode: '',
    resign: 'null',
    personalEmail: "",
    startDate: "",
    status: "1"
};
const EmployeeLabel = {
    travelAgencyUserId: null,
    companyId: null,
    companyName: null,
    travelAgencyNameTemp: { label: "First Name", type: 'text' },
    virtualName: { label: "Last Name", type: 'text' },
    employeeCode: {label: "Employee Code",type:'text'},
    email: { label: "Company Email", type: 'email' },
    mobile: { label: "Mobile Number", type: 'text' },
    department: { label: "Department", type: 'select' },
    designation: { label: "Designation", type: 'select' },
    resign: null,
    hierarchyId: null,
    // hierarchyId: { label: "Set Hierachy", type: 'select' },
    // benefitBundle: { label: '', type:'select' },
    personalEmail: { label: "Personal Email", type: 'email' },
    startDate: { label: "Join Date", type: 'date' },
    status: { label: "Account", type:'radio'},
    approverList: { label: "Approval Hierachy", type:'select'},
    
};
const Department = {
    departmentId: 'null',
    departmentName: "",
    departmentCode: "",
    travelAgencyMasterId: 'null',
}

const DepartmentLabel = {
    departmentId: null,
    departmentName: { label: "Department Name", type: 'text' },
    departmentCode: { label: "Department Code", type: 'text' },
    travelAgencyMasterId: null,
}

const Designation = {
    department: '',
    designationId: 'null',
    designationName: '',
    designationCode: '',
    hierarchyId: 'null',
    travelAgencyMasterId: 'null',
    benefitBundle: '',
    approval: 'null',
    rightsHotel: { label: 'Yes', value: '1' },
    dayCount: 'null',
    reservHandle: '',
    bookRoomPersion:  { label: "Approver", value: "2|approvar" },
    overBudget: 'null',
    bookingTool: [],
    role: '',
    travldesk: 'null',
};

const DesignationLabel = {
    travelAgencyMasterId: null,
    designationId: null,
    department: { label: 'Department', type: 'select' },
    designationName: { label: 'Designation', type: 'text' },
    designationCode: { label: 'Designation Code', type: 'text' },
    hierarchyId : null,
    // hierarchyId: { label: 'Set hierarchy', type: 'select' },
    benefitBundle: { label: 'Grade Policy', type: 'select' },
    // approval: { label: 'No of Approval', type: 'select' },
    approval: null,
    role: { label: 'Role', type: 'select' },
    rightsHotel: { label: 'Who has Rights to choose hotel?', type: 'select' },
    // dayCount: { label: 'No of day to approval', type: 'select' },
    dayCount: null,
    reservHandle: { label: 'Booking Approver?', type: 'select' },
    bookRoomPersion: { label: 'Who will book the Room?', type: 'select' },
    // overBudget: { label: 'Over Budget Policy can be approved by', type: 'select' },
    overBudget: null,
    // bookingTool: { label: 'Booking Tool', type: 'checkbox' },
    bookingTool: null,
    travldesk: null,
}

const Role = [
    { label: 'Employee', value: '3' },
    { label: 'Travel Desk', value: '1' },
    { label: 'Finance Approval Team', value: '2' },
    
];

const Reserve = [
    { label: 'Yes', value: '1|yes' },
    { label: 'No', value: '2|no' },
    // { label: 'Approval', value: '3|approval' },
];

const Rights = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" }
];

const Permission = [
    { label: "Employee After Approval", value: "1|employee" },
    { label: "Approver", value: "2|approvar" },
    { label: "Travel Desk", value: "3|travel desk" },
];

const OverBudget = [
    { label: "Employee", value: "1|employee" },
    { label: "Approver", value: "2|approvar" },
    { label: "Travel Desk", value: "3|travel desk" },
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
    designation: {
        data: Designation,
        label: DesignationLabel
    },
    role: Role,
    rights: Rights,
    permission: Permission,
    overbudget: OverBudget,
    reserve: Reserve,
}