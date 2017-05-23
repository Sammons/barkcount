import * as React from 'react';
const RecordRTC = require('recordrtc');
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
    let subscription = SoundService.subscriberCounter++;
    SoundService.applySubscription(cb, subscription);
    SoundService.volumeSubscribers.push({ subscription, sub: cb });
    return subscription
  }

  public static unsubscribe(subscription: number) {
    SoundService.volumeSubscribers.splice(SoundService.volumeSubscribers.findIndex(s => s.subscription === subscription), 1);
  }

  private static volumeChange(value: number) {
    SoundService.volumeSubscribers.forEach(v => v ? v.sub(value) : null);
  }
  static audioContext: AudioContext;
  static stream: MediaStream
  static mediaStreamNode: MediaStreamAudioSourceNode;
  static scriptProcessor: ScriptProcessorNode;
  static initialize() {

    AudioContext = AudioContext || window['webkitAudioContext'];

    SoundService.audioContext = new AudioContext();

    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(stream => {
      SoundService.stream = stream;
      SoundService.mediaStreamNode = SoundService.audioContext.createMediaStreamSource(stream);
      SoundService.scriptProcessor = SoundService.audioContext.createScriptProcessor(2048, 2, 1)
      var that = {};
      var instant = 0;
      // var stop = false;
      // setTimeout(() => stop = true, 2000)
      // var max = 0.000001;
      // var count = 0;
      // var lastTime = Date.now();
      // console.log('activated')
      SoundService.scriptProcessor.onaudioprocess = (event) => {
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
        SoundService.volumeChange(instant);
      };
      let connectToSource = (callback?) => {
        console.log('SoundMeter connecting');
        try {
          // thi = context.createMediaStreamSource(stream);
          SoundService.mediaStreamNode.connect(SoundService.scriptProcessor);
          // necessary to make sample run, but should not be.
          SoundService.scriptProcessor.connect(SoundService.audioContext.destination);
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