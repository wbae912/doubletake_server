const EventsService = {
  getAllEvents(db,user_id) {
    return db
      .select('*')
      .from('events')
      .where( {user_id} );
  },

  getSpecificEventForUser(db,id,user_id) {
    return db
      .select('*')
      .from('events')
      .where({id, user_id})
      .first();
  },

  postEvent(db,newEvent) {
    return db
      .insert(newEvent)
      .into('events')
      .returning('*')
      .then(res => res[0]);
  },

  editEvent(db,id,editEvent) {
    return db
      .update(editEvent)
      .from('events')
      .where( {id} );
  },

  deleteEvent(db,id) {
    return db
      .from('events')
      .where( {id} )
      .delete();
  }
};

module.exports = EventsService;