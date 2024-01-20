import _ from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../../config/axios";
import { UserContext } from "../../context/UserContext";
import  CustomTable  from "../ui/CustomTable";
import { Modal } from "../ui/Modal2";
import noImage from '../../assets/noImage.jpg'
import { BarLoader } from "react-spinners";

export const TodaysVisitors = () => {
  const { userState } = useContext(UserContext);
  const [daysVisitors, setDaysVisitors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const elementsPerPage = 6;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading,setLoading]=useState(false)

  useEffect(() => {
    if (!_.isEmpty(userState.group)) {
      (async () => {
        try {
          setLoading(true)
          const { data } = await axiosInstance.get(
            `/visitors/${
              userState.group._id
            }/today?limit=${elementsPerPage}&skip=${
              (currentPage - 1) * elementsPerPage
            }`
          );
          setDaysVisitors(data.visitors);
          setLoading(false)
          setTotalPages(Math.ceil(data.total / elementsPerPage));
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [currentPage]);

  const columns = [
    { header: "Name", accessor: "visitorName" },
    { header: "Phone", accessor: "visitorPhoneNumber" },
    { header: "Unit", accessor: "unitNumber" },
    { header: "Permission", accessor: "permission" },
    { header: "Permission By", accessor: "approvedBy" },
    { header: "Time", accessor: "time" },
  ];
  const todaysVisitors = useMemo(
    () =>
      daysVisitors.map((e) => {
        return {
          id: e._id,
          visitorName: e.visitorName,
          visitorPhoneNumber: e.visitorPhoneNumber,
          unitNumber: `${
            userState.group.blocks.find((ele) => ele.blockId._id === e.block)
              .blockId.blockName
          }-${
            userState.group.blocks
              .find((ele) => ele.blockId._id === e.block)
              .blockId.units.find((element) => element.unitId._id === e.unit)
              .unitId.unitNumber
          }`,
          permission:("permission" in e)? (e.permission ? "Approved" : "Rejected"):"No Response",
          visitorPhoto: e.visitorPhoto||noImage,
          approvedBy:e.approvedBy?
            (userState.group.members.find(
              (ele) => ele.memberId._id === e.approvedBy
            )?.memberId.userAuthId.userName ||
            userState.group.groupAdmin.userAuthId.userName):"-",
          time: new Date(e.createdAt).toLocaleTimeString(),
        };
      }),
    [daysVisitors]
  );
  return (
    <div className="p-2 ">
      
      <div className="flex justify-center">
        <h2 className="font-semibold text-xl">Day's Visitors</h2>
      </div>
      <BarLoader loading={loading}/>
      {todaysVisitors.length === 0 && !loading&& (
        <div className="text-center font-semibold text-lg">
          Visitors yet to come today
        </div>)}
       { daysVisitors.length !== 0 &&(
        <div className="flex flex-col items-center">
          
          <CustomTable
            columns={columns}
            data={todaysVisitors}
            actions={{ name: "View" }}
            setOpen={setIsOpen}
            setValue={setValue}
            paginate={true}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          {isOpen && (
            <Modal
              open={isOpen}
              setOpen={setIsOpen}
              title={
                <span className="text-lg font-semibold">{`${value.visitorName}`}</span>
              }
              description={
                <div className="flex justify-center">
                  <img src={value.visitorPhoto} />
                </div>
              }
              value={value}
              simple={true}
            />
          )}
        </div>
      )}
    </div>
  );
};
