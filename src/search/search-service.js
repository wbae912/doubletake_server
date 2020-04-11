const SearchService = {
  getGeneralSearch(db, searchTerm, user_id) {
    return db
      .select('*')
      .from('general')
      .where({ user_id })
      .where('title', 'ilike', `%${searchTerm}%`);
  },
  getEventSearch(db, searchTerm, user_id) {
    return db
      .select('*')
      .from('events')
      .where({ user_id })
      .where('title', 'ilike', `%${searchTerm}%`);
  }
};

module.exports = SearchService;