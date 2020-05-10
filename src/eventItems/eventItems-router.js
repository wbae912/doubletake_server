const express = require('express');
const EventItemsService = require('./eventItems-service');
const xss = require('xss');
const path = require('path');
const { requireAuth } = require('../middleware/jwt-auth');

const eventItemsRouter = express.Router();
const jsonParser = express.json();

const serializeItem = item => ({
  id: item.id,
  item: xss(item.item),
  checked: item.checked,
  quantity: item.quantity,
  user_id: item.user_id,
  list_id: item.list_id
});

eventItemsRouter
  .route('/')
  .get(requireAuth, (req,res,next) => {
    const db = req.app.get('db');

    EventItemsService.getAllItemsByUser(db, req.user.id)
      .then(items => {
        return res.status(200).json(items.map(serializeItem));
      })
      .catch(next);
  });

eventItemsRouter
  .route('/:list_id')
  .post(requireAuth, jsonParser, (req,res,next) => {
    const db = req.app.get('db');
    const list_id = req.params.list_id;
    const { item } = req.body;

    if(!item) {
      return res.status(400).json({error: 'Please enter an item'});
    }

    const newItem = { item };
    newItem.user_id = req.user.id;
    newItem.list_id = list_id;

    EventItemsService.addItem(db, newItem)
      .then(item => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl + `${item.id}`))
          .json(serializeItem(item));
      })
      .catch(next);
  });

eventItemsRouter
  .route('/:list_id/:id')
  .all(requireAuth)
  .all((req,res,next) => {
    const db = req.app.get('db');
    const id = req.params.id;
    const list_id = req.params.list_id;

    EventItemsService.getSpecificItemInList(db, id, list_id)
      .then(item => {
        if(!item) {
          return res.status(400).json({error: 'Item does not exist'});
        }
        res.item = item;
        next();
      })
      .catch(next);
  })
  .get((req,res,next) => {
    return res.status(200).json(serializeItem(res.item));
  })
  .patch(jsonParser, (req,res,next) => {
    const db = req.app.get('db');
    const id = req.params.id;
    const { item, checked, quantity } = req.body;

    const numberOfValues = Object.values(item).filter(Boolean).length;
    if(numberOfValues === 0) {
      return res.status(400).json({error: 'Please enter an item'});
    }

    if(quantity < 1) {
      return res.status(400).json({error: 'Enter a quantity greater than 0'});
    }

    const editItem = { item, checked, quantity };

    EventItemsService.editItem(db, editItem, id)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  })
  .delete((req,res,next) => {
    const db = req.app.get('db');
    const id = req.params.id;
    
    EventItemsService.deleteItem(db, id)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  });

module.exports = eventItemsRouter;