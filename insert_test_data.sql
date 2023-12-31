-- # Insert data into the tables

USE schoolForum;

INSERT INTO users (user_name, user_email, user_password) 
VALUES('Anna', 'anna@karenina.com', 'p4ssword'), 
('Bilbo', 'bilbo@baggins.com', 'passw0rd'), 
('Cruella','cruella@devil.com','pa55word'), 
('David', 'david@copperfield.com', 'password!'),
('Emma', 'emma@bovary.com', 'Password'),
('Llewelyn', 'Llewelyn.Fernandes@gold.ac.uk', 'DWApps') ;

INSERT INTO topics (topic_title)
VALUES ('Uniform'), ('Trips'), ('Lunch'), ('Assemblies'),
('Reception Year'), ('Year 1'), ('Year 2'), ('Year 3'), ('Year 4'), ('Year 5'), ('Year 6'), 
('School Socials'), ('Projects');

-- #CREATE VIEWCREATE VIEW vw_posts AS
SELECT
    p.post_id,
    p.post_date,
    u.user_name,
    t.topic_title,
    p.post_title,
    p.post_content
FROM
    posts p
JOIN
    users u ON u.user_id = p.user_id
JOIN
    topics t ON t.topic_id = p.topic_id
ORDER BY
    post_date DESC;


-- # Creating sql stored procedure:
DELIMITER //
CREATE PROCEDURE sp_insert_post(IN p_post_title MEDIUMTEXT, IN p_post_content LONGTEXT, IN p_topic_title VARCHAR(150), IN p_user_name VARCHAR(50))
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_topic_id INT;
    DECLARE v_user_is_member INT;
    
    SELECT user_id
    FROM users
    WHERE user_name=p_user_name
    INTO v_user_id;
    
    IF ISNULL(v_user_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No matching username found';
    END IF;
    
    SELECT topic_id
    FROM topics
    WHERE topic_title = p_topic_title
    INTO v_topic_id;
    
    IF ISNULL(v_topic_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No matching topic found';
    END IF;
    
    SELECT COUNT(*) AS countmembership
    FROM userTopic
    WHERE user_id = v_user_id AND topic_id = v_topic_id
    INTO v_user_is_member;
    
    IF v_user_is_member = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User is not a member of that topic';
    END IF;
    
    INSERT INTO posts (post_date, post_title, post_content, user_id, topic_id)
    VALUES (NOW(), p_post_title, p_post_content, v_user_id, v_topic_id);
END //
DELIMITER ;

