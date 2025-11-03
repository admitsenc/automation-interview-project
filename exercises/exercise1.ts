import { describe, expect, test } from 'vitest';

// This first exercise will focus on implementing some function to display information based on the company.json file
// which can be found in the folder "content". Each test represent a task to implement (each one will have its
// own description). The tests can be ran using the command "yarn test:ex1".
// Before adding any code, please read the "README.md" file in the root of the project.

describe('Exercise 1', () => {
  // Task 1: Create a type to save employee information:
  // This type should contain all the employee information with instead of "isManager", a "role" property which can
  // either be "manager" or "employee". If the value is manager, the the type should also have a "subordinateIds"
  // property containing an array of of managed employee id but not if the value is employee.

  test('Create a type to save employee information', () => {
    type EmployeeBase = {
      "id": number;
      "first name": string;
      "last name": string;
      "job title": string;
      "email": string;
      "phone": string;
    };

    type RegularEmployee = EmployeeBase & {
      "role": 'employee';
    }

    type ManagerEmployee = EmployeeBase & {
      "role": 'manager',
      "subordinateIds": number[]
    }

    type EmployeeInformation = RegularEmployee | ManagerEmployee;

    const manager: EmployeeInformation = {
      "id": 1,
      "first name": "Johnson",
      "last name": "Jackson",
      "job title": "CTO",
      "email": "jonhsonjackson@qctech.com",
      "phone": "+1-555-0000",
      "role": "manager",
      "subordinateIds": [2, 3]
    };

    const employee: RegularEmployee  = {
      "id": 45,
      "first name": "John",
      "last name": "Doe",
      "job title": "Software engineer",
      "email": "johndoe@qctech.com",
      "phone": "+1-555-1234",
      "role": "employee"
    };

    expect(Object.keys(manager)).toContain('subordinateIds');
    expect(Object.keys(employee)).not.toContain('subordinateIds');
  });

  // Task 2: Return several information about the company employees
  // The employee list should be loaded from company.json file.

  test('Return several information about the company employees', () => {
    const company = require('./content/company.json');

    // All employees
    expect(company.employees.length).toEqual(24);

    // All non manager employees
    let nonManagerEmployees = [];
    for (let i = 0; i < company.employees.length; i++) {
      if (company.employees[i].isManager === false) {
        nonManagerEmployees.push(company.employees[i]);
      }
    }
    expect(nonManagerEmployees.length).toEqual(20);

    // Top manager employees (employees who are not managed by anyone)
    let managedEmployees: any[] = [];
    for (let i = 0; i < company.employees.length; i++) {
      if (company.employees[i].isManager === true) {
        managedEmployees.push(company.employees[i].subordinateIds);
      }
    }

    const managedEmployeesArray = managedEmployees.flat();
    let topManagerEmployees = [];
    for (let i = 0; i < company.employees.length; i++) {
      if (managedEmployeesArray.includes(company.employees[i].id) === false) {
        topManagerEmployees.push(company.employees[i]);
      }
    }
    expect(topManagerEmployees.length).toEqual(1);
  });

  // Task 3: Create a function which will take an employee id as parameter and return the amount of subordinates
  // under them. The returned value should take direct and indirect subordinates into account.
  // The employee list should be loaded from company.json file.
  // Tip: You can modify the function signature

  test('Create a function to display amount of subordinates', () => {
    const company = require('./content/company.json');

    const getSubordinatesAmount = (id: number): number => {
      const arr: number[] = [];

      const addToArray = (array: number[]) => {
        for (let i = 0; i < array.length; i++) {
          arr.push(array[i]);
        }
      };

      const helper = (id: number) => {
        const employee = company.employees.find((employee: { id: number; }) => employee.id === id);
        if (!employee || !employee.isManager) return;

        addToArray(employee.subordinateIds);

        for (let subId of employee.subordinateIds) {
          helper(subId);
        }
      };

      helper(id);
      return arr.length;
    };

    expect(getSubordinatesAmount(67)).toEqual(0);
    expect(getSubordinatesAmount(4)).toEqual(10);
    expect(getSubordinatesAmount(2)).toEqual(11);
    expect(getSubordinatesAmount(1)).toEqual(23);
  });
});
