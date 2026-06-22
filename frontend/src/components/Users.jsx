import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./Button";
import {useNavigate} from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
   

   useEffect(() => {
    axios.get(
        `${BACKEND_URL}/api/v1/user/bulk?filter=` + filter,
        {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
    )
    .then(response => {
        setUsers(response.data.users);
    })
    .catch(err => {
        console.log(err);
    });
}, [filter]);

    return (
        <>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>

            <div className="my-2">
                <input
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>

            <div>
                {users.map(user => (
                    <User key={user._id} user={user} />
                ))}
            </div>
        </>
    );
};

function User({ user }) {
     const navigate=useNavigate();
    return (
        <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
                    <div className="h-12 w-12 mr-3">
                        {user.profilePic?(
                            <img 
                            src={user.profilePic}
                            alt={user.firstName}
                            className="h-12 w-12 rounded-full  object-cover object-top"
                            />
                        ):(
                            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center items-center text-xl font-semibold">
                                      {user.firstName?.charAt(0).toUpperCase()}
                              </div>
                        )}
                    </div>

                <div className="flex flex-col justify-center h-full">
                    {user.firstName} {user.lastName}
                </div>
            </div>

            <div className="flex flex-col justify-center h-full">
                <Button onClick={(e)=>{
                    navigate("/send?id="+user._id+"&name="+user.firstName);
                }} label={"Send Money"} />
            </div>
        </div>
    );
}