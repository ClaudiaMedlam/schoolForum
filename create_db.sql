--# Create database script for School NEXT

--# Create the database
CREATE DATABASE schoolNet;
USE schoolNet;

--# Create the tables
CREATE TABLE topics (topic_id INT AUTO_INCREMENT,name VARCHAR(150),unsigned,PRIMARY KEY(id));
CREATE TABLE users (user_id INT AUTO_INCREMENT,name VARCHAR(50),email VARCHAR(50), password VARCHAR(20), unsigned,PRIMARY KEY(id));
CREATE TABLE posts (post_id INT AUTO_INCREMENT, title VARCHAR(255), content VARCHAR(600), datePosted DATETIME(CURRENT_TIMESTAMP), user_id INT, topic_id INT, unsigned, PRIMARY KEY(id))
CREATE TABLE userTopic (user_id, topid_id)

--# Create the app user and give it access to the database
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON schoolNet.* TO 'appuser'@'localhost';