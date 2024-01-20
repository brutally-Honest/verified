import _ from "lodash";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";
import {axiosInstance} from "../../config/axios"
import { updateProfileSchema } from "../../validations/clientSideValidations";

export const Profile = () => {
  const { userState,userDispatch } = useContext(UserContext);
  const { role } = jwtDecode(localStorage.getItem("token"));
  const [serverErrors, setServerErrors] = useState([]);
  const [toggle, setToggle] = useState(false);
  const formik = useFormik({
    initialValues: {
      userName:
        role === "admin"
          ? userState.user?.userName
          : userState.user?.userAuthId?.userName || "",
      userPhoneNumber:
        role === "admin"
          ? userState.user.userPhoneNumber
          : userState.user?.userAuthId?.userPhoneNumber || "",
      email:
        role === "admin"
          ? userState.user?.email
          : userState.user?.userAuthId?.email || "",
    },
    validateOnChange: false,
    validationSchema:updateProfileSchema,
    onSubmit: async (formData) => {
      try {
        const updated= await axiosInstance.put("/users/edit", formData);
        toast.success("Successfully Updated Profile",{duration:3000})
        userDispatch({type:"SET_PROFILE",payload:updated.data})
        setServerErrors([]);
        setToggle(!toggle)
       } catch (e) {
         setServerErrors(e.response.data.errors);
       }
      // }
    },
  });

  const defaultValues = () => {
    formik.setFieldValue(
      "userName",
      role === "admin" || role === "user"
        ? userState.user.userName
        : userState.user.userAuthId.userName
    );
    formik.setFieldValue(
      "userPhoneNumber",
      role === "admin" || role === "user"
        ? userState.user.userPhoneNumber
        : userState.user.userAuthId.userPhoneNumber
    );
    formik.setFieldValue(
      "email",
      role === "admin" || role === "user"
        ? userState.user.email
        : userState.user.userAuthId.email
    );
  };
  const handleToggle = () => {
    setToggle(!toggle);
    toggle && defaultValues();
    formik.resetForm()
    setServerErrors([])
  };
  return (
    <>
      {_.isEmpty(userState.user) ? (
        <div></div>
      ) : (
        <div className="flex flex-col items-center mt-10">
          <h2 className="font-thin text-3xl">Profile</h2>
          <div>
            <form onSubmit={formik.handleSubmit}>
              <div className="rounded-sm  m-2 flex">
                <div className="p-1 bg-blue-500/80  pl-2 py-1 rounded-l-[4px] w-[120px] font-semibold text-center">
                  Name
                </div>
                <input
                  type="text"
                  className={`p-1 w-[100%] border-2 border-l-0 border-blue-500 text-center rounded-r-[4px] focus:outline-none focus:bg-indigo-200 font-semibold ${
                    toggle ? "bg-indigo-500/40 focus" : "bg-blue-300/50"
                  }`}
                  name="userName"
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  disabled={!toggle}
                />
              </div>
              <div className="h-[10px] flex items-center justify-center text-sm text-red-500">{formik.errors.userName}</div>
              <div className="rounded-sm  m-2 flex ">
                <div className="p-1 bg-blue-500/80  pl-2 py-1 rounded-l-[4px]  w-[120px] font-semibold text-center">
                  Phone
                </div>
                <input
                  type="number"
                  className={`p-1 w-[100%] border-2 border-l-0 border-blue-500 text-center rounded-r-[4px] focus:outline-none focus:bg-indigo-200 font-semibold ${
                    toggle ? "bg-indigo-500/40 focus" : "bg-blue-300/50"
                  }`}
                  name="userPhoneNumber"
                  value={formik.values.userPhoneNumber}
                  onChange={formik.handleChange}
                  disabled={!toggle}
                />
              </div>
              <div className="h-[10px] flex items-center justify-center text-sm text-red-500">{formik.errors.userPhoneNumber}</div>
              <div className="rounded-sm  m-2 flex">
                <div className="p-1 bg-blue-500/80  pl-2 py-1 rounded-l-[4px] w-[120px] font-semibold text-center">
                  Email
                </div>
                <input
                  type="text"
                  className={`p-1 w-[100%] border-2 border-l-0 border-blue-500 text-center rounded-r-[4px] focus:outline-none focus:bg-indigo-200 font-semibold ${
                    toggle ? "bg-indigo-500/40 focus" : "bg-blue-300/50"
                  }`}
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  disabled={!toggle}
                />
              </div>
              <div className="h-[8px] flex items-center justify-center text-sm text-red-500">{formik.errors.email}{serverErrors.filter(e=>e.path==="email").map(e=>e.msg)}</div>
              {(role === "groupAdmin" || role === "member") && (
                <>
                  {userState.group?.status === "approved" &&
                    (userState.user.property && (
                      <>
                        <div className="rounded-sm m-2 flex">
                          <div className="p-1 bg-blue-500/80  pl-2 py-1 rounded-l-[4px] w-[120px] font-semibold text-center">
                            Block
                          </div>
                          <div
                            className={`p-1 w-[100%] border-2 border-l-0 border-blue-500 text-center rounded-r-[4px] focus:outline-none focus:bg-indigo-200 font-semibold bg-blue-300/50`}
                          >
                            {userState.user.property.block.blockName}
                          </div>
                        </div>
                        <div className="h-[8px]"></div>
                        <div className="rounded-sm m-2 flex">
                          <div className="p-1 bg-blue-500/80  pl-2 py-1 rounded-l-[4px] w-[120px] font-semibold text-center">
                            Unit{" "}
                          </div>
                          <div
                            className={`p-1 w-[100%] border-2 border-l-0 border-blue-500 text-center rounded-r-[4px] focus:outline-none focus:bg-indigo-200 font-semibold bg-blue-300/50`}
                          >
                            {userState.user.property.unitNumber}
                          </div>
                        </div>
                        <div className="h-[8px]"></div>
                      </>
                    ))}
                    
                </>
              )}
              <div className="flex justify-evenly">
                <input
                  type="button"
                  onClick={handleToggle}
                  value={toggle ? "Cancel" : "Edit"}
                  className={`text-indigo-600 cursor-pointer p-1 px-2 rounded-md text-center font-semibold ${
                    toggle ? "hover:bg-black" : "bg-white rounded-md shadow-md"
                  } hover:text-indigo-500 hover:shadow-md outline-indigo-400`}
                />
                <input
                  type="submit"
                  hidden={!toggle}
                  value={"Update"}
                  className="text-indigo-600  cursor-pointer p-1 px-2 rounded-md text-center font-semibold hover:bg-indigo-600 hover:text-white hover:shadow-md outline-indigo-400"
                />
              </div>
            </form>
            {role==="member" && userState.user.status==="Unit Pending" &&<div className="flex p-2 m-2 bg-slate-300  rounded  shadow-md"><Link to={'/addUnit'} className="w-full text-center font-medium">Set Unit</Link></div>}
          </div>
        </div>
      )}
    </>
  );
};
