import _ from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useFormik } from "formik";
import { newVisitorSchemaMember } from "../../validations/clientSideValidations";
import { axiosInstance } from "../../config/axios";
import { SocketContext } from "../../context/SocketContext";
import { Button } from "../ui/Button";
import { BarLoader } from "react-spinners";
import toast from "react-hot-toast";
import CustomTable from "../ui/CustomTable";

export const ExpectedVisitors = () => {
  const { userState } = useContext(UserContext);
  const { visitorTypes, user } = userState;
  const socket = useContext(SocketContext);
  const [expectedVisitors, setExpectedVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      visitorType: "",
      visitors: [{ visitorName: "", visitorPhoneNumber: "" }],
    },
    validateOnChange: false,
    validationSchema: newVisitorSchemaMember,
    onSubmit: async (formData, { resetForm }) => {
      (formData.unit = user.property._id),
        (formData.block = user.property.block._id),
        (formData.group = user.group),
        (formData.permission = true),
        (formData.response = true),
        (formData.approvedBy = userState.user._id);
      setLoading(true);
      try {
        const { data } = await axiosInstance.post(
          "/visitors/new/member",
          formData
        );
        setExpectedVisitors([...expectedVisitors, ...data]);
        setLoading(false);
        socket.emit("expectedVisitor", ...data);
        toast.success(`${formData.visitors.length} visitor/s expected!`);
        resetForm();
      } catch (e) {
        console.log(e.response.data);
        toast.error(`Something went Wrong!`);
      }
    },
  });

  const handleAddVisitor = () => {
    formik.setFieldValue("visitors", [
      ...formik.values.visitors,
      { visitorName: "", visitorPhoneNumber: "" },
    ]);
  };

  const handleRemoveVisitor = (id) => {
    formik.setFieldValue(
      "visitors",
      formik.values.visitors.filter((e, i) => i !== id)
    );
  };

  const columns = [
    { header: "Name", accessor: "visitorName" },
    { header: "Phone", accessor: "visitorPhoneNumber" },
  ];

  const visitorsExpected = useMemo(
    () =>
      expectedVisitors.map((e) => {
        return {
          id: e._id,
          visitorName: e.visitorName,
          visitorPhoneNumber: e.visitorPhoneNumber,
        };
      }),
    [expectedVisitors]
  );

  useEffect(() => {
    (async () => {
      setLoading1(true);
      try {
        const { data } = await axiosInstance.post("/visitors/expected", {
          group: user.group,
          unit: user.property?._id,
        });
        setExpectedVisitors(data);
        setLoading1(false);
      } catch (e) {
        console.log(e.response);
      }
    })();
  }, []);

  return (
    <div className="md:mt-[80px] sm:mt-auto">
      <div className="flex justify-center rounded-md bg-indigo-500/40 md:mx-[30dvw] sm:mx-[15dvw] shadow-md z-10">
        <form
          className="flex flex-col p-2"
          name="visitorType"
          onSubmit={formik.handleSubmit}
        >
          <select
            className="p-1 mt-2 m-1 border-2 border-blue-500/70 rounded-[4px] text-black font-medium"
            value={formik.values.visitorType}
            name="visitorType"
            onChange={formik.handleChange}
          >
            <option value={""}>Select Visitor Type</option>
            {visitorTypes.map((e) => (
              <option key={e._id} value={e._id}>
                {e.type}
              </option>
            ))}
          </select>
          <div className="h-4 font-semibold text-sm pl-0.5 text-red-500 mb-0.5 ">
            {formik.errors.visitorType}
          </div>
          {formik.values.visitors.map((e, i) => (
            <div key={i} className="flex">
              <div className="flex flex-col">
                <input
                  type="text"
                  name={`visitors[${i}].visitorName`}
                  value={formik.values.visitors[i].visitorName}
                  onChange={formik.handleChange}
                  placeholder="Name"
                  className={`p-1 m-1  rounded-[4px] border-blue-500/70 border-2 outline-none`}
                />
                <div className="h-4 font-semibold text-sm pl-0.5 text-red-500 mb-0.5 ">
                  {formik.errors.visitors &&
                    formik.errors.visitors[i]?.visitorName}
                </div>
              </div>
              <div className="flex flex-col">
                <input
                  type="number"
                  name={`visitors[${i}].visitorPhoneNumber`}
                  value={formik.values.visitors[i].visitorPhoneNumber}
                  onChange={formik.handleChange}
                  placeholder="Phone Number"
                  className={`p-1 m-1  rounded-[4px] border-blue-500/70 border-2 outline-none`}
                />
                <div className="h-4 font-semibold text-sm pl-0.5 text-red-500 mb-0.5 ">
                  {formik.errors.visitors &&
                    formik?.errors?.visitors[i]?.visitorPhoneNumber}
                </div>
              </div>
              {i >= 1 && (
                <div className="flex h-[45px] items-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveVisitor(i)}
                    className=" text-justify px-[2px] border-[1.5px] bg-white font-semibold  border-black rounded hover:bg-black hover:text-white"
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-center">
            <input
              type="button"
              onClick={handleAddVisitor}
              value={"+Visitor"}
              className="px-2 py-1 rounded mt-2 m-1 bg-white text-black font-semibold cursor-pointer w-fit border-2 border-blue-500/80 hover:bg-blue-500 hover:text-white hover:border-white"
            />
          </div>
          <div className="flex justify-center">
            <Button
              text={"Submit"}
              loading={loading}
              submitHandler={formik.handleSubmit}
              style={` cursor-pointer border-2 border-purple-600 bg-indigo-500 rounded font-semibold mt-2 m-1 w-fit px-3 py-1  hover:text-white hover:border-white`}
            />
          </div>
        </form>
      </div>
      {loading1 &&<div className="flex h-[100px] justify-center items-end"> <BarLoader /></div>}
      {!loading && !_.isEmpty(expectedVisitors) && (
        <div className="flex justify-center w-full mb-5">
          <CustomTable columns={columns} data={visitorsExpected} width={500} />
        </div>
      )}
    </div>
  );
};
