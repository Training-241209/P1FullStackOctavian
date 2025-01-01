import { useAuthToken } from "@/authentication/authentication_ops"
import { createFileRoute, Link } from "@tanstack/react-router"
import axios from "axios"
import { useState } from "react"
import {SubmitHandler, useForm} from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute("/managers_login")({
  component: AuthLogin,
})

type FormFields = {
  username: string
  password: string 
}

function AuthLogin() {
  const 
  {register, 
   handleSubmit, 
   setError,
   clearErrors,
   setValue,
   formState : {errors, isSubmitting}
 }= useForm<FormFields>({mode : 'onChange'})

const [theMessage, setTheMessage] = useState('')
 const [token, setToken] = useAuthToken() as [string | null, React.Dispatch<React.SetStateAction<string | null>>]
 
console.log(token)
const navigate = useNavigate()
 
 const onSubmit : SubmitHandler<FormFields> = async (data) => {
   setTheMessage('')
  
   try {
    
   await axios.post('http://localhost:8080/api/auth/login', data)
               .then((response) => {
                const myToken = response.headers['token']
                if(myToken){
                  sessionStorage.setItem('authToken', myToken)
                  sessionStorage.setItem('username', data.username)
                  console.log(sessionStorage.getItem('authToken'))
                  setToken(myToken)
                  navigate({ to: '/manager_options' })                  
                  console.log(sessionStorage.getItem('authToken'))                  
                }
                else {
                   setTheMessage('You are not authorizedto access this page')
                 }
                 
               })
               .catch (error => {
                if(error.response.status !== 200){
                  setTheMessage('You are not authorizedto access this page')
                }
              })

   } catch  {
     setError ("root", {    
       message: 'Check your network connection'
     }) } 
     
   finally {
   // clearErrors()
    setValue('username', '')
    setValue('password', '')

  }  
  clearErrors()
  }
 
  return (
   <>
   <div className='w-1/2 m-auto text-lg'><h1><b>Manager Login</b></h1></div>
    <form className='w-1/2 mx-auto bg-teal-500 pt-10 flex items-center justify-center flex-col gap-5 ' onSubmit={handleSubmit(onSubmit)}>
      <input className='@media(max-width: 400px) {width: 60%}'{...register('username', {
       required : 'Username is required', 
       minLength : {
         value : 3,
         message : 'Username must have at least 3 characters'
         }
       })} type="text" placeholder="Username"/>
      {errors.username && 
      (<div className='text-red-900'>{errors.username.message}</div>)}
      <input {...register('password', {
       required : 'Password is required',
       minLength : {
         value : 6,
         message : 'Password must have at least 6 characters'
       }
      })} type="password" placeholder="Password"/>
     {errors.password && 
      (<div className='text-red-900'>{errors.password.message}</div>)}
      <button disabled={isSubmitting} type="submit"  className='bg-blue-900 border-opacity-80 rounded-full text-white p-2  hover:bg-blue-800'>
       {isSubmitting ? "Logging in..." : "Login"}
       </button>
       {errors.root && 
      (<div className='text-red-900'>{errors.root.message}</div>)}  
      {theMessage && <div><p>{theMessage}</p></div>}     
    </form>     
    <div className='w-1/2 m-auto text-lg'><h1>No account? Register <Link to="/" className='underline'>Here</Link></h1></div>
    <div className='w-1/2 m-auto text-lg'><h1>Employees login <Link to="/employees_login" className='underline'>Here</Link></h1></div>
    </>
  )
}



