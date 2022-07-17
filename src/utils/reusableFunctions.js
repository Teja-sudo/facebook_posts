import { sendDataToSentry } from "..";

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
    const user =JSON.stringify({userid:userid,username:username,email:email});
     sessionStorage.setItem('currentUser',user)
  } catch (error) {
    console.error(error)
    sessionStorage.setItem('currentUser','')
  }
}

export const getCurrentUserDetails = () => {
  let user = {};
  try {
     user=JSON.parse( sessionStorage.getItem('currentUser'));
  } catch (error) {
    console.error(error)
     sendDataToSentry({
          name: 'Log in',
          message: 'User Login failed',
          tags: { severity: 'CRITICAL' },
          extra: [{ type: 'errorEncounter', err }],
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