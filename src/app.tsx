/// <reference path="../typings/index.d.ts" />
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as redux from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { lightBaseTheme } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { Card } from 'material-ui/Card';
import { CardHeader, CardText } from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import * as recordrtc from 'recordrtc';
import { SoundBar } from './components/SoundBar';
import { connect, store, GlobalState } from './redux/store';
import { Provider } from 'react-redux';

require('../style/default.styl');

injectTapEventPlugin();

const theme = getMuiTheme(lightBaseTheme)

interface AppProps {

}

@connect<AppProps>(
  (state, ownProps) => {
    return {};
  },
  (dispatch, ownProps) => {
    return ownProps;
  })
class App extends React.Component<AppProps, {}> {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <AppBar showMenuIconButton={false}
          // style={{
          //   paddingTop: 10,
          //   height: 50,
          //   marginBottom: 50,
          //   textAlign: 'top'
          // }}
          title={'Welcome'}>
        </AppBar>
        <Paper style={{ margin: 'auto', width: 800 }}  >
          <Card style={{ height: 800 }} >
            <CardText>
              Whenever we see sound louder than what you pick, we'll record when it happened and how loud it seemed to be; note that raw the loudness numbers are mic specific.
            </CardText>
            <SoundBar
              width={800} height={100}
              relativeMaxVolume={false}
              renderVertical={false}
              renderValue={false}
              />
          </Card>
        </Paper>
        <Paper style={{ margin: 'auto', width: 800 }}>
          <h1>Reset</h1>
        </Paper>
        <Paper style={{ margin: 'auto', width: 800 }}>
          <h1>View</h1>
        </Paper>
      </div>
    );
  }
}

ReactDOM.render(
  <MuiThemeProvider muiTheme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root'));

/** required for HMR */
if (module['hot']) {
  console.log('module is hot, accepting');
  console.log(module['hot'].accept)
  module['hot'].accept()
}
window['react'] = React;