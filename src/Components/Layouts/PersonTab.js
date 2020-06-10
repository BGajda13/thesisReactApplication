import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import { DatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Box from "@material-ui/core/Box";
import moment from "moment";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import "date-fns";
import {
  MyContext,
  handleFormChange,
  editNode,
  closeDrawer,
  clearPersonTab,
  addNewNode,

} from "../MyContext";
import { addPerson, editPerson,  addAvatar, getAvatar } from "../../dataAccess";

export default function PersonTab() {
  const [state, setState] = React.useContext(MyContext);

  useEffect(()=>{
    if(state.personTab.avatarId !== null){
      getAvatar(state.personTab.avatarId).then(avatarBlob =>{
        setState(state=>({
          ...state,
          personTab:{
            ...state.personTab,
            avatarSrc: avatarBlob.pictureBlob
          }
        }))
      })
    }
  })
  useEffect(() => {
    return () => {
      clearPersonTab(setState);
      removeClickListener();
    };
  }, [state.selectedTab]);
  const handleChange = (event) => {
    handleFormChange(setState, "personTab", event);
  };
  const handleAddNewNode = (x, y) => {
    //perform checks?
    var newNode = state.personTab;
    console.log(state.personTab);
    newNode.gender = parseInt(newNode.gender, 10);
    newNode.generation = parseInt(newNode.generation, 10);
    addPerson(newNode).then((nodeFromApi) => {
      //Check where request came from, right click or drawer
      nodeFromApi.x = x === undefined ? state.clickedX : x;
      nodeFromApi.y = y === undefined ? state.clickedY : y;
      addNewNode(setState, nodeFromApi);
    });

    clearAndClose();
  };
  const handleAddNewNodeFromDrawer = () => {
    alert("wskaz miejsce");
    // add new click event listener
    // getClickedPosition, and then fire handleAddNew with x and y
    document
      .getElementsByName("svg-container-graph-id")[0]
      .addEventListener("click", getClickedPosition);
  };
  const getClickedPosition = function (e) {
    // Odsianie side-effectu w postaci klikania w nody
    if (e.target.nodeName === "svg") {
      var pt = e.target.createSVGPoint();
      pt.x = e.x;
      pt.y = e.y;
      console.log("pt", pt.x, pt.y, "e", e.x, e.y);
      var clicked = pt.matrixTransform(e.target.getScreenCTM().inverse());
      var movedElementAttr = document
        .getElementById("graph-id-graph-container-zoomable")
        .getAttribute("transform");
      var movedPosition = {
        x: 0,
        y: 0,
        scale: 1,
      };
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
      }
      clicked.x = (clicked.x - movedPosition.x) / movedPosition.scale;
      clicked.y = (clicked.y - movedPosition.y) / movedPosition.scale;
      console.log("Left clicked: ", clicked);
    }

    handleAddNewNode(clicked.x, clicked.y);

    removeClickListener();
  };
  const removeClickListener = () => {
    document
      .getElementsByName("svg-container-graph-id")[0]
      .removeEventListener("click", getClickedPosition);
  };
  const handleEditNode = () => {
    var newNode = state.personTab;
    newNode.id = state.personTabEditNodeId;
    editPerson(newNode).then((nodeFromApi) => {
      var newNodes = state.data.nodes;
      console.log("clear", newNodes);
      newNodes[newNodes.map((n) => n.id).indexOf(nodeFromApi.id)] = nodeFromApi;
      console.log("newNodes", newNodes);
      editNode(setState, newNodes);
    });

    clearAndClose();
  };
  const clearAndClose = () => {
    clearPersonTab(setState);
    closeDrawer(setState);
    removeClickListener();
  };

  return (
    <Container component="main" maxWidth="xs">
      <div>
        <form noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="Imię"
                autoFocus
                value={state.personTab.firstName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Nazwisko"
                name="lastName"
                value={state.personTab.lastName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="outlined-gender-native-simple">
                  Płeć
                </InputLabel>
                <Select
                  native
                  value={state.personTab.gender}
                  onChange={handleChange}
                  label="Płeć"
                  inputProps={{
                    name: "gender",
                    id: "gender",
                  }}
                >
                  <option value="" />
                  <option value={0}>Męzczyzna</option>
                  <option value={1}>Kobieta</option>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex">
                <Grid item xs={12} sm={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      disableFuture
                      views={["year", "month", "date"]}
                      openTo="year"
                      format="dd/MM/yyyy"
                      label="Data urodzin"
                      value={state.personTab.birthDate}
                      onChange={() => {}}
                      onAccept={(date) => {
                        handleChange({
                          target: {
                            id: "birthDate",
                            value: moment(date).format(),
                          },
                        });
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      disableFuture
                      views={["year", "month", "date"]}
                      id="deathDate"
                      openTo="year"
                      format="dd/MM/yyyy"
                      label="Data śmierci"
                      minDate={state.personTab.birthDate}
                      onChange={() => {}}
                      value={state.personTab.deathDate}
                      onAccept={(date) => {
                        handleChange({
                          target: {
                            id: "deathDate",
                            value: moment(date).format(),
                          },
                        });
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                id="generation"
                label="Generacja"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={state.personTab.generation}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={3} align="center" justify="center">
              <Avatar
                alt="Avatar"
                src={state.personTab.avatarSrc}
                style={{
                  width: "50px",
                  height: "50px",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} align="center" >
              <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  console.log(e.target.files[0]);
                  const reader = new FileReader();
                  reader.addEventListener("load", (event) => {
                    console.log(event.target.result);
                    //POST
                    addAvatar(event.target.result).then(res => {
                      console.log(res.id, res.pictureBlob)
                      setState(state =>({
                        ...state,
                        personTab:{
                          ...state.personTab,
                          avatarId: res.id,  
                          avatarSrc: res.pictureBlob
                        }
                      }))
                    })

                  });
                  reader.readAsDataURL(e.target.files[0]);
                }}
              />
              <label htmlFor="contained-button-file">
                <Button
                style={{height: "50px"}}
                  component="span"
                  fullWidth
                  variant="contained"
                  color="default"
                  startIcon={<AddAPhotoIcon />}
                >
                  Portret
                </Button>
              </label>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                label="Opis"
                multiline
                rows={4}
                placeholder="Opis osoby"
                variant="outlined"
                value={state.personTab.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => {
                  if (state.personTabEditMode) handleEditNode();
                  else if (state.personTabFromDrawer)
                    handleAddNewNodeFromDrawer();
                  else handleAddNewNode();
                }}
              >
                {state.personTabEditMode ? "Zapisz zmiany" : "Dodaj osobę"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={clearAndClose}
              >
                Anuluj
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
