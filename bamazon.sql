-- Drop bamazonDB if it exists --
DROP DATABASE IF EXISTS bamazonDB;
-- Create bamazonDB --
CREATE DATABASE bamazonDB;
-- Use bamazonDB --
USE bamazonDB;

-- Create products table --
CREATE TABLE products (
  id INT(3) ZEROFILL NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(4) NOT NULL,
  PRIMARY KEY (id)
);

-- Initial stock --
INSERT INTO products
  (product_name, department_name, price, stock_quantity)
VALUES
  ("Nintendo Switch", "Video Games", 500, 50),
  ("VR Headset", "Devices", 115, 40),
  ("iPhone Case", "Accessories", 10, 200),
  ("Playstation 4", "Video Games", 300, 15),
  ("Night Vision Goggles", "Outdoor Recreation", 200, 100),
  ("Fire TV Stick", "Devices", 50, 80),
  ("Surface Book", "Laptop", 999, 50),
  ("Boxing Stand", "Sports", 240, 25),
  ("Mattress", "Home", 400, 10),
  ("Blender Bottle", "Kitchen", 8, 80);
