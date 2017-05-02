import YoutubeAPI from './YoutubeApi';
import Player from './Player';
import Player2 from './Player2'
import Player3 from './Player3'

export default class YoutubeTracker {
  constructor($element, options) {
    this._$element = $element;
    this._$element.wrap(`<div class="video"></div>`);
    this._youtubeAPI = new YoutubeAPI();
    this._youtubeAPI.afterReady((api) => {
      console.log(options);
      if(options.play_type === undefined || options.play_type == 1){
        this._player = new Player(this._$element, api, options);
      }else if(options.play_type == 2){
        this._player = new Player2(this._$element, api, options);
      }else if(options.play_type == 3){
        this._player = new Player3(this._$element, api, options);
      }

    });
  }
}
