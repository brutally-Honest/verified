import _ from "lodash";
import { useFormik } from "formik";
import {
  groupRegisterationSchema,
  memberRegisterationSchema,
} from "../../validations/clientSideValidations";
import { axiosInstance } from "../../config/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import toast from "react-hot-toast";

export const RegisterComponent = ({ type }) => {
  const [serverErrors, setServerErrors] = useState([]);
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      userName: "",
      userPhoneNumber: "",
      email: "",
      password: "",
      groupCode: type === "group" ? null : "",
    },
    validationSchema:
      type === "group" ? groupRegisterationSchema : memberRegisterationSchema,
    validateOnChange: false,
    onSubmit: async (formData, { resetForm }) => {
      let user;
      try {
        setLoading(true)
        if (type === "group")
          user = await axiosInstance.post(
            "/users/register/groupAdmin",
            formData
          );
        if (type === "member")
          user = await axiosInstance.post("/users/register/member", formData);
        setLoading(false)
        toast.success('Account Registered Successfully')
        setServerErrors([]);
        resetForm();
        navigate("/login");
      } catch (e) {
        console.log(e);
        setServerErrors(e.response.data.errors);
      }
    },
  });
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col py-3 mt-2 md:mt-5 w-full items-center justify-center "
    >
      <div className="w-[80%] pb-2 ">
        <input
          type="text"
          name="userName"
          id="userName"
          value={formik.values.userName}
          onChange={formik.handleChange}
          className="bg-slate-700 border-none text-white  md:h-[35px]  w-full  sm:h-[30px] sm:text-sm rounded-[3px] p-2.5"
          placeholder="Your Name"
        />
        <div className="md:h-6 sm:h-4 sm:mt-[1px] pl-[2px] mt-[2px] text-sm text-red-500">
          {formik.errors.userName}
        </div>
      </div>
      <div className="w-[80%] pb-2">
        <input
          type="number"
          name="userPhoneNumber"
          id="userPhoneNumber"
          value={formik.values.userPhoneNumber}
          onChange={formik.handleChange}
          className="bg-slate-700 border-none text-white md:h-[35px]  w-full  sm:h-[30px] sm:text-sm rounded-[3px] p-2.5"
          placeholder="Phone Number"
        />
        <div className="md:h-6 sm:h-4 sm:mt-[1px] pl-[2px] mt-[2px] text-sm text-red-500">
          {formik.errors.userPhoneNumber}
        </div>
      </div>
      <div className="w-[80%] pb-2">
        <input
          type="text"
          name="email"
          id="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          className="bg-slate-700 border-none text-white  md:h-[35px]  w-full sm:h-[30px] sm:text-sm rounded-[3px] p-2.5"
          placeholder="name@email.com"
        />
        <div className="md:h-6 sm:h-4 sm:mt-[1px] pl-[2px] mt-[2px] text-sm text-red-500">
          {formik.errors.email}
          {serverErrors.filter((e) => e.path === "email").map((e) => e.msg)}
        </div>
      </div>
      <div className="w-[80%] pb-2">
        <input
          type="password"
          name="password"
          id="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          className="bg-slate-700 border-none text-white md:h-[35px]  w-full  sm:h-[30px] sm:text-sm rounded-[3px] p-2.5"
          placeholder="••••••••"
        />
        <div className="md:h-6 sm:h-4 sm:mt-[1px] pl-[2px] mt-[2px] text-sm text-red-500">
          {formik.errors.password}
          {serverErrors.filter((e) => e.path === "password").map((e) => e.msg)}
        </div>
      </div>
      {type === "member" && (
        <>
          <div className="w-[80%] pb-2">
            <input
              type="text"
              name="groupCode"
              id="groupCode"
              value={formik.values.groupCode}
              onChange={formik.handleChange}
              className="bg-slate-700 border-none text-white  md:h-[35px] w-full  sm:h-[30px] sm:text-sm rounded-[3px] p-2.5"
              placeholder="Group Code"
              required=""
            />
            <div className="md:h-6 sm:h-4 pl-[2px] mt-[2px] text-sm text-red-500">
              {serverErrors
                .filter((e) => e.path === "groupCode")
                .map((e) => e.msg)}
              {formik.errors.groupCode}
            </div>
          </div>
        </>
      )}
      <Button
      style={`${type === "member" && "mt-1"}
        cursor-pointer text-indigo-600 px-5 p-2 mt-0 border-none outline-indigo-400 rounded-md  font-semibold hover:bg-indigo-600 hover:text-white hover:shadow-md `}
      submitHandler={formik.handleSubmit}
        text={'Register'}
        loading={loading}
      />
 
    </form>
  );
};


