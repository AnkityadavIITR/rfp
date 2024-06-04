import React from "react";
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

const AccordionComponent = () => {
    const queries = useQuestionStore((state) => state.queries);
    const responses = useQuestionStore((state) => state.responses);
    const setActiveQuery = useQuestionStore((state) => state.setActiveQuery);
    const activeQuery = useQuestionStore((state) => state.activeQuery);

    const handleSaveResponse = async (): Promise<void> => {
        if (queries[activeQuery] && editableResponse != "") {
            try {
                const res = await backendClient.saveQna("/save-qna/", queries[activeQuery] || "", editableResponse);
                // console.log("Res", res);
                setIsEditing(false)
            } catch (e) {
                console.log("error saving response", e)
            }
        }
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editableResponse, setEditableResponse] = useState("");
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
                    className={responses[i] ? "bg-orange-200 text-left" : "bg-gray-200 text-left"}
                    key={i}
                >
                    <AccordionTrigger
                        className={responses[i] ? "p-[10px] text-left" : "p-[10px] text-left"}
                        onClick={() => setActiveQuery(i)}
                    >
                        {query}
                    </AccordionTrigger>
                    <AccordionContent className="mb-0 bg-white p-[10px] text-gray-700">
                        {responses[i] ? (
                            <>
                                {!isEditing ? (
                                    <>
                                        <div className="w-full flex border bg-blue-100 rounded-xl relative"
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}>
                                            <ReactMarkdown className="p-2">
                                                {responses[i]}
                                            </ReactMarkdown>
                                            {
                                                isHovered &&
                                                <div className="absolute bg-blue-100 top-[8px] right-[8px] hover:cursor-pointer" onClick={() => {
                                                    setIsEditing(true);
                                                    setEditableResponse(responses[i] || "");
                                                }}>
                                                    <SquarePen strokeWidth={1.25} size={20} />
                                                </div>
                                            }
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
                                                    handleSaveResponse().then(() => {
                                                        console.log('Response saved successfully');
                                                    }).catch((error) => {
                                                        console.error('Failed to save response', error);
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
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default AccordionComponent;
