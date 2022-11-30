import React, {useEffect} from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    useRouteMatch,
    useLocation
} from "react-router-dom";
import Home from 'screens/home'
import Redirector from 'screens/redirector/index'
import Login from 'screens/login/index';
import Menu from 'screens/menu'
import EatIn from 'screens/eatIn'
import SingleMenu from 'screens/singleMenu'

//styles
import 'navigation/style.scss'
import Booking from 'screens/booking';
import SignUp from 'screens/signup';
import ForgetPass from 'screens/forgetPass';
import { useMarketContext } from 'store/marketStore';
import PostCodeCheckModal from 'screens/postCodeCheck';
import EnterCodeScreen from 'screens/enterCode';
import { useUser } from 'store/userStore';
import StartCheckout from 'screens/startCheckout';
import ResetPassScreen from 'screens/resetPass';
import PaymentScreen from 'screens/payment'
import HistoryScreen from "../screens/history";
import {types} from "util";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

const AppNavigation = () => {
    return (
        <Router basename="/menu">
          <ScrollToTop/>
          <RouteSwitcher />
        </Router>
    );
};

const RouteSwitcher = () => {
  let location = useLocation<{ background: Location }>();
  let background = location.state && location.state.background;

  return (
    <div>
      <AppNavBar />
      <Switch>
        <Route path="/checkout">
          <StartCheckout />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
          <Route path="/redirector">
              <Redirector />
          </Route>
        <Route path="/history">
            <HistoryScreen />
        </Route>
        <Route path="/forgetpass">
          <ForgetPass />
        </Route>
        <Route path="/payment">
          <PaymentScreen />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/booking">
          <Booking />
        </Route>
        <Route path="/reset-pass">
          <ResetPassScreen />
        </Route>
        <Route path="/enter-code">
          <EnterCodeScreen />
        </Route>
        <Route path="/order/:filter">
            <Menu/>
        </Route>
          <Route path="/singleMenu">
              <EatIn />
          </Route>
          <Route path="/single-menu/:filter">
              <SingleMenu />
          </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
      { background && <Route path={ ['*/postcode-check'] }>
          <PostCodeCheckModal />
        </Route> }
    </div>
  );
};


const NavbarLink = ({ title, link }:{ title: string, link: string }) => {

    let match = useRouteMatch({
    path: link,
    exact: true
  });

    if(title === "Booking")
        return <Link id='bookingNavBtn' className={`nav-link ${match ? 'active' : '' }`} to={link}>{title}</Link>;

return <Link className={`nav-link ${match ? 'active' : '' }`} to={link}>{title}</Link>
};

const NavbarLinkWithATag = ({ title, link }:{ title: string, link: string }) => {
    return <a className={`nav-link`} href={link}>{title}</a>
};

const AppNavBar = () => {

    return <div></div>
  // const { user, logout } = useUser();
  // const base_url = "http://localhost/";

  // return <Navbar className='justify-content-between menu' expand="lg">
  //     <Container>
  //         <Navbar.Toggle aria-controls="basic-navbar-nav" />
  //         <Navbar.Collapse>
  //           <Nav className="mr-auto">
  //
  //               { <NavbarLinkWithATag link={base_url} title = 'Home'/> }
  //               { <NavbarLinkWithATag link={base_url + 'gallery'} title = 'Gallery'/> }
  //               { <NavbarLink link='/menu' title = 'Menu'/> }
  //               { <NavbarLink link='/booking' title = 'Booking'/> }
  //               { <NavbarLinkWithATag link={base_url + 'contactus'} title = 'ContactUs'/> }
  //           </Nav>
  //           <Nav className="justify-content-end">
  //               { user == undefined && <NavbarLink title = 'Sign In' link = '/login'/>}
  //               { user && <NavDropdown className="mr-auto" title={ `Hi ${user.full_name || user.username || user.mobile }` } id="menu-nav-dropdown">
  //                   <Link to={"/history"} className='dropdown-item'>My Orders</Link>
  //                   <div onClick = { logout } className='dropdown-item'>Sign Out</div>
  //               </NavDropdown>}
  //           </Nav>
  //         </Navbar.Collapse>
  //   </Container>
  //   </Navbar>
};

export default AppNavigation
