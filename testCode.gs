function test(){
  var officerPortal = SpreadsheetApp.openById("1gW2ia2udhnlK48jZ65oD-Ufuu-YFyQMrbFwqHpZ4d0Q");
  var portalSheets = officerPortal.getSheets();
  var portalSheetsNum = officerPortal.getNumSheets();
  Logger.log(portalSheets);
  Logger.log(portalSheetsNum);
  var portalSheetArray = [];
  for (var i = 0; i < portalSheetsNum; i++) {
    portalSheetArray.push([portalSheets[i].getName()])
  }
  Logger.log(portalSheetArray);
  var storageArray = [];
  for (var i = 0; i < portalSheetsNum; i++) {
    var tempVar = portalSheetArray[i].getName(); tempVar = tempVar.toString();
    if(tempVar.toString().includes("11/") || tempVar.includes("12/") || tempVar.includes("1/") || tempVar.includes("2/")){
      storageArray.push(portalSheetArray[i]);
    }
  }
  Logger.log(storageArray);
}




function SendSheetAsXlsxAttach() {
  try {
    /*Get your Spreadsheet */
    var ss = SpreadsheetApp.openById(SpreadsheetApp.getActiveSpreadsheet().getId());
    /*Create URL to Export as xlsx */
    var url = "https://docs.google.com/feeds/download/spreadsheets/Export?key=" + ss.getId() + "&exportFormat=xlsx";
    var params = {
      method: "get",
      /*add authorization to get the file */
      headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() },
      muteHttpExceptions: true
    };
    /* with an http query get the blob file */
    var blob = UrlFetchApp.fetch(url, params).getBlob();
    /* sets the file extension */
    blob.setName(ss.getName() + ".xlsx");
    /* Send Mail with attachments */
    Logger.log("Sending File");
    MailApp.sendEmail("tykruse2@gmail.com", "Subject", "This mail contains .XLSX file attached", { attachments: [blob] });
  } catch (f) {
    Logger.log(f.toString());
  }
}

function sendToStorage(sheetName){
//Adding the old shift log into storage
 Logger.log(ShiftLogName);
 var dest = SpreadsheetApp.openById("1XW3hMBYiRPTe902VVWKOc2M051pXVfQPZ6caNenk9w0");
 var CopiedLog = ShiftLogDay.copyTo(dest);
 CopiedLog.setName(sheetName);
 dest.setActiveSheet(dest.getSheetByName(sheetName));
 dest.moveActiveSheet(1);
}

function sorterTest(){

  var officersRow = [5, 7, 17, 12, 18, 9, 19, 10, 20, 13, 8, 14, 22, 15, 21];

  var firstShiftArray = ["Ty  1", "Jim  1430-1700", "Gage  16 - 07"];
  sorter(firstShiftArray);
}
// + " "+ value.toString()
function sorter(array){
  var splitArray = [];
  var splitInt = 0;
  for(var i = 0; i < array.length; i++){
    if(array[i].includes("0") || array[i].includes("1")){
      var tempSplitArray = array[i].split("  ");
      if(splitInt !=0){
        splitArray.push(tempSplitArray[0]);
        splitArray.push(tempSplitArray[1]);
      }else{splitArray = tempSplitArray}
      //Logger.log("Split Array: " + splitArray + " splitArray Name: " + splitArray[0]);
      array[i] = array[i].replace(array[i], splitArray[splitInt]);
      splitInt = splitInt + 2;
    }
  }
  //Logger.log("Split Array: " + splitArray);
  //Logger.log(array);
  var officersName = ['Josh'/*5*/, 'Jim'/*7*/, 'Eric'/*17*/, 'Ty'/*12*/, 'Terry'/*18*/, 'Angela'/*9*/, 'Jeff'/*19*/, 'Kris'/*10*/, 'Marquise'/*20*/, 'Collin'/*13*/, 'Gavin'/*8*/, 'Lisa'/*14*/, 'Mike'/*22*/, 'Gage'/*15*/, 'Jody'/*21*/];
  var sorterArray = [];
  for(var i = 0; i < array.length; i++){sorterArray.push(officersName.indexOf(array[i]));}
  sorterArray.sort(function(a, b){return a - b});
  //Logger.log(sorterArray);
  array = [];
  for(var i = 0; i < sorterArray.length; i++){array.push(officersName[sorterArray[i]]);}
  if(splitInt != 0){
    var counter = 0;
    for(var k = 0; k < splitInt/2; k++){
      var splitArrayComb = splitArray[counter] +" "+ splitArray[counter+1];
      //Logger.log(splitArrayComb);
      //Logger.log(array[array.indexOf(splitArray[counter])]);
      array[array.indexOf(splitArray[counter])] = array[array.indexOf(splitArray[counter])].replace(splitArray[counter], splitArrayComb);
      counter = counter+2;
    }
  }
  //Logger.log(array);
  return array
}

function OLDsorter(array){
  var officersName = ['Josh'/*5*/, 'Jim'/*7*/, 'Eric'/*17*/, 'Ty'/*12*/, 'Terry'/*18*/, 'Angela'/*9*/, 'Jeff'/*19*/, 'Kris'/*10*/, 'Marquise'/*20*/, 'Collin'/*13*/, 'Gavin'/*8*/, 'Lisa'/*14*/, 'Mike'/*22*/, 'Gage'/*15*/, 'Jody'/*21*/];
  var sorterArray = [];
  for(var i = 0; i < array.length; i++){sorterArray.push(officersName.indexOf(array[i]));}
  sorterArray.sort(function(a, b){return a - b});
  array = [];
  for(var i = 0; i < sorterArray.length; i++){array.push(officersName[sorterArray[i]]);}
  return array
}

function  currentUser(){
  var email = Session.getActiveUser().getEmail();
  Logger.log(email);
}

function allSheetNames() {
  //unused
  let ss = SpreadsheetApp.getActive();
  let sheets = ss.getSheets();
  let sheetNames = [];
  sheets.forEach(function (sheet) {
    sheetNames.push(sheet.getName());
  });
  return sheetNames;
}

function portalLoadOrder(){
  //load order of Officer Portal
  var portalOrder = [
    "SCHEDULE", "PARKING", "Housing", "PANIC ALARMS", "PHONE LIST", "TEMP CARDS", "DEACTIVATIONS", "ESA / ESports", "LOCK UPS", "KEY LIST", "NAEGELE", "LOCK OUTS", "SCHED ARCHIVE", "Settings", "COPY"];
  var orderStart = 8 + 1;
  var orderEnd = portalOrder.length + orderStart;

  var officerPortal = SpreadsheetApp.getActiveSpreadsheet();
  if (officerPortal.getSheetByName(portalOrder[0]).length <= 8){
    return;
  }else{
    var load = officerPortal.getSheets();
    var eighthsDaySheet = load[orderStart - 1].getName();
    if (eighthsDaySheet == portalOrder[0]){return;}
    var sheetOne = load[0].getName();
    officerPortal.setActiveSheet(officerPortal.getSheetByName(eighthsDaySheet));
    officerPortal.moveActiveSheet(orderEnd + 2);

    //Im keeping this in just incase: this will reorganize the important sheets into the same order that "portalOrder" is in.
    //for(var j = 1; j < portalOrder.length + 1; j++){
      //var load = j - 1;
      //officerPortal.setActiveSheet(officerPortal.getSheetByName(portalOrder[load]));
      //officerPortal.moveActiveSheet(orderStart + load);
  }
  officerPortal.setActiveSheet(officerPortal.getSheetByName(sheetOne));
  }

  function sendToStorage(){
//Adding the old shift log into storage
 var ShiftLogDay = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 var ShiftLogName = ShiftLogDay.getName();
 Logger.log(ShiftLogName);
 var dest = SpreadsheetApp.openById("11TsvcG-fJEc3s1UyktM0ZPBSLq8pczYv1Vo1xwzrU0E");
 var CopiedLog = ShiftLogDay.copyTo(dest);
 CopiedLog.setName(ShiftLogName);
 dest.setActiveSheet(dest.getSheetByName(ShiftLogName));
 dest.moveActiveSheet(1);
}
