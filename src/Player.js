import Utils from './Utils';
export default class Player {

  constructor($element, api, options) {
    this._$element = $element;
    this._$parent = $element.parent();
    this._api = api;
    this._options = options;
    this.render();
    this.renderControls();
  }

  render() {
    const videoId = this._options.videoId;

    this._player = new this._api.Player(this._$element.attr('id'), {
      videoId: videoId,
      width: 640,
      playerVars: {
        controls: 0
      },
      events: {
        'onReady': this.onReady.bind(this),
        'onStateChange': this.onStateChange.bind(this)
      }
    });
  }

  handleProgressBar(event) {
    let offset, percent, newCursorTime;

    event.preventDefault();
    offset = event.clientX - this._$progressBar.offset().left;
    percent = Math.floor(offset / (this._$progressBar.width() / 100));
    newCursorTime = this.duration / 100 * percent;
    this.updateProgressBarCursor(percent);
    this.currentTime = newCursorTime;
  }

  renderControls() {
    const template = {
      playpause:
      '<div class="navbar-left nav">        <button class="btn pause">' +
      '<em class="glyphicon glyphicon-pause"></em></button>' +
      '        <button class="btn play">' +
      '<em class="glyphicon glyphicon-play"></em></button></div>',
      progress:
        '    <div class="progress nav navbar-text"><div class="progress-bar">&nbsp;</div></div>',
      quality:
        '    <div class="nav navbar-text quality">&nbsp;</div>',
      timer:
        '    <div class="nav navbar-text timer">00:00 | 00:00</div>',
      mute:
      '        <button class="btn navbar-btn mute"><!-- --></button>' +
      '        <button class="btn navbar-btn unmute"><!-- --></button>',
      fullscreen:
      '        <button class="btn navbar-btn enterFullscreen"><!-- --></button>' +
      '        <button class="btn navbar-btn leaveFullscreen"><!-- --></button>'
    };

    this._$parent.append(`<div class="controls navbar"> <div class="navbar-inner">
                        ${template.playpause}
                        ${template.progress}
                        ${template.quality}
                        ${template.timer}
                        ${template.mute}</div></div>`);

    this._$playButton = this._$parent.find('button.play');
    this._$pauseButton = this._$parent.find('button.pause');
    this._$progressBar = this._$parent.find('.progress');
    this._$progressBarCursor = this._$parent.find('.progress > .progress-bar');

    this._$pauseButton.hide();

    this._$playButton.on('click', () => { this.play(); });
    this._$pauseButton.on('click', () => { this.pause(); });
    this._$progressBar.on('click', (event) => { this.handleProgressBar(event); });

  }

  onReady() {
    this.startTimer();
  }

  onStateChange(event) {
    console.log('[' + new Date() + '] Video State Changed to : ' + event.data);
    if (event.data === 1) { // Playing
      this._$playButton.hide();
      this._$pauseButton.show();
    }else {
      this._$playButton.show();
      this._$pauseButton.hide();
    }
  }

  play() {
    this._player.playVideo();
  }

  stop() {
    this._player.stopVideo();
  }

  pause() {
    this._player.pauseVideo();
  }

  get currentTime() {
    return this._player.getCurrentTime();
  }

  set currentTime(currentTime) {
    if (currentTime !== undefined) this._player.seekTo(currentTime, true);
  }

  get duration() {
    return this._player.getDuration();
  }

  updateProgressBarCursor(percent) {
    this._$progressBarCursor.css({'width': percent + '%'});
  }

  startTimer() {
    var timerFn, timerOut = null;

    ((delay) => {
      setTimeout(timerFn = () => {
        if (this.currentTime) {
          const curTime = Utils.getTimeByFloat(this.currentTime),
            duration = Utils.getTimeByFloat(this.duration),
            progressPercents = Math.floor((
              this.currentTime * 100) / this.duration);
          let line;

          if (duration.min) {
            curTime.sec = Utils.paddingLeft(curTime.sec);
            duration.sec = Utils.paddingLeft(duration.sec);
          }
          if (duration.hours) {
            curTime.min = Utils.paddingLeft(curTime.min);
            duration.min = Utils.paddingLeft(duration.min);
          }
          line = (duration.hours ? curTime.hours + ':' : '') +
            (duration.min ? curTime.min + ':' : '') +
            curTime.sec +
            ' | ' +
            (duration.hours ? duration.hours + ':' : '') +
            (duration.min ? duration.min + ':' : '') +
            duration.sec;

          if (timerOut !== line && !isNaN(duration.sec)) {
            // this.updateTimer(line);
            this.updateProgressBarCursor(progressPercents);
          }
          timerOut = line;
        }
        setTimeout(timerFn, delay);
      }, delay);
    })(100);
  }
}
