import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from "./Navbar";
import './App.css'

// NOTE: Outlet context is required for passing params held by parent to outlets

function App() {

	const [error, setError] = useState(null);
	const [allBlogposts, setAllBlogposts] = useState('');
	const [loggedIn, setLoggedIn] = useState(false);

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

	function handleLogout(){
		console.log("handle logout");
		setLoggedIn(false);
	}	

	async function handleLogin(formData){

		// Make POST request using formData
	
		const response = await fetch('http://localhost:3000/login', {
			method:'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({name: formData.target.name.value, password: formData.target.password.value})
		})
		const data = await response.json();


		if (!response.ok){
			// Set some error message in state variable similar to how we did the comment post error message
			console.log("BAD LOGIN")
			return;
		}
		// Log in success! Token returned as data.token

		

		

		// If succeeds, then add JWT token to localStorage
		setLoggedIn(true);
	}

  // Give the login/logout handlers to the outlets
  if (error) return  <div>Error: Could not load data from API!🥹</div> 
  return (
	<>
		<Navbar handleLogout={handleLogout} loggedIn={loggedIn}/>
  		<Outlet context={{allBlogposts, loggedIn, handleLogin, handleLogout}}/> 
		
	</>
  )
}

export default App