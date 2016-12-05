import * as React from 'react';
const subKey = 'bark_subscriptions'

export class SoundService {
  static subscriberCounter = 0;
  static volumeSubscribers: { sub: ((magnitude: number) => void), subscription: number }[] = [];
  public static getSubscriptions(cb: Function): number[] {
    return cb[subKey];
  }

  private static applySubscription(f: Function, subscription: number) {
    if (f[subKey]) {
      f[subKey].push(subscription);
    } else {
      f[subKey] = [subscription];
    }
  }
  public static subscribeToVolumeChange(cb: (magnitude: number) => void): number {
    let subscription = this.subscriberCounter++;
    this.applySubscription(cb, subscription);
    this.volumeSubscribers.push({ subscription, sub: cb });
    return subscription;
  }

  public static subscribeToVolumeChangesAbove(cb: (magnitude: number) => void, threshold: number) {
    let subscription = this.subscriberCounter++;
    this.applySubscription(cb, subscription);
    let wrapperLambda = (v: number) => { if (v > threshold) { cb(v); } }
  }
  public static unsubscribe(subscription: number) {
    this.volumeSubscribers.splice(this.volumeSubscribers.findIndex(s => s.subscription === subscription), 1);
  }

  private static volumeChange(value: number) {
    this.volumeSubscribers.forEach(v => v ? v.sub(value) : null);
  }
  static audioContext: AudioContext;
  static mediaStream: MediaStreamAudioSourceNode;
  static scriptProcessor: ScriptProcessorNode;
  static initialize() {

      AudioContext = AudioContext || window['webkitAudioContext'];

      this.audioContext = new AudioContext();

      navigator.mediaDevices.getUserMedia({
        audio: true
      }).then(stream => {
        // var recordRTC = RecordRTC(stream);
        // recordRTC.startRecording();
        // setTimeout(() => {
        // recordRTC.stopRecording(function(audioURL) {
        //     var recordedBlob = recordRTC.getBlob();
        //     console.log(recordedBlob)
        //     window.blob = recordedBlob
        // });
        // }, 3000)
        this.mediaStream = this.audioContext.createMediaStreamSource(stream);
        this.scriptProcessor = this.audioContext.createScriptProcessor(2048, 2, 1)
        var that = {};
        var instant = 0;
        // var stop = false;
        // setTimeout(() => stop = true, 2000)
        // var max = 0.000001;
        // var count = 0;
        // var lastTime = Date.now();
        // console.log('activated')
        this.scriptProcessor.onaudioprocess = (event) => {
          var input = event.inputBuffer.getChannelData(0);
          var i;
          var sum = 0.0;
          var clipcount = 0;
          for (i = 0; i < input.length; ++i) {
            sum += input[i] * input[i];
            if (Math.abs(input[i]) > 0.99) {
              clipcount += 1;
            }
          }
          instant = Math.sqrt(sum / input.length);
          this.volumeChange(instant);
        };
        let connectToSource = (callback?) => {
          console.log('SoundMeter connecting');
          try {
            // thi = context.createMediaStreamSource(stream);
            this.mediaStream.connect(this.scriptProcessor);
            // necessary to make sample run, but should not be.
            this.scriptProcessor.connect(this.audioContext.destination);
            if (typeof callback !== 'undefined') {
              callback(null);
            }
          } catch (e) {
            console.error(e);
            if (typeof callback !== 'undefined') {
              callback(e);
            }
          }
        };
        connectToSource();
      });
    }
}
SoundService.initialize();