import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import UsersPage from '../Users';
import AdduserPage from '../Adduser';
import EdituserPage from '../Edituser';
import EditeventPage from '../EditEvent';
import ShoweventPage from '../Showevent';
import ShowchapelPage from '../Showchapel';
import ShowcategoryPage from '../Showcategory';
import EditcategoryPage from '../Editcategory';
import EditchapelPage from '../Editchapel';
import ShowuserPage from '../Showuser';
import CatlistPage from '../Catlist';
import AdminPage from '../Admin';
import ChapellistPage from '../Chapellist';
import AddchapelPage from '../Addchapel';

import EventlistPage from '../Eventlist';
import AddeventPage from '../Addevent';

import AddcategoryPage from '../Addcategory';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <div className="">
      <div className="row">
        <div className="col-md-3 col-lg-3">
          <Navigation />
        </div>
        <div className="col-md-8">
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route
            exact
            path={ROUTES.PASSWORD_FORGET}
            component={PasswordForgetPage}
          />
          <Route exact path={ROUTES.HOME} component={HomePage} />
          <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route exact path={ROUTES.USERS} component={UsersPage} />
          <Route exact path={ROUTES.CATS} component={CatlistPage} />
          <Route exact path={ROUTES.ADDUSERS} component={AdduserPage} />
          <Route exact path={ROUTES.ADDCATEGORY} component={AddcategoryPage} />

          <Route exact path={ROUTES.ADDCHAPEL} component={AddchapelPage} />
          <Route exact path={ROUTES.CHAPEL} component={ChapellistPage} />

          <Route exact path={ROUTES.ADDEVENT} component={AddeventPage} />
          <Route exact path={ROUTES.EVENTS} component={EventlistPage} />

          <Route exact path={ROUTES.EDITUSERS} component={EdituserPage} />
          <Route exact path={ROUTES.EDITEVENT} component={EditeventPage} />
          <Route exact path={ROUTES.SHOWEVENT} component={ShoweventPage} />
          <Route exact path={ROUTES.SHOWCHAPEL} component={ShowchapelPage} />
          <Route exact path={ROUTES.SHOWCATEGORY} component={ShowcategoryPage} />
          <Route exact path={ROUTES.EDITCATEGORY} component={EditcategoryPage} />
          <Route exact path={ROUTES.EDITCHAPEL} component={EditchapelPage} />
          <Route exact path={ROUTES.SHOWUSER} component={ShowuserPage} />
          <Route exact path={ROUTES.ADMIN} component={AdminPage} />

        </div>
      </div>



    </div>
  </Router>
);

export default withAuthentication(App);
