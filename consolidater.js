const excelModules = require("./excel.js")
const fs = require("fs")
const mailerModules = require("./mailer.js");
const {ATTACHMENT_NAME, HEADER_CELLS, ROW_VALUES, SHEET, STATUS_SUCCESS, STATUS_INTERNAL_SERVER_ERROR} = require("./constants");
const mailer = require("./mailer.js");

// Import the necessary modules

const headerCells = HEADER_CELLS;
const rowValues = ROW_VALUES;
const fileOutput = ATTACHMENT_NAME;
// const fileName = 'testFile.xlsx';



async function main(rowValues) {
try{
    // 
    
    
    console.log("before if-else")
    // if (fileOutput !== fileName) {
        
    //     console.log("inside if");

        const newWorkbook = excelModules.createExcel(SHEET, headerCells);
        const sheet = newWorkbook.getWorksheet( SHEET);
        // Promise.all(excelModules.addNewRow(sheet, rowValues), newWorkbook.xlsx.writeFile(fileOutput), mailer.sendMail(fileOutput) )
        await excelModules.addNewRow(sheet, rowValues);
        await newWorkbook.xlsx.writeFile(fileOutput);
        const response = await mailer.sendMail(fileOutput);
        if (response === undefined) {
            (console.log("Success Status :" + STATUS_SUCCESS)); 
            return STATUS_SUCCESS;
        }
        else {
            console.log("Error Status :" + STATUS_INTERNAL_SERVER_ERROR);
            return STATUS_INTERNAL_SERVER_ERROR;
        }
    // }else {
    //     console.log("inside else");
    //     const workbook = excelModules.copyBook();
    //     workbook.xlsx.readFile(ATTACHMENT_NAME).then (() =>{
    //         const sheet = workbook.getWorksheet(SHEET);
    //         excelModules.addNewRow(sheet, rowValues);
    //         workbook.xlsx.writeFile(fileOutput);
    //         return workbook;

    //     })
    // }

}catch(e){
    console.log("Error: " + e.message, e);
}
}


module.exports = {
    main
};
