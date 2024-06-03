import React from "react";
import useIsMobile from "~/hooks/utils/useIsMobile";

import type { NextPage } from "next";
import { TitleAndDropdown } from "~/components/landing-page/TitleAndDropdown";

const LandingPage: NextPage = () => {
  const { isMobile } = useIsMobile()

  return (
    <>
      {isMobile ? (
        <div className="landing-page-gradient-1 relative flex h-max w-screen flex-col items-center font-lora ">
        <div className="mt-12 flex h-1/5 w-11/12 rounded border p-4 text-center">
          <div className="text-xl font-bold">
            To start analyzing documents, please switch to a larger screen!
          </div>
        </div>
        </div>
      ) : (
        <TitleAndDropdown />
      )}
    </>
  );
};
export default LandingPage;
