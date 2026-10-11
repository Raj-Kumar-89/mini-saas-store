exports.up = function (knex) {
  return knex.schema.createTable("favorites", (table) => {
    table.increments("id").primary();

    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .integer("template_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("templates")
      .onDelete("CASCADE");

    table.timestamps(true, true);

    table.unique(["user_id", "template_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("favorites");
};