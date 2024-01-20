import _ from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { loadStripe } from "@stripe/stripe-js";
import { axiosInstance } from "../../config/axios";
import { Button } from "../ui/Button";
import  CustomTable  from "../ui/CustomTable";

export const Payments = () => {
  const { userState } = useContext(UserContext);
  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  const monthlyAmount = userState?.group?.blocks?.reduce((acc,cv)=>{acc+=(cv.blockId?.units.length*2) ;return acc},0) * 200;
  const yearlyAmount = userState?.group?.blocks?.reduce((acc,cv)=>{acc+=(cv.blockId?.units.length*2) ;return acc},0) *12* 170;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [myPayments,setMyPayments]=useState([])

  const handleSubscribe = async (duration, amount,setLoading) => {
    setLoading(true);
    const stripe = await loadStripe(stripePublicKey);

    const payerData = {
      email: userState.user.userAuthId.email,
      duration,
      id: userState.user._id,
      group:userState.group._id,
      amount,
      phone: userState.user.userAuthId.userPhoneNumber,
      name: userState.user.userAuthId.userName,
      product_name:
        duration === "month" ? "Verified Monthly" : "Verified Yearly",
      product_description:
        duration === "month"
          ? "Monthly payment for Verified services"
          : "Yearly payment for Verified services",
    };
    try {
      const session = await axiosInstance.post(
        "/payments/stripe-subscription-session",
        payerData
      );
      setLoading(false);
      if (session.data.redirectUrl) {
        window.location.href = session.data.redirectUrl; //redirect if already subscribed
      } else {
        stripe.redirectToCheckout({ sessionId: session.data.id });
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const myPaymentsAPI=async()=>{
    try{
      const {data}=await axiosInstance.get(`/payments/myPayments/${userState?.user?._id}`)
      console.log(data);
      setMyPayments(data)
    }catch(e){
      console.log(e);
    }
  }
  useEffect(()=>{
    if(!_.isEmpty(userState.user))
    myPaymentsAPI()
  },[])


  const columns=[
    {header:"Amount",accessor:"amount"},
    {header:"Plan",accessor:"plan"},
    {header:"Start Date ",accessor:"startDate"},
    {header:"End Date",accessor:"endsAt"},
  ]

  const myPamentsData=useMemo(()=>myPayments.map(e=>{
    return {
      id:e._id,
      startDate:new Date(e.createdAt).toDateString(),
      amount:e.amount,
      plan:e.plan,
      endsAt:new Date(e.endsAt).toDateString()
    }
  }),[myPayments])
  
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <h1 className="text-center font-semibold text-xl">Plans</h1>
        <div className="flex justify-around">
          <div className={`bg-gradient-to-bl from-purple-200 via-current to-pink-600 m-3 p-3 text-gray-800 rounded shadow-md ${!_.isEmpty(myPayments)?(myPayments[myPayments.length-1]?.plan!=='month'&&'hidden'):''}`}>
            <h1 className="font-thin text-3xl text-white">Monthly</h1>
            <h2 className="font-medium text-xl text-white p-1">₹{monthlyAmount}</h2>
            <Button
              text={`${myPayments?myPayments[myPayments.length-1]?.plan==='month'?'Cancel':'Subscribe':'Subscribe'}`}
              loading={isLoading}
              submitHandler={() => handleSubscribe("month", monthlyAmount,setIsLoading)}
              style={`p-2 m-1 rounded border-2 font-semibold ${
                isLoading && "px-[32.5px]"
              } border-sky-400 bg-white  text-blue-800 hover:text-white hover:bg-indigo-500`}
            />
          </div>
          <div className={`bg-gradient-to-bl from-purple-200 via-current to-pink-600 m-3 p-3 text-gray-800 rounded shadow-md ${!_.isEmpty(myPayments)?(myPayments[myPayments.length-1]?.plan!=='month'&&'hidden'):''}`}>
            <h1 className="font-thin text-3xl text-white">Yearly</h1>
            <h2 className="font-medium text-xl text-white p-1">₹{yearlyAmount}</h2>
            <Button
              text={`${myPayments&&myPayments[myPayments.length-1]?.plan!=='year'?'Change Plan':'Subscribe'}`}
              loading={isLoading2}
              submitHandler={() => handleSubscribe("year", yearlyAmount,setIsLoading2)}
              style={`p-2 m-1 rounded border-2 font-semibold ${
                isLoading2 && "px-[32.5px]"
              } border-sky-400 bg-white text-blue-800 hover:text-white hover:bg-indigo-500`}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-3">
        <h1 className="text-center font-medium text-xl">My Payment History</h1>
        {!_.isEmpty(myPayments)?<div className="flex justify-center">
        <CustomTable columns={columns} data={myPamentsData} width="500px"/>
        </div>:<div className="text-center font-medium text-lg"> No payments made yet!</div>}
      </div>
    </div>
  );
};
