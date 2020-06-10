import React, { useState } from "react";
import CustomNode from "./Graph/CustomNode"
const INITIAL_STATE = {
  showMenu: false,
  selectedTab: 0,
  showCtxMenu: false,
  showCtxMenuNode: false,
  nodeIdToDelete: null,
  showCtxMenuLink: false,
  linkIndexToDelete: null,
  menuY: 0,
  menuX: 0,
  clickedY: 0,
  clickedX: 0,
  data: {
    nodes: [{ id: "Root", opacity: 0.000001 }],
    links: []
  },
  config: {
    staticGraphWithDragAndDrop: true,
    height: "100%",
    width: "100%",
    marginBottom: "0px",
    style: {
      backgroundColor: "green",
      flexDirection: "column",
      flex: 1
    },
    maxZoom: 8,
    minZoom: 1,
    nodeHighlightBehavior: true,
    node: {
      color: "#d3d3d3",
        fontColor: "black",
        fontSize: 12,
        fontWeight: "normal",
        highlightColor: "red",
        highlightFontSize: 12,
        highlightFontWeight: "bold",
        highlightStrokeColor: "SAME",
        highlightStrokeWidth: 1.5,
        labelProperty: "name",
        mouseCursor: "pointer",
        opacity: 1,
        renderLabel: false,
        size: 700,
        strokeColor: "none",
        strokeWidth: 1.5,
        svg: "",
        symbolType: "circle",
      viewGenerator: node => <CustomNode person={node} />
    },
    link: {
      highlightColor: "lightblue",
      strokeWidth: 5,
      color: "#1E90FF",
    }
  },
  personTabFromDrawer: false,
  personTabEditNodeId: null,
  personTabEditMode: false,
  personTab: {
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: null,
    deathDate: null,
    descritpion: "",
    generation: 0,
    avatarId: null,
    avatarSrc: ""
  },
  relationsTabEditMode: false,
  relationsTabRelationId: null,
  relationsTabTypes: [],
  relationsTabErrors: {
    firstPerson: false,
    secondPerson: false
  },
  relationsTab: {
    source: "",
    target: "",
    relationType: "",
    startedDate: null,
    endedDate: null,
    descritpion: ""
  },
  linkIdToDelete: null,
  nodeIdToDelete: null
};

const MyContext = React.createContext([{}, () => {}]);

const MyContextProvider = props => {
  const [state, setState] = useState(INITIAL_STATE);
  return (
    <MyContext.Provider value={[state, setState]}>
      {props.children}
    </MyContext.Provider>
  );
};

function openDrawer(setState) {
  setState(state => ({
    ...state,
    showMenu: true,
    personTabFromDrawer: true
  }));
}
function closeDrawer(setState) {
  setState(state => ({
    ...state,
    showMenu: false
  }));
}
function changeSelectedTab(setState, selectedTab) {
  setState(state => ({
    ...state,
    selectedTab: selectedTab
  }));
}

function handleFormChange(setState, form, event) {
  setState(state => ({
    ...state,
    [form]: {
      ...state[form],
      [event.target.id]: event.target.value
    }
  }));
}

function addNewNode(setState, newNode) {
  setState(state => ({
    ...state,
    data: {
      ...state.data,
      nodes: [...state.data.nodes, newNode]
    }
  }));
}

function editNode(setState, editedNodes) {
  setState(state => ({
    ...state,
    data: {
      ...state.data,
      nodes: editedNodes
    }
  }));
}

function clearPersonTab(setState) {
  setState(state => ({
    ...state,
    personTabEditNodeId: null,
    personTabEditMode: false,
    personTabFromDrawer: false,
    personTab: INITIAL_STATE.personTab,
  }));
}
function clearRelationsTab(setState) {
  setState(state => ({
    ...state,
    relationsTabErrors: INITIAL_STATE.relationsTabErrors,
    relationsTabEditMode: false,
    relationsTabRelationIndex: null,
    relationsTab: INITIAL_STATE.relationsTab
  }));
}
function setRelationsTabErrors(setState, errBool) {
  setState(state => ({
    ...state,
    relationsTabErrors: {
      source: errBool,
      target: errBool
    }
  }));
}
function addNewRelation(newLink, setState) {
  setState(state => ({
    ...state,
    data: {
      ...state.data,
      links: [...state.data.links, newLink]
    }
  }));
}
function editLink(editedLink,state, setState) {
  var links = state.data.links;
  const index = state.data.links.map(l => l.id).indexOf(editedLink.id);
  links[index] = editedLink;
  setState(state => ({
    ...state,
    data: {
      ...state.data,
      links: links
    }
  }));
}
export {
  MyContext,
  MyContextProvider,
  openDrawer,
  closeDrawer,
  changeSelectedTab,
  handleFormChange,
  addNewNode,
  editNode,
  clearPersonTab,
  clearRelationsTab,
  setRelationsTabErrors,
  addNewRelation,
  editLink
};
