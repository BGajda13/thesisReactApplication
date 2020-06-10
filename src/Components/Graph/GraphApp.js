import React, { useEffect } from "react";
import { Graph } from "react-d3-graph";
import { getPersons, getRelationships, deletePerson, deleteLink , editPerson} from "../../dataAccess";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { MyContext, editNode } from "../MyContext";
function GraphApp() {
  const [state, setState] = React.useContext(MyContext);
  /* GET PERSONS FROM API, AND LINKS BETWEEN THEM */
  const getFromApi = () =>{
    getPersons()
      .then((persons) => {
        persons.map((person) => {
          return person;
        });
        console.log("Fetched:", persons);
        return persons;
      })
      .then((persons) =>
        getRelationships().then((relations) => {
          relations.map((r) => {
            r.source = r.individual_ID_1;
            r.target = r.individual_ID_2;
            return r;
          });
          console.log("Fetched: ", relations);
          setState((state) => ({
            ...state,
            data: {
              nodes: persons,
              links: relations,
            },
          }));
        })
      );
  }
  useEffect(getFromApi, []); //Refresh when state data changes

  /* Dodanie do SVG prawego klikniecia myszą */
  useEffect(() => {
    document
      .getElementsByName("svg-container-graph-id")[0]
      .removeEventListener("contextmenu", () => {});
    document
      .getElementsByName("svg-container-graph-id")[0]
      .addEventListener("contextmenu", (e) => {
        // Odsianie side-effectu w postaci klikania w nody
        if (e.target.nodeName === "svg") {
          //Wyłączenie domyslnego menu kontekstowego
          e.preventDefault(true);
          var pt = e.target.createSVGPoint();
          pt.x = e.x;
          pt.y = e.y;
          var clicked = pt.matrixTransform(e.target.getScreenCTM().inverse());
          var movedElementAttr = document
            .getElementById("graph-id-graph-container-zoomable")
            .getAttribute("transform");
          var movedPosition = {
            x: 0,
            y: 0,
            scale: 1,
          };
          console.log("element ", movedElementAttr);
          if (movedElementAttr != null) {
            movedPosition.x = parseInt(
              movedElementAttr.slice(
                movedElementAttr.indexOf("(") + 1,
                movedElementAttr.indexOf(",")
              ),
              10
            );
            movedPosition.y = parseInt(
              movedElementAttr.slice(
                movedElementAttr.indexOf(",") + 1,
                movedElementAttr.indexOf(")")
              ),
              10
            );
            movedPosition.scale = parseFloat(
              movedElementAttr.slice(
                movedElementAttr.lastIndexOf("(") + 1,
                movedElementAttr.lastIndexOf(")")
              )
            );
            console.log("moved X", movedPosition.x);
            console.log("moved Y", movedPosition.y);
            console.log("moved scale", movedPosition.scale);
          }
          clicked.x = (clicked.x - movedPosition.x) / movedPosition.scale;
          clicked.y = (clicked.y - movedPosition.y) / movedPosition.scale;
          console.log("Clicked: (" + clicked.x + ", " + clicked.y + ")");
          setState((state) => ({
            ...state,
            showCtxMenu: true,
            menuY: e.y,
            menuX: e.x,
            clickedX: clicked.x,
            clickedY: clicked.y,
          }));
        }
      });
  }, []);

  const onClickNode = function (nodeId) {
    console.log(`clicked nodeId ${nodeId}`, typeof nodeId);
    nodeId = parseInt(nodeId, 10);
    const index = state.data.nodes.map((n) => n.id).indexOf(nodeId);
    console.log(index);
    const clickedNode = { ...state.data.nodes[index] };
    console.log("clicked node", clickedNode);
    // SHOW MENU WITH EDIT
    setState((state) => ({
      ...state,
      showMenu: true,
      selectedTab: 0,
      personTabEditMode: true,
      personTabEditNodeId: nodeId,
      personTab: clickedNode,
    }));
  };
  const onClickLink = function (source, target) {
    //OPEN DRAWER WITH EDIT
    source = parseInt(source, 10);
    target = parseInt(target, 10);
    console.log(`Clicked link between ${source} and ${target}`);
    const index = state.data.links.findIndex((l) => {
      return l.source === source && l.target === target;
    });
    const relation = state.data.links[index];
    console.log(relation);
    setState((state) => ({
      ...state,
      showMenu: true,
      selectedTab: 1,
      relationsTabEditMode: true,
      relationsTabRelationId: relation.id,
      relationsTab: {
        source: relation.source,
        target: relation.target,
        relationType: relation.relationShipTypeId,
        startedDate: relation.startedDate,
        endedDate: relation.endedDate,
        descritpion: relation.details,
      },
    }));
  };

  const onRightClickLink = (e, source, target) => {
    e.preventDefault(true);
    source = parseInt(source, 10);
    target = parseInt(target, 10);
    console.log(e.pageX, e.pageY, `Link between ${source} and ${target}`);
    const link = state.data.links.find((l) => {
      return l.source === source && l.target === target;
    });
    console.log("to delete:", link);
    setState((state) => ({
      ...state,
      showCtxMenuLink: true,
      linkIdToDelete: link.id,
      menuY: e.pageY,
      menuX: e.pageX,
    }));
  };
  const delLink = () => {
    if (window.confirm("Usunąć relację?")) {
      deleteLink(state.linkIdToDelete).then(getFromApi);
    }
    handleClose();
  };

  const onRightClickNode = (e, nodeId) => {
    e.preventDefault(true);
    console.log(e.pageX, e.pageY, nodeId);
    setState((state) => ({
      ...state,
      showCtxMenuNode: true,
      nodeIdToDelete: nodeId,
      menuY: e.pageY,
      menuX: e.pageX,
    }));
  };
  const delNode = () => {
    if (window.confirm("Usunąć osobę?")) {
      deletePerson(state.nodeIdToDelete).then(getFromApi);
    }
    handleClose();
  };
  const onNodePositionChange = function (nodeId, x, y) {
    x = parseInt(x,10)
  y = parseInt(y,10)
    console.log(
      `Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`,
      typeof nodeId
    );
    const index = state.data.nodes.map((n) => n.id).indexOf(nodeId);
    const changedNode = { ...state.data.nodes[index] };
    changedNode.x = x;
    changedNode.y = y;
    const newNodes = state.data.nodes;
    newNodes[index] = changedNode;
    setState((state) => ({
      ...state,
      data: {
        ...state.data,
        nodes: newNodes,
      },
    }));
    editPerson(changedNode);
  };
  const handleClose = () => {
    setState((state) => ({
      ...state,
      showCtxMenu: false,
      showCtxMenuNode: false,
      showCtxMenuLink: false,
    }));
  };
  const addNode = () => {
    setState((state) => ({
      ...state,
      showMenu: true,
      personTabEditMode: false,
      selectedTab: 0,
    }));
    handleClose();
  };
  const arrange = () => {
    const nodes = [...state.data.nodes];
    nodes.map((n) => (n.y = 150));
    setState((state) => ({
      ...state,
      data: {
        ...state.data,
        nodes: nodes,
      },
    }));
    console.log(nodes);
  };

  return (
    <React.Fragment>
      <Menu
        id="ctxMenu"
        anchorReference="anchorPosition"
        anchorPosition={{
          left: state.menuX,
          top: state.menuY,
        }}
        keepMounted
        open={state.showCtxMenu}
        onClose={handleClose}
        onContextMenu={(e) => {
          e.preventDefault(true);
          handleClose();
        }}
      >
        <MenuItem onClick={addNode}>Dodaj osobę</MenuItem>
        <MenuItem onClick={arrange}>Wyrównaj</MenuItem>
        
        <MenuItem onClick={delNode}>Usuń Osobę</MenuItem>
      </Menu>
      <Menu
        id="ctxMenuLink"
        anchorReference="anchorPosition"
        anchorPosition={{
          left: state.menuX,
          top: state.menuY,
        }}
        keepMounted
        open={state.showCtxMenuLink}
        onClose={handleClose}
        onContextMenu={(e) => {
          e.preventDefault(true);
          handleClose();
        }}
      >
        <MenuItem onClick={delLink}>Usuń relację</MenuItem>
      </Menu>
      <Graph
        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
        data={state.data}
        config={state.config}
        onClickNode={onClickNode}
        onClickLink={onClickLink}
        onRightClickLink={onRightClickLink}
        onRightClickNode={onRightClickNode}
        onNodePositionChange={onNodePositionChange}
      />
    </React.Fragment>
  );
}

export default GraphApp;
 /*
 <MenuItem
          onClick={() => {
            console.log(state);
            handleClose();
          }}
        >
          Debug state
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.location.reload();
            handleClose();
          }}
        >
          Reload
        </MenuItem>
      </Menu>
      <Menu
        id="ctxMenuNode"
        anchorReference="anchorPosition"
        anchorPosition={{
          left: state.menuX,
          top: state.menuY,
        }}
        keepMounted
        open={state.showCtxMenuNode}
        onClose={handleClose}
        onContextMenu={(e) => {
          e.preventDefault(true);
          handleClose();
        }}
      >*/