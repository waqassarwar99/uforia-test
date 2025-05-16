import { createContext, useState, useEffect } from "react";

import {
  onMessage,
  saveLikedFormSubmission,
  fetchLikedFormSubmissions,
} from "../service/mockServer";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [likedToasts, setLikedToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onMessage((toast) => {
      setToasts((prev) => [...prev, toast]);
    });

    //fetching the previously liked posts and as fetchLikedFormSubmissions is an asynchoronous funtion which returns a promise we are using .then that if the promise was successfull store the liked toast in use state and if the server gives any error it's handled in the catch block
    fetchLikedFormSubmissions()
      .then((res) => {
        setLikedToasts(res.formSubmissions || []);
      })
      .catch((error) => {
        console.log(error, "server error");
      });
  }, []);

  //updating the likedtoast array when user clicks the like button
  const handleLikedToast = async (toast) => {
    setLoading(true)
    const updated = {
      ...toast,
      data: { ...toast.data, liked: true },
    };
    try {
      await saveLikedFormSubmission(updated);
      setLikedToasts((prev) => [...prev, updated]);
      setLoading(false)
      handleCloseToast(updated.id);
    } catch (err) {
      console.error("Failed to like submission", err);
    }
  };

  const handleCloseToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider
      value={{ toasts, likedToasts, loading,handleLikedToast, handleCloseToast }}
    >
      {children}
    </ToastContext.Provider>
  );
};
