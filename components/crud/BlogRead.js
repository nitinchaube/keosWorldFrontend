import React from "react"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { list, removeBlog } from '../../actions/blog';
import moment from "moment";

const BlogRead =({username}) =>{
    const [Blogs , setBlogs] =useState([]);
    const [message, setMessage]=useState('');

    const token =getCookie('token');
    useEffect(()=>{
        loadBlogs()
    },[])


    const loadBlogs =() =>{
        list(username).then(data =>{
            if(data.error){
                console.log(data.error)
            }else {
                setBlogs(data)
            }
        })
    }

    const deleteConfirm =(slug) =>{
        let answer =window.confirm("Are you sure you want to delete this blog?")
        if(answer){
            deleteBlog(slug);
        }
    }

    const deleteBlog=(slug)=>{
        removeBlog(slug, token).then((data)=>{
            if(data.error){
                console.log(error)
            }else {
                setMessage(data.message);
                loadBlogs();
            }
        })
    }

    const showUpdateButton=(blog)=>{
        if(isAuth() && isAuth().role==0){
            return (
                // <Link href={`/user/crud/${blog.slug}`}>
                //     <a className="ml-2 btn btn-sm btn-warning">Update</a>
                // </Link>
                <a href={`/user/crud/${blog.slug}`} className="ml-2 btn btn-sm btn-warning">Update</a>

            )
        }else if(isAuth() && isAuth().role==1){
            return(
                // <Link href={`/admin/crud/${blog.slug}`}>
                //     <a className=" ml-2 btn btn-sm btn-warning">Update</a>
                // </Link>
                <a href={`/admin/crud/${blog.slug}`} className="ml-2 btn btn-sm btn-warning">Update</a>
            )
        }
    }

    const showAllBlogs =() =>{
        return Blogs.map((blog,i)=>{
            return (
                <div key={i} className="pb-5">
                    <h3>{blog.title}</h3>
                    <p className="mark">
                        Written by {blog.postedBy.name} | Published on {moment(blog.updatedAt).fromNow()}
                    </p>
                    <button className="btn btn-sm btn-danger" onClick={()=>deleteConfirm(blog.slug)}>
                        Delete
                    </button>
                    {showUpdateButton(blog)}
                </div>
            )
        })
    }
    return (
        <React.Fragment>
            <div className="row">
                {message && <div className="alert alert-warning">{message}</div>}
                <div className="col-md-12">{showAllBlogs()}</div>
            </div>
        </React.Fragment>
    )
}

export default BlogRead;
