import { getNumFormat } from './Helpers';
import { connect } from '../redux/store';
import * as React from 'react';
import * as uuid from 'uuid';
import * as soundStore from '../redux/soundSubscriptionStore';

type ComponentProps = {
  /** text color */
  textColor: CanvasPattern | CanvasGradient | string;
  /** font style */
  textFont: string;
  /** canvas width */
  width: number;
  /** canvas height */
  height: number;
  style?: React.CSSProperties;
  /** used to pad 0's to front */
  digits?: number;
  /** constrain precision. */
  decimals?: number;
  subscriptions?: { [id: string]: number };
  /** normalize by max observed to be out of 100 */
  relative: boolean;
}

type ComponentDispatchers = {
  updateSubscription?: (canvasId: string, prevSubscription: number, cb: (volume: number) => void) => void;
}

type Props = ComponentProps & ComponentDispatchers;

@connect<Partial<ComponentProps> & ComponentDispatchers>(
  (state, ownProps): Partial<ComponentProps> => {
    return {
      subscriptions: state.soundSubscriptions.subscriptions
    };
  },
  (dispatch, ownProps): ComponentDispatchers => {
    return {
      updateSubscription: soundStore.setSubscription,
    };
  })
export class SoundVolumeText extends React.Component<Props, {}> {
  constructor(props) {
    super(props)
  }

  canvasId = uuid.v4() + '_canvas';
  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;
  getCanvas(): Promise<HTMLCanvasElement> {
    return new Promise((resolve) => {
      if (!this.canvas) {
        this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext('2d');
      }
      resolve(this.canvas);
    });
  }

  lastRequestedFrame = null;
  max = 0;
  draw(volume: number) {
    let fmt = getNumFormat(this.props.digits, this.props.decimals)
    if (this.props.relative && volume > this.max) {
      this.max = volume;
    }
    if (this.props.relative) {
      volume = (volume / this.max) * 100
    }
    let txt = fmt(volume);
    this.getCanvas().then(() => {
      if (this.canvasContext) {
        if (this.lastRequestedFrame) {
          window.cancelAnimationFrame(this.lastRequestedFrame);
        }
        this.lastRequestedFrame = window.requestAnimationFrame(() => {
          this.canvasContext.font = this.props.textFont;
          this.canvasContext.fillStyle = this.props.textColor;
          this.canvasContext.clearRect(0, 0, this.props.width, this.props.height);
          this.canvasContext.fillText(txt, 40, this.props.height, this.props.width)
        })
      }
    });
  }

  soundVolumeChangeHandler = (volume: number) => {
    this.draw(volume);
  }

  render() {
    this.props.updateSubscription(this.canvasId, this.props.subscriptions[this.canvasId], this.soundVolumeChangeHandler);
    return (<canvas id={this.canvasId} style={this.props.style || {}}></canvas>)
  }
}