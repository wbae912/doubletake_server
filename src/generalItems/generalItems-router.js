const express = require('express');
const GeneralItemsService = require('./generalItems-service');
const xss = require('xss');
const path = require('path');
const { requireAuth } = require('../middleware/jwt-auth');

const generalItemsRouter = express.Router();
const jsonParser = express.json();

const serializeItem = (item) => ({
  id: item.id,
  item: xss(item.item),
  list_id: item.list_id
});

generalItemsRouter
  .route('/:list_id')
  .get(requireAuth, (req,res,next) => {
    const db = req.app.get('db');
    const list_id = req.params.list_id;

    GeneralItemsService.getAllItemsByList(db, list_id)
      .then(items => {
        return res.status(200).json(items.map(serializeItem));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req,res,next) => {
    const db = req.app.get('db');
    const list_id = req.params.list_id;
    const { item } = req.body;

    if(!item) {
      return res.status(400).json({error: 'Item is required in the body'});
    }

    const newItem = { item };
    newItem.list_id = list_id;

    GeneralItemsService.addItem(db, newItem)
      .then(item => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl + `${item.id}`))
          .json(serializeItem(item));
      })
      .catch(next);
  });

generalItemsRouter
  .route('/:list_id/:id')
  .get(requireAuth, (req,res,next) => {
    const db = req.app.get('db');
    const id = req.params.id;
    const list_id = req.params.list_id;

    GeneralItemsService.getSpecificItemInList(db, id, list_id)
      .then(item => {
        if(!item) {
          return res.status(400).json({error: 'Item does not exist'});
        }
        res.item = item;
        return res.status(200).json(serializeItem(item));
      })
      .catch(next);
  })
  .patch(requireAuth, jsonParser, (req,res,next) => {
    const db = req.app.get('db');
    const id = req.params.id;
    const { item } = req.body;

    const numberOfValues = Object.values(item).filter(Boolean).length;
    if(numberOfValues === 0) {
      return res.status(400).json({error: 'Request body must contain item'});
    }

    const editItem = { item };

    GeneralItemsService.editItem(db, editItem, id)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  })
  .delete(requireAuth, (req,res,next) => {
    const db = req.app.get('db');
    const id = req.params.id;

    GeneralItemsService.deleteItem(db, id)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  });

module.exports = generalItemsRouter;