/// <reference path="../typings/index.d.ts" />
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
import { BarkCount } from './redux/defaultStore';
import { SoundVolumeText } from './components/SoundVolumeText';

require('../style/default.styl');

const theme = getMuiTheme(lightBaseTheme)

interface AppProps {
  counts?: BarkCount[];
  maxVolume?: number;
}

@connect<AppProps>(
  (state, ownProps) => {
    return {
      counts: state.default.barkcounts
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
              This is the volume bar. Volumes are relative to your device and the width of the bar will adjust so that the max is the loudest volume observed so far.
            </CardText>
            <SoundVolumeText
              width={300}
              height={100}
              textColor={"black"}
              textFont={"100pt Calibri"}
              decimals={3}
              digits={1}
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
            <div style={{ paddingLeft: 25, paddingTop: 25, width: 155}}>
              <RaisedButton style={{marginBottom: 10, width: 130}}>Start</RaisedButton>
              <RaisedButton style={{marginBottom: 10, width: 130}}>Reset</RaisedButton>
              <RaisedButton style={{width: 130}}>Share</RaisedButton>
            </div>

            <List>
              {
                this.props.counts.map((c, i) => {
                  return (
                    <ListItem key={i} >
                      <span style={{ paddingRight: 10 }}>{i}</span>
                      {Math.round(c.volume * 1000000) / 1000000} at {c.timestamp.toLocaleTimeString()}
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