import {InputBox} from "../components/InputBox";
import {SubHeading} from "../components/SubHeading";
import {Heading } from "../components/Heading";
import {Button} from "../components/Button";
import {BottomWarning} from "../components/BottomWarning";
import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const Signup = () =>{
    const [firstName,setFirstName]=useState("");
    const [lastName,setLastName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate = useNavigate();
    return <div className="bg-slate-300 h-screen flex justify-center"> 
    <div className="flex flex-col justify-center">
    <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
    <Heading label={"Sign up"}/>
    <SubHeading label={"Enter your information to create an account"}/>
    
    <InputBox onChange={e=>{
        setFirstName(e.target.value);
    }}  placeholder="John" label={"First Name"}/>

    <InputBox  onChange={e=>{
        setLastName(e.target.value);
    }} placeholder="Doe" label={"Last Name"}/>

    <InputBox  onChange={e=>{
        setEmail(e.target.value);
    }} placeholder="John@gmail.com" label={"Email"}/>


    <InputBox  onChange={e=>{
        setPassword(e.target.value);
    }}  placeholder="123456" label={"Password"}/>


    <div className="pt-4">
        <Button onClick={async ()=>{
           try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`,
        {
            firstName,
            lastName,
           username:email,
            password
        }
    );
    localStorage.setItem("token",response.data.token);
    localStorage.setItem("firstName", firstName);
    
    console.log(response.data);
    navigate("/dashboard");

} catch(err) {
    console.log(err.response.data);
}
        }}label={'Sign up'}/>
    </div>
    <div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"}/>
    </div>
    </div>
    </div>
    </div>
}  