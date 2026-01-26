import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [token, setTokenState] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Helper: set token in state + axios + localStorage
  const setToken = (newToken) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Fetch logged-in user
  const fetchUser = async () => {
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    try {
      setLoadingUser(true);
      const { data } = await axios.get("/api/user/data"); // token sent automatically

      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message || "Failed to fetch user");
        setUser(null);
        setToken(null); // remove invalid token
      }
    } catch (error) {
      console.error("Fetch user error:", error.response || error.message);
      toast.error(error.response?.data?.message || error.message);
      setUser(null);
      setToken(null); // clear invalid token
    } finally {
      setLoadingUser(false);
    }
  };

  // Create new chat
  const createNewChat = async () => {
    if (!user) return toast.error("Login to create a new chat");

    try {
      navigate("/");
      await axios.get("/api/chat/create"); // token sent automatically
      await fetchUsersChats();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Fetch user chats
  const fetchUsersChats = async () => {
    try {
      const { data } = await axios.get("/api/chat/get"); // token sent automatically

      if (data.success) {
        setChats(data.chats || []);

        // If no chats, create one
        if (data.chats.length === 0) {
          await createNewChat();
          return fetchUsersChats();
        } else {
          setSelectedChat(data.chats[0]);
        }
      } else {
        toast.error(data.message || "Failed to fetch chats");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Theme handling
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch chats when user changes
  useEffect(() => {
    if (user) {
      fetchUsersChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user]);

  // Fetch user on token change
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setLoadingUser(false);
    }
  }, [token]);

  const value = {
    navigate,
    user,
    setUser,
    fetchUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    createNewChat,
    loadingUser,
    fetchUsersChats,
    token,
    setToken,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
