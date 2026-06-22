import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        axios
            .get(
                `${BACKEND_URL}/api/v1/user/bulk?filter=${filter}`,
                {
                    headers: {
                        Authorization:
                            "Bearer " +
                            localStorage.getItem("token"),
                    },
                }
            )
            .then((response) => {
                setUsers(response.data.users);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [filter]);

    return (
        <>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>

            <div className="my-3">
                <input
                    onChange={(e) => setFilter(e.target.value)}
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                {users.map((user) => (
                    <User
                        key={user._id}
                        user={user}
                    />
                ))}
            </div>
        </>
    );
};

function User({ user }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center p-4 border-b last:border-b-0 hover:bg-slate-50 transition">
            <div className="flex items-center">
                <div className="mr-3">
                    {user.profilePic ? (
                        <img
                            src={user.profilePic}
                            alt={user.firstName}
                            className="w-12 h-12 rounded-full object-cover object-top"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                            <span className="text-lg font-semibold">
                                {user.firstName?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                <div>
                    <div className="font-semibold">
                        {user.firstName} {user.lastName}
                    </div>

                    {user.bio && (
                        <div className="text-sm text-gray-500">
                            {user.bio}
                        </div>
                    )}
                </div>
            </div>

            <Button
                onClick={() => {
                    navigate(
                        "/send?id=" +
                            user._id +
                            "&name=" +
                            user.firstName
                    );
                }}
                label="Send Money"
            />
        </div>
    );
}