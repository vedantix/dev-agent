export interface GeneratedPatch {
    files: GeneratedPatchFile[];
  }
  
  export interface GeneratedPatchFile {
    path: string;
    content: string;
  }