

var mysql = require('mysql');
var dbcofig = require('./config/config');


var connection = mysql.createConnection(dbcofig.connect);
connection.query('CREATE DATABASE ' + dbcofig.database + ";");

connection.query('use ' + dbcofig.database + ";");

console.log(dbcofig.usersTable);
connection.query('CREATE TABLE ' + dbcofig.usersTable + ' ( `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
                                            `username` CHAR(60) NOT NULL, \
                                            `password` CHAR(60) NOT NULL, \
                                            PRIMARY KEY (`id`),\
                                            UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
                                            UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
                                            ) ;' );
console.log("Tao bang thanh cong");
connection.end();