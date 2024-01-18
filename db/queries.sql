SELECT first_name, last_name, title, salary 
FROM employee
JOIN role ON employee.role_id = role.id;