import React, { Component, useEffect } from "react";
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
import "date-fns";
import { getRelationshipTypes,addRelation,editRelation } from "../../dataAccess";
import FormHelperText from "@material-ui/core/FormHelperText";
import {
  MyContext,
  clearRelationsTab,
  closeDrawer,
  addNewRelation,
  editLink,
  setRelationsTabErrors,
  handleFormChange
} from "../MyContext";

export default function RelationsTab() {
  const [state, setState] = React.useContext(MyContext);
  useEffect(() => {
    getRelationshipTypes().then(t => {
      setState(state => ({
        ...state,
        relationsTabTypes: t
      }));
    });
    return () => {
      clearRelationsTab(setState);
    };
  }, [state.selectedTab]);

  function handleChange(event) {
    handleFormChange(setState, "relationsTab", event);
  }

  function setErrors(errbool) {
    setRelationsTabErrors(setState, errbool);
  }

  function handlePickChange(event) {
    if (event.target.id === "target") {
      if (state.relationsTab.source === event.target.value) {
        if (event.target.value !== null) setErrors(true);
        else setErrors(false);
      } else {
        setErrors(false);
      }
    } else {
      if (state.relationsTab.target === event.target.value) {
        if (event.target.value !== null) setErrors(true);
        else setErrors(false);
      } else {
        setErrors(false);
      }
    }
    handleChange({
      target: {
        id: event.target.id,
        value: event.target.value
      }
    });
  }

  const handleAddRelation = () => {
    var newLink = state.relationsTab;
    newLink.relationShipTypeId = parseInt(newLink.relationType, 10);
    newLink.individual_ID_1 = parseInt(newLink.source, 10);
    newLink.individual_ID_2 = parseInt(newLink.target, 10);
    addRelation(newLink).then(newLinkFromApi =>{
      newLinkFromApi.source = newLinkFromApi.individual_ID_1
      newLinkFromApi.target = newLinkFromApi.individual_ID_2
      addNewRelation(newLinkFromApi, setState);
    })
    clearAndClose();
  };
  const handleEditRelation = () => {
    var editedLink = state.relationsTab;
    editedLink.relationShipTypeId = parseInt(editedLink.relationType, 10);
    editedLink.individual_ID_1 = parseInt(editedLink.source, 10);
    editedLink.individual_ID_2 = parseInt(editedLink.target, 10);
    editedLink.id = state.relationsTabRelationId;
    editRelation(state.relationsTab).then(editedRelation =>{
      editedRelation.source = editedRelation.individual_ID_1
      editedRelation.target = editedRelation.individual_ID_2
      editLink(editedRelation,state, setState)
    });
    
    clearAndClose();
  };
  const clearAndClose = () => {
    clearRelationsTab(setState);
    closeDrawer(setState);
  };
  return (
    <Container component="main" maxWidth="xs">
      <div>
        <form noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl
                variant="outlined"
                fullWidth
                error={state.relationsTabErrors.source}
              >
                <InputLabel htmlFor="outlined-source-native-simple">
                  Osoba
                </InputLabel>
                <Select
                  native
                  value={state.relationsTab.source}
                  onChange={handlePickChange}
                  label="Osoba"
                  inputProps={{
                    name: "source",
                    id: "source"
                  }}
                >
                  <option aria-label="None" value={undefined} />
                  {state.data.nodes.map(person => (
                    <option value={person.id}>
                      {person.id +
                        " " +
                        person.firstName +
                        " " +
                        person.lastName}
                    </option>
                  ))}
                </Select>
                {state.relationsTabErrors.source && (
                  <FormHelperText>Wybrano tę samą osobę</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl
                variant="outlined"
                fullWidth
                error={state.relationsTabErrors.target}
              >
                <InputLabel>Osoba</InputLabel>
                <Select
                  native
                  value={state.relationsTab.target}
                  onChange={handlePickChange}
                  label="Osoba"
                  inputProps={{
                    name: "target",
                    id: "target"
                  }}
                >
                  <option aria-label="None" value={undefined} />
                  {state.data.nodes.map(person => (
                    <option value={person.id}>
                      {person.id +
                        " " +
                        person.firstName +
                        " " +
                        person.lastName}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>
                  Rodzaj relacji
                </InputLabel>
                <Select
                  native
                  value={state.relationsTab.relationType}
                  onChange={handleChange}
                  label="Rodzaj relacji"
                  inputProps={{
                    name: "relationType",
                    id: "relationType"
                  }}
                >
                  <option value={undefined} />
                  {state.relationsTabTypes.map(t => (
                    <option value={t.id}>{t.typeDescription}</option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex">
                <Grid item xs={12} sm={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      clearable
                      disableFuture
                      views={["year", "month", "date"]}
                      openTo="year"
                      format="dd/MM/yyyy"
                      label="Data rozpoczęcia"
                      value={state.relationsTab.startedDate}
                      onChange={() => {}}
                      onAccept={date => {
                        handleChange({
                          target: {
                            id: "startedDate",
                            value: moment(date).format()
                          }
                        });
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      clearable
                      disableFuture
                      views={["year", "month", "date"]}
                      id="deathDate"
                      openTo="year"
                      format="dd/MM/yyyy"
                      label="Data zakończenia"
                      minDate={state.relationsTab.startedDate}
                      value={state.relationsTab.endedDate}
                      onChange={() => {}}
                      onAccept={date => {
                        handleChange({
                          target: {
                            id: "endedDate",
                            value: moment(date).format()
                          }
                        });
                      }}
                      onClear={() => {
                        handleChange({
                          target: {
                            id: "endedDate",
                            value: null
                          }
                        });
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                label="Opis"
                multiline
                rows={4}
                placeholder="Opis relacji"
                variant="outlined"
                value={state.relationsTab.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                disabled={Object.values(state.relationsTabErrors).find(x => x)}
                fullWidth
                variant="contained"
                color="primary"
                onClick={
                  state.relationsTabEditMode
                    ? handleEditRelation
                    : handleAddRelation
                }
              >
                {state.relationsTabEditMode ? "Zapisz zmiany" : "Dodaj relację"}
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
