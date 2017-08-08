// Initialize Global Variables
var synoPeriod = "";
var numPeriods = "";
var sFirst = "";
var eFirst = "";
var sLast = "";
var eLast = "";
var checkBox;
var errorMessage = "";

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
  // set rt and dc codes back to empty string
  document.getElementById("rt").innerHTML = "Rt: ";
  document.getElementById("dc").innerHTML = "Dc: ";
  document.getElementById("errors").innerHTML = ">";

  // store all data passed as input by user
  synoPeriod = getOptionText("synoPeriod");
  numPeriods = getOptionText("numPeriods");

  sFirst = document.getElementById("sFirst").value;
  eFirst = document.getElementById("eFirst").value;
  sLast = document.getElementById("sLast").value;
  eLast = document.getElementById("eLast").value;

  checkBox = document.getElementById("chkbx").checked;

  // initialize error wrapper and message
  var errorWrapper = document.getElementById("errors");

  // check to see if any of the required fields are empty
  errorMessage = checkRequiredInput();
  if (errorMessage != "") return errorWrapper.innerHTML = errorMessage;

  // if number of periods is 2, validates times for both periods
  // else, validates times for first period only
  errorMessage = checkTimesValid();
  if (errorMessage != "") return errorWrapper.innerHTML = errorMessage;

  // check break between periods is greater than 15 minutes
  // otherwise, convert to one period, alert user, and hide
  // last period container from page, set last period fields
  // to empty text and numPeriods to 1
  if (numPeriods == 2 && eFirst+100 > sLast)
    checkPeriodBreak();

  // calculate Rt
  var rt = getRt();
  document.getElementById("rt").innerHTML = "Rt: " + rt;
  // calculate dc
  var dc = getDc();
  document.getElementById("dc").innerHTML = "Dc: " + dc;

  return true;
}

//==============================================================================
// checkRequiredInput()
//
// check to see if any of the required fields are empty,
// if so, returns the error messages to be displayed in alert
//------------------------------------------------------------------------------
function checkRequiredInput()
{
  var e = "";

  if (synoPeriod == "") e = (e + "> Synoptic period not selected.<br>");
  if (numPeriods == "") e = (e + "> Number of periods not selected.<br>");

  if (sFirst == "") e = (e + "> Start of first period not entered.<br>");
  if (eFirst == "") e = (e + "> End of first period not entered.<br>");

  if (numPeriods == "2")
  {
    if (sLast == "") e = (e + "> Start of last period not entered.<br>");
    if (eLast == "") e = (e + "> End of last period not entered.<br>");
  }
  return e;
}

//==============================================================================
// checkTimesValid()
//
// checks validity of start and end times for one or both periods
//------------------------------------------------------------------------------
function checkTimesValid()
{
  var e = "";

  if (checkTimeFormat(sFirst) == 1)
    e = (e + "> Start of first period is invalid.<br>");
  if (checkTimeFormat(eFirst) == 1)
    e = (e + "> End of first period is invalid.<br>");

  if (numPeriods == "2")
  {
    if (checkTimeFormat(sLast) == 1)
      e = (e + "> Start of last period is invalid.<br>");
    if (checkTimeFormat(eLast) == 1)
      e = (e + "> End of last period is invalid.<br>");
  }

  if (e != "") return e;

  // pack variables as integers for calculations
  synoPeriod = parseInt(synoPeriod);
  sFirst = parseInt(sFirst);
  eFirst = parseInt(eFirst);
  if (numPeriods == 2)
  {
    sLast = parseInt(sLast);
    eLast = parseInt(eLast);
  }

  // if synoPeriod and/or end of first or last period, depending on the
  // number of periods selected, is "0000" then convert to "2400" for
  // use in calculations
  if (synoPeriod == 0)
  {
    if (numPeriods == 1 && eFirst == 0)
      eFirst = 2400;
    else if (numPeriods == 2 && eLast == 0)
      eLast = 2400;
    synoPeriod = 2400;
  }

  if (checkBox)
  {
    eFirst += 2400;
    if (numPeriods == 2)
    {
      sLast += 2400;
      eLast += 2400;
    }
    synoPeriod += 2400;
  }

  // start checks
  // if one period of precip selected
  if (numPeriods == "1")
  {
    // check that start is less than end, end is less than or equal to syno,
    // and that end time is within 6hr period
    if (sFirst >= eFirst && sFirst < synoPeriod)
      e = (e + "> Start of period is invalid.<br>");

    if (eFirst < (synoPeriod - 600) || eFirst > synoPeriod)
    {
      e = (e + "> End of period is invalid.<br>");
      alert("If precipitation is occurring on the hour, set the end time equal to the synoptic period.");
    }
  }
  // if 2 periods selected
  else if (numPeriods == "2")
  {
    if (sFirst >= eFirst && sFirst < synoPeriod)
      e = (e + "> Start of first period is invalid.<br>");

    if (eFirst < (synoPeriod - 600) || eFirst >= sLast)
      e = (e + "> End of first period is invalid.<br>");
    if (sLast <= (eFirst) || sLast < (synoPeriod - 600) || sLast >= eLast)
      e = (e + "> Start of last period is invalid.<br>");
    if (eLast <= (sLast) || eLast < (synoPeriod - 600) || eLast > synoPeriod)
      e = (e + "> End of last period is invalid.<br>");
  }
  return e;
}

//==============================================================================
// checkTimeFormat()
//
// checks format of start and end times, and returns any errors
//------------------------------------------------------------------------------
function checkTimeFormat(t)
{
  // check start and end of first period
  if (t.length != 4)
    return 1;

  // check if text has non-digit characters
  for (var i = 0; i < t.length; i++)
  {
    if (isNaN(parseInt( t.charAt(i) )))
      return 1;
  }

  // check hour < 24 and minute < 60
  if ( (parseInt(t.substr(0,2)) > 23) || (parseInt(t.substr(2,4)) > 59) )
    return 1;

  return 0;
}

//==============================================================================
// checkPeriodBreak()
//
// checks to see if break between periods is less than 15 minutes
// if so, clears and hides last period container, resetting fields
//------------------------------------------------------------------------------
function checkPeriodBreak()
{
  str_eFirst = ""+ eFirst +"";
  str_sLast = ""+ sLast +"";
  len_eFirst = str_eFirst.length;
  len_sLast = str_sLast.length;

  // pad text
  if (len_eFirst != 4)
  {
    pads = 4 - len_eFirst;
    str_eFirst = ("0" * pads) + str_eFirst;
  }
  if (len_sLast != 4)
  {
    pads = 4 - len_sLast;
    str_sLast = ("0" * pads) + str_sLast;
  }

  min_eFirst = str_eFirst.substr(2,4);
  min_sLast = str_sLast.substr(2,4);

  if (parseInt(min_sLast) < parseInt(min_eFirst) || parseInt(min_sLast)-15 <= 0)
    min_sLast = ""+ (parseInt(min_sLast) + 60) +"";

  if (parseInt(min_sLast)-15 <= parseInt(min_eFirst))
  {
    // convert to one period...
    // change numPeriods = 1, set sLast and eLast = "",
    numPeriods = 1;
    eFirst = eLast;
    tmp = eFirst;
    if (tmp == "2400") tmp = "0000";
    else if (tmp > "2400")
    {
      tmp = parseInt(tmp)-2400;
      tmp = ""+tmp+"";
      if (tmp.length != 4)
        pads = 4 - tmp.length;
        tmp = "0"*pads + tmp;
    }
    sLast = "";
    eLast = "";

    // change input tags inner html to reflect
    document.getElementById("numPeriods").value = 1;
    document.getElementById("eFirst").value = tmp;
    document.getElementById("sLast").value = "";
    document.getElementById("eLast").value = "";
    // hide the lastPeriod container
    var lastPeriod = document.getElementById("lastPeriod");
    lastPeriod.setAttribute('class', "hidden");
    // alert the user of changes
    alert("Break between periods is less than 15 minues.\nConverted to one period.");
  }
}

//==============================================================================
// getRt()
//
//
//------------------------------------------------------------------------------
function getRt()
{
  if (numPeriods == 2)
  {
    start = sLast;
    end = eLast;
  }
  else
  {
    start = sFirst;
    end = eFirst;
  }

  // if precip occuring or within hour ( syno - start )
  if (end == synoPeriod || end > (synoPeriod - 100))
  {
    if (synoPeriod < start) synoPeriod += 2400;
    duration = synoPeriod - start;
  }
  else // precip not occuring or within hour ( syno - end )
  {
    duration = synoPeriod - end;
  }

  // alert(duration);

  if (duration < 100) return 1;
  else if (duration < 200) return 2;
  else if (duration < 300) return 3;
  else if (duration < 400) return 4;
  else if (duration < 500) return 5;
  else if (duration < 600) return 6;
  else if (duration < 1200) return 7;
  else if (duration > 1200) return 8;
  else return -1;
}

//==============================================================================
// getDc()
//
//
//------------------------------------------------------------------------------
function getDc()
{
  start = sFirst;
  if (numPeriods == 2)
    end = eLast;
  else
    end = eFirst;

  // if precip occuring or within hour ( syno - start )
  if (end == synoPeriod || end > (synoPeriod - 100))
  {
    if (synoPeriod < start) synoPeriod += 2400;
    duration = synoPeriod - start;
  }
  else // precip not occuring or within hour ( end - start )
  {
    if (end < start) end += 2400;
    duration = end - start;
  }

  // alert(duration);

  if (numPeriods == 1)
  {
    if (duration <= 100) return 0;
    else if (duration <= 300) return 1;
    else if (duration <= 600) return 2;
    else if (duration > 600) return 3;
  }
  else if (numPeriods == 2)
  {
    if (duration <= 100) return 4;
    else if (duration <= 300) return 5;
    else if (duration <= 600) return 6;
    else if (duration > 600) return 7;
  }
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
    lastPeriod.setAttribute('class', "formDiv visible");
  }
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

  document.getElementById("rt").innerHTML = "Rt: ";
  document.getElementById("dc").innerHTML = "Dc: ";
  document.getElementById("errors").innerHTML = ">";

  return false;
}

//==============================================================================
// sets the visted flag to "1" so when refreshed the form will
// be reset to hold empty or default strings
//------------------------------------------------------------------------------
function checkToolsPageRefresh()
{
  visited = document.getElementById("visited").value;
  if (visited != "") // a fresh page
  {
    document.getElementById("formRtdc").reset();
  }
  document.getElementById("visited").value = "1";

  var lastPeriod = document.getElementById("lastPeriod");
  lastPeriod.setAttribute('class', "hidden");
}

//==============================================================================
// checkContactPageRefresh()
//------------------------------------------------------------------------------
function checkContactPageRefresh()
{
  visited = document.getElementById("visited").value;
  if (visited != "") // a fresh page
  {
    document.getElementById("formContact").reset();
  }
  document.getElementById("visited").value = "1";
}
