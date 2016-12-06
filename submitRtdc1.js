//==============================================================================
// submitRtdc.js
//
// checks to ensure all required input fields are not blank;
// confirms times are correctly entered - all digits, hour < 24, minute < 60;
// displays any errors to the screen for the user to correct;
// calculates and displays the codes for Rt and Dc;
//------------------------------------------------------------------------------
function submitRtDc()
{

  var synoPeriod = getOptionText("synoPeriod");
  var numPeriods = getOptionText("numPeriods");
  var sFirst = document.getElementById("sFirst").value;
  var eFirst = document.getElementById("eFirst").value;
  var sLast = document.getElementById("sLast").value;
  var eLast = document.getElementById("eLast").value;
  var checkBox = document.getElementById("chkbx").checked;
  
  var errorWrapper = document.getElementById("errors");
  var errorMessage = "";
  
  // check to see if any of the required field are empty
  // alert error message if message is not an empty string
  errorMessage = checkRequiredInput(synoPeriod, numPeriods, sFirst, eFirst, sLast, eLast);
  if (errorMessage != "") return errorWrapper.innerHTML = errorMessage;
  
  // if number of periods is 2, validates times for both periods
  // else, validates times for first period only
  // alert error message if message is not an empty string
  errorMessage = checkTimesValid(numPeriods, sFirst, eFirst, sLast, eLast);
  if (errorMessage != "") return errorWrapper.innerHTML = errorMessage;
  
  
}

//==============================================================================
// checkRequiredInput()
//
// check to see if any of the required fields are empty,
// if so, returns the error messages to be displayed in alert
//------------------------------------------------------------------------------
function checkRequiredInput(s, n, sF, eF, sL, eL)
{
  var e = "";
  
  if (s == "--") e = (e + "> Synoptic period not selected.<br>");
  if (n == "--") e = (e + "> Number of periods not selected.<br>");
  
  if (sF == "") e = (e + "> Start of first period not entered.<br>");
  if (eF == "") e = (e + "> End of first period not entered.<br>");
  
  if (n == "2")
  {
    if (sL == "") e = (e + "> Start of last period not entered.<br>");
    if (eL == "") e = (e + "> End of last period not entered.<br>");
  }
  return e;
}

//==============================================================================
// checkTimesValid()
//
// checks validity of start and end times for one or both periods
//------------------------------------------------------------------------------
function checkTimesValid(n, sF, eF, sL, eL)
{
  var e = "";
  
  if (!checkTimeFormat(sF)) e = (e + "> Start of first period is invalid.<br>");
  if (!checkTimeFormat(eF)) e = (e + "> End of first period is invalid.<br>");
  
  if (n == "2")
  {
    if (!checkTimeFormat(sL)) e = (e + "> Start of last period is invalid.<br>");
    if (!checkTimeFormat(eL)) e = (e + "> End of last period is invalid.<br>");
  }
  
  return e;
}

//==============================================================================
// checkTimesValid()
//
// checks format of start and end times, and returns any errors
//------------------------------------------------------------------------------
function checkTimeFormat(t)
{
  // check start and end of first period
  if (t.length != 4) return false;
  
  // check if text has non-digit characters
  for (var i = 0; i < t.length; i++)
  {
    if (isNaN(parseInt( t.charAt(i) ))) return false;
  }
  
  // check hour < 24 and minute < 60
  if (parseInt(t.substr(0,2)) > 23 && parseInt(t.substr(2,4)) > 59) return false;
    
  return true;
}





//==============================================================================
// sets the visted flag to "1" so when refreshed the form will 
// be reset to hold empty or default strings
//------------------------------------------------------------------------------
function clearRtDc()
{
  document.getElementById("formRtdc").reset();
  document.getElementById("visited").value = "1";
  
  var lastPeriod = document.getElementById("lastPeriod");
  lastPeriod.setAttribute('class', "hidden");
  
  document.getElementById("errors").innerHTML = ">";

  return false;  
}
  
//==============================================================================
// sets the visted flag to "1" so when refreshed the form will 
// be reset to hold empty or default strings
//------------------------------------------------------------------------------
function checkRefresh()
{
  visited = document.getElementById("visited").value;
  if (visited != "") // a fresh page
  {
    document.getElementById("formRtdc").reset();
  }
  document.getElementById("visited").value = "1";
}

//==============================================================================
// gets text of the currently selected option element
//------------------------------------------------------------------------------  
function getOptionText(elementId)
{
  var elt = document.getElementById(elementId);

  if (elt.selectedIndex == -1)
  {
    return null;
  }

  return elt.options[elt.selectedIndex].text;
}

//==============================================================================
// shows or hides the last period input wrapper based on 
// the selected number of periods
//------------------------------------------------------------------------------
function showLastPeriod() 
{
  var numPeriods = getOptionText("numPeriods");
  
  var lastPeriod = document.getElementById("lastPeriod");

  if(numPeriods != "2")
  {
    lastPeriod.setAttribute('class', "hidden");
  }
  else
  {
    lastPeriod.setAttribute('class', "visible");
  }
}
