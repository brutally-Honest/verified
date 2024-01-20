import { useFormik } from "formik";
import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axios";
import { useDispatch } from "react-redux";
import { startGetAllData } from "../../actions/adminActions";
import { jwtDecode } from "jwt-decode";
import { userLoginSchema } from "../../validations/clientSideValidations";
import { SocketContext } from "../../context/SocketContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userDispatch } = useContext(UserContext);
  const socket = useContext(SocketContext);
  const [isLoading,setIsLoading]=useState(false)

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: userLoginSchema,
    validateOnChange: false,
    onSubmit: async (formData, { resetForm }) => {
      setIsLoading(true)
      try {
        const token = await axiosInstance.post("/users/login", formData);
        localStorage.setItem("token", token.data);
        const { role, id } = jwtDecode(token.data);

        if (role === "admin") {
          const { data } = await axiosInstance.get("/users/account");
          userDispatch({ type: "SET_ADMIN", payload: data });
          dispatch(startGetAllData());
        } else {
          const responses = await Promise.all([
            await axiosInstance.get("/users/account"),
            await axiosInstance.get("/groups/account"),
            await axiosInstance.get("/visitors/types"),
          ]);
          socket.emit("userAuthId", { role:role, id: responses[0].data._id });
          userDispatch({
            type: "SET_USER",
            payload: responses.map((e) => e.data),
          });
        }
        setIsLoading(false)
        resetForm();
        navigate("/dashboard");
      } catch (e) {
        setIsLoading(false)
        console.log(e);
        toast.error(`${e.response.data}`);
      }
    },
  });

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500  flex-1 flex justify-center items-center">
      <div className="loginDiv bg-black flex flex-col justify-center items-center rounded-md shadow-md  min-h-[380px] w-[330px] ">
         <div className="mb-6 w-full flex justify-center text-xl">

          <h1 className="text-white  font-semibold text-xl">Sign in to your account</h1>
         </div>
        <div className="flex flex-2 items-center justify-center w-full text-white">
          <form
            className="flex flex-col items-center  mb-3"
            onSubmit={formik.handleSubmit}
          >
            <div className="flex flex-col w-full">
              <label
                htmlFor="email"
                className=" mb-2 text-sm font-medium  "
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                className=" sm:text-sm rounded-[3px] w-[255px] p-1.5 mt-0.5 border-none outline-black bg-slate-700"
                placeholder="name@email.com"
              />
              <div className="h-6 pl-[2px] mt-[2px] text-sm text-red-500">
                {formik.errors.email}
              </div>
            </div>
            <div className="flex flex-col w-full">
              <label
                htmlFor="password"
                className=" mb-2 text-sm font-medium "
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="••••••••"
                className=" sm:text-sm rounded-[3px] w-[255px] p-1.5 mt-0.5 border-none outline-black bg-slate-700"
              />
              <div className="h-6 pl-[2px] mt-[2px] text-sm text-red-500">
                {formik.errors.password}
              </div>
            </div>
            <div className="flex justify-center ">
              <Button text={`Sign In`} submitHandler={formik.handleSubmit} loading={isLoading} style={`cursor-pointer text-indigo-600 px-5 p-2 mt-0 border-none outline-indigo-400 rounded-md  font-semibold hover:bg-indigo-600 hover:text-white hover:shadow-md `}/>
            </div>
          </form>
        </div>
        <div className="flex items-center">
          <p className="text-sm font-light text-gray-500 flex justify-center  mt-2">
            Don’t have an account yet?{" "}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:underline pl-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
