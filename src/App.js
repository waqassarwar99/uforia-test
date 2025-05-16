import React from "react";
import Container from "@mui/material/Container";

import Header from "./Header";
import Content from "./Content";

import ToastContainer from "./ToastComponent";
import { ToastProvider } from "./context/ToastContext";
function App() {
  return (
    <ToastProvider>
      <Header />
      <Container>
        <Content />
        <ToastContainer />
      </Container>
    </ToastProvider>
  );
}

export default App;
