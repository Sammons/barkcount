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
import {List, ListItem} from 'material-ui/List';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import * as recordrtc from 'recordrtc';
import { SoundBar } from './components/SoundBar';
import { connect, store, GlobalState, BarkCount } from './redux/store';
import { Provider } from 'react-redux';

require('../style/default.styl');

injectTapEventPlugin();

const theme = getMuiTheme(lightBaseTheme)

interface AppProps {
  counts?: BarkCount[];
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
            <CardHeader>{this.props.counts.length}</CardHeader>
            <List>
              {
                this.props.counts.map(c => {
                  return (
                    <ListItem>
                    {Math.round(c.volume * 1000000)/1000000} at {c.timestamp.toLocaleTimeString()}
                    <audio controls>
                      <source src={c.data}/>
                    </audio>
                    </ListItem>
                  )
                })
              }
            </List>
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