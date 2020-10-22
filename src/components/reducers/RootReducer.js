import { combineReducers } from 'redux';
import AccountRegisterReducer from './Account_registerReducer'
import AccountLoginReducer from './Account_loginReducer'
import UpdateUserTypeReducer from './Account_userTypeReducer'
import UpdateBasicProfileReducer from './Account_basicProfileReducer'
import UpdateDetailedProfileReducer from './Account_detailedProfileReducer'
import UpdateBillingProfileReducer from './Account_billingProfileReducer'
import ForgotPasswordReducer from './Account_forgotPasswordReducer'
import GetNewPasswordReducer from './Account_getNewPasswordReducer'
import AccountLogoutReducer from './Account_logoutReducer'
import ChangePasswordReducer from './User_changePasswordReducer'
import EmployeeRegisterReducer from './Add_employeeReducer'
import GetEmployeeListReducer from './GetEmployeeListReducer'
import SetEmployeePasswordReducer from './SetEmployeePasswordReducer'
import NewCaseRequestReducer from './NewCaseRequestReducer'
import ForwardCaseRequestReducer from './ForwardCaseRequestReducer';
import ReplyCaseRequestReducer from './Reply_case_requestReducer';
import ProposalAcceptReducer from './Proposal_AcceptReducer';
import EmployeeRemoveReducer from './RemoveEmployeeReducer';
import ServiceRegisterReducer from './AddServiceReducer';
import ServiceRemoveReducer from './RemoveServiceReducer';
import ServiceEditReducer from './EditServiceReducer';
import ClientRegisterReducer from './Add_clientReducer';
import PeopleRegisterReducer from './Add_peopleReducer';
import PeopleDeactivateReducer from './DeactivatePeopleReducer';
import AddTimerReducer from './AddTimerReducer';
import TimerActionReducer from './TimerActionReducer';
import TimerRunningTimeReducer from './TimerRunningTimeReducer';
import AddCustomTaskReducer from './AddCustomTaskReducer';
import SaveIntakeFormReducer from './SaveIntakeFormReducer';
import SetClientPasswordReducer from './SetClientPasswordReducer';

const rootReducer =  combineReducers({
    // list of all the reducers
    resgiterResponse : AccountRegisterReducer,
    loginResponse: AccountLoginReducer,
    updateUserTypeResponse: UpdateUserTypeReducer,
    updateBasicProfileResponse: UpdateBasicProfileReducer,
    updateDetailedProfileResponse: UpdateDetailedProfileReducer,
    updateBillingProfileResponse: UpdateBillingProfileReducer,
    forgotPasswordResponse : ForgotPasswordReducer,
    resetPasswordResponse: GetNewPasswordReducer,
    logoutUserResponse: AccountLogoutReducer,
    changePasswordResponse: ChangePasswordReducer,
    addEmployeeResponse: EmployeeRegisterReducer,
    getEmployeeResponse: GetEmployeeListReducer,
    setEmployeePasswordResponse: SetEmployeePasswordReducer,
    NewCaseRequestResponse: NewCaseRequestReducer,
    ForwardCaseRequestResponse: ForwardCaseRequestReducer,
    ReplyCaseRequestResponse: ReplyCaseRequestReducer,
    ProposalAcceptResponse: ProposalAcceptReducer,
    EmployeeRemoveResponse: EmployeeRemoveReducer,
    ServiceRegisterReponse: ServiceRegisterReducer,
    ServiceRemoveResponse: ServiceRemoveReducer,
    ServiceEditResponse: ServiceEditReducer,
    ClientRegisterResponse: ClientRegisterReducer,
    PeopleRegisterResponse: PeopleRegisterReducer,
    PeopleDeactivateResponse: PeopleDeactivateReducer,
    AddTimerResponse: AddTimerReducer,
    TimerActionResponse: TimerActionReducer,
    TimerRunningTimeResponse: TimerRunningTimeReducer,
    AddCustomTaskResponse: AddCustomTaskReducer,
    SaveIntakeFormResponse: SaveIntakeFormReducer,
    SetClientPasswordResponse: SetClientPasswordReducer
})

export default rootReducer