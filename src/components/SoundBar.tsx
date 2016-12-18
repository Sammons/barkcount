import { Dispatch } from 'redux';
import * as React from 'react';
import * as soundStore from '../redux/soundSubscriptionStore';
import { connect } from '../redux/store';
import * as uuid from 'uuid';

export interface ComponentProps {
  /** internal canvas style */
  canvasStyle?: React.CSSProperties,
  width?: number;
  height?: number;
  /** update max volume when value higher than max observed */
  relativeMaxVolume?: boolean;
  /** default renders horizontal, set true to make vertical */
  renderVertical?: boolean;
  /** arbitrary raw volume magnitude */
  maxVolume?: number;
  /** render current value in bar */
  renderValue?: boolean;
  /** view observed volume magnitudes */
  logVolumeUpdateValues?: boolean;
  /** color of the bar */
  fillColor?: CanvasPattern | CanvasGradient | 'string';
  /** text color */
  textColor?: CanvasPattern | CanvasGradient | 'string';
  /** font style */
  textFont?: string;
  /** text coords, units relative to width and height, starts from top left */
  textPosition?: { x: number; y: number; }
  /** flip */
  flip?: boolean;
  /** subscription */
  subscriptions?: {[id: string]: number};
  /** to hook into the volume change handler */
  onVolumeChange?: (volume: number) => void;
}

type ComponentDispatchers = {
  /** set subscription */
  updateSubscription?: (canvasId: string, prevSubscription: number, cb: (volume: number) => void) => void
}
type Props = ComponentProps & ComponentDispatchers;

@connect<Props>(
  (state, ownProps): Partial<ComponentProps> => {
    return {
      subscriptions: state.soundSubscriptions.subscriptions
    };
  },
  (dispatch, ownProps): ComponentDispatchers => {
    return {
      updateSubscription: soundStore.setSubscription
    };
  })
export class SoundBar extends React.Component<Props, {}> {
  constructor(public props: Props) {
    super(props);
  }

  maxVolume = this.props.maxVolume || (this.props.relativeMaxVolume ? 0.01 : 0.5);

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
    this.getCanvas().then(() => {
      if (this.canvasContext) {
        if (this.lastRequestedFrame) {
          window.cancelAnimationFrame(this.lastRequestedFrame);
        }
        this.lastRequestedFrame = window.requestAnimationFrame(() => {
          this.canvasContext.clearRect(0, 0, this.props.width, this.props.height);
          this.canvasContext.fillStyle = this.props.fillColor || 'blue';
          const value = volume / (this.props.maxVolume || 0.5) * (this.props.renderVertical ? this.props.height : this.props.width);
          if (!this.props.flip) {
            if (this.props.renderVertical) {
              this.canvasContext.fillRect(0, this.props.height - value, this.props.width, this.props.height);
            } else {
              this.canvasContext.fillRect(0, 0, value, this.props.height);
            }
          } else {
            if (this.props.renderVertical) {
              this.canvasContext.fillRect(0, 0, this.props.width, value);
            } else {
              this.canvasContext.fillRect(this.props.width - value, 0, this.props.width, this.props.height);
            }
          }
          if (this.props.renderValue) {
            if (this.props.textColor) {
              this.canvasContext.fillStyle = this.props.fillColor || 'black';
            }
            if (this.props.textFont) {
              this.canvasContext.font = this.props.textFont;
            }
            if (!this.props.textPosition) {
              this.canvasContext.fillText(Math.floor(volume * 100000) / 100000 + '', 50, 50, this.props.width - 50);
            } else {
              this.canvasContext.fillText(Math.floor(volume * 100000) / 100000 + '', this.props.textPosition.x, this.props.textPosition.y, this.props.width - this.props.textPosition.x);
            }
          }
        })
      }
    });
  }

  soundVolumeChangeHandler = (volume: number) => {
    if (this.props.logVolumeUpdateValues) {
      console.log('SoundBar Debug Volume', volume)
    }
    if (this.props.relativeMaxVolume) {
      if (this.maxVolume <= volume) { this.maxVolume = volume; }
    }
    if (this.props.onVolumeChange) {
      this.props.onVolumeChange(volume)
    }
    this.draw(volume);
  }

  render() {
    this.props.updateSubscription(
      this.canvasId, this.props.subscriptions[this.canvasId], this.soundVolumeChangeHandler);
    return (
      <canvas
        id={this.canvasId}
        width={this.props.width}
        height={this.props.height}
        style={this.props.canvasStyle || {}}
        >
      </canvas>
    )
  }
}