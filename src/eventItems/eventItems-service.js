const EventItemsService = {
  getAllItemsByUser(db, user_id) {
    return db
      .select('*')
      .from('event_items')
      .where({ user_id })
      .orderBy('id', 'ASC');
  },
  getSpecificItemInList(db, id, list_id) {
    return db
      .select('*')
      .from('event_items')
      .where({ id, list_id })
      .first();
  },
  addItem(db, newItem) {
    return db
      .insert(newItem)
      .into('event_items')
      .returning('*')
      .then(res => res[0]);
  },
  editItem(db, editItem, id) {
    return db
      .update(editItem)
      .from('event_items')
      .where( {id} );
  },
  deleteItem(db, id) {
    return db
      .from('event_items')
      .where( {id} )
      .delete();
  }
};

module.exports = EventItemsService;