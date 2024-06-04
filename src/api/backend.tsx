import type { Message } from "~/types/conversation";
import type { BackendDocument } from "~/types/backend/document";
import type { SecDocument } from "~/types/document";
import type { PdfData, Chunk } from "~/pages/documents";

const backendUrl: string = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export interface SaveQnaResponse {
  message: string;
}

export interface ProcessQueryResponse {
  id: string;
  message: string;
  pdf_data: PdfData[];
  Chunks: Chunk[];
  page: number[];
}

export interface UploadExcelResponse {
  message: string;
  details: string[];
}

export interface UploadPdfResponse {
  message: string;
  details: string[];
}

class BackendClient {
  private async get(endpoint: string): Promise<Response> {
    const url = backendUrl + endpoint;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res;
  }

  private async post(endpoint: string, body?: unknown): Promise<Response> {
    const url = backendUrl + endpoint;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res;
  }

  public async postExcelFile(endpoint: string, files: File[]): Promise<UploadExcelResponse | undefined> {
    const url = backendUrl + endpoint;
    // console.log("excels", files);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return res.json() as Promise<UploadExcelResponse>;
    } catch (e) {
      console.log("got error on excel upload", e);
      return undefined;
    }
  }

  public async postPdfFile(endpoint: string, files: File[]): Promise<UploadPdfResponse | undefined> {
    const url = backendUrl + endpoint;
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return res.json() as Promise<UploadPdfResponse>;
    } catch (e) {
      console.log("error on pdf upload", e);
      return undefined;
    }
  }

  public async saveQna(endpoint: string, query: string, newAns: string): Promise<SaveQnaResponse | undefined> {
    const url = backendUrl + endpoint;
    const qna = {
      question: query,
      answer: newAns,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(qna),
      });
      if (!response.ok) {
        console.log("error saving qna");
        return undefined;
      }
      return response.json() as Promise<SaveQnaResponse>;
    } catch (e) {
      console.log("error saving qna", e);
      return undefined;
    }
  }

  public async fetchQuery(endpoint: string, query: string): Promise<ProcessQueryResponse | undefined> {
    const url = backendUrl + endpoint;
    const requestData = {
      query: query,
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json() as Promise<ProcessQueryResponse>;
    } catch (e) {
      console.log("error fetching query", e);
      return undefined;
    }
  }
}

export const backendClient = new BackendClient();
