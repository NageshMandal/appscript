function updateDashboard() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dataSheet = ss.getSheetByName("Post August");
    var dashboardSheet = ss.getSheetByName("Dashbord");
    
    // Clear existing data in Dashboard sheet
    dashboardSheet.getRange("A1:C").clearContent();
    
    // Get all values from the data sheet
    var data = dataSheet.getRange("A1:D" + dataSheet.getLastRow()).getValues();
    
    // Initialize variables for storing totals
    var totals = {};
    
    // Loop through the data to calculate totals
    for (var i = 0; i < data.length; i++) {
      var dateValue = new Date(data[i][1]);
      
      // Check if the date is valid
      if (!isNaN(dateValue.getTime())) {
        var date = Utilities.formatDate(dateValue, ss.getSpreadsheetTimeZone(), "dd/MM/yyyy");  // Format the date
        
        // Update the total for the date
        if (!totals[date]) {
          totals[date] = 0;
        }
        totals[date] += 1;  // Adding 1 for each row
      }
    }
    
    // Calculate totals and differences
    var dates = Object.keys(totals).sort();  // Sort dates
    var cumulativeTotal = 0;  // Initialize cumulative total
    
    for (var i = 0; i < dates.length; i++) {
      var date = dates[i];
      var total = totals[date];
      dashboardSheet.getRange(i + 2, 1).setValue(date);
      
      // Calculate cumulative total
      cumulativeTotal += total;
      dashboardSheet.getRange(i + 2, 2).setValue(cumulativeTotal);
      
      // Calculate and set the difference
      if (i > 0) {
        var prevDate = dates[i - 1];
        var prevTotal = dashboardSheet.getRange(i + 1, 2).getValue();
        dashboardSheet.getRange(i + 2, 3).setValue(cumulativeTotal - prevTotal);
      } else {
        dashboardSheet.getRange(i + 2, 3).setValue("");  // No difference for the first date
      }
    }
  }

  
  function onEdit(e) {
    var sheet = e.source.getActiveSheet();
    var range = e.range;
    var column = range.getColumn();
    var row = range.getRow();
    
    // Check if edited cell is in column C and the sheet name is correct
    if (column == 4 && sheet.getName() == "Post August") {
      var dateCell = sheet.getRange(row, 2); 
      var timeCell = sheet.getRange(row, 3); 
      var cellRow1 = sheet.getRange(row, 1); 
      
      // Set date and time
      dateCell.setValue(new Date()).setNumberFormat("dd-mm-yyyy");
      timeCell.setValue(new Date()).setNumberFormat("hh:mm");
      cellRow1.setValue("1");
      
      // Find the last non-empty cell in column 1
      var lastRow = sheet.getLastRow();
      var lastValueRow1 = sheet.getRange("A1:A" + lastRow).getValues().flat().filter(String).length;
      
      // Sum values in column 1 (from row 1 to the last non-empty row) and update the cell after that
      var sumRange = sheet.getRange(1, 1, lastValueRow1, 1);
      var values = sumRange.getValues().flat();
      var sum = values.reduce(function(acc, val) {
        return acc + Number(val);
      }, 0);
      sheet.getRange(lastValueRow1 + 1, 1).setValue(sum);
    }
  }
  