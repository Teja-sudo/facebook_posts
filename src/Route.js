import React, { Suspense } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import Loader from './components/Loader';
import './index.css';  
import Home from './views/Home';
import FormPage from './views/FormPage';

const RouteTo = () => {
    const history = useHistory()


    return (
         <Suspense fallback={<Loader />}>
            <Router>
            <Switch>
                <Route exact path="/" component={FormPage} />
                <Route path="/home" component={Home} />
                <Route path="*" component={FormPage} />
                </Switch>
                </Router>
       </Suspense>
    )
};

export default RouteTo



// export const useLogging = (action, isMspRedirect, userid, firstName) => {
//   const [loggingInNow, { error, loading: loggingLoading }] = useMutation(
//     LOGGING_LOGIN,
//     {
//       onCompleted: () => {},
//       onError: (err) => {
//         sendDataToSentry({
//           name: 'LoggingLogoutToAuditLog',
//           message: 'User Logout failed',
//           tags: { severity: 'CRITICAL' },
//           extra: [{ type: 'errorEncounter', err }],
//         });
//       },
//     }
//   );
