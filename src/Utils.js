export default class Utils {
  static getTimeByFloat(floatTime) {
    const time = {
        hours: 0,
        min: 0,
        sec: 0
      },
      minFloat = floatTime / 60,
      hourFloat = minFloat / 60;

    if (floatTime) {
      time.sec = Math.floor(floatTime);
      time.min = Math.floor(minFloat);
      time.hours = Math.floor(hourFloat);
      if (time.hours) {
        time.min = Math.floor(minFloat - (time.hours * 60));
      }
      if (time.hours || time.min) {
        time.sec = Math.floor(floatTime - (time.min * 60) - (time.hours * 60 * 60));
      }
    }
    return time;
  }

  static paddingLeft(value, length = 2) {
    if (value.toString().length < length) {
      value = '0' + value;
    }
    return value;
  }

  static createCookie(name, value, days) {
    let expires;

    if (days) {
      let date = new Date();

      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toGMTString();
    }
    else expires = '';
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  static readCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');

    for (let i = 0 ; i < ca.length ; i++) {
      let c = ca[i];

      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  static eraseCookie(name) {
    this.createCookie(name, '', -1);
  }

  static guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
}
