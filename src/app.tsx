/// <reference path="../typings/index.d.ts" />
import { InterleavingRecorder, Snippet } from './latent/InterleavingRecorder';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as redux from 'redux';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { lightBaseTheme } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { Card } from 'material-ui/Card';
import { CardHeader, CardText } from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import { List, ListItem } from 'material-ui/List';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import * as recordrtc from 'recordrtc';
import { SoundBar } from './components/SoundBar';
import { connect, store, GlobalState } from './redux/store';
import { Provider } from 'react-redux';
import { SoundVolumeText } from './components/SoundVolumeText';
import { SoundScale } from './components/SoundScale';
require('../style/default.styl');

const theme = getMuiTheme(lightBaseTheme)

interface AppProps {
  snippets?: Snippet[];
  maxVolume?: number;
}

@connect<AppProps>(
  (state, ownProps) => {
    return {
      snippets: state.default.barks
    };
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
          title={'How loud is your dog?'}>
        </AppBar>
        <Paper style={{ margin: 'auto', width: 800 }}  >
          <Card style={{ height: 800 }} >
            <CardText style={{ margin: '25 25 0 10', paddingTop: 30, paddingRight: 0, width: 750 }}>
              Please note: volumes are relative and will adapt. 100 just means the loudest thing ever heard.
            </CardText>
            <SoundVolumeText
              width={300}
              height={100}
              textColor={"black"}
              textFont={"100pt Calibri"}
              decimals={0}
              digits={3}
              relative={true}
              style={{
                display: 'inline',
                width: '90px',
                height: '60px',
                marginLeft: 25,
                marginTop: 5,
                marginBottom: 0,
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 10,
                paddingTop: 30,
                backgroundColor: 'lightgrey'
              }}
              />

            <SoundBar
              width={650} height={100}
              renderVertical={false}
              renderValue={false}
              maxVolume={0.1}
              canvasStyle={{
                display: 'inline',
                width: 595,
                height: 100,
                margin: '10 0 0 25',
                padding: 0,
                backgroundColor: 'grey',
              }}
              />
            <div style={{ paddingLeft: 25, paddingTop: 25, width: 155, display: 'inline-block' }}>
              <RaisedButton style={{ marginBottom: 10, width: 130 }}>Start</RaisedButton>
              <RaisedButton style={{ marginBottom: 10, width: 130 }}>Reset</RaisedButton>
              <RaisedButton style={{ width: 130 }}>Share</RaisedButton>
            </div>
            <div style={{width: 595, display: 'inline-block'}}>
              <SoundScale max={100} decimals={0} style={{
                display: 'inline-block',
                position: 'relative',
                top: -120,
                width: 595,
                borderTop: '1px solid black'
              }} />
            </div>

            <List>
              {
                 this.props.snippets && this.props.snippets.map((c, i) => {
                  return (
                    <ListItem key={i} >
                      <span style={{ paddingRight: 10 }}>{i}</span>
                      {Math.round(c.triggerVolume * 1000000) / 1000000} at {new Date(c.startTime).toLocaleTimeString()}
                      {c.data &&
                        <audio controls>
                          <source src={c.data} />
                        </audio>
                      }
                    </ListItem>
                  )
                })
              }
            </List>
          </Card>
        </Paper>
      </div>
    );
  }
}
if (!window['tapInjected']) {
  window['tapInjected'] = true;
  injectTapEventPlugin();
}
ReactDOM.render(
  <MuiThemeProvider muiTheme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document['getElementById']('root'));

/** required for HMR */
if (module['hot']) {
  console.log('module is hot, accepting');
  console.log(module['hot'].accept)
  module['hot'].accept()
}
window['react'] = React;

new InterleavingRecorder(5000, 0.1).initialize(store)