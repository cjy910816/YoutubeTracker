import Utils from './Utils';
export default class Player2 {

  constructor($element, api, options) {
    this._$element = $element;
    this._$parent = $element.parent();
    this._api = api;
    this._options = options;
    this._isPaused = false;

    if(options.play_data){
      this._play_data = options.play_data;
      this._data_position = 0;
    }

    this.render();
    this.renderControls();

    if (this._options.firebase !== undefined){
      this._logRef = this._options.firebase;
    }

    this._uuid = Utils.readCookie("uuid");
    if(this._uuid === undefined || this._uuid == null){
      this._uuid = Utils.guid();
      Utils.createCookie("uuid", this._uuid, 30);
    }
  }

  set data_position(position){
    this._data_position = position;
    console.log(this._$picker.text('(' + (this.data_position +1)+ '/' + this._play_data.length + ')') );

  }

  get data_position(){
    return this._data_position;
  }

  render() {
    const videoId = this._options.videoId;

    console.log(this._$parent);
    if(this._options.preview_player){
      this._$preview = $(this._options.preview_player);
    }else{
      this._$preview = $(`<div id="preview"></div>`);
      this._$parent.prepend(this._$preview);
    }



    this._player = new this._api.Player(this._$element.attr('id'), {
      videoId: videoId,
      width: 640,
      playerVars: {
        controls: 0,
        rel: 0,
        showinfo: 0,
        modestbranding: 1
      },
      events: {
        'onReady': this.onReady.bind(this),
        'onStateChange': this.onStateChange.bind(this)
      }
    });

    this._previewPlayer = new this._api.Player(this._$preview.attr('id'), {
      videoId: videoId,
      width: 640,
      playerVars: {
        controls: 0,
        rel: 0,
        showinfo: 0,
        modestbranding: 1
      },
      events:{
        'onStateChange': this.onPreivewStateChange.bind(this)
      }
    });
  }

  handleProgressBar(event) {
    let offset, percent, newCursorTime;

    event.preventDefault();
    offset = event.clientX - this._$progressBar.offset().left;
    percent = Math.floor(offset / (this._$progressBar.width() / 100));
    newCursorTime = this.duration / 100 * percent;

    if(this._play_data != undefined){
      for(let i = 0 ; i < this._play_data.length ; i++){
        if(this._play_data[i].start_time < newCursorTime && this._play_data[i].end_time > newCursorTime){
          this.data_position = i;
        }
      }
    }

    this.updateProgressBarCursor(percent);
    this.currentTime = newCursorTime;
  }

  renderControls() {
    const template = {
      playpause:
      '<div class="navbar-left nav">' +
      '<button class="btn pause"><em class="glyphicon glyphicon-pause"></em></button>' +
      '<button class="btn play"><em class="glyphicon glyphicon-play"></em></button></div>',
      progress:
      '<div class="progress-wrapper nav navbar-text">' +
      '<div class="progress-picker"><div class="progress-bar">&nbsp;</div></div>' +
      '<div class="progress"><div class="progress-bar">&nbsp;</div></div>' +
      '</div>',
      picker:
        '    <div class="nav navbar-text picker"> (' +
        (this.data_position + 1) + '/' + this._play_data.length  + ')' +
      '</div>',
      timer:
        '    <div class="nav navbar-text timer">00:00 | 00:00</div>',
      mute:
      '<div class="navbar-left nav">' +
      '<button class="btn mute" style="margin-right: 10px;"><em class="glyphicon glyphicon-volume-off"></em></button>' +
      '<button class="btn unmute"><em class="glyphicon glyphicon-volume-up"></em></button>' +
      '</div>',
      fullscreen:
      '        <button class="btn navbar-btn enterFullscreen"><!-- --></button>' +
      '        <button class="btn navbar-btn leaveFullscreen"><!-- --></button>'
    };

    this._$parent.append(`<div class="controls navbar"> <div class="navbar-inner">
                        ${template.playpause}
                        ${template.progress}
                        ${template.picker}
                        ${template.timer}
                        ${template.mute}</div></div>`);

    this._$playButton = this._$parent.find('button.play');
    this._$pauseButton = this._$parent.find('button.pause');
    this._$muteButton = this._$parent.find('button.mute');
    this._$unMuteButton = this._$parent.find('button.unmute');
    this._$progressBar = this._$parent.find('.progress-picker');
    this._$progressBarCursor = this._$parent.find('.progress > .progress-bar');
    this._$picker = this._$parent.find(".picker");
    this._$timer = this._$parent.find('.timer');

    this._$pauseButton.hide();

    this._$playButton.on('click', () => { this.play(); });
    this._$pauseButton.on('click', () => { this.pause(); });
    this._$muteButton.on('click', () => { this.mute(); });
    this._$unMuteButton.on('click', () => { this.unMute(); });
    this._$progressBar.on('click', (event) => {
      this.handleProgressBar(event);
      // console.log('hello');
    });

  }

  onReady() {
    this.startTimer();
    this._$progressBar.empty();
    var last_time = 0;
    console.log(this.duration);
    for(var i = 0 ; i < this._play_data.length ; i++){
      console.log(this._play_data[i]);
      var length = this._play_data[i].end_time - last_time;
      this._$progressBar.append('<div class="progress-bar" style=width:' + (length / this.duration * 100)+ '%;">&nbsp;</div>');
      last_time = this._play_data[i].end_time;
    }
  }


  onStateChange(event) {

    if(this._logRef !== undefined){
      this._logRef.push({
        date: new Date().toISOString(),
        user: this._uuid,
        videoID: this._options.videoId,
        event: event.data == 1 ? "Playing" : "Stopped"
      });
    }

    if (event.data === 1) { // Playing
      this._$playButton.hide();
      this._$pauseButton.show();
    }else {
      this._$playButton.show();
      this._$pauseButton.hide();
    }

    if(event.data === 0){
      this.data_position = 0;
    }
  }

  onPreivewStateChange(event){
    this._previewPlayerState = event.data;
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

  mute() {
    this._player.mute();
  }

  unMute() {
    this._player.unMute();
  }

  get currentTime() {
    return this._player.getCurrentTime();
  }

  set currentTime(currentTime) {
    if (currentTime !== undefined) this._player.seekTo(currentTime, true);
  }

  set previewCurrentTime(currentTime){
    if (currentTime !== undefined){
      this._previewPlayer.seekTo(currentTime, true);
      this._previewPlayer.playVideo();
    }
  }

  get duration() {
    return this._player.getDuration();
  }

  updateProgressBarCursor(percent) {
    this._$progressBarCursor.css({'width': percent + '%'});
  }

  startTimer() {
    var timerFn, timerOut = null;
    var classme = this;

    ((delay) => {
      setTimeout(timerFn = () => {
        if (this.currentTime) {
          const curTime = Utils.getTimeByFloat(this.currentTime),
            duration = Utils.getTimeByFloat(this.duration),
            progressPercents = Math.floor(((classme.currentTime * 100) / classme.duration) * 100) / 100;
          let line;


          if(this._play_data[this.data_position] && this.currentTime > this._play_data[this.data_position].end_time + 1){ // pass duration
            console.log(this.currentTime);
            classme.pause();


            // preview를 구간만큼 재생한다.
            let offset, percent, newCursorTime;

            // percent = Math.floor(((classme._play_data[classme._data_position].start_time * 100) / classme.duration) * 100) / 100;
            newCursorTime = classme.duration / 100 * percent;
            // this.updateProgressBarCursor(percent);
            this.previewCurrentTime = classme._play_data[this.data_position].start_time;

            if(this._play_data.length > this.data_position){
              this.data_position++;
            }
          }else if(classme._previewPlayerState != undefined && classme._previewPlayerState == 1){
            let previewCur = this._previewPlayer.getCurrentTime();

            if(classme.data_position >= 1 && previewCur > classme._play_data[classme.data_position-1].end_time){
              classme._previewPlayer.pauseVideo();
              classme.play();
            }
          }else{
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
              this._$timer.html(line);
              this.updateProgressBarCursor(progressPercents);
            }
            timerOut = line;
          }
        }
        setTimeout(timerFn, delay);
      }, delay);
    })(150);
  }
}
