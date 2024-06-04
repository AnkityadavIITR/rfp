import React, { useEffect, useState} from "react";
import { useRouter } from "next/router";
import { PdfFocusProvider } from "~/context/pdf";
import AccordionComponent from "~/components/document/Accordion";
import DisplayMultiplePdfs from "~/components/pdf-viewer/DisplayMultiplePdfs";
import { BiArrowBack } from "react-icons/bi";
import useIsMobile from "~/hooks/utils/useIsMobile";
import { backendClient } from "~/api/backend";
import { useQuestionStore, clearData } from "~/utils/store/questionStore";
import MobileWarningComponent from "~/components/document/MobileWarningComponent";


export interface Chunk{
  chunk:string,
  fileUrl:string,
  pageno:number,
  pdfName:string,
}

export interface PdfData{
  pdf_name:string,
  url:string
}

export interface ApiResponse {
  message: string;
  Chunks: Chunk[]; 
  pdf_data: PdfData[];
}


export default function Conversation() {
  const router = useRouter();
  const { isMobile } = useIsMobile();
  const [loading, setLoading] = useState(true);

  const queries = useQuestionStore((state) => state.queries);
  const responses = useQuestionStore((state) => state.responses);
  const addResponse = useQuestionStore((state) => state.addResponse);
  const activeQuery = useQuestionStore((state) => state.activeQuery);
  const addApiResponse = useQuestionStore((state) => state.addApiResponse);
  const apiResponse = useQuestionStore((state) => state.apiResponse);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all(
          queries.map(async (question, index) => {
            const responseData = await backendClient.fetchQuery(
              "/processquery/",
              question
            );
            if (responseData) {
              // const response = formatMarkdown(responseData.message);
              addResponse(responseData.message);
              addApiResponse({
                reponseMessage: responseData.message,
                chunks: responseData.Chunks,
                files: responseData.pdf_data.map((data: PdfData) => ({
                  id: data.pdf_name,
                  filename: data.pdf_name,
                  url: data.url,
                })),
              });
              setLoading(false);
            }
          })
        );
      } catch (e) {
        console.error(e);
      }
    };

    if (queries.length > responses.length) {
      fetchData().then(() => {
        console.log('Response saved successfully');
    }).catch((error) => {
        console.error('Failed to save response', error);
    });
    }
  }, []);

  useEffect(() => {
    if (apiResponse[0] && apiResponse.length > 0) {
      setLoading(false);
    }
  }, []);

  const formatMarkdown = (message: string): string => {
    const lines: string[] = message.split("\n");
    let formattedMessage = "";

    let currentHeadingLevel = 2;
    let currentNumber: number | null = null;
    let currentSubheadingLetter= "a";

    lines.forEach((line: string) => {
      const numberMatch = line.match(/^\d+\./);
      if (numberMatch && numberMatch[0]) {
        const number: string | undefined = numberMatch[0].match(/^\d+/)?.[0];
        if (number) {
          const newNumber = parseInt(number, 10);
          if (currentNumber === null || newNumber !== currentNumber) {
            currentNumber = newNumber;
            formattedMessage += `### ${currentNumber}. ${line
              .slice(line.indexOf(".") + 1)
              .trim()}\n\n`;
            currentSubheadingLetter = "a";
          } else {
            formattedMessage += `   ${currentSubheadingLetter}. ${line
              .slice(line.indexOf(".") + 1)
              .trim()}\n`;
            currentSubheadingLetter = String.fromCharCode(
              currentSubheadingLetter.charCodeAt(0) + 1
            );
          }
        }
      } else if (line.startsWith("- **")) {
        formattedMessage += `      - ${line.slice(4).trim()}\n`;
      } else if (line.startsWith("   - ")) {
        formattedMessage += `         - ${line.slice(5).trim()}\n`;
      } else if (line.trim() !== "") {
        formattedMessage += `${line.trim()}\n\n`;
        currentHeadingLevel = 2;
      }
    });

    return formattedMessage;
  };

  if (isMobile) {
    return (
      <MobileWarningComponent/>
    );
  }

  return (
    <>
      <PdfFocusProvider>
        <div className="flex h-[100vh] w-full items-center">
          <div className="flex h-[100vh] w-[44vw] flex-col items-center border-r-2 bg-white">
            <div className="flex h-[44px] w-full items-center justify-between border-b-2 ">
              <div className="flex w-full items-center justify-between">
                <button
                  onClick={() => {
                    clearData();
                    router
                      .push("/")
                      .catch(() => console.error("error navigating home"));
                  }}
                  className="ml-4 flex items-center justify-center rounded px-2 font-light text-[#9EA2B0] hover:text-gray-900"
                >
                  <BiArrowBack className="mr-1" /> Back to Document Selection
                </button>
              </div>
            </div>
            <div className="flex h-full w-[44vw] flex-grow flex-col overflow-scroll ">
              <div className="mx-auto  flex w-[100%] flex-col text-left">
                <AccordionComponent/>
              </div>
            </div>
          </div>
          <div className="h-[100vh] w-full">
            {loading ? (
              <div className="flex h-full w-full items-center justify-center ">
                <h1>loading...</h1>
              </div>
            ) : (
              <DisplayMultiplePdfs
                fileUrls={apiResponse[activeQuery]?.files || []}
              />
            )}
          </div>
        </div>
      </PdfFocusProvider>
    </>
  );
}
