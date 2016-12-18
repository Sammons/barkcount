import { connect } from '../redux/store';
import * as React from 'react';
import * as uuid from 'uuid';
import * as soundStore from '../redux/soundSubscriptionStore';

type ComponentProps = {
  max: number,
  style: { width: number } & React.CSSProperties;
}

type ComponentDispatchers = {}

type Props = ComponentProps & ComponentDispatchers;

@connect<Partial<ComponentProps> & ComponentDispatchers>(
  (state, ownProps): Partial<ComponentProps> => {
    return {};
  },
  (dispatch, ownProps): ComponentDispatchers => {
    return {};
  })
export class SoundScale extends React.Component<Props, {}> {
  constructor(props) {
    super(props)
  }

  render() {
    let number = Math.round(this.props.style.width / 25);
    let widthEach = Math.floor(this.props.style.width / number);
    "".repeat(number).split('')
    let id = uuid.v4();
    return <div style={this.props.style}>
      {" ".repeat(number-1).split('').map((e,i) => <div key={id +' '+ i} style={{ display: 'inline',width: 0, paddingLeft: widthEach, height: 10, borderRight: '1px solid black'}}></div>)}
    </div>
  }
}