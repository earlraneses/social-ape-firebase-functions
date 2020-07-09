const { db } = require("../util/admin");
const constants = require("../util/constants");

exports.getAllScreams = (request, response) => {
  db.collection(constants.collection.screams)
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
        });
      });
      return response.json(screams);
    })
    .catch((err) => console.error(err));
};

exports.postOneScream = (request, response) => {
  const scream = {
    body: request.body.body,
    userHandle: request.user.handle,
    createdAt: new Date().toISOString(),
    userImage: request.user.imageUrl,
    likeCount: 0,
    commentCount: 0,
  };

  db.collection(constants.collection.screams)
    .add(scream)
    .then((doc) => {
      const responseScream = scream;
      responseScream.screamId = doc.id;
      return response.json(responseScream);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: "something went wrong" });
    });
};

exports.getScream = (request, response) => {
  let screamData = {};

  db.doc(`/${constants.collection.screams}/${request.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Scream not found" });
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection("comments")
        .where("screamId", "==", request.params.screamId)
        .orderBy("createdAt", "desc")
        .get();
    })
    .then((data) => {
      screamData.comments = [];
      data.forEach((doc) => {
        screamData.comments.push(doc.data());
      });
      return response.json(screamData);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.commentOnScream = (request, response) => {
  if (request.body.body.trim() === "")
    return response.status(400).json({ error: "Must not be empty" });

  const comment = {
    body: request.body.body,
    createdAt: new Date().toISOString(),
    screamId: request.params.screamId,
    userHandle: request.user.handle,
    userImage: request.user.imageUrl,
  };

  db.doc(`/${constants.collection.screams}/${request.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Scream not found" });
      }
      let commentCount = doc.data().commentCount || 0;
      return doc.ref.update({ commentCount: commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(comment);
    })
    .then(() => {
      return response.json(comment);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: "Something went wrong" });
    });
};

exports.likeScream = (request, response) => {
  const likeDocument = db
    .collection(constants.collection.likes)
    .where("userHandle", "==", request.user.handle)
    .where("screamId", "==", request.params.screamId)
    .limit(1);

  const screamDocument = db.doc(
    `/${constants.collection.screams}/${request.params.screamId}`
  );

  let screamData;

  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      }
      return response.status(404).json({ error: "Scream not found" });
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection(constants.collection.likes)
          .add({
            screamId: request.params.screamId,
            userHandle: request.user.handle,
          })
          .then(() => {
            if (screamData.likeCount == null) screamData.likeCount = 0;
            screamData.likeCount++;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            return response.json(screamData);
          });
      }
      return response.status(400).json({ error: "Scream already liked" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.unlikeScream = (request, response) => {
  const likeDocument = db
    .collection(constants.collection.likes)
    .where("userHandle", "==", request.user.handle)
    .where("screamId", "==", request.params.screamId)
    .limit(1);

  const screamDocument = db.doc(
    `/${constants.collection.screams}/${request.params.screamId}`
  );

  let screamData;

  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      }
      return response.status(404).json({ error: "Scream not found" });
    })
    .then((data) => {
      if (!data.empty) {
        return db
          .doc(`/${constants.collection.likes}/${data.docs[0].id}`)
          .delete()
          .then(() => {
            if (screamData.likeCount == null) screamData.likeCount = 1; // initialize to 1 so that it will result to 0
            screamData.likeCount--; 
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            return response.json(screamData);
          });
      }
      return response.status(400).json({ error: "Scream not yet liked" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.deleteScream = (request, response) => {
  const document = db.doc(`/${constants.collection.screams}/${request.params.screamId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: 'Scream not found' });
      }
      if (doc.data().userHandle !== request.user.handle) {
        return response.status(403).json({ error: 'Unauthorized' });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      return response.json({ message: 'Scream deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};
