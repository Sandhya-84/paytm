import { useEffect, useState } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const Profile=()=>{
    const [user,setUser]=useState(null);
    const [editing , setEditing]=useState(false);
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


    const saveProfile = async()=>{
        try{
            await axios.put(
                `${BACKEND_URL}/api/v1/user`,
                {
                    firstName: user.firstName,
                    lastName:user.lastName,
                    phone : user.phone,
                    bio: user.bio
                },
                {
                    headers:{
                        Authorization:
                        "Bearer "+localStorage.getItem("token")
                    }
                }
            );
            setEditing(false);
            alert("Profile updated successfully ");
        }catch(err){
            alert("Failed to update profile");
        }
    }

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

                {editing?(
                    <div className="flex gap-2 mt-4">
                        <input 
                        value ={user.firstName}
                        onChange={(e)=>
                            setUser({
                                ...user,
                                firstName: e.target.value
                            })
                        }
                        className="border p-2 rounded"
                        placeholder= "First Name"
                        />
                        <input
                        value={user.lastName}
                        onChange={(e)=>
                            setUser({
                                ...user,
                                lastName: e.target.value
                            })
                        }
                        className="border p-2 rounded"
                        placeholder="Last Name"
                        />
                        </div>
                ):(
                    <h2 className="mt-4 text-xl font-semibold">
                        {user.firstName} {user.lastName}
                    </h2>
                )}
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
                   {editing?(
                    <input
                    value={user.phone || ""}
                    onChange={(e)=>
                        setUser({
                            ...user,
                            phone: e.target.value
                        })
                    }
                    className="border p-2 rounded w-full"
                    placeholder="Phone Number"
                    />
                   ):(
                    user.phone || "Not added"
                   )}
                </div>

                 <div >
                    <span  className="font-semibold" >
                       Bio:
                    </span>{" "}
                    {editing?(
                        <textarea
                        value ={user.bio ||""}
                        onChange={(e)=>
                            setUser({
                                ...user,
                                bio: e.target.value
                            })
                        }
                        className="border p-2 rounded w-full"
                        placeholder="Bio"
                        />
                    ):(
                        user.bio || "No bio added"
                    )}
                </div>
                
                <div>
                    <span className="font-semibold">Member Since:</span>{" "}
                         {new Date(user.createdAt).toLocaleDateString()}
                </div>

            </div>

            <button onClick={()=> setEditing(true)}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
             Edit Profile
            </button>

            {editing &&(
                <button 
                onClick={saveProfile}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                    Save chnages
                </button>
            )}

           </div>

        </div>
    )
}