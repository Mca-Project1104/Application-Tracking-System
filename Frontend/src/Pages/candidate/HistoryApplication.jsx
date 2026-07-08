import React, { useEffect } from "react";
import { useAppContext } from "../../context/AppProvider";
import { getStatusColors } from "../../assets/dummydata.js";
import Loading from "../../Components/Loading/Loading.jsx";

const HistoryApplication = () => {
  const { applications, navigate } = useAppContext();
  return (
    <div>
      {applications.length > 0 ? (
        <div>
          {applications.map((item, idx) => {
            const statusColors = getStatusColors(item.status);
            return (
              <div
                key={item._id}
                className={`p-4 space-y-2 mb-2 m-1 border-2 dark:border-gray-100/15 border-black/10  ${item.status === "hired" ? "bg-black/3 dark:bg-black/20" : ""} rounded-2xl`}
              >
                <div
                  style={{ justifyContent: "space-between" }}
                  className="flex p-3  "
                >
                  <div className="flex space-x-3.5">
                    <img
                      src={item?.jobId?.company?.logo}
                      alt={item?.jobId?.name}
                      className="w-10 h-10 rounded-full "
                    />
                    <p
                      className="text-lg font-medium cursor-pointer hover:text-blue-600 "
                      onClick={() =>
                        navigate(`/candidate/application/${item._id}`)
                      }
                    >
                      {item?.jobId?.title}
                    </p>
                  </div>{" "}
                  <div className={` `}>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColors.badge}`}
                    >
                      {item?.status}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="line-clamp-2 text-sm">
                    {item?.jobId?.description}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item?.jobId?.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                  {["createdAt", "updatedAt"].map((date) => (
                    <div className="flex">
                      <svg
                        className="shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {new Date(item?.[date]).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <Loading detail={"Not Found"} />
        </div>
      )}
    </div>
  );
};

export default HistoryApplication;
