import React from "react";
import {Redirect, Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom'
import ChangePassword from "../Change_password";
import ViewCasesSPActive from "../case_management/Cases_SP_active_view";
import ViewCasesSP from "../case_management/Cases_SP_View";
import ViewCaseActiveDetailsSP from "../case_management/Case_SP_active_details";
import ViewCaseDetailsSP from "../case_management/Case_SP_details";
import ReplyCaseRequest from "../case_management/Case_SP_reply";

const SPCAeContent = () => {
    return(
        <div>
            <Switch>
                <Route exact path='/user/change-password' component={ChangePassword} />
                <Route exact path='/user/cases' component={ViewCasesSP} />
                <Route exact path='/user/cases/active' component={ViewCasesSPActive} />
                <Route exact path='/user/case/active/:id' component={ViewCaseActiveDetailsSP} />
                <Route exact path='/user/case/:id' component={ViewCaseDetailsSP} />
                <Route exact path='/user/case/reply/:id' component={ReplyCaseRequest} />
            </Switch>
        </div>
    )
}

export default SPCAeContent