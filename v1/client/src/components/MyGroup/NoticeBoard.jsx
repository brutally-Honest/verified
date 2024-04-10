import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../config/axios";
import { UserContext } from "../../context/UserContext";
import { BarLoader } from "react-spinners";
import toast from "react-hot-toast";

export const NoticeBoard = () => {
  const { role } = jwtDecode(localStorage.getItem("token"));
  const { userState } = useContext(UserContext);
  const [notice, setNotice] = useState("");
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(
          `/notices/all/${userState.group._id}`
        );
        setNotices(data);
        setLoading(false);
      } catch (e) {
        toast.error(`${e.response.data}`);
      }
    })();
  }, [notices.length]);

  const handleNotice = async () => {
    if (notice) {
      try {
        const { data } = await axiosInstance.post("/notices/new", {
          group: userState.group._id,
          notice,
          groupAdmin: userState.user._id,
        });
        toast.success("Notice Created");
        setNotices([...notices, data]);
        setNotice("");
      } catch (e) {
        toast.error(e.response.data.errors?.[0].msg);
      }
    } else toast.error("Notice cannot be Empty!!");
  };
  return (
    <div className="mt-5 overflow-hidden">
      <h1 className="text-center text-xl font-semibold">Notice Board</h1>
      {loading && (
        <div className="flex justify-center items-center mt-5">
          <BarLoader />
        </div>
      )}
      {!loading && notices.length === 0 && (
        <div className="text-center text-xl font-semibold mt-2">
          No Notices Yet! {role === "groupAdmin" && "Create One"}
        </div>
      )}
      {!loading && (
        <>
          <div className="flex flex-col border-[2px] bg-gradient-to-r from-indigo-600 via-blue-500 to-blue-400 border-purple-700 rounded-md mx-[15vw] h-[400px]  overflow-y-scroll ">
            {notices.map((e) => (
              <div
                key={e._id}
                className=" w-fit border-[1.5px] border-blue-700 rounded-md bg-blue-300 m-2 mx-3 p-1 font-semibold"
              >
                <div className="text-black">{e.notice}</div>
                <div className="text-xs font-semibold flex justify-end text-black">
                  {new Date(e.createdAt).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
          {role === "groupAdmin" && (
            <div className=" flex border-[2px] mt-2 bg-gradient-to-r from-indigo-600  to-indigo-400 border-purple-700 rounded-md mx-[15vw] h-[100px]">
              <input
                className="flex-1 m-2 border-none px-1 rounded-md outline-black/25"
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
              />{" "}
              <div className="flex items-end">
                <button
                  className="m-2 p-1 px-3 flex items-center h-fit border-[1.5px] bg-indigo-600 font-semibold rounded-md"
                  onClick={handleNotice}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
