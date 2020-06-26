DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

CREATE TABLE department(
  id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(30) NOT NULL, 
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL, 
  salary DECIMAL(8,2) NOT NULL, 
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) references department(id)
);

CREATE TABLE employee(
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department(department_name) VALUES ('General Management');
INSERT INTO department(department_name) VALUES ('Sales');
INSERT INTO department(department_name) VALUES ('Marketing');
INSERT INTO department(department_name) VALUES ('Operations');

INSERT INTO role(title, salary, department_id) VALUES ('Manager', 100000, 1);
INSERT INTO role(title, salary, department_id) VALUES ('Accountant', 80000, 2);
INSERT INTO role(title, salary, department_id) VALUES ('Intern', 40000, 3);
INSERT INTO role(title, salary, department_id) VALUES ('Book keeper', 60000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('Tyler', 'Niknam', 1, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('Charles', 'Davis', 2, 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('Anabelle', 'Garcia', 3, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('Richard', 'Lewis', 4, 4);

SELECT * FROM employee;