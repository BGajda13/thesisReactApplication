const baseAddress = "https://localhost:5001/api/v1/";
const individuals = "Individuals";
const relationships = "Relationship";
const pictures = "Pictures";
const relationshipTypes = "RelationshipTypes";

const getRelationshipTypes = () => {
  return fetch(baseAddress + relationshipTypes).then((response) =>
    response.json()
  );
};

const getRelationships = () => {
  return fetch(baseAddress + relationships).then((response) => response.json());
};
const addRelation = (newRelation) => {
  console.log("Trying to add", JSON.stringify(newRelation));
  return fetch(baseAddress + relationships, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newRelation),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("Added relation:", res);
      return res;
    });
};
const editRelation = (editedRelation) => {
  console.log("Trying to put", JSON.stringify(editedRelation));
  return fetch(baseAddress + relationships + "/" + editedRelation.id, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedRelation),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("Edited relation:", res);
      return res;
    });
};
const deleteRelation = (id) => {
  console.log("Trying to delete", id);
  return fetch(baseAddress + relationships + "/" + id, {
    method: "delete",
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("Deleted relation:", res);
      return res;
    });
};
const getPersons = () => {
  return fetch(baseAddress + individuals).then((response) => response.json());
};
const addPerson = (newNode) => {
  console.log("Trying to add", JSON.stringify(newNode));
  return fetch(baseAddress + individuals, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newNode),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("Added person:", res);
      return res;
    });
};

const editPerson = (editedNode) => {
  console.log("Trying to put", JSON.stringify(editedNode));
  return fetch(baseAddress + individuals + "/" + editedNode.id, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedNode),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("Edited person:", res);
      return res;
    });
};

const deletePerson = (id) => {
  console.log("Trying to delete", id);
  return fetch(baseAddress + individuals + "/" + id, {
    method: "delete",
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("Deleted person:", res);
      return res;
    });
};

const addAvatar = (avatar) => {
  avatar = {
    pictureBlob: avatar,
  };
  return fetch(baseAddress + pictures, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(avatar),
  }).then(response => response.json())
  .then((res) => {
    console.log("Added avatar:", res);
    return res;
  });
};
const getAvatar = (id) => {
  return fetch(baseAddress + pictures + "/" + id).then((response) =>
    response.json()
  );
};
export {
  getPersons,
  getRelationshipTypes,
  addPerson,
  getRelationships,
  editPerson,
  deletePerson,
  addRelation,
  editRelation,
  deleteRelation as deleteLink,
  addAvatar,
  getAvatar,
};
