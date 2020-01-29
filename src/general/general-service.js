const GeneralService = {
  getAllListsForUser(db, user_id) {
    return db
      .select('*')
      .from('general')
      .where( {user_id} ); 
  },

  getSpecificListForUser(db, id, user_id) {
    return db
      .select('*')
      .from('general')
      .where( {id, user_id } )
      .first();
  },

  postList(db, newList) {
    return db
      .insert(newList)
      .into('general')
      .returning('*')
      .then(res => res[0]);
  },

  editList(db, id, editList) {
    return db
      .update(editList)
      .from('general')
      .where( {id} );
  },

  deleteList(db, id) {
    return db
      .from('general')
      .where( {id} )
      .delete();
  }
};

module.exports = GeneralService;