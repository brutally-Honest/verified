import { useFormik } from "formik";
import { groupRegisterationSchema as gaurdRegisterationSchema } from "../../validations/clientSideValidations";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { axiosInstance } from "../../config/axios";
import { Modal } from "../ui/Modal2";
import { jwtDecode } from "jwt-decode";
import { startCreateGaurd } from "../../actions/adminActions";
import { useDispatch,useSelector } from "react-redux";

export const CreateGaurd = () => {
  const { userState, userDispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch=useDispatch()
  const [serverError, setServerError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { role } = jwtDecode(localStorage.getItem("token"));

  const formik = useFormik({
    initialValues: {
      userName: "",
      userPhoneNumber: "",
      email: "",
      password: "",
    },
    validateOnChange: false,
    validationSchema: gaurdRegisterationSchema,
    onSubmit: async (formData, { resetForm }) => {

      try {
        if (role === "admin") {
          formData.group = location.state.group;
          formData.groupAdmin = location.state.groupAdmin;
          console.log(formData);
          dispatch(
            startCreateGaurd(formData, resetForm, navigate, setServerError)
          );
        } else {
          formData.group = userState.group._id;
          formData.groupAdmin = userState.group.groupAdmin._id;
          const gaurdResponse = await axiosInstance.post(
            "/groups/createGaurd",
            formData
          );
          userDispatch({ type: "SET_GAURD", payload: gaurdResponse.data });
          resetForm();
          navigate("/myGroup/details");
        }
        setIsOpen(false)
      } catch (e) {
        setIsOpen(false)
        setServerError(e.response.data.errors[0].msg);
      }
    },
  });
  
  return (
    <div className="flex  flex-col items-center sm:mt-14 ">
      <h2>Create Gaurd </h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col mt-5">
        <input
          type="text"
          name="userName"
          value={formik.values.userName}
          onChange={formik.handleChange}
          placeholder="Name"
          className={`${
            formik.errors.userName
              ? " border-red-500 outline-red-500"
              : "border-transparent border-b-gray-300 rounded-none outline-indigo-400"
          } p-[2px] border-2 rounded-md  sm:w-[220px] bg-transparent `}
        />
        <div className="h-7 pl-[2px] mt-[2px] text-sm text-red-500">
          {formik.errors.userName}
        </div>
        <input
          type="number"
          name="userPhoneNumber"
          value={formik.values.userPhoneNumber}
          onChange={formik.handleChange}
          placeholder="Phone Number"
          className={`${
            formik.errors.userPhoneNumber
              ? " border-red-500 outline-red-500"
              : "border-transparent border-b-gray-300 rounded-none outline-indigo-400"
          } p-[2px] border-2 rounded-md bg-transparent`}
        />
        <div className="h-7 pl-[2px] mt-[2px] text-sm text-red-500">
          {formik.errors.userPhoneNumber}
        </div>
        <input
          type="text"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          placeholder="Email"
          className={`${
            formik.errors.email
              ? " border-red-500 outline-red-500"
              : "border-transparent border-b-gray-300 rounded-none outline-indigo-400"
          } p-[2px] border-2 rounded-md bg-transparent`}
        />
        <div className="h-7 pl-[2px] mt-[2px] text-sm text-red-500">
          {formik.errors.email}
          {serverError}
        </div>
        <input
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          placeholder="Password"
          className={`${
            formik.errors.password
              ? " border-red-500 outline-red-500 "
              : "border-transparent border-b-gray-300 rounded-none outline-indigo-400"
          } p-[2px] border-2 rounded-md bg-transparent`}
        />
        <div className="h-7 pl-[2px] mt-[2px] text-sm text-red-500">
          {formik.errors.password}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-indigo-600  p-1 rounded-md text-center font-semibold hover:bg-indigo-600 hover:text-white hover:shadow-md outline-indigo-400"
        >
          Create Gaurd
        </button>
      </form>
      {isOpen && (
        <Modal
          open={isOpen}
          setOpen={setIsOpen}
          title={"Gaurd"}
          description={<span>Are you sure you want to create gaurd <span className="font-bold text-black">{formik.values.userName}</span> and assign to the group?</span>}
          action={{method:formik.handleSubmit,name:"Submit"}}
        />
      )}
    </div>
  );
};
