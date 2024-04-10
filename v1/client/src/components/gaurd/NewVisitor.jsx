import _ from "lodash";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { UserContext } from "../../context/UserContext";
import { SocketContext } from "../../context/SocketContext";
import { newVisitorSchemaGaurd } from "../../validations/clientSideValidations";
import { axiosInstance } from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { CamerOff, CameraOn, SearchIcon } from "../../assets/Svg";
import Webcam from "react-webcam";
import toast from "react-hot-toast";

export const NewVisitor = () => {
  const navigate = useNavigate();
  const { userState } = useContext(UserContext);
  const { visitorTypes } = userState;
  const [phoneResponse, setPhoneResponse] = useState({ text: "", data: null });
  const socket = useContext(SocketContext);
  const imgRef = useRef();
  const [acknowledge, setAcknowledged] = useState({});
  const [vC, setVC] = useState(false);
  const [permission, setPermission] = useState(false);
  const [videoCalled, setVideoCalled] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState({});
  const [openCamera, setOpenCamera] = useState(false);
  const [visitorPhoto, setVisitorPhoto] = useState(null);

  const formik = useFormik({
    initialValues: {
      visitorType: "",
      visitorName: "",
      visitorPhoneNumber: "",
      block: "",
      unit: "",
    },
    validationSchema: newVisitorSchemaGaurd,
    validateOnChange: false,
    onSubmit: async (formData, { resetForm }) => {
      //visitorData is to be uploaded to db
      formData.group = userState.group._id;
      formData.image = { body: img, type: "file" };
      formData.imageUrl = phoneResponse.data;

      

      const visitorData = new FormData();
      visitorData.append("visitorPhoto", img);
      visitorData.append("visitorType", formik.values.visitorType);
      visitorData.append("visitorName", formik.values.visitorName);
      visitorData.append(
        "visitorPhoneNumber",
        formik.values.visitorPhoneNumber
      );
      visitorData.append("block", formik.values.block);
      visitorData.append("unit", formik.values.unit);
      visitorData.append("group", formData.group);

      try {
        setIsLoading(true);
        const {data}=await axiosInstance.post(
          "/visitors/new",
          visitorData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setIsLoading(false);
        toast.success("Successfully Sent Request");

        socket.emit("permission", formData);

        localStorage.setItem("currentVisitor", JSON.stringify(formData));
        localStorage.setItem("cvImage", phoneResponse.data?phoneResponse.data:data.visitorPhoto);//set image url in localStorage
        resetForm();
        setPhoneResponse({ text: "", data: null });
        setImg({})
        imgRef.current && (imgRef.current.value = "");
      } catch (e) {
        setIsLoading(false);
        console.log(e);
        if(e.response.data.errors)toast.error(e.response.data.errors[0].msg)
      }
    },
  });

  const checkPhone = async () => {
    if (String(formik.values.visitorPhoneNumber).length === 10)
      try {
        const { data } = await axiosInstance.get(
          `/visitors/checkPhone/${formik.values.visitorPhoneNumber}`
        );
        console.log(data);
        formik.setFieldValue("visitorName", data.visitorName);
        setPhoneResponse({ text:'', data: data.visitorPhoto });
      } catch (e) {
        setPhoneResponse({ text: e.response.data?.message || e.response.data, data: null });
        // setPhoneResponse({ text: e.response.data, data: null });
        formik.setFieldValue("visitorName", e.response.data?.visitorName||"");
      }
  };

  //join videocall
  const joinVC = useCallback(() => {
    // socket.emit("joinVideoCall");
    socket.emit("joinVideoCall",localStorage.getItem('videoCalled'));
    navigate("/videoCall");
  }, [socket]);

  //socket handler to set set who approved the visitor
  const handleJoinVideoCall = useCallback(
    ({ approvedBy }) => {
      console.log("Received ApprovedBy");
      localStorage.setItem("videoCalled", approvedBy);
      setVC(true);
    },
    [vC]
  );

  //socket handler for setting Permission Response as state
  const handleFinalRequest = useCallback((result) => {
    setAcknowledged(result);
  }, []);

  //response api call -> Setting response from member to dB
  const newVisitor = async (visitorData) => {
    console.log(visitorData);
    try {
      const { data } = await axiosInstance.put(
        "/visitors/permission-response",
        visitorData
      );
      console.log(data);
    } catch (e) {
      console.log(e.response);
      if (e.response.data.errors) toast.error(e.response.data?.errors[0].msg);
    }
    localStorage.removeItem("videoCalled");
    localStorage.removeItem("currentVisitor");
    localStorage.removeItem("cvImage");
  };

  //without video
  const handleSubmitVisitor = (visitorData) => {
    const response = {
      visitorPhoneNumber: visitorData.visitorPhoneNumber,
      unit: visitorData.unit,
      permission: visitorData.permission,
      approvedBy: visitorData.approvedBy,
      response: true,
    };
    newVisitor(response);
    localStorage.removeItem("currentVisitor");
    localStorage.removeItem("cvImage");
    setAcknowledged({});
  };

  //with video
  const handleSubmitVisitorAfterVideo = async (e) => {
    e.preventDefault();
    const visitorDetails = JSON.parse(localStorage.getItem("currentVisitor"));
    visitorDetails.approvedBy = localStorage.getItem("videoCalled");
    visitorDetails.permission = permission;
    visitorDetails.response = true;
    
    await newVisitor(visitorDetails);
    setVideoCalled({});
   
  };

  //socket
  useEffect(() => {
    socket.on("s-Final", handleFinalRequest);
    socket.on("s-joinVideoCall", handleJoinVideoCall);
  }, [socket, handleFinalRequest, handleJoinVideoCall]);

  //after videocall
  useEffect(() => {
    if (localStorage.getItem("videoCalled")) {
      setVideoCalled(JSON.parse(localStorage.getItem("currentVisitor")));
    }
  }, []);

  return (
    <>
      <div className="text-center font-semibold text-lg">NEW VISITOR</div>
      {/* Requested video call */}
      {vC && (
        <div className="flex justify-center">
          <div className="flex items-center flex-col m-2 rounded w-fit p-3 shadow-md bg-teal-500">
            Requested Video Call
            <button
              onClick={joinVC}
              className="p-2 bg-white font-semibold text-lg rounded m-2 hover:bg-emerald-300 border-[1.5px] border-slate-500"
            >
              Join Call
            </button>
          </div>
        </div>
      )}
      {/* without video */}
      {!_.isEmpty(acknowledge) && (
        <div className="flex justify-center m-2 p-2 mb-0">
          <div className="flex items-center flex-col m-2 rounded w-fit shadow-md bg-gradient-to-bl from-indigo-200 via-gray-500 to-teal-700">
            <div className="container flex flex-col items-center px-5 py-2">
              <div className="text-center p-2">
                <span className="font-medium text-lg pr-1">
                  {acknowledge.visitorName}
                </span>
                <span className="font-medium text-lg">
                  {acknowledge.permission === true ? (
                    <>
                      <span className="p-1 rounded bg-emerald-500 text-white">
                        Approved
                      </span>
                      👍
                    </>
                  ) : (
                    <>
                      <span className="p-1 rounded bg-rose-500 text-white">
                        Denied{" "}
                      </span>
                      👎
                    </>
                  )}{" "}
                </span>
                <div className="flex flex-col px-2 mx-2">
                  {`By `}
                  <span className="font-medium text-lg">
                    {userState.group?.members?.find(
                      (e) => e.memberId._id === acknowledge.approvedBy
                    )?.memberId?.userAuthId.userName ||
                      userState.group.groupAdmin.userAuthId.userName}
                  </span>
                </div>
              </div>
              <button
                className=" rounded p-2 bg-gray-500 font-semibold text-lg m-2 hover:bg-gray-700 border-[1.5px] border-black/80"
                onClick={() => handleSubmitVisitor(acknowledge)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {/* with video */}
      {!_.isEmpty(videoCalled) && (
        <div className="flex justify-center items-center h-screen">
          <form className="shadow-lg rounded flex flex-col w-[400px] m-2 p-2">
            <div className="my-1">
              <img src={localStorage.getItem("cvImage")} className="rounded" />
            </div>
            <input
              type="text"
              value={`${
                visitorTypes?.find((e) => e._id === videoCalled.visitorType)
                  ?.type
              }`}
              disabled={true}
              className="text-center font-semibold text-lg p-[2px] my-[2px] rounded bg-slate-500/20"
            />
            <input
              type="text"
              value={`${videoCalled.visitorName}`}
              disabled={true}
              className="text-center font-semibold text-lg p-[2px] my-[2px] rounded bg-slate-500/20"
            />
            <input
              type="text"
              value={`${videoCalled.visitorPhoneNumber}`}
              disabled={true}
              className="text-center font-semibold text-lg p-[2px] my-[2px] rounded bg-slate-500/20"
            />
            <input
              type="text"
              value={`${
                userState?.group?.blocks?.find(
                  (e) => e?.blockId?._id === videoCalled.block
                )?.blockId?.blockName
              }`}
              disabled={true}
              className="text-center font-semibold text-lg p-[2px] my-[2px] rounded bg-slate-500/20"
            />
            <input
              type="text"
              value={`${
                userState?.group?.blocks
                  ?.find((e) => e?.blockId?._id === videoCalled.block)
                  ?.blockId?.units?.find(
                    (e) => e.unitId._id === videoCalled.unit
                  )?.unitId?.unitNumber
              }`}
              disabled={true}
              className="text-center font-semibold text-lg p-[2px] my-[2px] rounded bg-slate-500/20"
            />
            <div className="flex justify-center p-[2px] my-1">
              <span className="font-semibold pr-2">Permission </span>
              <label className="relative inline-flex items-center  cursor-pointer">
                <input
                  type="checkbox"
                  value={permission}
                  onChange={() => setPermission(!permission)}
                  className="sr-only peer "
                />
                <div className="w-11 h-6 bg-gray-200  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-green-500 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all "></div>
              </label>
            </div>
            <div className="flex justify-center">
              <Button
                submitHandler={handleSubmitVisitorAfterVideo}
                text={"Submit"}
                loading={isLoading}
                style={`p-1 font-semibold border-2 border-purple-500 hover:text-white text-indigo-500 hover:bg-indigo-500 bg-white rounded px-2`}
              />
            </div>
          </form>
        </div>
      )}
      {/* initial form  */}
      {!vC && _.isEmpty(acknowledge) && _.isEmpty(videoCalled) && (
        <div className="h-screen mt-10 flex items-start justify-evenly">
          <div className="flex h-[590px] ">
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col m-2 shadow-[1px_2px_6px_rgba(0,0,0,0.3)] rounded-xl w-[300px] bg-indigo-300"
            >
              <div className=" flex flex-col items-center p-4">
                <h2 className="font-semibold text-2xl mb-4 mt-2 text-black">
                  Visitor Details
                </h2>
                <select
                  onChange={formik.handleChange}
                  value={formik.values.visitorType}
                  name="visitorType"
                  className={`${
                    formik.errors.visitorType ? "outline-red-400 " : ""
                  } outline-none w-[220px] mt-5 rounded-md p-1 px-2 text-black`}
                >
                  <option value={""}>Select Visitor Type</option>
                  {visitorTypes?.map((e) => (
                    <option key={e._id} value={e._id} className="font-semibold">
                      {e.type}
                    </option>
                  ))}
                </select>

                <div className="h-7 mt-[5px] text-sm text-red-500">
                  {formik.errors.visitorType}
                </div>
                <input
                  type="text"
                  name="visitorName"
                  placeholder="Name"
                  value={formik.values.visitorName}
                  onChange={formik.handleChange}
                  className={`${
                    formik.errors.visitorName ? "outline-red-400" : ""
                  } p-1 font-medium w-[220px] mt-2 mb-2  rounded-md text-black`}
                />
                <div className="h-7 text-sm text-red-500">
                  {formik.errors.visitorName}
                </div>
                <div className="flex">
                  <input
                    type="number"
                    name="visitorPhoneNumber"
                    placeholder="Phone"
                    value={formik.values.visitorPhoneNumber}
                    onChange={formik.handleChange}
                    className={`${
                      formik.errors.visitorPhoneNumber ? "outline-red-400" : ""
                    } p-1 font-medium w-[220px] mt-2 mb-2 ml-6 rounded-md text-black`}
                  />
                  <div className="flex items-center" onClick={checkPhone}>
                    <div
                      className={` relative right-8 flex justify-center items-center ${
                        String(formik.values.visitorPhoneNumber).length === 10
                          ? "visible"
                          : "invisible"
                      } z-10 p-0 h-[30px]`}
                    >
                      <SearchIcon />
                    </div>
                  </div>
                </div>
                <div className="h-7 text-sm text-red-500">
                  {formik.errors.visitorPhoneNumber}
                  <span className="font-medium">{phoneResponse.text}</span>
                </div>
                {!phoneResponse.data && (
                  <input
                    type="file"
                    accept="image/*"
                    ref={imgRef}
                    onChange={(e) => {
                      setImg(e.target.files[0]);
                      const reader = new FileReader();
                      reader.addEventListener("load", () => {
                        localStorage.setItem("cvImage", reader.result);
                      });
                      reader.readAsDataURL(e.target.files[0]);
                    }}
                    className={`p-1 font-medium my-2 pl-6 outline-none`}
                  />
                )}

                <div className="m-2 mt-5 flex">
                  <div className="mr-1">
                    <select
                      value={formik.values.block}
                      onChange={formik.handleChange}
                      name="block"
                      className={`${
                        formik.errors.block ? "outline-red-400  " : ""
                      } outline-none  rounded-md p-1  text-black`}
                    >
                      <option value="">Select Block</option>
                      {userState?.group?.blocks?.map((e) => (
                        <option
                          key={e.blockId._id}
                          value={e.blockId._id}
                          className="font-semibold"
                        >
                          {e.blockId.blockName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="pl-1 text-sm text-red-500">
                    {formik.errors.block}
                  </div>
                  {formik.values.block && (
                    <div>
                      <select
                        onChange={formik.handleChange}
                        name="unit"
                        className={`${
                          formik.errors.unit ? "outline-red-400 " : ""
                        } outline-none text-black rounded-md p-1 `}
                      >
                        <option value="">Select Unit</option>
                        {userState?.group?.blocks
                          ?.filter(
                            (e) => e.blockId._id === formik.values.block
                          )[0]
                          ?.blockId.units?.map((ele) => (
                            <option
                              key={ele.unitId._id}
                              value={ele.unitId._id}
                              className="font-semibold"
                            >
                              {ele.unitId.unitNumber}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="h-7 text-sm text-red-500">
                  {formik.errors.block ? "" : formik.errors.unit}
                </div>
                <Button
                  submitHandler={formik.handleSubmit}
                  text={"Submit"}
                  loading={isLoading}
                  style={` p-1 px-3 font-semibold text-lg rounded-md cursor-pointer bg-indigo-600 text-white hover:bg-indigo-400 hover:shadow-md `}
                />
              </div>
            </form>
            <div className="m-2 flex flex-col items-center w-[320px]  h-max shadow-[1px_2px_6px_rgba(0,0,0,0.3)] rounded-xl px-3">
              {
                <button
                  type="button"
                  className="p-1 px-2 rounded bg-white m-1 text-lg"
                  onClick={() => setOpenCamera(!openCamera)}
                >
                  {" "}
                  {openCamera ? "Close Webcam" : "Open Webcam"}
                  <div className="flex justify-center">
                    {openCamera ? <CamerOff /> : <CameraOn />}
                  </div>
                </button>
              }
              {openCamera && (
                <Webcam
                  width={300}
                  height={300}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={1}
                >
                  {({ getScreenshot }) => (
                    <button
                      className="m-2 font-medium rounded-md border-[1.5px] px-2 shadow-lg p-1 hover:bg-indigo-600 hover:text-white"
                      onClick={() => {
                        const imageSrc = getScreenshot();
                        setVisitorPhoto(imageSrc);
                      }}
                    >
                      Capture photo
                    </button>
                  )}
                </Webcam>
              )}
              {visitorPhoto && (
                <img src={visitorPhoto} alt="screenShot" className="mb-3" />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
