import React, { Fragment } from "react";
import "./styles.css";
import { Header, Footer } from "./Layouts";
import { GraphApp } from "./Graph";
import { MyContextProvider } from "./MyContext";

const App = () => {
  return (
    <Fragment>
      <MyContextProvider>
        <Header />
        <GraphApp />
        <Footer />
      </MyContextProvider>
    </Fragment>
  );
};

export default App;
