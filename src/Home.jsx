import { useOutletContext } from "react-router-dom"
import { useState } from 'react'

function Home() {
	const { allBlogposts, setAllBlogposts } =  useOutletContext();

	const [expandedPosts, setExpandedPosts] = useState([]); // Array that tracks which posts we want to have as expanded
	const [allComments, setAllComments] = useState([]); // Array that tracks which posts we want to have as expanded
	const [errorMessage, setErrorMessage] = useState(''); //Tracks error message generated when posting a comment
	const [errorPostMessage, setErrorPostMessage] = useState(''); //Tracks error message generated when posting a post
	const [expandPostEdit, setExpandPostEdit] = useState([]); //Tracks error message generated when posting a post


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
			const response = await fetch('https://hothaza-blogapi.fly.dev/posts/'+targetPost._id+'/comments');
			const comments = await response.json();
			
			// Check if comments are loaded already for this post, if not load them in
			if (!checkSubset(allComments, comments)) setAllComments(allComments.concat(comments));
			
		}
	}

	async function togglePostEdit(targetPost){

		// Check if our targetPost is already in the array of expandPostEdit
		if ( expandPostEdit.find(post => post._id===targetPost._id) ){
			setExpandPostEdit(expandPostEdit.filter(post => post._id !== targetPost._id)); 
		}else{
			setExpandPostEdit(expandPostEdit.concat(targetPost));

			
		}
	}

	// Submits POST request for comment using formData for a specified post.
	async function handleCommentSubmit(formData, post){
		formData.preventDefault(); // Stop page from refreshing
	
		const response = await fetch('https://hothaza-blogapi.fly.dev/posts/'+post._id+'/comments', {
			method: "POST",
			credentials: "include",
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

	// Submits POST request for post using formData
	async function handlePostSubmit(formData){
		formData.preventDefault(); // Stop page from refreshing
	
		const response = await fetch('https://hothaza-blogapi.fly.dev/posts/', {
			method: "POST",
			credentials: "include",
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({title: formData.target.title.value, content: formData.target.content.value})
		});
		const data = await response.json();
		if (!response.ok){
			setErrorPostMessage({msg: 'POST FAILED: '+ Object.values(data)[0].msg}); //Prints message of first error object
			return;
		}
		// Append freshly created post
		setAllBlogposts(allBlogposts.concat({_id: data._id, title: formData.target.title.value,  content: formData.target.content.value}))
		// Clear form fields and error
		formData.target.title.value = '';
		formData.target.content.value = '';
		setErrorPostMessage('');
	}

	async function handlePostEdit(formData, post){
		formData.preventDefault(); // Stop page from refreshing

		const response = await fetch('https://hothaza-blogapi.fly.dev/posts/'+post._id, {
			method: "PUT",
			credentials: "include",
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({title: formData.target.title.value, content: formData.target.content.value})
		});
		const data = await response.json();
		if (!response.ok){
			console.log("BAD FORM DATA FOR POST EDIT")
			return;
		}

		// Update array by replacing edited post with new post
		setAllBlogposts(allBlogposts.map(p => {
			if (p._id === post._id){
				return {_id: p._id, title: formData.target.title.value,  content: formData.target.content.value}
			}else{
				return p;
			}
		}))

		// Clear form fields
		formData.target.title.value = '';
		formData.target.content.value = '';

	}

	async function handlePostDelete(e,post){
		e.preventDefault(); // Stop page from refreshing

		const response = await fetch('https://hothaza-blogapi.fly.dev/posts/'+post._id, {
			method: "DELETE",
			credentials: "include",
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			}
		});
		
		if (!response.ok){
			const error = await response.json();
			console.log("INVALID DELETE: ", error.msg)
			return;
		}

		// Update array by deleteing the post
		setAllBlogposts(allBlogposts.filter(p => p._id !== post._id))
	}

	
	async function handleCommentDelete(e,post,comment){
		e.preventDefault(); // Stop page from refreshing

		const response = await fetch('https://hothaza-blogapi.fly.dev/posts/'+post._id+'/comments/'+comment._id, {
			method: "DELETE",
			credentials: "include",
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			}
		});
		
		if (!response.ok){
			const error = await response.json();
			console.log("INVALID DELETE: ", error.msg)
			return;
		}

		// Update array by deleteing the post
		setAllComments(allComments.filter(c => c._id !== comment._id))
	}

	return (
		<>
		{/* CREATE POST FORM VISIBLE FOR ADMIN ONLY */}
		{localStorage.getItem("user")=="Sebastian" && 
			<>
			<form onSubmit={(formData) => handlePostSubmit(formData)}>
				<label htmlFor="title">Post Title</label>
				<input type="text" id="title" name="title"></input>
				<label htmlFor="content">Post Content</label>
				<input type="text" id="content" name="content"></input>
				<button type="submit">SUBMIT</button>
		 	</form>
			{errorPostMessage && <div>{errorPostMessage.msg}</div>}
			</>
		}
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
								{localStorage.getItem("user")=="Sebastian" && 
									<>
										<button onClick={()=>togglePostEdit(post)}>EDIT</button>
										{expandPostEdit.find((p) => p._id === post._id) && 
											<>
												<form onSubmit={(formData) => handlePostEdit(formData, post)}>
													<label htmlFor="title">Post Title</label>
													<input type="text" id="title" name="title" defaultValue={post.title}></input>
													<label htmlFor="content">Post Content</label>
													<input type="text" id="content" name="content" defaultValue={post.content}></input>
													<button type="submit">SUBMIT</button>
												</form>
											</>
										}
										<button onClick={(e)=>handlePostDelete(e,post)}>DELETE</button>
									</>
								}
								{/* COMMENTS */}
								{allComments.filter(comment => comment.parentPost === post._id).map(comment => 
										<div className="postComment" key={comment._id}>
											<div>{comment.name}: {comment.comment}</div>
											{localStorage.getItem("user")=="Sebastian" && <button onClick={(e)=>handleCommentDelete(e,post,comment)}>DELETE</button>}
										</div>
								)}

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