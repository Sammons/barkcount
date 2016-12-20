import { Snippet } from '../latent/InterleavingRecorder';
import {List, ListItem} from 'material-ui/List';
import * as React from 'react';
import {connect} from '../redux/store';



interface SnippetProps {
  snippets: Snippet[];
}

interface SnippetDispatchers {
  playSnippet;
  stopSnippet;
}

type Props = SnippetProps & SnippetDispatchers;

@connect((state, ownProps) => {
  return {
    snippets: state.default.barkcounts
  };
}, (dispatch, ownProps) => {
  return {};
})
export class SnippetListing extends React.Component<Props,{}> {
  render() {
    return <List>
    
    </List>
  }
}