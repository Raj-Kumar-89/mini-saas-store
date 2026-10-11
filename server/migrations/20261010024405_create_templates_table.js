exports.up = function (knex) {
  return knex.schema.createTable("templates", (table) => {
    table.increments("id").primary();
    table.string("name", 150).notNullable();
    table.text("description").notNullable();
    table.text("thumbnail_url").notNullable();
    table.string("category", 100).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("templates");
};