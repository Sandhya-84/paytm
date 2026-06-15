import {BottomWarning} from "../components/BottomWarning";
import { Heading } from "../components/Heading";
import {Button} from "../components/Button";
import {InputBox} from "../components/InputBox";
import {SubHeading} from "../components/SubHeading";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const Signin=()=>{

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const navigate=useNavigate();

    return(
     <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"Sign in"}/>
                <SubHeading label={"Enter your credentials to access your account"}/>
                <InputBox placeholder="John@gmail.com" label={"Email"}
                onChange={(e)=>{
                    setEmail(e.target.value);
                }}/>
                <InputBox placeholder="123456" label={"password"}
                onChange={(e) => {
                            setPassword(e.target.value);
                        }}/>
                <div className="pt-4">
                    <Button label={"Sign in"}
                    onClick={async()=>{
                        try{
                            const response=await axios.post(`${BACKEND_URL}/api/v1/user/signin`,
                                {
                                    username: email,
                                    password
                                }
                            );
                            
                            localStorage.setItem("token",response.data.token);
                            localStorage.setItem("firstName",response.data.firstName);
                            navigate("/dashboard");
                        }catch(err){
                            console.log(err.response?.data);
                            alert("Invalid credentials");
                        }
                    }}/>
                </div>
                <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"}/>
            </div>
        </div>
    </div>
    )
}