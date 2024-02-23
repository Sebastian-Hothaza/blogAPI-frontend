import { useOutletContext } from "react-router-dom"
import { useEffect, useState } from 'react'

function Home() {
  const allBlogposts =  useOutletContext();
  if (!allBlogposts) return <div>...API LOADING...</div>

  return (
    <div name="blogpostCards">

      
      {allBlogposts.map(post=>{
        return (
          <div name="blogpostCard" key={post._id}>
            <div name="header" >{post.title}</div>
            <div name="content">{post.content}</div>
          </div>
          
        )
      })}
      
      
    </div>
  )
}

export default Home