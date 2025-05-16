// components/ToastContainer.jsx
import React, { Fragment, useContext } from "react";
import { ToastContext } from "./context/ToastContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { SnackbarContent } from "@mui/material";

export default function ToastComponent() {
  const { toasts, handleLikedToast, handleCloseToast } =
    useContext(ToastContext);
  const action = (toast) => {
    return (
      <Fragment>
        <Button
          color="primary"
          size="small"
          onClick={() => handleLikedToast(toast)}
        >
          Like
        </Button>
        <Button
          color="inherit"
          size="small"
          onClick={() => handleCloseToast(toast.id)}
        >
          X
        </Button>
      </Fragment>
    );
  };

  return (
    <Box>
      {toasts?.map((toast, index) => (
        <Box
          key={toast.id}
          sx={{
            position: "fixed",
            bottom: 20 + index * 55,
            right: 20,
            width: 400,
            zIndex: 10,
          }}
        >
          <SnackbarContent
            message={
              <Fragment>
                {toast.data.firstName} {toast.data.lastName}
                <br />
                {toast.data.email}
              </Fragment>
            }
            action={action(toast)}
          />
        </Box>
      ))}
    </Box>
  );
}
