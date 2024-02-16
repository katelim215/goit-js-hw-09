import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from 'notiflix';

const startButtonEl = document.getElementById('start-button');
const datetimePickerEl = document.getElementById('datetime-picker');
const daysEl = document.querySelector('span[data-days]');
const hoursEl = document.querySelector('span[data-hours]');
const minutesEl = document.querySelector('span[data-minutes]');
const secondsEl = document.querySelector('span[data-seconds');

startButtonEl.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      Notiflix.Notify.failure('Please choose a date in the future');
      startButtonEl.disabled = true;
    } else {
      startButtonEl.disabled = false;
    }
  },
};

flatpickr("#datetime-picker", options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value < 10 ? `0${value}` : value;
}

startButtonEl.addEventListener('click', () => {
  const selectedDate = new Date(datetimePickerEl.value).getTime();
  const countdownInterval = setInterval(() => {
    const currentDate = new Date().getTime();
    const remainingTime = selectedDate - currentDate;

    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      Notiflix.Notify.success('Countdown has ended');
    } else {
      const { days, hours, minutes, seconds } = convertMs(remainingTime);
      daysEl.textContent = addLeadingZero(days);
      hoursEl.textContent = addLeadingZero(hours);
      minutesEl.textContent = addLeadingZero(minutes);
      secondsEl.textContent = addLeadingZero(seconds);
    }
  }, 1000);
});
