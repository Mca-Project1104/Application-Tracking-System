import React from "react";
import { useAppContext } from "../context/AppProvider";

const NotFound = () => {
  const { navigate } = useAppContext();
  return (
    <>
      <div className="relative top-50 text-center ">
        <p className="text-5xl"></p>
        <p className=" animate-pulse  text-black dark:text-white text-4xl ">
          {" "}
          Page Not Found!
        </p>
        <p
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-800 cursor-pointer"
        >
          Go to Dashboard
        </p>
      </div>
    </>
  );
};

export default NotFound;
