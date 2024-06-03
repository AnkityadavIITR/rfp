import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FileUrl {
  id:string,
  filename: string;
  url: string;
}
interface Chunk{
  chunk:string,
  fileUrl:string,
  pdfName:string,
  pageno:number
}
interface Response{
  reponseMessage:string,
  files?:FileUrl[],
  chunks:Chunk[],
}


export interface QuestionState {
  queries: string[];
  activeQuery:number;
  apiResponse:Response[];
  askQuestion:boolean;
  setAskQuestion:(ask:boolean)=>void;
  addApiResponse:(res:Response)=>void;
  setActiveQuery:(num:number)=>void;
  fileUrls:FileUrl[];
  addFileUrl: (files: FileUrl) => void;
  responses: string[];
  setResponseAtIndex: (index: number, newResponse: string) => void;
  addQueries: (questions: string[]) => void;
  removeQuery: (index:number)=>void;
  addResponse: (response: string) => void;
  clearQueries: () => void;

  setQuestions: (questions: string[]) => void;
}

const useQuestionStore = create<QuestionState>()(
  persist(
    (set) => ({
      queries: [],
      fileUrls:[],
      activeQuery:0,
      askQuestion:false,
      setAskQuestion(ask) {
        set({askQuestion:ask});
      },
      apiResponse:[],
      setActiveQuery:(num)=>
        set((state)=>({
          activeQuery:num,
        })),
        addApiResponse: (res) =>
          set((state) => ({
            apiResponse: [...state.apiResponse, res],
          })),
      addFileUrl: (file) => 
        set((state) => {
          const existingFile = state.fileUrls.find((f) => f.filename === file.filename);
          if (!existingFile) {
            return { fileUrls: [...state.fileUrls, file] };
          }
          return state;
        }),
      responses: [],
      setResponseAtIndex: (index, newResponse) =>
        set((state) => {
          const updatedResponses = [...state.responses];
          updatedResponses[index] = newResponse;
          return { responses: updatedResponses };
        }),
      removeQuery: (index)=>
        set((state)=>{
          const newQueries=state.queries.filter((_,i)=>i!==index);
          return {queries:newQueries};
        }),
      addQueries: (questions) =>
        set((state) => ({


          queries: [...state.queries, ...questions],
        })),
      addResponse: (response) =>
        set((state) => ({
          responses: [...state.responses, response],
        })),

      clearQueries: () => set({ queries: [] }),

      setQuestions: (queries) => set({ queries }),
    }),
    {
      name: 'questions-storage', 
      getStorage: () => localStorage,
    }
  )
);

function clearData() {
  useQuestionStore.setState({ queries: [], responses: [],fileUrls:[],apiResponse:[],askQuestion:false }); // Reset Zustand store
  localStorage.removeItem('questions-storage'); // Remove item from local storage
}


export { useQuestionStore, clearData };