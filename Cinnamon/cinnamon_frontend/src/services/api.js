import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

export const askChatbot = async (question) => {
  const res = await api.post('/api/chat/ask', { question }); // ✅ correct endpoint
  return res.data; // { answer, score }
};

export default api;
