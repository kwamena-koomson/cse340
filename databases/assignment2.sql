-- Inserting a new record for Tony Stark into the account table
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');


-- Updating the account_type for Tony Stark to 'Admin'
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Deleting the record for Tony Stark from the account table
DELETE FROM account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';


-- Modifying the description for GM Hummer in the inventory table
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- Retrieving make and model details from the inventory table for items belonging to the 'Sport' category
SELECT inv.inv_make, inv.inv_model, cls.classification_name
FROM inventory AS inv
INNER JOIN classification AS cls ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';


-- Updating image paths in the inventory table to include '/vehicles' in the middle
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');


