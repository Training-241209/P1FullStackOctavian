import { useState, useEffect } from 'react';

export const useAuthToken = () => {
  
  const [token, setToken] = useState(() => {
    return  sessionStorage.getItem('authToken')|| null    
  })
  useEffect(() => {
    if (token) {
      sessionStorage.setItem('authToken', token)
      setToken(token)
    } else {
      sessionStorage.removeItem('authToken')
      setToken(null)
    }
  }, [token])

  return [token, setToken]
}