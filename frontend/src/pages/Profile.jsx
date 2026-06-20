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
                <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-3xl font-bold">
                    {user?.firstName?.charAt(0).toUpperCase()}
                </div>

                <h2 className="mt-4 text-xl font-semibold">
                    {user?.firstName}
                </h2>
            </div>

           </div>

        </div>
    )
}