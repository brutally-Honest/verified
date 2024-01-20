import { useState, memo, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
const OptimizedTable = (props) => {
  const { columns, url, paginate,actions } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [tableData,setTableData]=useState([])
  const elementsPerPage = 5;
  useEffect(() => {
    //api call
    (async () => {
      try {
        const { data } = await axios.get(
          `https://dummyjson.com/users?limit=${elementsPerPage}&skip=${
            (currentPage - 1) * elementsPerPage
          }`
        );
        console.log(data);
        setTableData(data.users)
        setTotalPages(Math.ceil(data.total/elementsPerPage))
      } catch (e) {
        console.log(e.response);
      }
    })();
  }, [currentPage]);

  const handleAction=(rowData)=>{
    console.log(rowData);
  }
  return (
    <div className="flex flex-col items-center my-1.5">
      <div className={`overflow-x-auto  shadow-md rounded-lg w-[600px]`}>
        <table className="w-full">
          <thead className=" bg-gray-700 text-sm text-gray-400">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className=" p-2 ">
                  {column.header}
                </th>
              ))}
              {actions && (
                <th key={"Action"} className="p-2">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {tableData?.map((row) => (
              <tr
                key={row.id}
                className="border-b bg-gray-800 border-gray-700 "
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-2 py-2 ${
                      colIndex === 0 ? "font-medium" : "font-light"
                    } text-center text-white `}
                  >
                    <span className={`p-1 rounded `}>
                      {row[column.accessor]}
                    </span>
                  </td>
                ))}
                {!_.isEmpty(actions) && (
                  <>
                    {actions.name === "Verify" && (
                      <td>
                        <button
                          onClick={() =>
                            navigate(
                              `/visitors/expected/verification/${row.id}`,
                              { state: { row } }
                            )
                          }
                          className="p-2 text-blue-600 hover:underline"
                        >
                          {actions.name}
                        </button>
                      </td>
                    )}
                    {actions.name !== "Verify" && (
                      <td>
                        <button
                          onClick={() => handleAction(row)}
                          className="p-2 text-blue-600 hover:underline"
                        >
                          {actions.name}
                        </button>
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginate && (
        <div className="flex items-center justify-between p-2 border-gray-200">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  disabled={currentPage <= 1 ? true : false}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className={`cursor-pointer relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
                >
                  ◀️
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`cursor-pointer relative z-10 inline-flex items-center border ${
                      i === currentPage - 1
                        ? "bg-indigo-600"
                        : "text-indigo-400"
                    } px-4 py-2 text-sm font-semibold  focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage >= totalPages ? true : false}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={`cursor-pointer relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
                >
                  ▶️
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(OptimizedTable);
