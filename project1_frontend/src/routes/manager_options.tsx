import { createFileRoute, useNavigate } from "@tanstack/react-router"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import "@/index.css"
import axios from "axios"
import { useState } from "react"

export const Route = createFileRoute("/manager_options")({
  component: RouteComponent,
})

interface User {
  userId: number
  username: string
  roleId: number
}
const myToken = sessionStorage.getItem("authToken") 

console.log(sessionStorage.getItem("authToken"))
function RouteComponent() {
  //const[users, setUsers] = useState<User[]>([])
  const navigate = useNavigate()
  const [theMessage, setTheMessage] = useState('')
  const handleClick = async() => {
    try{ await axios.get('http://localhost:8080/api/admin/allusers', 
      {headers: {
        'Authorization': `Bearer ${myToken}`
      }}
    )
    .then((response) => {
      console.log(response.data)
      const theUsers = response.data.map((user: User) => ({
        userId: user.userId,
        username: user.username,
        roleId: user.roleId
      }))
      //setUsers(theUsers)
      
      localStorage.setItem('data', JSON.stringify(theUsers));
      navigate({ to: '/all_users_list' })})
      .catch (error => {
        if(error.response.status !== 200){
          setTheMessage('You are not authorized to access this page')
        }
      })
    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="bg-teal-400 mx-auto w-1/2 p-5 min-h-full flex flex-col gap-5">
      <Card className="my-10"> 
        <CardHeader>
          <CardTitle>Manager Options</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 text-zinc-200 ">     
          <Button className="hover-button" onClick={handleClick}>See all users</Button>
          <Button className="hover-button">See all pending tickets</Button>
        </CardContent>
        <CardFooter>
          {theMessage && <div><p>{theMessage}</p></div>} 
        </CardFooter>
      </Card>
    </div>
  )
}



