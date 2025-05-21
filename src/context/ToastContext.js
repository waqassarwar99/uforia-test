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
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    const unsubscribe = onMessage((toast) => {
      // Prevent adding the same toast twice
      setToasts((prev) => {
        if (prev.some((t) => t.id === toast.id)) return prev;
        return [...prev, toast];
      });
    });

    //fetching the previously liked posts and as fetchLikedFormSubmissions is an asynchoronous funtion which returns a promise we are using .then that if the promise was successfull store the liked toast in use state and if the server gives any error it's handled in the catch block
    setLoading(true);
    fetchLikedFormSubmissions()
      .then((res) => {
        setLikedToasts(res.formSubmissions || []);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error, "server error");
        setLoading(false);
        if (error.status === 500) {
          setServerError(true);
          //  setToasts([]);
        }
      });
    // Clean up on unmount if onMessage supports it
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe(); // Make sure mockServer supports it
      }
    };
  }, []);

  //updating the likedtoast array when user clicks the like button
  const handleLikedToast = async (toast) => {
    setLoading(true);
    const updated = {
      ...toast,
      data: { ...toast.data, liked: true },
    };

    try {
      await saveLikedFormSubmission(updated);
      setLikedToasts((prev) => [...prev, updated]);
      setLoading(false);
      handleCloseToast(updated.id);
    } catch (err) {
      console.error("Failed to like submission", err);
      setLoading(false);
      setServerError(true);
      // setToasts([])
    }
  };

  const handleCloseToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        likedToasts,
        loading,
        serverError,
        setServerError,
        handleLikedToast,
        handleCloseToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};
