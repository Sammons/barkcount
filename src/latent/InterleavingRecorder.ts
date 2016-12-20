import { addRecording } from '../redux/defaultStore';
import { SoundService } from '../services/SoundService';
const RecordRTC = require('recordrtc');
import * as uuid from 'uuid';

export interface Snippet {
  id: string;
  startTime: number;
  endTime: number;
  triggerVolume: number;
  data: string;
}

// let lastTimestamp = Date.now() - 5000;
// var started = false;
// var existingSnippet = null;
// function getSnippet(length: number) {
//   if (started) {
//     return existingSnippet;
//   }
//   existingSnippet = new Promise((resolve, reject) => {
//     started = true;
//     try {
//       var recordRTC = RecordRTC(SoundService.stream, { type: 'audio' });
//       recordRTC.startRecording();
//       setTimeout(() => {
//         recordRTC.stopRecording(function (audioURL) {
//           resolve(audioURL);
//           started = false;
//         });
//       }, length)
//     } catch (e) {
//       reject(e);
//       started = false;
//     }
//   });
//   return existingSnippet;
// }

export class InterleavingRecorder {
  constructor(public defaultSnippetLengthMs: number, public sustainThreshold: number) {
  }

  initialize(store) {
    SoundService.subscribeToVolumeChange((volume) => {
      let t = Date.now();
      this.recordingsToWatchFor.filter(r => r.threshold <= volume).forEach(r => {
        this.recordingsToSustain[r.id] = {
          time: t,
          kick: volume
        }
      });
    })
    setInterval(() => {
      console.log('testing')
      const t = Date.now();
      Object.keys(this.recordings).forEach(id => {
        if (this.recordingsToSustain[id] && (t - this.recordingsToSustain[id].time) < this.defaultSnippetLengthMs) {
          this.recordings[id].triggerVolume = this.recordingsToSustain[id].kick;
          return;
        }
        /** 2/3 of default length is sufficient since we iterate on 0.5*default length, builds in tolerance for lag */
        if (this.recordings[id] && (t - this.recordings[id].startTime) > (this.defaultSnippetLengthMs/3*2)) {
          this.end(id).then((s) => s && store.dispatch(addRecording(s)));
        }
      });
      this.recordingsToSustain = {};
      let id = uuid.v4();
      this.begin(id, this.sustainThreshold);
      console.log('start', id, 'currently in progress', Object.keys(this.inprogressRecordings).length)
    }, this.defaultSnippetLengthMs / 2)
  }

  completedRecordings: { [id: string]: Snippet } = {};
  recordings: { [id: string]: Snippet } = {};
  inprogressRecordings = {};
  recordingsToWatchFor: { id: string; threshold: number }[] = [];
  recordingsToSustain: { [id: string]: {kick: number; time: number} } = {};

  /** initializes recording */
  begin(id: string, sustainThreshold: number): void {
    if (!this.recordings[id] && !this.completedRecordings[id]) {
      this.recordings[id] = {
        id,
        triggerVolume: null,
        startTime: Date.now(),
        endTime: null,
        data: null
      };
      this.inprogressRecordings[id] = RecordRTC(SoundService.stream, { type: 'audio' });
      this.inprogressRecordings[id].startRecording();
      this.recordingsToWatchFor.push({ id, threshold: sustainThreshold });
    }
  }

  /** returns snippet */
  end(id: string): Promise<Snippet> {
    return new Promise<Snippet>((resolve, reject) => {
      try {
        if (!this.inprogressRecordings[id]) { return; }
        this.inprogressRecordings[id].stopRecording((audioURL) => {
          this.recordings[id].data = audioURL;
          this.recordings[id].endTime = Date.now();
          this.completedRecordings[id] = this.recordings[id];
          delete this.recordings[id];
          delete this.inprogressRecordings[id];
          delete this.recordingsToSustain[id];
          this.recordingsToWatchFor = this.recordingsToWatchFor.filter(r => r.id !== id);
          console.log('end', id, this.completedRecordings[id].endTime - this.completedRecordings[id].startTime);
          if (this.completedRecordings[id].triggerVolume) {
            console.log('keeping', id);
          } else {
            delete this.completedRecordings[id];
            console.log('deleting', id)
          }
          resolve(this.completedRecordings[id]);
        });
      } catch (e) {
        reject(e);
      }
    })
  }
}

// var handling = false;
// SoundService.subscribeToVolumeChange((v: number) => {
//   if (handling) { return; }
//   handling = true;
//   if (v > 0.1 && (Date.now() - lastTimestamp) > 5000) {
//     lastTimestamp = Date.now();
//     var count = {
//         volume: v,
//         timestamp: new Date(),
//         data: null
//     }
//     getSnippet(5000).then(snippet => {
//       count.data = snippet
//       store.dispatch(updateCounts())
//     })
//     store.dispatch(incrementCount(count))
//   }
//   handling = false;
// })
