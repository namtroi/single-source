import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import  api  from "../api/apiService";
import type { RootState } from '..store';

export default function Login() {
  return <h1> Login Page</h1>;
}
// Access dispatch function to send actions to redux
const dispatch = useDispatch();

// Redirect after login
const navigate = useNavigate();

// Pull loading state from the redux auth slice
const isLoading = useSelector((state: RootState) => state.auth);

//local state for input and error message
const [form, setForm]= useState({
username: "",
password: "",
confirm: "",
});
//handleSubmit runs when user clicks login
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError("");
}
//make sure both fields have something before sending

//hit backend login route

//expecting backend to send { user, token }

//save login info in localStorage so it sticks after refresh 

//update redux state with user + token

//send user to dashboard once logged in 

//catch any issues like wrong password or server error

//render
export default function Login() {
  return <h1> Login Page</h1>;
}