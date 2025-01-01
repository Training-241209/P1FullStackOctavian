import { createFileRoute } from '@tanstack/react-router'
import {SubmitHandler, useForm} from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react'

export const Route = createFileRoute('/user_options')({
  component: UserOptions,
})
type FormFields = {
    description: string
    amount: number
    userId : number
  }

function UserOptions() {
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
    await axios.post('http://localhost:8080/api/reimbursement/addticket', data)
                .then((response) => {
                  console.log(response.status)
                  if(response.status === 200){               
                    setTheMessage('Ticket created successfully')
                  } else {
                    setTheMessage('Something went wrong')
                  }                  
                })

                .catch (error => {
                  if(error.response.status !== 409){
                    setTheMessage('Ticket not created')
                  }
                })
              }

    finally {
    // clearErrors()
     setValue('description', '')
     setValue('amount', 0)

   }  
   clearErrors()
   }

  return (
    <>
        <div className='w-1/2 m-auto text-lg'><h1><b>Create a new ticket</b></h1></div>
         <form className='w-1/2 mx-auto bg-cyan-700 pt-10 flex items-center justify-center flex-col gap-5 ' onSubmit={handleSubmit(onSubmit)}>
           <input className='@media(max-width: 400px) {width: 60%}'{...register('description', {
            required : 'Description is required', 
            minLength : {
              value : 3,
              message : ' Description must have at least 3 characters'
              }
            })} type="text" placeholder="description"/>
           {errors.description && 
           (<div className='text-white'>{errors.description.message}</div>)}
           <input {...register('amount', {
            required : 'Amount is required'

           })} type="number" placeholder="amount"/>
          {errors.amount && 
           (<div className='text-white'>{errors.amount.message}</div>)}
          <input {...register('userId')}
             type="number" value={sessionStorage.getItem('userId') ?? 0} readOnly/>
           <button disabled={isSubmitting} type="submit"  className='bg-blue-900 border-opacity-80 rounded-full text-white p-2  hover:bg-blue-800'>
            {isSubmitting ? "Submitting..." : "Create ticket"}
            </button>
            {errors.root && 
           (<div className='text-gray-50'>{errors.root.message}</div>)}  
           {theMessage && <div><p className='text-slate-50'>{theMessage}</p></div>}     
         </form>     
         
         
         </>
  )
}
