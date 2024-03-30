var OfficerPortal = SpreadsheetApp.getActiveSpreadsheet();
var date = Utilities.formatDate(new Date(), "GMT-4", "MM/dd"); //This is used to name the new days sheet. Example "5/21"
if(date.charAt(0) == "0"){date = date.substring(1);}//removes the "0" infront of the date if needed

function createNewDay() { //This Functions creates the new days Shift Roster
 var CopySheet = OfficerPortal.getSheetByName("COPY"); //What ever sheet is named at the end is what gets coppied to the new day
 var dateCell = "R2";//Location of the date cell
 var dayCell = "M2";//Location of the Day Cell
 var dayDate = new Date().getDay();
  switch (dayDate) {//this is how we get the day to be in word format
  case 0:day = "Sunday";break;
  case 1:day = "Monday";break;
  case 2:day = "Tuesday";break;
  case 3:day = "Wednesday";break;
  case 4:day = "Thursday";break;
  case 5:day = "Friday";break;
  case 6:day = "Saturday";
}
Logger.log("Creating New Day Now");
 try{var asn = CopySheet.copyTo(OfficerPortal).setName(date);}//The new day gets created here
 catch(TypeError){new Error( "A sheet named " + date + " already exists, either delete this or try again later." );}
 asn.getRange(dateCell).setValue(date);//sets the date in the sheet
 asn.getRange(dayCell).setValue(day); //sets the day in the sheet
 OfficerPortal.setActiveSheet(OfficerPortal.getSheetByName(date));//makes the new day into the main sheet
 OfficerPortal.moveActiveSheet(1);//moves the new day to the 1st possition in the portal
 Logger.log("New Day Created! Sheet Name: " + date)
}

function officersScheduled(){//This Function is whats adds who works that day
  Logger.log("Starting officersSheduled()");
  var scheduleSheet = OfficerPortal.getSheetByName("SCHEDULE");//This needs to be whatever the schedule sheet is named
  var officersName = ['Josh'/*5*/, 'Jim'/*7*/, 'Eric'/*17*/, 'Ty'/*12*/, 'Terry'/*18*/, 'Angela'/*9*/, 'Jeff'/*19*/, 'Kris'/*10*/, 'Marquise'/*20*/, 'Collin'/*13*/, 'Gavin'/*8*/, 'Lisa'/*14*/, 'Mike'/*22*/, 'Gage'/*15*/, ' '/*21*/];//this is every officer listed by seniority
  var officersRow = [5, 7, 17, 12, 18, 9, 19, 10, 20, 13, 8, 14, 22, 15, 21];//this goes with the list above and is the officers Row on the schedule
  var adminShiftArray = [];//this and the ones below like this one are just getting the name ready for use
  var firstShiftArray = [];
  var secondShiftArray = [];
  var thirdShiftArray = [];
  var calledOutArray = [];
  var requestOffArray = [];
  var vacationArray = [];
  var scheduleDate = Utilities.formatDate(new Date(), "GMT-4", "d-MMM");//this is what ever the date format is used on the schedule. Example "5-FEB"
  var fd = scheduleSheet.createTextFinder(scheduleDate).findAll();//finds the location of the current date in the schedule
  if (fd.length > 0) {//this will get the column location of the current date
    for (var id = 0; id < fd.length; id++) {
      Logger.log("Schedule Date Column: " + fd[id].getColumn())
      Column = fd[id].getColumn()//gets column here
    }
  }
  for (var j = 1; j < 4; j++) {//repeates this part of the code 3 times (1 for each shift)
    var fs = scheduleSheet.createTextFinder(j).findAll();//finds the location of all the 1s, 2s, and 3s.
    if (fs.length > 0) {//only activates if there is a shift
      for (var is = 0; is < fs.length; is++) {//activates for the amount of times a shift apears
        if (fs[is].getColumn() == Column && fs[is].getRow() > 4) {// activates only if the value is in the correct column and in below line 4
          var value = fs[is].getValue();
          var valueCharAt = value.toString().substring(0, 2);
          parseInt(valueCharAt);
          Logger.log("Officer " + officersName[officersRow.indexOf(fs[is].getRow())] + " Current Row " + fs[is].getRow() + " Row Value " + value + " ValueCharAt " + valueCharAt);
          if(value.toString().charAt(0) == j.toString() && valueCharAt.length == 1){//activates only if the shift contains 1 number
            if(officersName[officersRow.indexOf(fs[is].getRow())] != "Josh"){//check to see if the person working isnt josh.
              if(j == 1){firstShiftArray.push(officersName[officersRow.indexOf(fs[is].getRow())])}//add to first shifts array.
              if(j == 2){secondShiftArray.push(officersName[officersRow.indexOf(fs[is].getRow())])}//add to second shifts array.
              if(j == 3){thirdShiftArray.push(officersName[officersRow.indexOf(fs[is].getRow())])}//add to third shifts array.
            }else{adminShiftArray.push(officersName[officersRow.indexOf(fs[is].getRow())])}//adds josh to admin array
          }
        }
      }
    }
  }
  var fr = scheduleSheet.createTextFinder("R/O").findAll();//finds location of everyone with R/O
  for (var ir = 0; ir < fr.length; ir++) {//activates for the amount of times that R/O appeared that day
    if (fr[ir].getColumn() == Column && fr[ir].getRow() > 4) {// activates only if the value is in the correct column and in below line 4
    Logger.log("Row " + fr[ir].getRow() + " Value " + fr[ir].getValue());
    if(fr[ir].getValue().includes("1") || fr[ir].getValue().includes("2") || fr[ir].getValue().includes("3")){//activates is they requested off a day that they worked
      requestOffArray.push(officersName[officersRow.indexOf(fr[ir].getRow())]);}}}//adds them the the request off array
  var fc = scheduleSheet.createTextFinder("C/O").findAll();//finds location of everyone with C/O
  for (var ic = 0; ic < fc.length; ic++) {//activates for the amount of times that C/O appeared that day
    if (fc[ic].getColumn() == Column && fc[ic].getRow() > 4) {// activates only if the value is in the correct column and in below line 4
    Logger.log("Row " + fc[ic].getRow() + " Value " + fc[ic].getValue());
    if(fc[ic].getValue().includes("1") || fc[ic].getValue().includes("2") || fc[ic].getValue().includes("3")){//activates is they requested off a day that they worked
      calledOutArray.push(officersName[officersRow.indexOf(fc[ic].getRow())]);}}}//adds them the the called out array
  var fv = scheduleSheet.createTextFinder("V").findAll();//finds location of everyone with V
  for (var iv = 0; iv < fv.length; iv++) {//activates for the amount of times that V appeared that day
    if (fv[iv].getColumn() == Column && fv[iv].getRow() > 4) {// activates only if the value is in the correct column and in below line 4
    Logger.log("Row " + fv[iv].getRow() + " Value " + fv[iv].getValue());
    if(fv[iv].getValue().includes("1") || fv[iv].getValue().includes("2") || fv[iv].getValue().includes("3")){//activates is they requested off a day that they worked
      vacationArray.push(officersName[officersRow.indexOf(fv[iv].getRow())]);}}}//add to the vacation  array.
  var f0 = scheduleSheet.createTextFinder(0).findAll();//finds location of everyone with 0
  for (var i0 = 0; i0 < f0.length; i0++) {//activates for the amount of times that 0 appeared that day
    var tempValue = f0[i0].getValue();
    if (f0[i0].getColumn() == Column && f0[i0].getRow() > 4 && !tempValue.includes("O")) {// activates only if the value is in the correct column and in below line 4 and doesnt contain an O
    var value = f0[i0].getValue();
    Logger.log("Row " + f0[i0].getRow() + " Value " + f0[i0].getValue());
    var valueCharAt = value.toString().substring(0, 2);
    if(valueCharAt.length > 1){//activates if its not just a random 0
          if(valueCharAt > 5 && valueCharAt < 12){//If there time is between 05:00 and 12:00 this If statement adds them to the fist shift array with there updated time
            if(f0[i0].getRow() != 5){//This activates if it isnt Josh
              firstShiftArray.push(officersName[officersRow.indexOf(f0[i0].getRow())]+ "  "+ value.toString()); 
              value = "1";
              Logger.log("Abnormal Shift " + value + "  " + officersName[officersRow.indexOf(f0[i0].getRow())])
          }else{adminShiftArray.push(officersName[0] + "  "+ value.toString())}}//This activates if it is Josh and adds him to the admin shift array
          if(valueCharAt > 12 && valueCharAt < 19){//If there time is between 12:00 and 19:00 this If statement adds them to the second shift array with there updated time
            if(f0[i0].getRow() != 5){//This activates if it isnt Josh
              secondShiftArray.push(officersName[officersRow.indexOf(f0[i0].getRow())]+ "  "+ value.toString()); 
              value = "2";
              Logger.log("Abnormal Shift " + value + "  " + officersName[officersRow.indexOf(f0[i0].getRow())])
          }else{adminShiftArray.push(officersName[0] + "  "+ value.toString())}}//This activates if it is Josh and adds him to the admin shift array
          if(valueCharAt > 19 && valueCharAt < 24){//If there time is between 19:00 and 24:00 this If statement adds them to the third shift array with there updated time
            if(f0[i0].getRow() != 5){//This activates if it isnt Josh
              thirdShiftArray.push(officersName[officersRow.indexOf(fs[is].getRow())]+ "  "+ value.toString()); 
              value = "3";
              Logger.log("Abnormal Shift " + value + "  " + officersName[officersRow.indexOf(f0[i0].getRow())])
          }else{adminShiftArray.push(officersName[0] + "  "+ value.toString())}}//This activates if it is Josh and adds him to the admin shift array
          if(valueCharAt >= 0 && valueCharAt < 5){//If there time is between 00:00 and 05:00 this If statement adds them to the third shift array with there updated time
            if(f0[i0].getRow() != 5){//This activates if it isnt Josh
              thirdShiftArray.push(officersName[officersRow.indexOf(f0[i0].getRow())]+ "  "+ value.toString()); 
              value = "3"; 
              Logger.log("Abnormal Shift " + value + "  " + officersName[officersRow.indexOf(f0[i0].getRow())])
          }else{adminShiftArray.push(officersName[0] + "  "+ value.toString())}}//This activates if it is Josh and adds him to the admin shift array
        }
      }
    }
  var newDaySheet = OfficerPortal.getSheetByName(date);
  var adminShiftSpots = ['D5', 'F5']//This hold every cell the admin can be in starting with the first
  var firstShiftSpots = ["D7", "D8", "F7", "F8"]//This hold every cell for 1st shift starting with the OIC spot
  var secondShiftSpots = ["D19", "D20", "F20", "F19"]//This hold every cell for 2nd shift starting with the OIC spot
  var thirdShiftSpots = ["L4", "L5", "N5", "L6", "N6", "N4"]//This hold every cell for 3rd shift starting with the OIC spot
  Logger.log("Adding Admin Shift: " + adminShiftArray);
  for (var fss = 0; fss <= adminShiftArray.length; fss++) {newDaySheet.getRange(adminShiftSpots[fss]).setValue(adminShiftArray[fss]);}//Adds the admin to the admin spots in the shift roster
  Logger.log("Adding 1st Shift: " + firstShiftArray);
  for (var fss = 0; fss <= firstShiftArray.length; fss++) {newDaySheet.getRange(firstShiftSpots[fss]).setValue(sorter(firstShiftArray)[fss]);}//adds 1st shift to there spots in shift roster
  Logger.log("Adding 2nd Shift: " + secondShiftArray);
  for (var sss = 0; sss <= secondShiftArray.length; sss++) {newDaySheet.getRange(secondShiftSpots[sss]).setValue(sorter(secondShiftArray)[sss]);}//adds 2nd shift to there spots in shift roster
  Logger.log("Adding 3rd Shift: " + thirdShiftArray);
  for (var tss = 0; tss <= thirdShiftArray.length; tss++) {newDaySheet.getRange(thirdShiftSpots[tss]).setValue(sorter(thirdShiftArray)[tss]);}//adds 3rd shift to there spots in shift roster

  if(calledOutArray.length > 0){//This If statements will color the officers time card yellow and add C/O if they would have worked that day
    Logger.log("Call Outs: " + calledOutArray);
    for(var ico = 0; ico < calledOutArray.length; ico++){
      var fnco = newDaySheet.createTextFinder(calledOutArray[ico]).findAll();
      Logger.log("C/O fnco Value: " + fnco[0].getValue() + " fnco Row: " + fnco[0].getRow());
      newDaySheet.getRange(fnco[0].getRow(), 18).setValue("C/O");
        for(var k = 0; k < 4; k++){
          newDaySheet.getRange(fnco[0].getRow(), k+18).setBackground("#999999");}}
  }
  if(requestOffArray.length > 0){//This If statements will color the officers time card light green 2 and add R/O if they would have worked that day
    Logger.log("Requests Off: " + requestOffArray);
    for(var iro = 0; iro < requestOffArray.length; iro++){
      var fnro = newDaySheet.createTextFinder(requestOffArray[iro]).findAll();
      Logger.log("R/O fnro Value: " + fnro[0].getValue() + " fnro Row: " + fnro[0].getRow());
      newDaySheet.getRange(fnro[0].getRow(), 18).setValue("R/O");
        for(var k = 0; k < 4; k++){
          newDaySheet.getRange(fnro[0].getRow(), k+18).setBackground("#b6d7a8");}}
  }
  if(vacationArray.length > 0){//This If statements will color the officers time card light green 2 and add VAC if they would have worked that day
    Logger.log("Vacation: " + vacationArray);
    for(var ivo = 0; ivo < vacationArray.length; ivo++){
      var fnvo = newDaySheet.createTextFinder(vacationArray[ivo]).findAll();
      Logger.log("VAC fnvo Value: " + fnvo[0].getValue() + " fnvo Row: " + fnvo[0].getRow());
      newDaySheet.getRange(fnvo[0].getRow(), 18).setValue("VAC");
        for(var k = 0; k < 4; k++){
          newDaySheet.getRange(fnvo[0].getRow(), k+18).setBackground("#b6d7a8");}}
  }
}

function sorter(array){//This Function will sort each shift into seniority and is called apon in the officersScheduled() function when adding them to the shift roster
  var splitArray = [];
  var splitInt = 0;
  for(var i = 0; i < array.length; i++){//activates for each officer in the shifts array
    if(array[i].includes("0") || array[i].includes("1")){//activates if they work an odd shift (looks for and 0s or 1s)
      var tempSplitArray = array[i].split("  ");//separates the name from the time
      if(splitInt !=0){
        splitArray.push(tempSplitArray[0]);
        splitArray.push(tempSplitArray[1]);
      }else{splitArray = tempSplitArray}
      //Logger.log("Split Array: " + splitArray + " splitArray Name: " + splitArray[0]);
      array[i] = array[i].replace(array[i], splitArray[splitInt]);//adds them back to the shifts array without the numbers so the next part will work
      splitInt = splitInt + 2;
    }
  }
  var officersName = ['Josh'/*5*/, 'Jim'/*7*/, 'Eric'/*17*/, 'Ty'/*12*/, 'Terry'/*18*/, 'Angela'/*9*/, 'Jeff'/*19*/, 'Kris'/*10*/, 'Marquise'/*20*/, 'Collin'/*13*/, 'Gavin'/*8*/, 'Lisa'/*14*/, 'Mike'/*22*/, 'Gage'/*15*/, 'Jody'/*21*/];
  var sorterArray = [];
  for(var i = 0; i < array.length; i++){sorterArray.push(officersName.indexOf(array[i]));}//adds everyone from the shift array to the sorter array as numbers
  sorterArray.sort(function(a, b){return a - b});//sorts everyone on that shift based on their index in the officersName Array
  array = [];
  for(var i = 0; i < sorterArray.length; i++){array.push(officersName[sorterArray[i]]);}//adds them back to the shift array in order
  if(splitInt != 0){//this activates if someone of that shift worked odd hours
    var counter = 0;
    for(var k = 0; k < splitInt/2; k++){//activates for everytime someone on that shift worked odd hours
      var splitArrayComb = splitArray[counter] +" "+ splitArray[counter+1];
      array[array.indexOf(splitArray[counter])] = array[array.indexOf(splitArray[counter])].replace(splitArray[counter], splitArrayComb);
      counter = counter+2;
    }
  }
  return array
}

function onExec(){
  createNewDay()
  officersScheduled()
}
