import { createLazyFileRoute, Link } from '@tanstack/react-router'
import {SubmitHandler, useForm} from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react'

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
})
type FormFields = {
  username: string
  password: string
  roleId : number
}

function RouteComponent() {
 
   //const navigate = useNavigate()
   const 
   {register, 
    handleSubmit, 
    clearErrors,
    setValue,
    formState : {errors, isSubmitting}
  }= useForm<FormFields>({mode : 'onChange'})

  const [theMessage, setTheMessage] = useState('')
 
  const onSubmit : SubmitHandler<FormFields> = async (data) => {
    setTheMessage('')
    try {
    await axios.post('http://localhost:8080/api/user/register', data)
                .then((response) => {
                  console.log(response.status)
                  if(response.status === 200){               
                    setTheMessage('User registered successfully')
                  } else {
                    setTheMessage('Something went wrong')
                  }                  
                })

                .catch (error => {
                  if(error.response.status === 409){
                    setTheMessage('Username is already taken')
                  }
                })
              }

    finally {
    // clearErrors()
     setValue('username', '')
     setValue('password', '')

   }  
   clearErrors()
   }
  
   return (
    <>
    <div className='w-1/2 m-auto text-lg'><h1><b>Register your account</b></h1></div>
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
      <input {...register('roleId', {
        required : 'Role id is required', 
        })} type="number" placeholder="role id"/>
       {errors.roleId && 
       (<div className='text-red-900'>{errors.roleId.message}</div>)}
       <button disabled={isSubmitting} type="submit"  className='bg-blue-900 border-opacity-80 rounded-full text-white p-2  hover:bg-blue-800'>
        {isSubmitting ? "Submitting..." : "Register"}
        </button>
        {errors.root && 
       (<div className='text-red-900'>{errors.root.message}</div>)}  
       {theMessage && <div><p>{theMessage}</p></div>}     
     </form>     
     <div className='w-1/2 m-auto text-lg'><h1>Managers login <Link to="/managers_login" className='underline'>Here</Link></h1></div>
     <div className='w-1/2 m-auto text-lg'><h1>Employees login <Link to="/employees_login" className='underline'>Here</Link></h1></div>
     </>
   )
}
