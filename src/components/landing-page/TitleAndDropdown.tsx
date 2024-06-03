"use client";
import { useRouter } from "next/router";
import React, { useState} from "react";
import {Trash2} from "lucide-react";
import { useQuestionStore } from "~/utils/store/questionStore";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Container from "../ui/container";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { useAuth,useUser, useSession  } from "@clerk/nextjs";
import Auth from "./auth";
import ExcelInput from "./ExcelInput";
import Image from "next/image";
import PdfInput from "./PdfInput";
import { checkUserRole } from "~/utils/userUtils";

export const TitleAndDropdown = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const { session } = useSession();
  // console.log("session",session);
  
  const userRole = checkUserRole(session);
  // console.log("userrole",userRole);  

  const queries = useQuestionStore((state) => state.queries);
  const addQuestions = useQuestionStore((state) => state.addQueries);
  const removeQuery = useQuestionStore((state) => state.removeQuery);

  const [loading, setLoading] = useState<boolean>(false);

  const [value, setValue] = useState<string>("Qna");
  const [inputQuestion, setInputQuestion] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");

  const handleSubmit = () => {
    if (!inputQuestion) {
        setInputQuestion(true);
    } else {
        if (!userId) {
            document.getElementById("auth")?.click();
        } else {
            void router.push("/documents");
        }
    }
};

  const className = () => {
    if (inputQuestion) {
      return queries.length > 0
        ? "min-w-[80px] text-[14px]"
        : "bg-gray-400 text-[14px] hover:bg-gray-400";
    } else {
      return "min-w-[80px] text-[14px]";
    }
  };
  return (
    <div className="landing-page-gradient-1 font-lora relative flex h-max w-screen flex-col items-center ">
      <Auth />
      <div className="absolute left-8 top-8 w-[180px]">
        <Image src="/speex.png" alt="Logo" width={180} height={20} />
      </div>

      <Container>
        <div className="mt-[72px] flex flex-col items-center">
          <h1 className="text-center text-4xl font-medium">
            Solution Consultant App
          </h1>
        </div>
      </Container>
      <Container className="mt-4">
        <div className="mx-auto flex w-[80%] gap-x-4">
          <Avatar className="mx-auto">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              className=""
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="text-center text-[22px]">
            Hello! I&pos;m Pedro, your assistant for cybersecurity, GDPR, and more.
            How can I help you today?
          </div>
        </div>
      </Container>
      <Tabs
        value={value}
        onValueChange={setValue}
        className="mx-auto mt-5 w-[400px]"
      >
        <TabsList className="w-full">
          <TabsTrigger
            value="Qna"
            className={value == "Qna" ? "w-1/2 bg-slate-800 shadow-md" : "w-1/2"}
          >
            Q & A
          </TabsTrigger>
          <TabsTrigger value="excel" className="w-1/2">
            Queries
          </TabsTrigger>
          {userId && userRole === "org:admin" && (
            <TabsTrigger value="pdf" className="w-1/2">
              Docs
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="Qna">
          <div className="mt-5 flex min-h-[320px] w-full flex-col items-center justify-center rounded-[16px] border-2 bg-white shadow-xl ">
            <div className="mx-4 mb-2 mt-4 self-start">
              <h1 className="text-center text-[18px] font-medium">
                In Q&apos;A, you can ask me questions, and I&apso;ll do my best to provide
                helpful answers.
              </h1>
            </div>
            <div className="mt-2 flex  w-full flex-col justify-start gap-y-6 p-4 ">
              {inputQuestion && (
                <div className="flex gap-x-2">
                  <Input
                    type="text"
                    placeholder="ask question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      addQuestions([question]);
                      setQuestion("");
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
              {inputQuestion && queries.length > 0 && (
                <div className="mx-auto flex flex-col gap-y-2">
                  {queries.map((query, index) => {
                    return (
                      <div key={index} className="flex gap-x-3">
                        <p className="text-[14px] font-medium">{index + 1}</p>
                        <p className="line-clamp-2 w-[280px] text-[14px] font-medium">
                          {query}
                        </p>
                        <div className="flex">
                          <Trash2
                            onClick={() => removeQuery(index)}
                            className="my-auto"
                            size={16}
                            strokeWidth={1.25}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mx-auto flex">
                <Button
                  disabled={inputQuestion && loading}
                  className={className()}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <div className="flex  items-center justify-center">
                      <div className="loader h-3 w-3 rounded-full border-2 border-gray-200 ease-linear"></div>
                    </div>
                  ) : (
                    <>{!inputQuestion ? "Ask a question" : "submit"}</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        {userId && userRole === "org:admin" && (
          <TabsContent value="pdf">
            <PdfInput setValue={setValue}/>
          </TabsContent>
        )}

        <TabsContent value="excel">
          <ExcelInput/>
        </TabsContent>
      </Tabs>
    </div>
  );
};
