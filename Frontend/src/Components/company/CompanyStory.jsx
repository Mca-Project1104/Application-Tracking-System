import React from "react";

const Company = () => {
  const companyLogos = [
    "slack",
    "framer",
    "netflix",
    "google",
    "linkedin",
    "instagram",
    "facebook",
  ];

  return (
    <>
      <style>{`
                .marquee-inner {
                    animation: marqueeScroll linear infinite;
                }

                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }

                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>

      <div className="overflow-hidden   p-3 w-full  relative mx-2  select-none">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none " />
        <div
          className="marquee-inner h-auto flex will-change-transform w-full"
          style={{ animationDuration: "7s" }}
        >
          <div className="flex">
            {[...companyLogos, ...companyLogos].map((company, index) => (
              <img
                key={index}
                src={`https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/${company}.svg`}
                alt={company}
                className="w-full h-full object-cover dark:opacity-80 mx-8"
                draggable={false}
              />
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none " />
      </div>
    </>
  );
};

export default Company;
