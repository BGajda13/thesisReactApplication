import React from "react";
import { MyContext } from "../MyContext";
function Footer() {
  const [state, setState] = React.useContext(MyContext);
  return <div />;
}

export default Footer;
