import { json, useOutletContext } from "react-router-dom"
import { useState } from 'react'

function Home() {
	const allBlogposts =  useOutletContext();

	const [expandedPosts, setExpandedPosts] = useState([]); // Array that tracks which posts we want to have as expanded
	const [allComments, setAllComments] = useState([]); // Array that tracks which posts we want to have as expanded
	const [errorMessage, setErrorMessage] = useState(''); //Tracks error message generated when posting a comment


  	if (!allBlogposts) return <div>...API LOADING...</div>

	// Returns true of child is a subset of parent
	function checkSubset(parent, child){
		// This is disgusting
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

	// Submits POST request using formData for a specified post.
	async function handleCommentSubmit(formData, post){
		formData.preventDefault(); // Stop page from refreshing
	
		const response = await fetch('http://localhost:3000/posts/'+post._id+'/comments', {
			method: "POST",
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({name: formData.target.name.value, comment: formData.target.comment.value})
		});
		const data = await response.json();
		if (!response.ok){
			setErrorMessage({postID: post._id, msg: 'COMMENT POST FAILED: '+ Object.values(data)[0].msg}); //Prints message of first error object
			return;
		}
		// Append freshly created comment
		setAllComments(allComments.concat({_id: data._id, parentPost: post._id, name: formData.target.name.value,  comment: formData.target.comment.value}))
		// Clear form fields and error
		formData.target.name.value = '';
		formData.target.comment.value = '';
		setErrorMessage('');
	}

	return (
		<>
		<h1>Welcome to my blog</h1>
		<div className="blogpostCards">
			{allBlogposts.map(post=>{
				return (
					<div className="blogpostCard" key={post._id}>
						<div className="header" >
							<div>{post.title}</div>
							<button onClick={() => toggleDetails(post)}>Toggle Details</button>
						</div>
						
						{/* PRINT THE CONTENTS WHEN EXPANDED */}
						{expandedPosts.find((p) => p._id === post._id) && 
							<>
								<div className="content">{post.content}</div>
								{/* COMMENTS */}
								{allComments.filter(comment => comment.parentPost === post._id).map(comment => <div key={comment._id}>{comment.name}: {comment.comment}</div>)}

								{/* COMMENT FORM */}
								<form onSubmit={(formData) => handleCommentSubmit(formData, post)}>
									<label htmlFor="name">Name</label>
									<input type="text" id="name" name="name"></input>
									<label htmlFor="comment">Comment</label>
									<input type="text" id="comment" name="comment"></input>
									<button type="submit">SUBMIT</button>
						 		</form>

								{errorMessage.postID === post._id && <div>{errorMessage.msg}</div>}

							</>
							
						}	
					</div>
				)
			})}
		</div>
		</>
	)
}

export default Home