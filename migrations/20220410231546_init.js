/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE views (
      url text PRIMARY KEY,
      views int8 DEFAULT 0
    )
  `).raw(`
    CREATE TABLE views_animated (
      appid int8,
      defid int8,

      views int8 DEFAULT 0,

      PRIMARY KEY(appid, defid)
    )
  `).raw(`
    CREATE TABLE votes (
      id serial8 PRIMARY KEY,
      url text,
      user_id int8,
      device_id text,

      created_at timestamptz
    )
  `).raw(`
    CREATE TABLE votes_animated (
      appid int8,
      defid int8,

      user_id int8 DEFAULT 0,
      device_id text,

      created_at timestamptz
    )
  `).raw(`
    CREATE TABLE votes_total (
      url text PRIMARY KEY,
      votes int8
    )
  `).raw(`
    CREATE TABLE votes_total_animated (
      appid int8,
      defid int8,

      votes int8,

      PRIMARY KEY(appid, defid)
    )
  `).raw(`
    CREATE TABLE animated_bgs (
      appid int8,
      defid int8,

      type int4,
      "communityItemClass" int4,
      "communityItemType" int4,
      "pointCost" int4,
      "timestampCreated" int8,
      "timestampUpdated" int8,
      "timestampAvailable" int8,
      quantity int4,
      "internalDescription" text,
      active bool,
      "communityItemData" jsonb,

      "timestampAvailableEnd" int8,
      "usableDuration" int8,
      "bundleDiscount" int8,

      PRIMARY KEY(appid, defid)
    )
  `)
}

exports.down = function (knex) {
  return knex.schema
    .raw('DROP TABLE views')
    .raw('DROP TABLE views_animated')
    .raw('DROP TABLE votes')
    .raw('DROP TABLE votes_animated')
    .raw('DROP TABLE votes_total')
    .raw('DROP TABLE votes_total_animated')
    .raw('DROP TABLE animated_bgs')
}
