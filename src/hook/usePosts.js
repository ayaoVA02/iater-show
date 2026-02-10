// src/hooks/usePosts.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const fetchPostById = async (postId) => {
  if (!postId) throw new Error("postId is required");
  const res = await axios.get(`http://localhost:3000/api/posts/${postId}`);
  return res.data;
};

export const usePostById = (postId) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
    enabled: !!postId, // only run if postId is truthy
  });
};
