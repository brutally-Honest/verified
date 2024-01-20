import _ from "lodash";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axios";
import { useContext, useState } from "react";
import PinField from "react-pin-field";
import toast from "react-hot-toast";
import {UserContext} from '../../context/UserContext'
import { Button } from "../ui/Button"

export const Verification = () => {
  const [key, setKey] = useState("");
  const [OTP, setOTP] = useState("");
  const [isLoading,setIsLoading]=useState(false)
  const [serverResponse, setServerResponse] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const {userState}=useContext(UserContext)

  const checkKey = async () => {
    if (key.length===6) {
      setIsLoading(true)
      try {
        await axiosInstance.put("/visitors/verify-key", {
          key,
          group:userState.group._id,
          visitorPhoneNumber: state.row.visitorPhoneNumber,
          visitorId: state.row.id,
        });
        setIsLoading(false)
        toast.success(`OTP Sent to ${state.row.visitorPhoneNumber}`);
        setServerResponse(true);
      } catch (e) {
        console.log(e);
        toast.error(`${_.isObject(e.response.data)?e.response.statusText:e.response.data}`);
      }

    } else toast.error("Enter Full Key");
  };

  const checkOTP = async () => {
    setIsLoading(true)
    try {
      const { data } = await axiosInstance.post("/visitors/verify-otp", {
        visitorId: state.row.id,
        otp: OTP,
      });
      setIsLoading(false)
      toast.success(data);
      navigate("/visitors/expected");
    } catch (e) {
      console.log(e);
      toast.error(`${_.isObject(e.response.data)?e.response.statusText:e.response.data}`);
    }
  };
  
  return (
    <div>
      <h2 className="text-center font-bold mt-2 ">Visitor VERIFICATION</h2>
      <div className="flex justify-center mt-2">
      <div className=" bg-blue-700  font-semibold m-1 px-2 py-1 w-fit rounded-[4px]">
        {state.row.visitorName}
      </div>
      <div className=" bg-blue-700  font-semibold m-1 px-2 py-1 w-fit rounded-[4px]">
        {state.row.unitNumber}
      </div>
      </div>
      {serverResponse || (
        <div className="bg-purple-400 flex flex-col justify-center my-5 items-center md:mx-[30vw] sm:mx-[20vw] border-[3px] border-purple-600 rounded-md shadow-md ">
          <h2 className="p-2 text-lg font-medium">KEY</h2>
          <div>
            <PinField
              className=" w-[50px] text-black h-[50px] text-3xl m-[2px] text-center outline-none rounded-[5px] border-[3px] focus:border-[3px] focus:border-indigo-500 focus:text-indigo-500"
              validate={/^[a-zA-Z0-9]$/}
              length={6}
              onChange={setKey}
            />
          </div>
          <Button submitHandler={checkKey} text={'Verify'} loading={isLoading} style={`"bg-indigo-600 font-semibold p-2 px-3 m-2 mt-3 rounded-[4px] hover:text-white hover:border-black border-[1.5px] cursor-pointer`}/>

        </div>
      )}
      {serverResponse && (
        <div className="bg-purple-400 flex flex-col justify-center my-5 items-center md:mx-[30vw] sm:mx-[20vw] border-[3px] border-purple-600 rounded-md shadow-md ">
        <h2 className="p-2 text-lg font-medium">OTP</h2>
        <div>
          <PinField
            className=" w-[50px] text-black h-[50px] text-3xl m-[2px] text-center outline-none rounded-[5px] border-[3px] focus:border-[3px] focus:border-indigo-500 focus:text-indigo-500"
            validate={/^[a-zA-Z0-9]$/}
            length={6}
            onChange={setOTP}
          />
        </div>
        <Button submitHandler={checkOTP} text={'Verify'} loading={isLoading} style={`bg-indigo-600 font-semibold p-2 px-3 m-2 mt-3 rounded-[4px] hover:text-white hover:border-black border-[1.5px] cursor-pointer`}/>
      </div>
      )}
    </div>
  );
};
