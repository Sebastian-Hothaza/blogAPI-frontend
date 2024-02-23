import { useOutletContext } from "react-router-dom"
import { useState } from 'react'

function Home() {
	const allBlogposts =  useOutletContext();

	const [expandedPosts, setExpandedPosts] = useState([]); // Array that tracks which posts we want to have as expanded
	const [allComments, setAllComments] = useState([]); // Array that tracks which posts we want to have as expanded

  	if (!allBlogposts) return <div>...API LOADING...</div>

	async function toggleDetails(targetPost){

		// Check if our targetPost is already in the array of expandedPosts
		if ( expandedPosts.find(post => post._id===targetPost._id) ){
			setExpandedPosts(expandedPosts.filter(post => post._id !== targetPost._id)); 
		}else{
			setExpandedPosts(expandedPosts.concat(targetPost));
		}
	}

	return (
	<div className="blogpostCards">
		{allBlogposts.map(post=>{
		return (
			<div className="blogpostCard" key={post._id}>
				<div className="header" >
					<div>{post.title}</div>
					<button onClick={() => toggleDetails(post)}>Toggle Details</button>
				</div>
				{expandedPosts.find((p) => p._id === post._id) && <div className="content">{post.content}</div>}
			</div>
		)
		})}
	</div>
	)
}

export default Home