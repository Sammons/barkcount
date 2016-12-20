import { getNumFormat } from './Helpers';
import { connect } from '../redux/store';
import * as React from 'react';
import * as uuid from 'uuid';
import * as soundStore from '../redux/soundSubscriptionStore';

type ComponentProps = {
  max: number;
  style: { width: number } & React.CSSProperties;
  decimals: number;
}

type ComponentDispatchers = {}

type Props = ComponentProps & ComponentDispatchers;

let scaleBarsStyle = (widthEach) => ({
  display: 'inline-block',
  width: 0, 
  paddingLeft: widthEach - 1,
  height: 10,
  borderLeft: '1px solid black'
});

let scaleBarsEndStyle = (widthEach) => Object.assign(scaleBarsStyle(widthEach), {
  borderRight: '1px solid black',
  paddingLeft: widthEach + 3
})

let scaleNumStyleBase = (other) => (Object.assign({
  display: 'inline-block',
  paddingLeft: 35,
  height: 10,
  borderLeft: '1px solid white',
  fontSize: '75%'
}, other));

let scaleNumStartStyle = (widthEach) => scaleNumStyleBase({
  width: widthEach - 55,
  paddingRight: 20,
  paddingLeft: 0
});

let scaleNumStyle = (widthEach) => scaleNumStyleBase({
  width: widthEach - (36),
});

let scaleNumAlmostEndStyle = (widthEach) => scaleNumStyleBase({
  width: 0,
  paddingRight: 0
});

let scaleNumEndStyle = (widthEach) => scaleNumStyleBase({
  float: 'right',
  paddingLeft: 0,
  paddingRight: 6
});

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
    let number = 10;
    let widthEach = Math.floor(this.props.style.width / number);
    console.log(widthEach)
    "".repeat(number).split('')
    // number -= 1; /** don't need/want a bar at the end */
    let id = uuid.v4();
    let slice = this.props.max / (number);
    let fmt = getNumFormat(1, this.props.decimals);
    return <div key={id} style={this.props.style}>
      <div>
        {
          " ".repeat(number-1).split('').map((e, i) =>
            <div key={id + '-1-' + i} style={scaleBarsStyle(widthEach)} ></div>)
        }
        <div key={id + '-1-end'} style={scaleBarsEndStyle(widthEach)} ></div>
      </div>
      <div>
        <div key={id + '-2-start'} style={scaleNumStartStyle(widthEach)} >&nbsp;{0}</div>
        {
          " ".repeat(number - 2).split('').map((e, i) =>
            <div key={id + '-2-' + i} style={scaleNumStyle(widthEach)} >&nbsp;{fmt(slice * (i + 1))}</div>)
        }
        <div key={id + '-2-near-end'} style={scaleNumAlmostEndStyle(widthEach)} >&nbsp;{fmt(slice * (number - 1))}</div>
        <div key={id + '-2-end'} style={scaleNumEndStyle(widthEach)} >&nbsp;{fmt(this.props.max)}</div>
      </div>
    </div>
  }
}