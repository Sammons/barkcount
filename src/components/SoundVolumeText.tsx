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
  draw(volume: number) {
    if (Number.isFinite(this.props.decimals)) {
      const pow = Math.pow(10, this.props.decimals);
      volume = Math.round(pow * volume) / pow;
    }

    let volumeStr: string = volume + '';
    if (Number.isFinite(this.props.digits)) {
      let decimalIndx = volumeStr.indexOf('.');
      let digits = decimalIndx > -1 ? decimalIndx : volumeStr.length;
      if (digits < this.props.digits) {
        volumeStr = "0".repeat(this.props.digits - digits) + volumeStr;
      }
    }

    if (Number.isFinite(this.props.decimals)) {
      let decimalIndx = volumeStr.indexOf('.');
      let decimals = decimalIndx > -1 ? volumeStr.length - decimalIndx : 0;
      if (decimalIndx === -1) {
        volumeStr += "."
      }
      if (decimals < this.props.decimals) {
        volumeStr = volumeStr + "0".repeat(this.props.decimals - decimals);
      }
    }

    this.getCanvas().then(() => {
      if (this.canvasContext) {
        if (this.lastRequestedFrame) {
          window.cancelAnimationFrame(this.lastRequestedFrame);
        }
        this.lastRequestedFrame = window.requestAnimationFrame(() => {
          this.canvasContext.font = this.props.textFont;
          this.canvasContext.fillStyle = this.props.textColor;
          this.canvasContext.clearRect(0, 0, this.props.width, this.props.height);
          this.canvasContext.fillText(volumeStr, 0, this.props.height, this.props.width)
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