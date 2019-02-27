import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);
/*

  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    <li>
      <Link to={ROUTES.ADMIN}>Admin</Link>
    </li>
    <li>
      <SignOutButton />
    </li>
  </ul>
*/
const NavigationAuth = () => (

  <div className="nav-side-menu">
    <div className="brand">Studium</div>
    <i className="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"></i>

    <div className="menu-list">

      <ul id="menu-content" className="menu-content out">
        <li>
          <Link to={ROUTES.HOME}>
            <i className="fa fa-dashboard fa-lg"></i> Dashboard
                  </Link>
        </li>

        <li data-toggle="collapse" data-target="#products" className="">
          <Link to={ROUTES.CATS}><i className="fa fa-gift fa-lg"></i>Categories</Link>
        </li>
        <li data-toggle="collapse" data-target="#products" className="">
          <Link to={ROUTES.CHAPEL}><i className="fa fa-gift fa-lg"></i>Chapels</Link>
        </li>

        <li data-toggle="collapse" data-target="#products" className="">
          <Link to={ROUTES.EVENTS}><i className="fa fa-gift fa-lg"></i>Events</Link>
        </li>



        <li>
          <Link to={ROUTES.USERS}>
            <i className="fa fa-users fa-lg"></i> Users
                  </Link>
        </li>
        <li>


          <Link to={ROUTES.ACCOUNT}><i className="fa fa-cog fa-lg"></i>Account</Link>
        </li>
        <li>
          <SignOutButton />
        </li>
      </ul>
    </div>
  </div>
);

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);

export default Navigation;
