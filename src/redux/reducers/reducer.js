const initialState = {
    modelConcreteShow:false,
    modelLabourShow:false,
    modelUserCreate:false,
    modalSiteCreate:false,
    modalRegLabour:false,
    tallyData:[],
    roles:[],
    siteAccounts:[],
    sites:[],
    salaryCodes:[],
    wageList:[],
    laboursData:[],
    users:[],
    advancePendingList:[],
    advanceTotalList:[],
    paymentTransactionList:[],
    paymentDetailsModal:false,
    paymentDetailsId:'',
    retentionPendingList:{},
    retentionApprovedList:{},
    compensationApprovedList:{},
    compensationPendingList:{},
    createSalaryStructure:false,
    editSalaryStructureModal:false,
    salaryCodeEdit:[],
    advanceTypes:[],
    paymentList:[],
    paymentListView:[],
    labourMaster:[],
    salaryMaster:[],
    wagesheet:[],
    registerOfWages:[],
    wagesSummary:[],
    labourWorkReport:[],
    concreteCats:[],
    labourTypes:[],
    otList:[],
    modalCompShow:false,
    modalRetShow:false,
    attendance:[],
    editUserModal:false,
    editUserData:[],
    modalSiteEdit:false,
    siteEditData:[],
    inputData:[],
    tallyModal:false,
    editLabourModal:false,
    labourData:[],
    applyAdvanceModal:false
}
const reducer = (previousState = initialState,action)=>{
    const {type,payload}=action;
    switch (type) {
        case "TOGGLE_CONCRETE_MODEL":
            return{
                ...previousState,
                modelConcreteShow:!previousState.modelConcreteShow
            
            }
            case "TOGGLE_LABOUR_MODEL":
                return{
                    ...previousState,
                    modelLabourShow:!previousState.modelLabourShow
                
                }
            case "USER_CREATE_MODEL":
            return{
                ...previousState,
                modelUserCreate:!previousState.modelUserCreate
            }
            case "TALLY_DATA":
                return{
                ...previousState,
                tallyData:payload
                }
            case "USER_ROLE":
            return{
                ...previousState,
                roles:payload

            }
            case "TOGGLE_SITE_CREATE_MODAL":
                return{
                    ...previousState,
                    modalSiteCreate : !previousState.modalSiteCreate
                }
            case "SITE_ACCOUNTS":
                return{
                    ...previousState,
                    siteAccounts:payload
                }
            case "SITE_LIST":
                return{
                    ...previousState,
                    sites:payload
                }
            case "SALARY_CODE":
                return{
                    ...previousState,
                    salaryCodes:payload
                }
            case "WAGE_LIST":
                return{
                    ...previousState,
                    wageList:payload
                }
            case "TOGGLE_REG_LABOUR_MODAL":
                return{
                    ...previousState,
                    modalRegLabour:!previousState.modalRegLabour
                }
            case "LABOURS_LIST":
                return{
                    ...previousState,
                    laboursData:payload
                }
            case "USERS_LIST":
                return{
                    ...previousState,
                    users:payload
                }
            case "ADVANCE_PENDING":
                return{
                    ...previousState,
                    advancePendingList:payload
                }
            case "ADVANCE_TOTAL_LIST":
                return{
                    ...previousState,
                    advanceTotalList:payload
                }
            case "PAYMENT_TRANSACTION_LIST":
                return{
                    ...previousState,
                    paymentTransactionList:payload
                }
            case "PAYMENT_DETAILS_MODAL":
                return{
                    ...previousState,
                    paymentDetailsModal:payload.show,
                    paymentDetailsId:payload.id
                }
            case "RETENTION_PENDING":
                return{
                    ...previousState,
                    retentionPendingList:payload
                }
            case "RETENTION_APPROVED":
                return{
                    ...previousState,
                    retentionApprovedList:payload
                }
            case "COMPENSATION_PENDING":
                return{
                    ...previousState,
                    compensationPendingList:payload
                }
            case "COMPENSATION_APPROVED":
                return{
                    ...previousState,
                    compensationApprovedList:payload
                }
            case "CREATE_SALARY_STRUCTURE_MODAL":
                return{
                    ...previousState,
                    createSalaryStructure:payload
                }
            case "EDIT_SALARY_STRUCTURE_MODAL":
                return{
                    ...previousState,
                    editSalaryStructureModal:payload.show,
                    salaryCodeEdit :payload.data
                }
            case "ADVANCE_TYPES":
                return{
                    ...previousState,
                    advanceTypes:payload
                }
            case "PAYMENT_LIST":
                return{
                    ...previousState,
                    paymentList:payload
                }
            case "PAYMENT_LIST_VIEW":
                return{
                    ...previousState,
                    paymentListView:payload
                }
            case "LABOUR_MASTER_DATA":
                return({
                    ...previousState,
                    labourMaster:payload
                  
                })
            case "SALARY_MASTER_DATA":
                return({
                    ...previousState,
                    salaryMaster:payload
                   
                })   
            case "WAGE_SHEET_DATA":
                return({
                    ...previousState, 
                    wagesheet:payload
                    
                })
            case "REGISTER_OF_WAGES_DATA":
                return({
                    ...previousState,
                    registerOfWages:payload
                   
                })
            case "WAGES_SUMMARY_DATA":
                return({
                    ...previousState,
                    wagesSummary:payload
                })
            case "LABOUR_WORK_REPORT":
                return({
                    ...previousState,
                    labourWorkReport:payload
                })
            case "LABOUR_TYPES":
                return({
                    ...previousState,
                    labourTypes:payload
                })
            case "CONCRETE_CATS":
                return({
                    ...previousState,
                    concreteCats:payload
                })
            case "OT_LIST":
              return({
                ...previousState,
                otList:payload
              })
            case "COMP_MODAL":
                return({
                    ...previousState,
                    modalCompShow:payload
                }) 
                
            case "RET_MODAL":
                return({
                    ...previousState,
                    modalRetShow:payload
                })
            case "ATTENDANCE":
                return({
                    ...previousState,
                    attendance:payload
                }) 
            case "EDIT_USER_MODAL":
                return({
                    ...previousState,
                    editUserModal:payload.show,
                    editUserData:payload.data
                })
            case "EDIT_SITE_MODAL":
                return({
                    ...previousState,
                    siteEditData:payload.data,
                    modalSiteEdit:payload.show
                })
            case "INPUT_DATA":
                return({
                    ...previousState,
                    inputData:payload
                })
            case "TALLY_MODAL":
                return({
                    ...previousState,
                    tallyModal:payload
                })
            case "EDIT_LABOUR_MODAL":
                return({
                    ...previousState,
                    editLabourModal:payload.show,
                    labourData:payload.data
                })
            case "ADVANCE_MODAL":
                return({
                    ...previousState,
                    applyAdvanceModal:payload.show
                })
        default: return previousState
        
    }
}

export default reducer