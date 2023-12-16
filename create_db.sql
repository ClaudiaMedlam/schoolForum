--# Create database script for School NEXT

--# Create the database
CREATE DATABASE schoolNet;
USE schoolNet;

--# Create the tables
CREATE TABLE topics (topic_id INT AUTO_INCREMENT, topic_title VARCHAR(150), PRIMARY KEY(topic_id));

CREATE TABLE users (user_id INT AUTO_INCREMENT, user_name VARCHAR(50), user_password VARCHAR(20), user_email VARCHAR(50), PRIMARY KEY(user_id));

CREATE TABLE posts(
    -> post_id INT AUTO_INCREMENT,
    -> post_title MEDIUMTEXT,
    -> post_content LONGTEXT,
    -> post_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    -> user_id INT,
    -> topic_id INT,
    -> PRIMARY KEY (post_id),
    -> FOREIGN KEY (user_id) REFERENCES users(user_id),
    -> FOREIGN KEY (topic_id) REFERENCES topics(topic_id)
    -> );

CREATE TABLE userTopic (
    -> user_id INT,
    -> topic_id INT,
    -> PRIMARY KEY (user_id, topic_id),
    -> FOREIGN KEY (user_id) REFERENCES users(user_id),
    -> FOREIGN KEY (topic_id) REFERENCES topics(topic_id)
    -> );

--# Create the app user and give it access to the database
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON schoolNet.* TO 'appuser'@'localhost';