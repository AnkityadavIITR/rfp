import { usePdfFocus } from "~/context/pdf";
import { Citation } from "~/types/conversation";
import { useQuestionStore } from "~/utils/store/questionStore";

export const ChunkDisplay = () => {
    const { setPdfFocusState } = usePdfFocus();
    const apiResponse = useQuestionStore((state) => state.apiResponse);
    const activeQuery = useQuestionStore((state) => state.activeQuery);

    const handleCitationClick = (
      documentId: string,
      pageNumber: number,
      citation: Citation
    ) => {
      console.log("documentid", documentId);
      console.log("pgn", pageNumber);
      console.log("cita", citation);
      setPdfFocusState({ documentId, pageNumber, citation });
    };

    return (
      <div className="mt-1 flex gap-x-2 overflow-auto">
        {apiResponse[activeQuery] &&
          apiResponse[activeQuery]?.chunks.map((d, i) => {
            return (
              <div
              key={i}
                onClick={() =>
                  handleCitationClick(
                    d.pdfName || "",
                    d.pageno,
                    {
                      documentId:
                        d.pdfName || "",
                      snippet: d.chunk || "",
                      pageNumber: d.pageno,
                      highlightColor: "yellow",
                    } as Citation
                  )
                }
                className="line-clamp-2 w-[200px] rounded-md border bg-gray-200 p-1 text-[12px] text-gray-700 hover:cursor-pointer hover:bg-slate-200"
              >
                <p className="border-l-4 border-yellow-400 pl-1">{d.chunk}</p>
              </div>
            );
          })}
      </div>
    );
  };