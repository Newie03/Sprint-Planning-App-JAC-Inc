import * as dbRtns from "./db_routines.js";

const addADocument = async () => {
  try {
    let db = await dbRtns.getDBInstance();
    console.log(`established connection for ${db.databaseName} on Atlas`);
    let results = await dbRtns.addOne(db, "testcollection", {
      property1: "somedata",
    });
    let count = await dbRtns.count(db, "testcollection");
    results.insertedId
      ? console.log(
          `added new document to testcollection, there are currently ${count} documents in the 
testcollection`
        )
      : console.log("document not added");
  } catch (err) {
    console.log(err);
  } finally {
    process.exit(); // we don't need to disconnect, connection pooled
  }
};
addADocument();
