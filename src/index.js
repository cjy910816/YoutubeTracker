import YoutubeAPI from './YoutubeApi';
import Player from './Player';

export default class YoutubeTracker {
  constructor($element, options) {
    this._$element = $element;
    this._$element.wrap(`<div class="video"></div>`);
    this._youtubeAPI = new YoutubeAPI();
    this._youtubeAPI.afterReady((api) => {
      this._player = new Player(this._$element, api, options);
    });
  }
}
