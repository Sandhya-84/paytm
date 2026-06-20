import { useEffect, useState } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const Profile=()=>{
    const [user,setUser]=useState(null);
    useEffect(()=>{
        axios.get(
            `${BACKEND_URL}/api/v1/user/me`,
            {
                headers:{
                    Authorization:
                    "Bearer "+localStorage.getItem("token")
                }
            }
        ).then((res)=>{
            setUser(res.data.user);
        });
    },[]);

    if(!user){
       return <div className="p-6">Loading...</div>
    }
    return (
        <div className="max-w-3xl mx-auto mt-10 p-6">
           <div className ="bg-white shadow rounded-xl p-6">
            <h1 className ="text-2xl font-bold mb-6">
                My Profile
            </h1>

            <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-blue-200  text-white flex items-center justify-center text-3xl font-bold">
                    {user?.firstName?.charAt(0).toUpperCase()}
                </div>

                <h2 className="mt-4 text-xl font-semibold">
                    {user?.firstName} {user.lastName}
                </h2>
            </div>

            <div className="mt-6 w-full max-w-md space-y-3">
                <div>
                    <span  className="font-semibold">
                        Email:
                    </span> {user.username} 
                </div>

                <div >
                    <span  className="font-semibold" >
                        Phone:
                    </span>{" "}
                    {user.phone || "Not added"}
                </div>

                 <div >
                    <span  className="font-semibold" >
                       Bio:
                    </span>{" "}
                    {user.bio || "No bio added"}
                </div>
                
                <div>
                    <span className="font-semibold">Member Since:</span>{" "}
                         {new Date(user.createdAt).toLocaleDateString()}
                </div>

            </div>

            <button
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
             Edit Profile
            </button>

           </div>

        </div>
    )
}