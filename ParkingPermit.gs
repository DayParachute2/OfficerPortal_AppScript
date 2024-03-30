function parkingshiftRowDown(){
  var OfficerPortal = SpreadsheetApp.getActiveSpreadsheet();
  var portalParking = SpreadsheetApp.setActiveSheet(OfficerPortal.getSheetByName("PARKING"));
  var permitNumber = portalParking.getRange(3, 1).getValues();
  var convert = parseInt(permitNumber);
  parkingmoverange();
  newNumber = convert + 1
  var permitNumber = OfficerPortal.getSheetByName("PARKING").getRange(3, 1).setValue(newNumber.toString());
  for(i = 2; i < 5; i++){portalParking.getRange("P1").copyTo(portalParking.getRange(3, i));;}
  
}

function parkingmoverange(){
  var OfficerPortal = SpreadsheetApp.getActiveSpreadsheet();
  var portalParking = SpreadsheetApp.setActiveSheet(OfficerPortal.getSheetByName("PARKING"));
  var Rowrange = portalParking.getRange("A4:O4");
  Logger.log("Inserting blank row in A4:O4");
  Rowrange.insertCells(SpreadsheetApp.Dimension.ROWS);
  Logger.log("Copying A3:O3 and bringing it down to A4");
  portalParking.getRange("A3:O3").copyTo(portalParking.getRange("A4"));
  Logger.log("Clearing A3:O3");
  portalParking.getRange("P2:AD2").copyTo(portalParking.getRange("A3"));
}
