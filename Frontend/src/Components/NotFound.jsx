import React from "react";

const NotFound = () => {
  return (
    <>
      <div className="relative top-50 text-center ">
        <p className="text-5xl">🔍</p>
        <p className=" animate-pulse  text-black dark:text-white text-4xl ">
          {" "}
          Page Not Found!
        </p>
      </div>
    </>
  );
};

export default NotFound;
