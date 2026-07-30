import React, {useState} from 'react'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Link } from 'react-router-dom'
import {
    Code,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail
} from "lucide-react";
import {z} from "zod";


const signSchema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(8, "password must be atleast 8 character"),
    name: z.string().min(3, "name must be atleast 3 character"),
})


const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {error},
    } = useForm({
        resolver: zodResolver(signSchema)
    });

  return (
    <div>SignUpPage</div>
  )
}

export default SignUpPage