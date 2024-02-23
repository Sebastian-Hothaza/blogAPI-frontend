import { useOutletContext } from "react-router-dom"
import { useEffect, useState } from 'react'

function Home() {
	const allBlogposts =  useOutletContext();
	const [allCommentposts, setAllCommentposts] = useState([]); // Array to manage all comments
	const temp = ['1','2']

	const [expandedPost, setExpandedPost] = useState(); // Tracks which post we want to have as expanded

  	if (!allBlogposts) return <div>...API LOADING...</div>
    	
	// if (allBlogposts && allCommentposts.length == 0) fetchAPIData_comment();
    	
	// function fetchAPIData_comment(){
	// 	// Go thru each blog post, get all comments for that post, then append those comments to allCommentPosts
	// 	allBlogposts.forEach(async (post) => {
	// 		const response = await fetch('http://localhost:3000/posts/'+post._id+'/comments');
	// 		const allCommentsForPost = await response.json();
	// 		console.log("All comments for post ",post._id,":",allCommentsForPost); // This appears to work correctly
	// 		setAllCommentposts(allCommentposts => [...allCommentposts, allCommentsForPost]); //ISSUE? Need to merge arrays
	// 	});
	// }		

	async function fetchAPIData_comment(id){

		return comments;
	}

	async function toggleDetails(post){
		if (expandedPost && expandedPost._id == post._id){
			// We want to hide the post
			setExpandedPost('');
		}else{
			setExpandedPost(post);
			const response = await fetch('http://localhost:3000/posts/'+post._id+'/comments');
			const comments = await response.json();
			console.log(comments);
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
				{expandedPost && expandedPost._id==post._id && <div className="content">{post.content}</div>}
			</div>
		)
		})}
	</div>
	)
}

export default Home