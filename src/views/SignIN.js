import React from 'react'
import { useHistory } from "react-router-dom";
import Loader from '../components/Loader';
import { checkUserAlreadyLoggedIn } from '../utils/reusableFunctions'

export default function SignIn() {
    const history=useHistory()
    
    if (checkUserAlreadyLoggedIn()) {
        history.push('/home')
        return <Loader />
    }

  return (
    <div>SignIn</div>
  )
}
