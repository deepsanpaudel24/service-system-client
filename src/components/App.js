//imports for react
import React from 'react';
import { BrowserRouter, Switch, Route, NavLink, Redirect} from "react-router-dom";

//imports for redux use
import { createStore, applyMiddleware } from "redux";
import { Provider, useDispatch } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/RootReducer"

//imports of all the components
import Landing from './landingPage/Landing';
import Register from './account/Register';
import Login from "./account/Login";
import ForgotPassword from "./account/Forgot_password";
import ResetPassword from "./account/Reset_password";
import SetupUserType from "./account/User_type_setup";
import ProfileSetupBasic from "./account/Profile_setup_basic";
import ProfileSetupDetailed from "./account/Profile_setup_detailed";
import HomePage from "./user_content/Home";
import SAHomePage from './super_admin/Home';
import EmployeePasswordSetup from './account/Employee_password_setup';

import axios from 'axios';
import ClientPasswordSetup from './account/Client_password_setup';
import ProfileSetupPreferences from './account/Profile_setup_preferences';
import SocketTest from './SocketTest';
import PeoplePasswordSetup from './account/People_password_setup';

//Making a global redux store for the application
const store = createStore(rootReducer, applyMiddleware(thunk))

//axios.defaults.baseURL = "https://service-system-backend.herokuapp.com/";
//axios.defaults.baseURL = "http://127.0.0.1:5000";
//axios.defaults.withCredentials = true;

function App() {
  return (
    <BrowserRouter>
      <Provider store= {store}>
        <div class="bg-orange-100 min-h-screen">
          <Switch>
            <Route exact path={"/"} component={Landing} />
            <Route path={"/user/register"} component={Register} />
            <Route path={"/user/login"} component={Login} />
            <Route path={"/user/forgot-password"} component={ForgotPassword} />
            <Route path={'/user/reset-password/:token'} component={ResetPassword} />
            <Route path={"/user/setup/user-type"} component={SetupUserType} />

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

            <Route path="/socket/test" component={SocketTest} />

            <Redirect to={"/"} />
          </Switch>
        </div>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
