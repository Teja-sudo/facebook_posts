import { sendDataToSentry } from "..";
import moment from 'moment';

export const DateFormatter = (
  newDate,
  dateOnly = false,
  secondsToDate = false
) => {
  let date = new Date(newDate);
  if (secondsToDate) date = new Date(newDate * 1000);

  if (date.toString() === 'Invalid Date') return '--';
  if (dateOnly) {
    date = moment(date).format('DD MMM YYYY');
    return date;
  }
  date = moment(date).format('DD MMM YYYY, hh:mm A');
  return date;
};

export const checkValidArray = (property, allowZero) => {
  if (Array.isArray(property)) {
    if (property.length > 0 || allowZero) {
      return true;
    }
  }
  return false;
};

export const checkValidObject = (property) => {
  if (!property) {
    property = {};
  }
  return typeof property === 'object' && Object.keys(property).length > 0;
};


export const SafeJsonParser = (value) => {
  let data = value;
  let error;
  try {
    data = JSON.parse(value);
  } catch (err) {
    console.error(err);
    data = value;
  }

  return data;
};

export const setCurrentUserDetails = (userid,username,email) => {
  try {
    localStorage.setItem('loggedInUserid', userid);
    localStorage.setItem('loggedInUsername', username);
    localStorage.setItem('loggedInEmailID', email);
  } catch (error) {
    console.error(error);
    sendDataToSentry({
          name: 'Log in',
          message: 'User Login failed',
          tags: { severity: 'CRITICAL' },
          extra: [{ type: 'errorEncounter', error }],
        });
  }
}

export const getCurrentUserDetails = () => {
  let user = {};
  try {
    user = {
      userid : localStorage.getItem('loggedInUserid'),
      username : localStorage.getItem('loggedInUsername'),
      email : localStorage.getItem('loggedInEmailID'),
    }
  } catch (error) {
    console.error(error)
     sendDataToSentry({
          name: 'Log in',
          message: 'User Login failed',
          tags: { severity: 'CRITICAL' },
          extra: [{ type: 'errorEncounter', error }],
        });
    user = {};
  }
  return user;
}

export const checkUserAlreadyLoggedIn = () => {
   const currentUser = getCurrentUserDetails();
  const isAlreadyLoggedin = Boolean(currentUser?.userid && currentUser?.email?.length > 0);
  return isAlreadyLoggedin;
}