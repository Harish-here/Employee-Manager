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
    // hierarchyId: "1",//sending defalut value  since we are gonna hide this shit
    approverList: [],
    // travelDesk: "null",
    employeeCode: '',
    resign: '0',
    personalEmail: "",
    startDate: "",
    status: "1"
};
const EmployeeLabel = {
    travelAgencyUserId: null,
    companyId: null,
    companyName: null,
    travelAgencyNameTemp: { label: "First Name", type: 'text',mandatory: true },
    virtualName: { label: "Last Name", type: 'text',mandatory: true },
    employeeCode: {label: "Traveller Code",type:'text',mandatory: true},
    email: { label: "Official Email / Username", type: 'email',mandatory: true },
    mobile: { label: "Mobile Number", type: 'text',mandatory: true },
    department: { label: "Department / Team", type: 'select',mandatory: true },
    designation: { label: "Designation", type: 'select',mandatory: true },
    
    resign: null,
    hierarchyId: null,
    // hierarchyId: { label: "Set Hierachy", type: 'select' },
    // benefitBundle: { label: '', type:'select' },
    personalEmail: { label: "Personal Email", type: 'email',mandatory: true },
    startDate: { label: "Date of Joining", type: 'date',mandatory: true },
    status: { label: "Account", type:'radio',mandatory: true},
    // travelDesk: {label: "Travel Desk",type:"select"},
    approverList: { label: "Approval Hierarchy", type:'select',mandatory: true},
    
    
};
const Department = {
    departmentId: 'null',
    departmentName: "",
    departmentCode: "",
    travelAgencyMasterId: 'null',
    financeApprover:"",
    team:"0"
}
const DepartmentTeam = {
    departmentId: 'null',
    departmentName: "",
    departmentCode: "",
    parent:"",
    budgetApprover: "",
    financeApprover: "",
    travelDesk: "",
    team:'1'
}

const DepartmentTeamLabel = {
    departmentId: null,
    departmentName: { label: "Team Name", type: 'text' ,mandatory: true },
    departmentCode: { label: "Team Code", type: 'text' ,mandatory: true},
    parent: { label: "Parent Team", type: 'select' ,mandatory: true},
    budgetApprover: { label: "Budget Approver", type: 'select' ,mandatory: true},
    financeApprover: { label: "Finance Approver", type: 'select' ,mandatory: true},
    travelDesk: { label: "Travel Desk", type: 'select' ,mandatory: true}
}
const DepartmentLabel = {
    departmentId: null,
    departmentName: { label: "Department Name", type: 'text',mandatory: true },
    departmentCode: { label: "Department Code", type: 'text',mandatory: true },
    financeApprover: { label: "Finance Approver", type: 'select',mandatory: true },
    travelAgencyMasterId: null,
}

const Designation = {
    // department: '',
    designationId: 'null',
    designationName: '',
    designationCode: '',
    hierarchyId: 'null',
    travelAgencyMasterId: 'null',
    benefitBundle: '',
    approval: 'null',
    rightsHotel: { label: 'Yes', value: '1' },
    dayCount: 'null',
    reservHandle: "",
    bookRoomPersion:  { label: "Approver", value: "2|approvar" },
    overBudget: 'null',
    // bookingTool: [],
    role: '',
    travldesk: 'null',
};

const DesignationLabel = {
    travelAgencyMasterId: null,
    designationId: null,
    // department: { label: 'Department', type: 'select' },
    designationName: { label: 'Designation', type: 'text',mandatory: true },
    designationCode: { label: 'Designation Code', type: 'text',mandatory: true },
    hierarchyId : null,
    // hierarchyId: { label: 'Set hierarchy', type: 'select' },
    benefitBundle: { label: 'Travel Policy', type: 'select',mandatory: true },
    // approval: { label: 'No of Approval', type: 'select' },
    approval: null,
    role: { label: 'Role', type: 'select',mandatory: true },
    reservHandle: { label: 'Does this designation eligible to approve the bookings?', type: 'select',mandatory: true },
    // rightsHotel: { label: 'Who has rights to choose hotel?', type: 'select' },
    rightsHotel: null,

    // dayCount: { label: 'No of day to approval', type: 'select' },
    dayCount: null,
    
    // bookRoomPersion: { label: 'Who will book the room?', type: 'select' },
    bookRoomPersion: null,
    // overBudget: { label: 'Over Budget Policy can be approved by', type: 'select' },
    overBudget: null,
    // bookingTool: { label: 'Booking Tool', type: 'checkbox' },
    // bookingTool: null,
    travldesk: null,
}

const Role = [
    { label: 'Traveller', value: '3' },
    { label: 'Travel Desk', value: '1' },
    { label: 'Finance', value: '2' },
    
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
    { label: "Traveller After Approval", value: "1|employee" },
    { label: "Approver", value: "2|approvar" },
    { label: "Travel Desk", value: "3|travel desk" },
];

const OverBudget = [
    { label: "Traveller", value: "1|employee" },
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
    team: {
        data: DepartmentTeam,
        label: DepartmentTeamLabel
    },
    role: Role,
    rights: Rights,
    permission: Permission,
    overbudget: OverBudget,
    reserve: Reserve,
}