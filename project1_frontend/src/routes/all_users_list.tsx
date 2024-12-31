import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/all_users_list')({
  component: AllUsersList,
})
interface User {
    userId: number,
    username: string,
    roleId: number
}

// Retrieve data from localStorage or sessionStorage
const storedData = JSON.parse(localStorage.getItem('data') || 'null');

function AllUsersList() {
  return storedData.map((user: User) => (
    <div key={user.userId} className="card">
        <p>{user.userId}</p>
      <p>{user.username}</p>
      <p>{user.roleId}</p>
    </div>
  ))    
}
