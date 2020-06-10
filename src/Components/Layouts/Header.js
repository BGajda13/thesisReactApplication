import React, {useContext} from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "./Menu";
import { MyContext, openDrawer } from "../MyContext";

function Header() {
  const [state, setState] = useContext(MyContext);
  return (
    <div id="header">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={()=>openDrawer(setState)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Drzewo Rodzinne</Typography>
        </Toolbar>
      </AppBar>
      <Menu />
    </div>
  );
}

export default Header;
