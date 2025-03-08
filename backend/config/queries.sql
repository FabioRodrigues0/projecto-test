CREATE DATABASE test;

USE test;

CREATE TABLE `clients` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `photo_profile` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_verify` tinyint (1) NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `products` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `description` text,
    `image_url` varchar(255) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `subscriptions` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `clients_id` int unsigned NOT NULL,
    `products_id` int unsigned NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `subscriptions_clients` (`clients_id`),
    KEY `subscriptions_products` (`products_id`),
    CONSTRAINT `subscriptions_clients` FOREIGN KEY (`clients_id`) REFERENCES `clients` (`id`),
    CONSTRAINT `subscriptions_products` FOREIGN KEY (`products_id`) REFERENCES `products` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `clients` (`email`, `is_verify`, `name`, `password`,)
VALUES
    (
        'client.1@email.com',
        0,
        'Client 1',
        '$2y$12$Adtlmuz2shjciWhehsXZquJP5sKql8tUNjyzadh1uJ5CJJOSyb6hu'
    ),
    (
        'client.2@email.com',
        0,
        'Client 2',
        '$2y$12$pO5sczG02zFwL6O5r0zp4..kRUEJ0mNw5uUcmclbOEwZuCWvl9tAC'
    );

INSERT INTO
    `products` (`description`, `image_url`, `name`)
VALUES
    ('Banana da Madeira', 'banana.png', 'Banana'),
    ('Cenoura', 'cenoura.png', 'Cenoura'),
    ('Alface', 'alface.png', 'Alface'),
    ('Ananas', 'ananas.png', 'Ananas'),
    ('Courgete', 'courgete.png', 'Courgete'),
    ('Kiwi', 'kiwi.png', 'Kiwi');

INSERT INTO
    `subscriptions` (`clients_id`, `products_id`)
VALUES
    (2, 1),
    (2, 2),
    (2, 3),
    (1, 4),
    (1, 5),
    (1, 6);
