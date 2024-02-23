import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [error, setError] = useState(null);
  const [allBlogposts, setAllBlogposts] = useState('');

  async function fetchAPIData(){
	try{
	  const response = await fetch('https://hothaza-blogapi.fly.dev/posts');
	  if (!response.ok) throw new Error("Failed to get API Data");
	  const data = await response.json();
	  setAllBlogposts(data);
	}catch(err){
	  setError(err.message)
	}
  }

  useEffect(() => {
	fetchAPIData();
  }, [])

  return (error)?  <div>Error: Could not load data from API!🥹</div> : <Outlet context={allBlogposts}/>
}

export default App