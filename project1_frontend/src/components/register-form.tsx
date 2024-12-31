import React from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'

type FormFields = {
  username : string
  password : string
}

const RegisterForm = () => {

  const {register, handleSubmit }= useForm<FormFields>()

  const onSubmit : SubmitHandler<FormFields> = (data) => {
    console.log(data)
  }

  return (
    <form className='tutorial gap-2' onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} type="text" placeholder="Username"/>
      <input {...register('password')} type="password" placeholder="Password"/>
      <button type="submit">Register</button>
    </form>
  )
}

export default RegisterForm
