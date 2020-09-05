/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const ObjectId = require('mongodb').ObjectID;

module.exports = function (app) {

  const createOne = require('../modules/db-module.js').createOne;
  const find = require('../modules/db-module.js').find;
  const findOneAndUpdate = require('../modules/db-module.js').findOneAndUpdate;
  const deleteOne = require('../modules/db-module.js').deleteOne;
  const deleteMany = require('../modules/db-module.js').deleteMany;

  app.route('/api/issues/:project')

    .get(function (req, res) {
      var project = req.params.project;

      const { ...data } = req.body;

      find(project, data, function (err, result) {
        if (err) console.log('An ERROR occured');

        res.json(result)
      })
    })

    .post(function (req, res) {
      var project = req.params.project;

      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.send('Missing Values!');
      }
      else {

        let data = {
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to !== '' ? req.body.assigned_to : '',
          status_text: req.body.status_text !== '' ? req.body.status_text : 'In QA',
          open: true,
          created_on: new Date(),
          updated_on: new Date()
        }

        createOne(project, data, function (err, result) {
          if (err) res.send(err);
          else if (result) res.json(result);
        })
      }
    })

    .put(function (req, res) {
      var project = req.params.project;

      let id = req.body._id;

      if (!id) res.send('No id');
      else if (!req.body) res.send('No Update Fields Sent');
      else {
        let data = { _id: ObjectId(id) };

        const { _id, ...options } = req.body;

        if (options.open === 'false') { options.open = false; }
        options.updated_on = new Date();

        findOneAndUpdate(project, data, options, function (err, result) {

          if (result) res.json(result);
          else if (err) res.json(err)
        })
      }
    })

    .delete(function (req, res) {
      var project = req.params.project;

      let id = req.body._id;

      if (!id) res.send('No id');
      else {
        let data = { _id: ObjectId(id) };

        deleteOne(project, data, function (err, result) {
          if (err) res.json(err);
          else if (result) res.json(result);
        })
      }
    });
};