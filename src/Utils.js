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
}
