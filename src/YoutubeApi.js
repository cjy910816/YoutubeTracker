/**
 * Created by mason on 2017-03-19.
 */
export default class YoutubeApi {
  constructor(callback) {
    this._isLoaded = false;
    this.isReady || this.loadAPI();
  }

  loadAPI() {
    this._isLoaded = true;
    const tag = document.createElement('script');
    const firstTag = document.getElementsByTagName('script')[0];

    tag.src = '//www.youtube.com/iframe_api';
    firstTag.parentNode.insertBefore(tag, firstTag);
  }

  get isLoaded() {
    return this._isLoaded;
  }

  get isReady() {
    return window.YT !== undefined && window.YT.Player !== undefined;
  }

  // @TODO :: change to promise
  afterReady(callback) {
    let timerFunc;

    ((delay) => {
      setTimeout(timerFunc = () => {
        if (this.isReady) {
          callback(window.YT);
        } else {
          setTimeout(timerFunc, delay);
        }
      });
    })(500);
  }
}
