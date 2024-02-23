import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [error, setError] = useState(null);
  const [allBlogposts, setAllBlogposts] = useState('');

  async function fetchAPIData_blogpost(){
	try{
	  const response = await fetch('http://localhost:3000/posts');
	  if (!response.ok) throw new Error("Failed to get API Data");
	  const data = await response.json();
	  setAllBlogposts(data);
	}catch(err){
	  setError(err.message)
	}
  }

  useEffect(() => {
	fetchAPIData_blogpost();
  }, [])

  return (error)?  <div>Error: Could not load data from API!🥹</div> : <Outlet context={allBlogposts}/>
}

export default App