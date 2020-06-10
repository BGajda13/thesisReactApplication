/* eslint-disable valid-jsdoc */
import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import {getAvatar} from "../../dataAccess"
import Tooltip from '@material-ui/core/Tooltip';
/**
 * Component that renders a person's name and gender, along with icons
 * @param {Object} props component props to render.
 */
function CustomNode({ person }) {
  const isMale = person.gender === 0;
  const hasAvatar = person.avatarId !== null;
  const [avatar, setAvatar] = useState("");
if(hasAvatar){
    getAvatar(person.avatarId).then(avatar=>{
        setAvatar(avatar.pictureBlob)
    })
}
  return (
  <Tooltip title={`${person.firstName} ${person.lastName}`}>
    <div className={`flex-container person-node ${isMale ? "male" : "female"}`}>
      <div className="name" style={{
          wordWrap:"break-word"
      }}>{person.firstName}</div>
          <Avatar
            alt="Avatar"
            src={avatar}
            style={{
              width: "25px",
              height: "25px",
              bottom: 0,
              position: "fixed",
              margin: "2px"
            }}
          />
    </div>
    </Tooltip>
  );
}

export default CustomNode;
