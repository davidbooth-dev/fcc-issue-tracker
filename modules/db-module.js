//const mongo = require('mongodb').mongoClient;
const MongoClient = require('mongodb');

const dboptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Setup database
function connectToDB(done) {
  MongoClient.connect(process.env.MONGO_URI, dboptions, function (err, client) {
    if (err) {
      console.log("Database error: " + err);
    }
    else {
      console.log("Connected to database");

      done(client);
    }
  });
}

// DB Functions
const find = function (project, data, done) {
  let db;
  connectToDB(function (dbclient) {
    const client = dbclient

    db = client.db('nodedb');
    db.collection(project).find(data).toArray(function (err, docs) {

      done(null, docs);
    });
  });
}

const createOne = function (project, data, done) {
  let db;
  connectToDB(function (dbclient) {
    const client = dbclient

    db = client.db('nodedb');
    db.collection(project).insertOne(data, function (err, result) {
      if (err) done(err, null);
      else if(result.insertedCount === 0 ) done('failed to insert document', null);
      else done(null, result.ops);
    });
  });
}

const findOneAndUpdate = function (project, data, options, done) {
  if (data.length === 0) done(null, 'No updated Field Sent')

  let db;
  connectToDB(function (dbclient) {
    const client = dbclient

    db = client.db('nodedb');
    db.collection(project).findOneAndUpdate(
      data,
      { $set: options },
      { new: false },
      (err, doc) => {
        //console.log('doc: ', doc, 'err: ', err);
        if (err) done('', null);
        else if (doc) done(null, doc.value);
      }
    )
  });
}

const deleteOne = function (project, data, done) {
  if (!data._id) done('id error', null);

  let db;
  connectToDB(function (dbclient) {
    const client = dbclient

    db = client.db('nodedb');
    db.collection(project).deleteOne(data, function (err, result) {
   
      if (err) done(err, null);
      else if (result.result.n === 0) done({ failure: 'could not delete ' + data._id }, null);
      else done(null, { success: 'deleted ' + data._id });
    });   
  });
}

const deleteMany = function (project, done) {
  let db;
  connectToDB(function (dbclient) {
    const client = dbclient

    db = client.db('nodedb');
    db.collection(project).deleteMany(function (err, result) {
      let count = result.result.n;

      if (err) done(err, null);
      else if (count === 0) done({ failure: 'could not delete documents' }, null);
      else done(null, { success: 'deleted ' + count + 'documents' });
    });
  });
}

exports.find = find;
exports.createOne = createOne;
exports.findOneAndUpdate = findOneAndUpdate;
exports.deleteOne = deleteOne;
exports.deleteMany = deleteMany;