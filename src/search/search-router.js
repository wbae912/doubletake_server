const express = require('express');
const xss = require('xss');
const { requireAuth } = require('../middleware/jwt-auth');
const SearchService = require('./search-service');

const searchRouter = express.Router();

const serializeSearch = searchTerm => {
  return xss(searchTerm);
};

searchRouter
  .route('/:listType')
  .get(requireAuth, async (req,res,next) => {
    let { searchTerm } = req.query;
    const listType = req.params.listType;

    searchTerm = searchTerm.trim();
    serializeSearch(searchTerm);

    const db = req.app.get('db');
    const user_id = req.user.id;

    if(listType === 'general') {
      let searchedGeneralResults = await SearchService.getGeneralSearch(db, searchTerm, user_id);
      return res.status(200).json(searchedGeneralResults);
    } else if(listType === 'event') {
      let searchedEventResults = await SearchService.getEventSearch(db, searchTerm, user_id);
      return res.status(200).json(searchedEventResults);
    }
  });

module.exports = searchRouter;