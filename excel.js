const ExcelJs = require('exceljs');
const fs = require('fs');

//   This file will contaion all the methods for exceljs from excel creation to adding sheets 


function createExcel(sheetName, headerCells) {
    try
    {
    const workbook = new ExcelJs.Workbook();
    
        const sheet = workbook.addWorksheet(sheetName, {views: [{showGridLines: false}]});
        sheet.pageSetup.margins = {
            left: 0.7, right: 0.7,
            top: 0.75, bottom: 0.75,
            header: 0.3, footer: 0.3,
            horizontalCentered: true
        };
        sheet.columns = headerCells;
        
        console.log("if this message is shown then it is creating a new workbook");
    return workbook;
    }catch(e){
        console.log("Error: " + e.message, e);
    }

}

function copyBook() {
        try
        {
        const workbook = new ExcelJs.Workbook();
        return workbook;
        }catch(e){
        console.log("Error: " + e.message, e);
    }
}

function getSheet(workbook, sheetName) {
   const sheet = workbook.getWorksheet(sheetName)
}

function addNewSheet(workbook, sheetName, headerCells) {

    const worksheet = workbook.addWorksheet(sheetName, {views: [{showGridLines: false}]});
    worksheet.pageSetup.margins = {
        left: 0.7, right: 0.7,
        top: 0.75, bottom: 0.75,
        header: 0.3, footer: 0.3,
        horizontalCentered: true
    };
    worksheet.columns = headerCells;

    return worksheet

}

function addNewRow(worksheet, rowValue) {
    const newRow = worksheet.addRow(rowValue);
    // console.log(newRow);
    return newRow;
}

// function updateRow(worksheet, rowId, newValue) {

//     const row = worksheet.getRow(rowId);
//     for (let i = 0; i <row.length; i++){

//     }
         
// }

module.exports = {
    createExcel,
    addNewSheet,
    addNewRow,
    copyBook,
    getSheet
}