import { execFile } from "child_process";
import { create } from "zustand";

interface FileState {
  files: File[];
  excels:File[];
  selectedFiles: File[];
  addExcels:(file:File[])=>void;
  removeExcel:(index:number)=>void;
  selectFile: (file: File) => void;
  removeSelectedFile:(name:string)=>void;
  addFiles: (file: File[]) => void;
  deleteFile: (index: number) => void;
}

export const useFileStore = create<FileState>((set) => ({
  files: [],
  excels:[],
  selectedFiles: [],
  addExcels: (newFiles) => set((state) => ({ excels: [...state.excels, ...newFiles] })),  
  removeExcel:(index)=>
    set((state) => ({
      excels: state.excels.filter((_, i) => i !== index),
    })),
  selectFile: (file) => set((state) => ({ selectedFiles: [...state.selectedFiles, file] })),
  removeSelectedFile: (name) => set((state) => ({ selectedFiles: state.selectedFiles.filter((file) => file.name !== name) })),
  addFiles: (newFiles) => set((state) => ({ files: [...state.files, ...newFiles] })),
  deleteFile: (index) =>
    set((state) => ({
      files: state.files.filter((_, i) => i !== index),
    })),
}));