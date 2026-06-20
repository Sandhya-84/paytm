import {useNavigate} from "react-router-dom"
import {useState} from "react"
import {FiUser,FiLogOut} from "react-icons/fi"

export const AppBar=({firstName})=>{
    const [open , setOpen]=useState(false);
    const navigate=useNavigate();

    const handleLogout=()=>{
        localStorage.removeItem("token");
        navigate("/signin");
    };

    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-6 font-bold pl-4 ">PayTM App</div>

        <div className="flex pt-2 mr-6">

            <div className="flex flex-col justify-center h-full mr-4 font-bold">Hello {firstName}</div>

            <div onClick={()=>
                setOpen(!open)} className="relative rounded-full  h-10 w-12 bg-slate-200 flex justify-center ">

                <div className="flex flex-col justify-center h-full text-l">{firstName?.charAt(0).toUpperCase()||"U"}</div>

                {open && (
                    <div className="absolute top-12 right-0 w-48 bg-white border rounded-lg shadow-lg overflow-hidden z-50">

                        <button onClick={()=>{
                            setOpen(false);
                            navigate("/profile");
                        }} className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100">
                            <FiUser/>
                            <span>My profile</span>
                        </button>

                        <button onClick={handleLogout} className=" flex items-center gap-2 text-red-500 font-bold w-full text-left px-4 py-2 hover:bg-gray-100">
                            <FiLogOut/>
                            <span>Logout</span>
                            </button>
                    </div>

                )}
            </div>

        </div>

    </div>
}