import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const Profile = () => {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(
            `${BACKEND_URL}/api/v1/user/me`,
            {
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("token")
                }
            }
        ).then((res) => {
            setUser(res.data.user);
        });
    }, []);

    const uploadImage=async(e)=>{
        const file=e.target.files[0];

        if(!file) return;
        const formData=new FormData();
        formData.append("file",file);

        formData.append(
            "upload_preset",
            "i0h3nzw6"
        );

        try{
            const res=await axios.post(
                "https://api.cloudinary.com/v1_1/dyld46lzd/image/upload",
                formData
            );

            setUser({
                ...user,
                profilePic: res.data.secure_url
            });
        }catch(err){
            console.log(err);
            alert("Image upload failed");
        }
    };

    const saveProfile = async () => {
        try {
            await axios.put(
                `${BACKEND_URL}/api/v1/user`,
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    bio: user.bio,
                    profilePic: user.profilePic
                },
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token")
                    }
                }
            );

            setEditing(false);
            alert("Profile updated successfully");
        } catch (err) {
            console.log(err);
            alert("Failed to update profile");
        }
    };

    if (!user) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6">
    <div className="bg-white shadow-lg rounded-xl p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
                My Profile
            </h1>

            <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
                <FiArrowLeft />
                Dashboard
            </button>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center">

            {user.profilePic ? (
                <img
                    src={user.profilePic}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
                />
            ) : (
                <div className="w-28 h-28 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold">
                    {user.firstName?.charAt(0).toUpperCase()}
                </div>
            )}

            {editing && (
                <div className="mt-4">
                    <input 
                    type="file"
                    accept="image/*"
                    onChange={uploadImage}
                    />
                    </div>
            )}

            {editing ? (
                <div className="flex gap-3 mt-4">
                    <input
                        value={user.firstName}
                        onChange={(e) =>
                            setUser({
                                ...user,
                                firstName: e.target.value
                            })
                        }
                        className="border p-2 rounded-lg"
                        placeholder="First Name"
                    />

                    <input
                        value={user.lastName}
                        onChange={(e) =>
                            setUser({
                                ...user,
                                lastName: e.target.value
                            })
                        }
                        className="border p-2 rounded-lg"
                        placeholder="Last Name"
                    />
                </div>
            ) : (
                <h2 className="mt-4 text-2xl font-semibold">
                    {user.firstName} {user.lastName}
                </h2>
            )}
        </div>

        {/* Details */}
        <div className="mt-10 border-t pt-6 space-y-5">

            <div className="flex justify-between">
                <span className="font-semibold text-gray-600">
                    Email
                </span>
                <span>{user.username}</span>
            </div>

            <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">
                    Phone
                </span>

                {editing ? (
                    <input
                        value={user.phone || ""}
                        onChange={(e) =>
                            setUser({
                                ...user,
                                phone: e.target.value
                            })
                        }
                        className="border p-2 rounded-lg w-64"
                        placeholder="Phone Number"
                    />
                ) : (
                    <span>{user.phone || "Not added"}</span>
                )}
            </div>

            <div className="flex justify-between items-start">
                <span className="font-semibold text-gray-600">
                    Bio
                </span>

                {editing ? (
                    <textarea
                        value={user.bio || ""}
                        onChange={(e) =>
                            setUser({
                                ...user,
                                bio: e.target.value
                            })
                        }
                        className="border p-2 rounded-lg w-64"
                        placeholder="Bio"
                    />
                ) : (
                    <span className="max-w-sm text-right">
                        {user.bio || "No bio added"}
                    </span>
                )}
            </div>

            <div className="flex justify-between">
                <span className="font-semibold text-gray-600">
                    Member Since
                </span>

                <span>
                    {new Date(user.createdAt).toLocaleDateString()}
                </span>
            </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-3">
            {editing ? (
                <>
                    <button
                        onClick={saveProfile}
                        className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
                    >
                        Save Changes
                    </button>

                    <button
                        onClick={() => setEditing(false)}
                        className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
                    >
                        Cancel
                    </button>


                    <button onClick={()=>
                        setUser({
                            ...user,
                            profilePic:""
                        })
                    } className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600">
                        Remove picture
                    </button>
                </>
            ) : (
                <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
                >
                    Edit Profile
                </button>
            )}
        </div>

    </div>
</div>
    );
};