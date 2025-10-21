import apiClient from "./apiClient";

export interface WordItem {
  id: string; 
  English: string;
  Turkish: string;
  "Example Sentence": string;
  Image?: File | string; 
}


export const getAllWords = async (): Promise<WordItem[]> => {
  const response = await apiClient.get("/words");
  return response.data.data;
};

export const getByIdword = async (Id: string) => {
  const response = await apiClient.get(`/words/${Id}`);
  return response.data.data;
}

export const createWord = async (formData: FormData) => {
  const response = await apiClient.post("/words/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteWord = async (Id: string) => {
  const response = await apiClient.delete(`/words/delete/${Id}`);
  return response.data;
};



