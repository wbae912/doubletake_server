module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin@localhost/doubletake',
  JWT_SECRET: process.env.JWT_SECRET || 'babylon',
  MAPQUEST_API_KEY: process.env.MAPQUEST_API_KEY,
  WEATHERMAP_API_KEY: process.env.WEATHERMAP_API_KEY
};