//imports for react
import React from 'react';
import { BrowserRouter, Switch, Route, NavLink, Redirect} from "react-router-dom";

//imports for redux use
import { createStore, applyMiddleware } from "redux";
import { Provider, useDispatch } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/RootReducer"
import axios from 'axios';

const Landing = React.lazy(() => import('./landingPage/Landing'));
const Register = React.lazy(() => import('./account/Register'));
const Login = React.lazy(() => import('./account/Login'));
const ForgotPassword = React.lazy(() => import('./account/Forgot_password'));
const ResetPassword = React.lazy(() => import('./account/Reset_password'));
const SetupUserType = React.lazy(() => import('./account/User_type_setup'));
const ProfileSetupBasic = React.lazy(() => import('./account/Profile_setup_basic'));
const ProfileSetupDetailed = React.lazy(() => import('./account/Profile_setup_detailed'));
const HomePage = React.lazy(() => import('./user_content/Home'));
const SAHomePage = React.lazy(() => import('./super_admin/Home'));
const EmployeePasswordSetup = React.lazy(() => import('./account/Employee_password_setup'));
const ClientPasswordSetup = React.lazy(() => import('./account/Client_password_setup'));
const ProfileSetupPreferences = React.lazy(() => import('./account/Profile_setup_preferences'));
const SocketTest = React.lazy(() => import('./SocketTest'));
const PeoplePasswordSetup = React.lazy(() => import('./account/People_password_setup'));
const ConfirmRegistration = React.lazy(() => import('./account/Confirm_registration'));


//Making a global redux store for the application
const store = createStore(rootReducer, applyMiddleware(thunk))

function App() {
  return (
    <BrowserRouter>
      <Provider store= {store}>
        <div class="bg-orange-100 min-h-screen">
          <Switch>
            <Route exact path={"/"} component={Landing} />
            <Route path={"/user/register"} component={Register} />
            <Route path={"/confirm-registration/:token"} component={ConfirmRegistration} />
            <Route path={"/user/login"} component={Login} />
            <Route path={"/user/forgot-password"} component={ForgotPassword} />
            <Route path={'/user/reset-password/:token'} component={ResetPassword} />
            <Route path={"/user/setup/user-type"} component={SetupUserType} />

            <Route path="/sadmin/transactions" component={SAHomePage} />
            <Route path={"/sadmin/home"} component={SAHomePage} />
            <Route path={"/sadmin/change-password"} component={SAHomePage} />
            <Route path={"/sadmin/employees"} component={SAHomePage} />
            <Route path={"/sadmin/add-employee"} component={SAHomePage} />
            <Route path={"/sadmin/employee/:id"} component={SAHomePage} />
            <Route path={"/sadmin/employee/roles/:id"} component={SAHomePage} />
            <Route path={"/sadmin/cases"} component={SAHomePage} />
            <Route path={"/sadmin/case/:id"} component={SAHomePage} />
            <Route path={"/sadmin/peoples"} component={SAHomePage} />
            <Route path={"/sadmin/people/add"} component={SAHomePage} />
            <Route path={"/sadmin/people/:id"} component={SAHomePage} />
            <Route path={"/sadmin/proposals/:id"} component={SAHomePage} />
            <Route path={"/user/people/password-setup/:token"} component={PeoplePasswordSetup} />

            <Route path={"/user/setup/profile/basic"} component={ProfileSetupBasic} />
            <Route path={"/user/setup/profile/details"} component={ProfileSetupDetailed} />
            <Route path={"/user/setup/profile/preferences"} component={ProfileSetupPreferences} />

            <Route path={"/user/home"} component={HomePage} />
            <Route path={"/user/change-password"} component={HomePage} />
            <Route path={"/user/profile-setting"} component={HomePage} />

            <Route path={"/user/employee/password-setup/:token"} component={EmployeePasswordSetup} />
            <Route path={"/user/employees"} component={HomePage} />
            <Route path={"/user/add-employee"} component={HomePage} />
            <Route path={"/user/employee/:id"} component={HomePage} />
            <Route path={"/user/employee/roles/:id"} component={HomePage} />

            <Route path={"/user/services"} component={HomePage} />
            <Route path={"/user/add-service"} component={HomePage} />
            <Route path={"/user/edit-service/:id"} component={HomePage} />

            <Route path={"/user/cases"} component={HomePage} />
            <Route path={"/user/case/active"} component={HomePage} />
            <Route path={"/user/create-case-request"} component={HomePage} />
            <Route path={"/user/case/:id"} component={HomePage} />
            <Route path={"/user/case/active/:id"} component={HomePage} />
            <Route path={"/user/case/reply/:id"} component={HomePage} />
            <Route path={"/user/case/proposals/:id"} component={HomePage} />
            <Route path={"/user/proposal/:id"} component={HomePage} />
            <Route path={"/user/case/send/contract/:id"} component={HomePage} />
            <Route path={"/user/contract/:id"} component={HomePage} />
            
            <Route path={"/user/client/password-setup/:token"} component={ClientPasswordSetup} />
            <Route path={"/user/clients"} component={HomePage} />
            <Route path={"/user/client/add"} component={HomePage} />
            <Route path={"/user/client/:id"} component={HomePage} />
            <Route path={"/user/client/create-case/:id"} component={HomePage} />

            <Route path={"/user/tasks"} component={HomePage} />
            <Route path={"/user/create-task"} component={HomePage} />
            <Route path={"/user/tasks/:id"} component={HomePage} />

            <Route path={"/user/intake-form"} component={HomePage} />
            <Route path={"/user/intake/form/:id"} component={HomePage} />
            <Route path={"/user/create-intake-form"} component={HomePage} />
            <Route path="/user/intake-form/list" component={HomePage} />
            <Route path="/user/fill-form" component={HomePage} />
            <Route path="/user/client/intake-form-send/:id" component={HomePage} />

            <Route path="/user/transactions" component={HomePage} />

            <Route path="/socket/test" component={SocketTest} />

            <Redirect to={"/"} />
          </Switch>
        </div>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
