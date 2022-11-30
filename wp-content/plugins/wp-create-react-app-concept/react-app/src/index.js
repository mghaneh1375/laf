import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import MenuProvider from './store/menuStore';
import AppNavigation from './navigation';
import { Toaster } from 'react-hot-toast';
import 'react-phone-input-2/lib/style.css'
import './translation'
import MarketProvider from 'store/marketStore';
import UserProvider from 'store/userStore';
import {BrowserRouter} from "react-router-dom";


const reactAppData = window.rpReactPlugin || {}
const { appSelector } = reactAppData
const appAnchorElement = document.querySelector(appSelector)

if (appAnchorElement) {

ReactDOM.render(
  <React.StrictMode>
      <MarketProvider>
        <UserProvider>
            <MenuProvider>
                <AppNavigation />
                <Toaster position = 'top-center'/>
            </MenuProvider>
        </UserProvider>
      </MarketProvider>
  </React.StrictMode>,
  appAnchorElement
);

}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

