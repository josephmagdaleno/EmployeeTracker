var mysql = require("mysql");
var inquirer = require("inquirer");
var util = require("util");
var consoleTable = require("console.table");


var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "gizgiz900",
  database: "employees_db"
});

connection.connect(function (err) {
  if (err) throw err;
  startEmployee();
});

//initial prompt for user

function startEmployee() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all employees.",
        "View all departments.",
        "View all roles.",
        "Add department.",
        "Add a role.",
        "Add an employee.",
        "Update an employees role.",
        "EXIT."
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View all employees.":
          viewEmployees();
          break;

        case "View all departments.":
          viewDepartments();
          break;

        case "View all roles.":
          viewRoles();
          break;

        case "Add department.":
          addDepartment();
          break;

        case "Add a role.":
          addRole();
          break;

        case "Add an employee.":
          addEmployee();
          break;

        case "Update an employees role.":
          employeeRole();
          break;

        case "EXIT.":
          endApp();
          break;

        default:
          break;

      }
    });
}
//function to view employees
function viewEmployees() {
  console.log("Selecting all employees....\n");
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    //log results from the SELECT statement
    console.log(res.length + " employees found.");
    console.table('All Employees', res);
    startEmployee();
  });
}
//function to view departments
function viewDepartments() {
  console.log("Selecting all departments.....\n");
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    //logging results
    console.log(res.length + " departments found.");
    console.table('All Departments', res);
    startEmployee();
  });
}
//function to view roles
function viewRoles() {
  console.log("Selecting all roles....\n");
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    //logging results
    console.log(res.length + " roles found.");
    console.table("All roles", res);
    startEmployee();
  });
}
//add an employee
function addEmployee() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "Employee's fist name: ",
        },
        {
          name: "last_name",
          type: "input",
          message: "Employee's last name: "
        },
        {
          name: "role",
          type: "list",
          choices: function () {
            var roleArray = [];
            for (let i = 0; i < res.length; i++) {
              roleArray.push(res[i].title);
            }
            return roleArray;
          },
          message: "What is this employee's role? "
        }
      ]).then(function (answer) {
        let roleID;
       
        for (let i = 0; i < res.length; i++) {
          if (res[i].title == answer.role) {
            roleID = res[i].id;
            console.log(roleID)
          }
        }
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: roleID,
            manager_id: roleID
          },
          function (err) {
            if (err) throw err;
            console.log("Your employee has been added!");
            startEmployee();
          }
        )
      })
  })
}
//add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "new_dept",
        type: "input",
        message: "What is the new department you would like to add?"
      }
    ]).then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: answer.new_dept
        }
      );
      var query = "SELECT * FROM department";
      connection.query(query, function (err, res) {
        if (err) throw err;
        console.table('All Departments:', res);
        startEmployee();
      })
    })
}
//add a role
function addRole() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "role_id",
          type: "input",
          message: "What is the Title of the new role?"
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for this position?"
        },
        {
          name: "department_id",
          type: "input",
          message: "Enter the department ID."
        }
      ]).then(function (answer) {
        let deptID;
        for (let i = 0; i < res.length; i++) {
          if (res[i].name == answer.department_id) {
            deptID = res[i].id;
          }
        }

        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.role_id,
            salary: answer.salary,
            department_id: deptID
          },
          function (err, res) {
            if (err) throw err;
            console.log("Your new role has been added!");
            startEmployee();
          }
        )
      })
  })

}
//update an employees role
function employeeRole(){
  let allemp = [];
  connection.query("SELECT * FROM employee", function(err, answer) {
    for (let i = 0; i < answer.length; i++) {
      let employeeString =
        answer[i].id + " " + answer[i].first_name + " " + answer[i].last_name;
      allemp.push(employeeString);
    }

    inquirer
      .prompt([
        {
          type: "list",
          name: "updateRole",
          message: "select employee to update role",
          choices: allemp
        },
        {
          type: "list",
          message: "select new role",
          choices: ["manager", "employee"],
          name: "newrole"
        }
      ])
      .then(function(answer) {
        console.log("updating", answer);
        const updateID = {};
        updateID.employeeId = parseInt(answer.updateRole.split(" ")[0]);
        if (answer.newrole === "manager") {
          updateID.role_id = 1;
        } else if (answer.newrole === "employee") {
          updateID.role_id = 2;
        }
        connection.query(
          "UPDATE employee SET role_id = ? WHERE id = ?",
          [updateID.role_id, updateID.employeeId],
          function(err, data) {
            startEmployee();
          }
        );
      });
  });
}
//close app
function endApp() {
  connection.end();
}
