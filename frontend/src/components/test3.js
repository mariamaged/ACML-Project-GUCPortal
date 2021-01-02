import React, { useState, useEffect } from 'react'
import axios from 'axios'
export default function Test() {
  const [requests, setRequests] = useState([])
  useEffect(() => {
    axios({
      method: 'GET',
      url: 'http://localhost:5000/faculty/viewAllFaculties',
    }).then((response) => {
      console.log(response)
      setFaculties(response.data.faculties)
    })
  }, [])

  return (
    <div>
      <button onClick={() => setCounter(!counter)}>Click Me</button>
      <ul>
        {faculties.map((faculty) => (
          <li>{faculty.name}</li>
        ))}
      </ul>
    </div>
  )
}