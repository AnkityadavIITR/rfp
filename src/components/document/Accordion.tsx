import React, { use } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Button } from "../ui/button";
import ReactMarkdown from "react-markdown";
import { useQuestionStore } from "~/utils/store/questionStore";
import { useState } from "react";
import { ChunkDisplay } from "./ChunkDisplay";
import { backendClient } from "~/api/backend";
import { Textarea } from "../ui/textarea";
import { SquarePen } from "lucide-react";
import { Slider } from "../ui/slider";
import { PdfData } from "~/pages/documents";
import { SendHorizontal } from "lucide-react";

const AccordionComponent = () => {
  const queries = useQuestionStore((state) => state.queries);
  const responses = useQuestionStore((state) => state.responses);
  const setActiveQuery = useQuestionStore((state) => state.setActiveQuery);
  const activeQuery = useQuestionStore((state) => state.activeQuery);
  const apiResponse = useQuestionStore((state) => state.apiResponse);
  const changeApiResponse = useQuestionStore(
    (state) => state.changeApiResponse
  );
  const [score, setScore] = useState<number>(
    apiResponse[activeQuery]?.confidence_score || 80
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleSaveResponse = async (): Promise<void> => {
    if (queries[activeQuery] && editableResponse != "") {
      try {
        const res = await backendClient.saveQna(
          "/save-qna/",
          queries[activeQuery] || "",
          editableResponse
        );
        setIsEditing(false);
      } catch (e) {
        console.log("error saving response", e);
      }
    }
  };

  const handleQueryWithScore = async (): Promise<void> => {    
    if (queries[activeQuery]) {
      try {
        setLoading(true);
        const res = await backendClient.fetchQueryWithScore(
          "/processquery/",
          queries[activeQuery] || "",
          score
        );
        if (res) {
          const apiRes = {
            reponseMessage: res.message,
            confidence_score: score,
            chunks: res.Chunks,
            files: res.pdf_data.map((data: PdfData) => ({
              id: data.pdf_name,
              filename: data.pdf_name,
              url: data.url,
              type: data.type,
            })),
          };
          changeApiResponse(activeQuery, apiRes);
        }
      } catch (e) {
        console.log("error saving response", e);
      } finally {
        setLoading(false);
      }
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editableResponse, setEditableResponse] = useState("");
  const setActiveChunk = useQuestionStore((state) => state.setActiveChunk);
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Accordion
      type="single"
      collapsible
      className="flex flex-col gap-y-1"
      defaultValue={`item-0`}
    >
      {queries.map((query, i) => (
        <AccordionItem
          value={`item-${i}`}
          className={
            responses[i] ? "bg-orange-200 text-left" : "bg-gray-200 text-left"
          }
          key={i}
        >
          <AccordionTrigger
            className={
              responses[i] ? "p-[10px] text-left" : "p-[10px] text-left"
            }
            onClick={() => {
              setActiveQuery(i);
              setActiveChunk(apiResponse[i]?.chunks[0]?.chunk || "");
            }}
          >
            {query}
          </AccordionTrigger>
          <AccordionContent className="mb-0 bg-white p-[10px] text-gray-700">
            {!loading ? (
              <>
                {responses[i] ? (
                  <>
                    {!isEditing ? (
                      <>
                        <div
                          className="relative flex w-full rounded-xl border bg-blue-100"
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                        >
                          <ReactMarkdown className="p-2">
                            {responses[i]}
                          </ReactMarkdown>
                          {isHovered && (
                            <div
                              className="absolute right-[8px] top-[8px] bg-blue-100 hover:cursor-pointer"
                              onClick={() => {
                                setIsEditing(true);
                                setEditableResponse(responses[i] || "");
                              }}
                            >
                              <SquarePen strokeWidth={1.25} size={20} />
                            </div>
                          )}
                        </div>
                        <div className="mt-2 flex w-full gap-x-1">
                          <Slider
                            defaultValue={[score]}
                            max={100}
                            step={1}
                            onValueChange={(value) =>
                              setScore(value?.[0] || 80)
                            }
                          />
                          <h1 className="text-[16px] font-medium">{score}%</h1>
                        </div>
                        <div className="mt-2 flex justify-end w-full">
                            <Button
                              className={score===80 ?"px-[6px] py-1 opacity-50" : "px-[6px] py-1 "}
                              disabled={score==80}
                              onClick={() => {
                                handleQueryWithScore()
                                  .catch((error) => {
                                    console.error(
                                      "Failed to save response",
                                      error
                                    );
                                  });
                              }}
                            >
                              <SendHorizontal size={20} strokeWidth={1.25} />
                            </Button>
                          </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full">
                          <Textarea
                            value={editableResponse}
                            onChange={(e) =>
                              setEditableResponse(e.target.value)
                            }
                            className="h-32 w-full rounded border p-2"
                          />
                        </div>
                        <div className="mt-2 flex w-full gap-2">
                          <Button
                            className="self-end"
                            onClick={() => {
                              handleSaveResponse()
                                .then(() => {
                                  console.log("Response saved successfully");
                                })
                                .catch((error) => {
                                  console.error(
                                    "Failed to save response",
                                    error
                                  );
                                });
                            }}
                          >
                            Save Response
                          </Button>
                          <Button onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </div>
                      </>
                    )}
                    <ChunkDisplay />
                  </>
                ) : (
                  <>
                    <div className="loader h-4 w-4 rounded-full border-2 border-gray-200 ease-linear"></div>
                    <p className="mr-1">processing</p>
                  </>
                )}
              </>
            ) : (
              <div className="flex w-full justify-center">
                <div className="loader h-4 w-4 rounded-full border-2 border-gray-200 ease-linear"></div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionComponent;
