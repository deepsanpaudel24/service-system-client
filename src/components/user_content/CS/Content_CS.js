import React from "react";
import {Redirect, Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom'
import ChangePassword from "../Change_password";
import ViewCasesClient from "../case_management/Cases";
import ViewCaseDetailsClient from "../case_management/Case_details";
import ViewCasesProposalClient from "../case_management/Case_propsals_client";
import CreateCaseRequest from "../case_management/Create_caseRequest";
import ViewProposalDetailsClient from "../case_management/Proposal_Details_clients";

const CSContent = () => {
    return(
        <div>
            <Switch>
                <Route exact path='/user/change-password' component={ChangePassword} />
                <Route exact path='/user/cases' component={ViewCasesClient} />
                <Route exact path='/user/create-case-request' component={CreateCaseRequest} />
                <Route exact path='/user/case/:id' component={ViewCaseDetailsClient} />
                <Route exact path='/user/case/proposals/:id' component={ViewCasesProposalClient} />
                <Route exact path='/user/proposal/:id' component={ViewProposalDetailsClient} />
            </Switch>
        </div>
    )
}

export default CSContent