-- Active: 1746455132333@@127.0.0.1@5432@Titanic_Databases
-- 1. Create ENUM types (as integers using CHECK constraints instead of actual ENUMs)
-- Since you're using integers in the Python Enums, you don't need PostgreSQL ENUM types.
-- We'll use SMALLINT with CHECK constraints for clarity and flexibility.

-- 2. Create the tables

CREATE TABLE Registered_User (
    User_id SERIAL PRIMARY KEY,
    Username TEXT UNIQUE,
    Email TEXT,
    Password TEXT
);

CREATE TABLE Models (
    Model_id SERIAL PRIMARY KEY,
    Model_Type TEXT
);

CREATE TABLE Calc_History (
    History_id SERIAL PRIMARY KEY,
    
    Class SMALLINT CHECK (Class IN (1, 2, 3)), -- First, Second, Third
    Sex SMALLINT CHECK (Sex IN (0, 1)), -- Male, Female
    Age INTEGER CHECK (Age >= 0 AND Age <= 100),
    Fare INTEGER CHECK (Fare >= 0 AND Fare <= 500),
    
    Travel_Status SMALLINT CHECK (Travel_Status IN (0, 1)), -- Alone, NotAlone
    Embark SMALLINT CHECK (Embark IN (0, 1, 2)), -- Cherbourg, Queenstown, Southampton
    Title SMALLINT CHECK (Title IN (0, 1, 2, 3, 4)), -- Master, Miss, Mr, Mrs, Rare
    
    Survival_status BOOLEAN,
    
    Model_used INTEGER REFERENCES Models(Model_id),
    Created_by INTEGER REFERENCES Registered_User(User_id)
);
