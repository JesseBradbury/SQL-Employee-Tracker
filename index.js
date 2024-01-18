const inquirer = require('inquirer');

const menu = [
    {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: ["View all departments", "View all roles", "View all employees", new inquirer.Separator(), "Add a department", "Add a role", "Add an employee", "Update an employee role", new inquirer.Separator(),]
    },
]

function init() {
    inquirer
        .prompt(menu)
        .then((response) => {
            console.log(response)
        });
}

init();