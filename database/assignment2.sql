INSERT INTO account VALUES (DEFAULT, 'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@an');

UPDATE account SET account_type = 'Admin' WHERE account_id = 1;

DELETE FROM account WHERE account_id = 1;

UPDATE inventory 
	SET inv_description = 'Do you have 6 kids and like to go offroading? The Hummer gives you a huge interior with an engine to get you out of any muddy or rocky situation.'
	WHERE inv_id = 10;

SELECT inv_make, inv_model, classification_name FROM inventory 
	INNER JOIN classification 
	ON inventory.classification_id = classification.classification_id
	WHERE classification.classification_name = 'Sport';

UPDATE inventory 
	SET inv_image = REPLACE(inv_image, '/images', '/images/vehicules'),
	inv_thumbnail = REPLACE(inv_thumbnail,'/images', '/images/vehicules' );