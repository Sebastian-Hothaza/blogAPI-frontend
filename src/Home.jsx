import { useOutletContext } from "react-router-dom"
import { useState } from 'react'

function Home() {
	const allBlogposts =  useOutletContext();

	const [expandedPosts, setExpandedPosts] = useState([]); // Array that tracks which posts we want to have as expanded
	const [allComments, setAllComments] = useState([]); // Array that tracks which posts we want to have as expanded

  	if (!allBlogposts) return <div>...API LOADING...</div>

	// Returns true of child is a subset of parent
	function checkSubset(parent, child){
		// Check each child object
		nextChild:
		for (let i = 0; i<child.length; i++){
			// For each child check each parent object to see if there is a matching parent
			for (let j=0; j<parent.length; j++){
				if (parent[j]._id == child[i]._id) break nextChild;
			}
			return false;
		}
		return true	
	}

	async function toggleDetails(targetPost){

		// Check if our targetPost is already in the array of expandedPosts
		if ( expandedPosts.find(post => post._id===targetPost._id) ){
			setExpandedPosts(expandedPosts.filter(post => post._id !== targetPost._id)); 
		}else{
			setExpandedPosts(expandedPosts.concat(targetPost));
			const response = await fetch('http://localhost:3000/posts/'+targetPost._id+'/comments');
			const comments = await response.json();
			
			// Check if comments are loaded already for this post, if not load them in
			if (!checkSubset(allComments, comments)) setAllComments(allComments.concat(comments));
			
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
				
				{/* PRINT THE CONTENT */}
				{expandedPosts.find((p) => p._id === post._id) && 
					<div className="content">{post.content}</div>
				}

				{/* PRINT THE CONTENT */}
				{expandedPosts.find((p) => p._id === post._id) && 
					allComments.filter(comment => comment.parentPost === post._id).map(comment => <div key={comment._id}>{comment.name}</div>)}


			
			</div>
		)
		})}
	</div>
	)
}

export default Home