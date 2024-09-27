DROP DATABASE IF EXISTS vrforum;
DROP USER IF EXISTS vrforum;

CREATE DATABASE vrforum;
USE vrforum;

CREATE USER vrforum IDENTIFIED BY 'password';

CREATE TABLE topics (
    id      INT             NOT NULL    AUTO_INCREMENT,
    name    VARCHAR(255)    NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE posts (
    id          INT             NOT NULL    AUTO_INCREMENT,
    title       VARCHAR(255)    NOT NULL,
    body        VARCHAR(5000)   NOT NULL,
    topic_id    INT             NOT NULL,
    date_time   DATETIME        NOT NULL    DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT FK_posts_topics
        FOREIGN KEY (topic_id) REFERENCES topics(id)
);

CREATE TABLE replies (
    id          INT             NOT NULL    AUTO_INCREMENT,
    post_id     INT             NOT NULL,
    body        VARCHAR(5000)   NOT NULL,
    date_time   DATETIME        NOT NULL    DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT FK_replies_posts
        FOREIGN KEY (post_id) REFERENCES posts(id)
);

GRANT SELECT, INSERT, UPDATE, DELETE
ON vrforum.*
TO vrforum;

INSERT INTO topics (name)
VALUES
    ('Programming'),
    ('Gaming'),
    ('Fishing'),
    ('Literature');

INSERT INTO posts (title, body, topic_id, date_time)
VALUES
    ('Hmsderh', 'vel accumsan tellus nisi eu orci mauris lacinia sapien quis', 1, '2020-08-25 19:47:31'),
    ('Hizgzff', 'massa volutpat convallis morbi odio odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis', 2, '2021-02-04 17:29:10'),
    ('Hbgxibp', 'turpis a pede posuere nonummy integer non velit donec diam neque vestibulum eget vulputate ut', 4, '2023-10-09 09:34:03'),
    ('Odwlfgj', 'volutpat eleifend donec ut dolor morbi vel lectus in quam', 3, '2021-09-27 14:24:02'),
    ('Tdopivj', 'nulla ultrices aliquet maecenas leo odio condimentum id luctus nec molestie sed justo pellentesque viverra pede ac diam', 3, '2023-01-04 10:42:36'),
    ('Zkbwqzl', 'morbi porttitor lorem id ligula suspendisse ornare consequat lectus in est risus', 3, '2020-07-07 17:36:24'),
    ('Igugcnn', 'imperdiet nullam orci pede venenatis non sodales sed tincidunt eu', 4, '2022-08-04 17:12:25'),
    ('Fnuuhea', 'sit amet turpis elementum ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus', 4, '2021-08-11 17:04:38'),
    ('Pztdgjf', 'id turpis integer aliquet massa id lobortis convallis tortor risus dapibus augue vel accumsan tellus nisi eu orci mauris', 2, '2020-08-15 07:44:15'),
    ('Douisfr', 'integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi quis tortor id nulla ultrices aliquet maecenas', 2, '2021-07-16 04:36:29'),
    ('Xegngid', 'ante nulla justo aliquam quis turpis eget elit sodales scelerisque mauris sit amet eros suspendisse accumsan tortor quis turpis', 2, '2021-06-13 10:09:14'),
    ('Zrgkmrp', 'auctor sed tristique in tempus sit amet sem fusce consequat nulla nisl nunc', 4, '2021-04-12 14:39:13'),
    ('Bbnjhbh', 'egestas metus aenean fermentum donec ut mauris eget massa tempor convallis nulla neque libero convallis eget eleifend', 4, '2021-03-02 08:03:28'),
    ('Eotjoza', 'morbi quis tortor id nulla ultrices aliquet maecenas leo odio condimentum', 2, '2023-12-02 18:45:04'),
    ('Obvxkdz', 'elit proin interdum mauris non ligula pellentesque ultrices phasellus id', 2, '2021-12-19 16:09:10'),
    ('Ietanlj', 'ut nunc vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia', 4, '2020-06-23 22:20:13');

INSERT INTO replies (post_id, body, date_time)
VALUES
    (8, 'cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus', '2020-08-10 09:21:43'),
    (3, 'in hac habitasse platea dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum at lorem', '2020-10-05 11:15:40'),
    (7, 'magnis dis parturient montes nascetur ridiculus mus vivamus vestibulum sagittis', '2020-03-31 10:04:13'),
    (8, 'quisque ut erat curabitur gravida nisi at nibh in hac habitasse platea dictumst aliquam augue quam', '2021-01-21 17:31:45'),
    (2, 'in blandit ultrices enim lorem ipsum dolor sit amet consectetuer adipiscing elit proin interdum mauris non', '2022-06-01 14:01:29'),
    (7, 'purus eu magna vulputate luctus cum sociis natoque penatibus et', '2023-04-26 14:07:58'),
    (10, 'felis fusce posuere felis sed lacus morbi sem mauris laoreet', '2020-11-28 16:25:18'),
    (12, 'a odio in hac habitasse platea dictumst maecenas ut massa quis augue luctus tincidunt nulla mollis molestie lorem quisque ut', '2020-07-10 00:15:28'),
    (3, 'euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula nec sem duis aliquam convallis nunc proin', '2023-02-02 07:07:15'),
    (1, 'ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae duis', '2021-04-13 21:27:07'),
    (8, 'in quis justo maecenas rhoncus aliquam lacus morbi quis tortor id nulla ultrices aliquet maecenas leo odio condimentum', '2023-12-12 10:05:10'),
    (6, 'viverra eget congue eget semper rutrum nulla nunc purus phasellus in felis donec', '2021-08-13 10:44:05'),
    (6, 'sapien in sapien iaculis congue vivamus metus arcu adipiscing molestie hendrerit at vulputate vitae nisl aenean', '2020-01-29 21:14:54'),
    (12, 'orci vehicula condimentum curabitur in libero ut massa volutpat convallis morbi odio odio elementum', '2021-10-29 19:38:46'),
    (3, 'habitasse platea dictumst etiam faucibus cursus urna ut tellus nulla ut erat id mauris vulputate', '2022-06-20 05:56:22'),
    (6, 'luctus et ultrices posuere cubilia curae mauris viverra diam vitae quam suspendisse potenti nullam porttitor lacus at turpis donec posuere', '2021-06-14 20:43:09'),
    (3, 'vestibulum velit id pretium iaculis diam erat fermentum justo nec condimentum neque sapien placerat ante nulla justo aliquam quis', '2021-05-07 06:44:04'),
    (15, 'sodales sed tincidunt eu felis fusce posuere felis sed lacus morbi sem mauris laoreet ut rhoncus aliquet pulvinar sed nisl', '2023-08-10 09:27:24'),
    (10, 'tincidunt in leo maecenas pulvinar lobortis est phasellus sit amet erat nulla tempus vivamus in felis eu sapien cursus vestibulum', '2022-10-07 20:42:47'),
    (5, 'praesent blandit nam nulla integer pede justo lacinia eget tincidunt eget tempus vel pede morbi porttitor', '2021-12-19 04:10:07'),
    (15, 'lorem id ligula suspendisse ornare consequat lectus in est risus auctor sed tristique in tempus sit amet sem fusce', '2020-07-25 00:17:07'),
    (9, 'phasellus id sapien in sapien iaculis congue vivamus metus arcu adipiscing molestie hendrerit at vulputate vitae nisl', '2021-06-19 07:56:26'),
    (8, 'augue aliquam erat volutpat in congue etiam justo etiam pretium iaculis justo in hac habitasse platea', '2021-03-22 11:40:35'),
    (3, 'suspendisse potenti in eleifend quam a odio in hac habitasse platea dictumst maecenas ut massa quis augue', '2022-04-26 19:01:07'),
    (13, 'consectetuer adipiscing elit proin risus praesent lectus vestibulum quam sapien varius ut', '2023-02-06 10:59:39'),
    (5, 'eros suspendisse accumsan tortor quis turpis sed ante vivamus tortor duis mattis egestas metus aenean fermentum donec ut', '2021-01-20 07:46:07'),
    (11, 'enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula nec sem duis', '2022-09-23 00:55:51'),
    (9, 'orci mauris lacinia sapien quis libero nullam sit amet turpis elementum ligula vehicula consequat morbi', '2021-10-09 20:34:10'),
    (13, 'dui maecenas tristique est et tempus semper est quam pharetra magna ac consequat metus sapien ut', '2022-10-06 17:27:20'),
    (10, 'et magnis dis parturient montes nascetur ridiculus mus vivamus vestibulum sagittis sapien', '2022-09-21 06:17:46'),
    (2, 'rhoncus aliquet pulvinar sed nisl nunc rhoncus dui vel sem sed sagittis nam congue risus semper porta volutpat', '2021-11-22 16:39:58'),
    (7, 'nulla justo aliquam quis turpis eget elit sodales scelerisque mauris sit amet', '2020-02-12 02:44:55'),
    (15, 'urna pretium nisl ut volutpat sapien arcu sed augue aliquam erat volutpat in congue', '2022-03-13 07:32:30'),
    (3, 'lacus at velit vivamus vel nulla eget eros elementum pellentesque quisque porta volutpat erat quisque erat', '2021-10-12 00:58:08'),
    (13, 'donec quis orci eget orci vehicula condimentum curabitur in libero ut massa volutpat convallis morbi', '2023-06-18 21:38:53'),
    (15, 'quam suspendisse potenti nullam porttitor lacus at turpis donec posuere metus vitae ipsum aliquam non mauris', '2022-04-27 17:14:45'),
    (7, 'nullam orci pede venenatis non sodales sed tincidunt eu felis fusce posuere', '2023-11-16 22:44:56'),
    (7, 'quis lectus suspendisse potenti in eleifend quam a odio in hac habitasse platea dictumst maecenas ut massa quis', '2023-06-13 16:41:37'),
    (14, 'sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus vivamus vestibulum sagittis', '2023-05-20 11:17:52'),
    (3, 'vestibulum sit amet cursus id turpis integer aliquet massa id lobortis convallis tortor risus dapibus augue', '2020-01-05 23:18:51'),
    (11, 'at velit vivamus vel nulla eget eros elementum pellentesque quisque', '2021-01-12 23:47:41'),
    (1, 'sollicitudin ut suscipit a feugiat et eros vestibulum ac est lacinia nisi venenatis tristique fusce congue diam id', '2020-05-17 20:03:06'),
    (15, 'volutpat erat quisque erat eros viverra eget congue eget semper rutrum nulla nunc', '2020-01-27 02:58:25'),
    (7, 'eget vulputate ut ultrices vel augue vestibulum ante ipsum primis in faucibus orci', '2021-04-10 16:07:36'),
    (8, 'in quis justo maecenas rhoncus aliquam lacus morbi quis tortor id nulla', '2021-02-16 21:17:33'),
    (3, 'nulla nisl nunc nisl duis bibendum felis sed interdum venenatis turpis', '2022-07-06 07:17:53'),
    (6, 'nulla suscipit ligula in lacus curabitur at ipsum ac tellus semper interdum mauris ullamcorper purus sit amet nulla', '2022-05-09 00:27:41'),
    (9, 'sollicitudin ut suscipit a feugiat et eros vestibulum ac est lacinia nisi venenatis tristique fusce congue diam id', '2021-07-16 12:33:51'),
    (2, 'bibendum felis sed interdum venenatis turpis enim blandit mi in porttitor pede justo eu massa donec dapibus duis', '2022-08-10 14:52:48'),
    (15, 'dictumst maecenas ut massa quis augue luctus tincidunt nulla mollis molestie lorem quisque ut erat curabitur gravida nisi', '2021-02-24 12:25:00'),
    (14, 'donec posuere metus vitae ipsum aliquam non mauris morbi non lectus', '2022-05-02 19:33:40'),
    (6, 'ut mauris eget massa tempor convallis nulla neque libero convallis eget eleifend luctus ultricies eu nibh', '2022-07-23 14:43:19'),
    (7, 'platea dictumst maecenas ut massa quis augue luctus tincidunt nulla mollis molestie lorem quisque ut erat curabitur gravida', '2023-07-11 19:48:20'),
    (9, 'proin eu mi nulla ac enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae', '2020-10-08 01:54:34'),
    (6, 'nam nulla integer pede justo lacinia eget tincidunt eget tempus vel pede morbi', '2020-06-30 12:48:35'),
    (11, 'consequat in consequat ut nulla sed accumsan felis ut at dolor quis odio consequat varius integer ac', '2023-07-23 07:52:00'),
    (9, 'etiam vel augue vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id massa id nisl venenatis lacinia aenean', '2023-09-07 20:44:35'),
    (15, 'pede ac diam cras pellentesque volutpat dui maecenas tristique est et tempus semper est quam', '2021-04-04 07:24:58'),
    (5, 'semper sapien a libero nam dui proin leo odio porttitor id consequat', '2022-07-22 01:54:55'),
    (3, 'consectetuer adipiscing elit proin interdum mauris non ligula pellentesque ultrices phasellus id sapien in sapien iaculis congue vivamus metus', '2021-04-17 22:22:00'),
    (14, 'nam congue risus semper porta volutpat quam pede lobortis ligula', '2020-04-15 16:15:21'),
    (8, 'non mauris morbi non lectus aliquam sit amet diam in magna bibendum imperdiet nullam orci', '2023-11-03 15:42:59'),
    (10, 'ultrices posuere cubilia curae mauris viverra diam vitae quam suspendisse potenti nullam porttitor lacus at turpis donec posuere', '2022-12-22 13:57:51'),
    (4, 'massa donec dapibus duis at velit eu est congue elementum in hac habitasse platea dictumst morbi vestibulum velit id pretium', '2020-11-08 02:13:48');
