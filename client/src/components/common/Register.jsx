import { useState } from "react";
import { RegisterComponent } from "./RegisterComponent";
import { Link } from "react-router-dom";
import { GroupRegisterIcon, MemberRegisterIcon } from "../../assets/Svg";

export const Register = () => {
  const [groupOrMember, setGroupOrMember] = useState("group");
  return (
    <section className="bg-gradient-to-r from-cyan-500 to-blue-500 flex-1 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center   mx-auto  ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 bg-black rounded-md">
          <h3 className=" font-bold sm:text-xl md:text-2xl dark:text-white">
            Create account
          </h3>
          <div className="flex justify-center items-center ">
            <div className="registerConatiner md:h-[480px] sm:h-[400px]">
              <div className="btnToggle h-[70px] sm:h-[55px] bg-slate-400 rounded-[3px] shadow-md z-[100] flex justify-center items-center ">
                <button
                  onClick={(e) => setGroupOrMember(e.target.name)}
                  name="group"
                  className={`flex justify-center items-center ${
                    groupOrMember === "group"
                      ? "bg-slate-700 rounded-[3px] shadow-md text-white transition duration-300 ease-in-out"
                      : "bg-inherit text-slate-700 "
                  }  sm:w-[110px]  sm:h-[30px] sm:text-sm mx-1 md:text-base h-full md:w-[125px] ml-3 font-semibold text-xl`}
                >
                  <GroupRegisterIcon/>
                  Group
                </button>
                <button
                  onClick={(e) => setGroupOrMember(e.target.name)}
                  name="member"
                  className={`flex justify-center items-center ${
                    groupOrMember === "member"
                      ? "bg-slate-700 rounded-[3px] shadow-md text-white transition duration-300 ease-in-out"
                      : "bg-inherit text-slate-700 "
                  }  sm:w-[110px] sm:h-[30px] sm:text-sm  mx-1 md:text-base h-full md:w-[125px] mr-3 font-semibold text-xl`}
                >
                  <MemberRegisterIcon/>
                  Member
                </button>
              </div>
              <div className="registerForm  flex  flex-col items-center ">
                {groupOrMember === "group" ? (
                  <RegisterComponent key={groupOrMember} type={groupOrMember} />
                ) : (
                  <RegisterComponent key={groupOrMember} type={groupOrMember} />
                )}
              </div>
            </div>
          </div>

          <p className="text-sm font-light text-gray-500 dark:text-gray-400 flex justify-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500 pl-1"
            >
              {" "}
              Login here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
