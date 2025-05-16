import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ToastContext } from "./context/ToastContext";
import { CircularProgress, Snackbar } from "@mui/material";

export default function Content() {
  const { likedToasts, loading, serverError,setServerError } = useContext(ToastContext);
  return (
    <Box sx={{ marginTop: 3 }}>
      {serverError ? (
        <Snackbar
          open={serverError}
          autoHideDuration={3000}
           onClose={() => setServerError(false)}
          message="Server Error! Please try again."
        />
      ) : (
        ""
      )}
      <Typography variant="h4">Liked Form Submissions</Typography>
      {loading ? (
        <Box
          sx={{
            height: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={30} color="inherit" />
        </Box>
      ) : (
        <Typography variant="body1" sx={{ fontStyle: "italic", marginTop: 1 }}>
          {likedToasts?.length === 0 ? (
            <Typography
              variant="body1"
              sx={{ fontStyle: "italic", marginTop: 1 }}
            >
              No liked submissions yet.
            </Typography>
          ) : (
            likedToasts?.map((toast) => (
              <Box
                key={toast.id}
                sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
              >
                <Typography>
                  {toast.data.firstName} {toast.data.lastName} (
                  {toast.data.email})
                </Typography>
              </Box>
            ))
          )}
        </Typography>
      )}
    </Box>
  );
}
