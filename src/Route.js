import React, { Suspense } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Loader from './components/Loader';
import './index.css';  
import Home from './views/Home';
import SignIn from './views/SignIn';
import SignUp from './views/SignUp';

const RouteTo = () => {
    console.log(1)
    return (
         <Suspense fallback={<Loader />}>
            <Router>
            <Switch>
                <Route exact path="/" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <Route path="/home" component={Home} />
                <Route path="*" component={SignIn} />
                </Switch>
                </Router>
       </Suspense>
    )
};

export default RouteTo