var urldb = "https://docs.google.com/spreadsheets/d/1gW2ia2udhnlK48jZ65oD-Ufuu-YFyQMrbFwqHpZ4d0Q/";

var ss = SpreadsheetApp.getActiveSpreadsheet();
var hs = ss.getSheetByName("Housing");
var ls = ss.getSheetByName("LOCK OUTS");
var searchValue = ls.getRange(3,5).getValue();

function SearchTotal(searchValue){
  Logger.log(searchValue);
  parseInt(searchValue);
  var totalArray = 0;
  var f = ls.createTextFinder(searchValue).findAll();
  Logger.log(f.length);
  if (f.length > 0) {
    for (var i = 0; i < f.length; i++) {
      if (f[i].getColumn() == 5) {
        Logger.log("found you" + f[i].getValue() + " " + f[i].getRow())
        totalArray = totalArray + 1
      }
    }
  }
  return totalArray;
}

function SearchVal(searchValue){
  Logger.log(searchValue);
  parseInt(searchValue);
  var f = hs.createTextFinder(searchValue).findAll();
  Logger.log(f.length);
  if (f.length > 0) {
    for (var i = 0; i < f.length; i++) {
      if (f[i].getColumn() == 1) {
        Logger.log("found you" + f[i].getValue() + " " + f[i].getRow())
        Row = f[i].getRow()
      }
    }
  }
  Logger.log(hs.getRange(Row, 3).getValue() + " " + hs.getRange(Row, 2).getValue() + " " + hs.getRange(Row, 7).getValue() + " " + hs.getRange(Row, 8).getValue());
  return addInfo(hs.getRange(Row, 7).getValue(), hs.getRange(Row, 8).getValue(), hs.getRange(Row, 3).getValue(), hs.getRange(Row, 2).getValue(), SearchTotal(searchValue));
}

function addInfo(building, number, first, last, total){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ls = ss.getSheetByName("LOCK OUTS");

  var todaysDate = Utilities.formatDate(new Date(), "GMT-05:00", "MM/dd/yy");
  var currentTime = Utilities.formatDate(new Date(), "GMT-04:00", "HH:mm");
  ls.getRange(3,2).setValue(currentTime);
  ls.getRange(3,1).setValue(todaysDate);
  ls.getRange(3,3).setValue(building + " " + number);
  ls.getRange(3,4).setValue(first + " " + last);
  ls.getRange(3,8).setValue(total);
  if(total > 2){
    ls.getRange(3,8).setBackground("yellow");
  }
}

function moverange(){
  var Rowrange = ls.getRange("A4:j4");
  Logger.log("Inserting blank row in A4:J4");
  Rowrange.insertCells(SpreadsheetApp.Dimension.ROWS);
  Logger.log("Copying A3:J3 and bringing it down to A4");
  ls.getRange("A3:J3").copyTo(ls.getRange("A4"));
  Logger.log("Clearing A3:J3");
  ls.getRange("N1:W1").copyTo(ls.getRange("A3"));
}

function fillExec(){
  SearchVal(searchValue);
  moverange();
}
