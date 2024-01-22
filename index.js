const inquirer = require('inquirer');
const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'tracker_db'
})


const introText = [{
    type: 'text',
    name: 'intro',
    message: `


                :::::::::: ::::    ::::  :::::::::  :::        ::::::::  :::   ::: :::::::::: ::::::::::                  
                :+:        +:+:+: :+:+:+ :+:    :+: :+:       :+:    :+: :+:   :+: :+:        :+:                         
                +:+        +:+ +:+:+ +:+ +:+    +:+ +:+       +:+    +:+  +:+ +:+  +:+        +:+                         
                +#++:++#   +#+  +:+  +#+ +#++:++#+  +#+       +#+    +:+   +#++:   +#++:++#   +#++:++#                    
                +#+        +#+       +#+ +#+        +#+       +#+    +#+    +#+    +#+        +#+                         
                #+#        #+#       #+# #+#        #+#       #+#    #+#    #+#    #+#        #+#                         
                ########## ###       ### ###        ########## ########     ###    ########## ##########                  
::::::::::: :::::::::      :::      ::::::::  :::    ::: :::::::::: :::::::::            :::::::::  :::::::::   ::::::::  
    :+:     :+:    :+:   :+: :+:   :+:    :+: :+:   :+:  :+:        :+:    :+:           :+:    :+: :+:    :+: :+:    :+: 
    +:+     +:+    +:+  +:+   +:+  +:+        +:+  +:+   +:+        +:+    +:+           +:+    +:+ +:+    +:+ +:+    +:+ 
    +#+     +#++:++#:  +#++:++#++: +#+        +#++:++    +#++:++#   +#++:++#:            +#++:++#+  +#++:++#:  +#+    +:+ 
    +#+     +#+    +#+ +#+     +#+ +#+        +#+  +#+   +#+        +#+    +#+           +#+        +#+    +#+ +#+    +#+ 
    #+#     #+#    #+# #+#     #+# #+#    #+# #+#   #+#  #+#        #+#    #+#           #+#        #+#    #+# #+#    #+# 
    ###     ###    ### ###     ###  ########  ###    ### ########## ###    ###           ###        ###    ###  ########  
    

    `,
}]

const menu = [
    {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: ["View all departments", "View all roles", "View all employees", new inquirer.Separator(), "Add a department", "Add a role", "Add an employee", "Update an employee role", new inquirer.Separator(),]
    },
]

function promptMenu() {
    inquirer
        .prompt(menu)
        .then((response) => {
            switch (response.menu) {
                case "View all departments":
                    allDepartmentsQuery();
                    break;
                case "View all roles":
                    allRolesQuery();
                    break;
                case "View all employees":
                    allEmployeesQuery();
                    break;
                case "Add a department":
                    addDepartmentQuery()
            }
        });
}

function addDepartmentQuery() {
    inquirer
        .prompt([
            {
                name: "department_name",
                type: "input",
                message: "Department name?",
            },
        ])
        .then((response) => {
            const insertDepartmentSql = 'INSERT INTO department (name) VALUES (?)';

            connection.query(insertDepartmentSql, [response.department_name], (error, results) => {
                if (error) {
                    console.log("Error inserting into db: ", error);
                } else {
                    console.log("Added ", response);

                }

                promptMenu();
            })
        })
}


function allDepartmentsQuery() {
    connection.query('SELECT id AS Department_ID, name AS Department_Name FROM department;', (error, results) => {
        if (error) {
            console.log("Error getting query: ", error);
        } else {
            console.log("View All Departments:");
            console.table(results)
        }

        promptMenu();
    })
}

function allRolesQuery() {
    connection.query('SELECT role.title AS Role_Title, role.id AS Role_ID, department.name AS Department_Name, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id;', (error, results) => {
        if (error) {
            console.log("Error getting query: ", error);
        } else {
            console.log("View All Roles:")
            console.table(results);
        }

        promptMenu();
    })
}

function allEmployeesQuery() {
    connection.query('SELECT e.id AS Employee_ID, e.first_name AS First_Name, e.last_name AS Last_Name, r.title AS Job_Title, d.name AS Department_Name, r.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;', (error, results) => {
        if (error) {
            console.log("Error getting query: ", error);
        } else {
            console.log("View All Employees:")
            console.table(results);
        }

        promptMenu();
    })
}

function init() {
    inquirer
        .prompt(introText)
        .then();
    promptMenu();


}

init();