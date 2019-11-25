import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './pages/home/index.js'
import './App.css';

const App = () => {
    return (

        <BrowserRouter>
            <Switch>
                <Route 
                    path = "/" 
                    exact
                    component = { Home } 
                />
            </Switch>
        </BrowserRouter>
        
    );
}

export default App;
