import Vue from 'vue'
import App from './App.vue'

Vue.filter('shortDate', milliseconds => {
  const date = new Date(milliseconds);
  let day = String(date.getDate());
  let month = String(date.getMonth() + 1);
  let year = String(date.getFullYear());

  day = day.length === 1 ? `0${day}` : day;
  month = month.length === 1 ? `0${month}` : month;

  return `${day}.${month}.${year}`;
});

Vue.filter('fullDate', milliseconds => {
  if (!milliseconds) {
    return '';
  }
  const date = new Date(milliseconds);

  let hours = String(date.getHours());
  let minutes = String(date.getMinutes());
  let day = String(date.getDate());
  let month = String(date.getMonth() + 1);
  let year = String(date.getFullYear());

  hours = hours.length === 1 ? `0${hours}` : hours;
  minutes = minutes.length === 1 ? `0${minutes}` : minutes;
  day = day.length === 1 ? `0${day}` : day;
  month = month.length === 1 ? `0${month}` : month;

  return `${hours}:${minutes} ${day}.${month}.${year}`;
});

Vue.filter('hoursAndMinutes', milliseconds => {
  if(!milliseconds && milliseconds !== 0) {
    return '';
  } else if (milliseconds < 60000) {
    return 'ни о чём';
  }

  let hours = milliseconds / 3600000;
  let minutes = Math.floor((hours - Math.floor(hours)) * 60);
  hours = Math.floor(hours);

  let hoursText = '';
  let minutesText = '';

  let preLastDigit = Math.floor((hours % 100) / 10);
  if (preLastDigit === 1) {
    hoursText = 'часов';
  } else {
    let lastDigit = hours % 10;
    if(lastDigit === 1) {
      hoursText = 'час';
    } else if ([2, 3, 4].includes(lastDigit)) {
      hoursText = 'часа';
    } else if ([5, 6, 7, 8, 9, 0].includes(lastDigit)) {
      hoursText = 'часов';
    }
  }
  hoursText = hours === 0 ? '' : `${hours} ${hoursText}`;

  preLastDigit = Math.floor((minutes % 100) / 10);
  if (preLastDigit === 1) {
    minutesText = 'минут';
  } else {
    let lastDigit = minutes % 10;
    if (lastDigit === 1) {
      minutesText = 'минута';
    } else if ([2, 3, 4].includes(lastDigit)) {
      minutesText = 'минуты';
    } else if ([5, 6, 7, 8, 9, 0].includes(lastDigit)) {
      minutesText = 'минут';
    }
  }
  minutesText = minutes === 0 ? '' : `${minutes} ${minutesText}`;

  let separator = hoursText && minutesText ? ' ' : '';

  return `${hoursText}${separator}${minutesText}`;
});

Vue.filter('shortHoursAndMinutes', milliseconds => {
  if (!milliseconds && milliseconds !== 0) {
    return '';
  }

  let hours = milliseconds / 3600000;
  let minutes = Math.floor((hours - Math.floor(hours)) * 60);
  hours = Math.floor(hours);

  let hoursText;
  if (hours === 0) {
    hoursText = '00';
  } else if (hours < 10) {
    hoursText = `0${hours}`;
  } else {
    hoursText = `${hours}`;
  }

  let minutesText;
  if (minutes === 0) {
    minutesText = '00';
  } else if (minutes < 10) {
    minutesText = `0${minutes}`;
  } else {
    minutesText = `${minutes}`;
  }

  return `${hoursText}:${minutesText}`;
});

new Vue({
  el: '#app',
  render: h => h(App)
})
