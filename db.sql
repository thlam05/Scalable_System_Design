CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TRUNCATE TABLE products;

INSERT INTO
    products (name, price)
VALUES ('iPhone 15 Pro', 999.99),
    ('MacBook Air M3', 1199.50),
    ('AirPods Pro 2', 249.00),
    ('Apple Watch Ultra', 799.00);