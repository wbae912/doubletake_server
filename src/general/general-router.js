const express = require('express');
const GeneralService = require('./general-service');
const xss = require('xss');
const path = require('path');
const { requireAuth } = require('../middleware/jwt-auth');

const generalRouter = express.Router();
const jsonParser = express.json();

const serializeList = list => ({
  id: list.id,
  title: xss(list.title),
  items: xss(list.items),
  user_id: list.user_id
});

generalRouter
  .route('/')
  .get(requireAuth, (req,res,next) => {
    const db = req.app.get('db');
    GeneralService.getAllListsForUser(db, req.user.id)
      .then(lists => {
        return res.status(200).json(lists.map(serializeList));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req,res,next) => {
    const { title, items } = req.body;

    if(!title) {
      return res.status(400).json({error: 'Title is required'});
    }
    if(!items) {
      return res.status(400).json({error: 'Items is required'});
    }

    const db = req.app.get('db');
    const newList = { title, items };

    newList.user_id = req.user.id;

    GeneralService.postList(db, newList)
      .then(list => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${list.id}`))
          .json(serializeList(list));
      })
      .catch(next);
  });

generalRouter
  .route('/:id')
  .all(requireAuth)
  .all((req,res,next) => {
    const db = req.app.get('db');
    const id = req.params.id;
    const user_id = req.user.id;

    GeneralService.getSpecificListForUser(db,id,user_id)
      .then(list => {
        if(!list) {
          return res.status(400).json({error: 'List does not exist'});
        }
        res.list = list;
        next();
      })
      .catch(next);
  })
  .get((req,res,next) => {
    return res.status(200).json(serializeList(res.list));
  })
  .delete((req,res,next) => {
    const db = req.app.get('db');
    const id = req.params.id;

    GeneralService.deleteList(db,id)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req,res,next) => {
    const { title, items } = req.body;
    const editList = { title, items };
    
    const db = req.app.get('db');
    const id = req.params.id;

    const numberOfValues = Object.values(editList).filter(Boolean).length;
    if(numberOfValues === 0) {
      return res.status(400).json({error: 'Request body must contain either title or items'});
    }

    GeneralService.editList(db,id,editList)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  });

module.exports = generalRouter;