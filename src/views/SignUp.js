import React from 'react'
import { useHistory } from "react-router-dom";
import Loader from '../components/Loader';
import { checkUserAlreadyLoggedIn } from '../utils/reusableFunctions'

export default function SignUp() {
    const history=useHistory()
    
    if (checkUserAlreadyLoggedIn()) {
        history.push('/home')
        return <Loader />
    }

    
  return (
    <div><Loader /></div>
  )
}

