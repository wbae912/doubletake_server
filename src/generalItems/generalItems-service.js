const GeneralItemsService = {
  getAllItemsByUser(db, user_id) {
    return db
      .select('*')
      .from('general_items')
      .where( {user_id} )
      .orderBy('id', 'ASC');
  },
  getAllItemsByList(db, list_id) {
    return db
      .select('*')
      .from('general_items')
      .where({ list_id });
  },
  getSpecificItemInList(db, id, list_id) {
    return db
      .select('*')
      .from('general_items')
      .where({ id, list_id })
      .first();
  },
  addItem(db, newItem) {
    return db
      .insert(newItem)
      .into('general_items')
      .returning('*')
      .then(res => res[0]);
  },
  editItem(db, editItem, id) {
    return db
      .update(editItem)
      .from('general_items')
      .where( {id} );
  },
  deleteItem(db, id) {
    return db
      .from('general_items')
      .where( {id} )
      .delete();
  }
};

module.exports = GeneralItemsService;