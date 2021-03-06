import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  RecoilRoot,
  // atom,
  // selector,
  // useRecoilState,
  // useRecoilValue,
} from 'recoil';

import { ThemeProvider, rootTheme } from './themes';
import './css/Colors.css';
import './css/Fonts.css';

import ParticipantList from './components/ParticipantList';
import DiscoveryApp from './components/DiscoveryApp';

export const PATIENT_MODE_SEGMENT = '/:patientMode(participant|uploaded)';

ReactDOM.render(
  <RecoilRoot>
    <ThemeProvider theme={rootTheme}>
      <Router>
        <Switch>
          <Route exact path="/" component={ParticipantList} />
          <Route path={`${PATIENT_MODE_SEGMENT}/:participantId/:activeView?`} component={DiscoveryApp} />
        </Switch>
      </Router>
    </ThemeProvider>
  </RecoilRoot>,
  document.getElementById('root'),
);
