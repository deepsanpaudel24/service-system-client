import React from "react";
import {Redirect, Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom'
import ViewCasesClient from "../case_management/Cases";
import ViewCaseDetailsClient from "../case_management/Case_details";
import ViewCasesProposalClient from "../case_management/Case_propsals_client";
import ContractDetailsClient from "../case_management/ContractDetailsClient";
import CreateCaseRequest from "../case_management/Create_caseRequest";
import ViewProposalDetailsClient from "../case_management/Proposal_Details_clients";
import ChangePassword from "../Change_password";
import ClientFillForm from "../client_intake_form/ClientFillForm";
import ContractDetails from "../contract_management/Contract_Details";
import AddEmployee from "../employee_management/Add_employee";
import EmployeeDetails from "../employee_management/Employee_details";
import EmployeeRoles from "../employee_management/Roles_employee";
import ViewEmployees from "../employee_management/View_employees";
import CheckoutTransactions from "../payments/Client_Transactions";
import ProfileSetting from "../Profile_setting";
import Dashboard from "./Dashboard_page";

const CCAContent = () => {
    return(
        <div>
            <Switch>
                {/* <Route exact path='/user/home' component={ClientFillForm} /> */}
                <Route exact path='/user/home' component={Dashboard} />
                <Route exact path='/user/profile-setting' component={ProfileSetting} />
                <Route exact path='/user/change-password' component={ChangePassword} />

                <Route exact path='/user/employees' component={ViewEmployees} />
                <Route exact path='/user/add-employee' component={AddEmployee} />
                <Route exact path='/user/employee/:id' component={EmployeeDetails} />
                <Route exact path='/user/employee/roles/:id' component={EmployeeRoles} />
                
                <Route exact path='/user/cases' component={ViewCasesClient} />
                <Route exact path='/user/create-case-request' component={CreateCaseRequest} />
                <Route exact path='/user/case/:id' component={ViewCaseDetailsClient} />
                <Route exact path='/user/case/proposals/:id' component={ViewCasesProposalClient} />
                <Route exact path='/user/proposal/:id' component={ViewProposalDetailsClient} />

                <Route exact path='/user/contract/:id' component={ContractDetailsClient} />
                <Route exact path='/user/fill-form' component={ClientFillForm} />

                <Route exact path="/user/transactions" component={CheckoutTransactions} />
            </Switch>
        </div>
    )
}

export default CCAContent