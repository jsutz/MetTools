// Global Variables
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

  synoPeriod = getOptionText("synoPeriod");
  numPeriods = getOptionText("numPeriods");
  sFirst = document.getElementById("sFirst").value;
  eFirst = document.getElementById("eFirst").value;
  sLast = document.getElementById("sLast").value;
  eLast = document.getElementById("eLast").value;
  checkBox = document.getElementById("chkbx").checked;
  
  var errorWrapper = document.getElementById("errors");
  errorMessage = "";
  
  // check to see if any of the required fields are empty
  // alert error message if message is not an empty string
  errorMessage = checkRequiredInput();
  if (errorMessage != "") return errorWrapper.innerHTML = errorMessage;
  
  // if number of periods is 2, validates times for both periods
  // else, validates times for first period only
  // alert error message if message is not an empty string
  errorMessage = checkTimesValid();
  if (errorMessage != "") return errorWrapper.innerHTML = errorMessage;
  
  // calculate Rt and Dc
  var rt = getRt();
  document.getElementById("rt").innerHTML = "Rt: " + rt;
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
  
  if (synoPeriod == "--") e = (e + "> Synoptic period not selected.<br>");
  if (numPeriods == "--") e = (e + "> Number of periods not selected.<br>");
  
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
  
  // adjust times if needed, then check if all times are within period
  //  
  // if synoPeriod and/or end of first or last period, depending on the
  // number of periods selected, is "0000" then convert to "2400" for
  // use in calculations
  if (synoPeriod == "0000")
  {
    if (numPeriods == "1" && eFirst == "0000")
      eFirst = "2400";
    else if (numPeriods == "2" && eLast == "0")
      eLast = "2400";
    synoPeriod = "2400";
  }
  
  // if one period of precip selected
  if (numPeriods == "1")
  {
    
    if (parseInt(eFirst) < (parseInt(synoPeriod) - 600) || parseInt(eFirst) > parseInt(synoPeriod))
    {
      e = (e + "> End of period is invalid.<br>");
      alert("If precipitation is occurring on the hour, the end time shall be equal the synoptic period.");
    }
      
    if (checkBox)
    {
      synoPeriod = "" + parseInt(synoPeriod)+2400 + "";
      eFirst += 2400;
    }
    
    if (parseInt(sFirst) >= parseInt(eFirst) && parseInt(sFirst) < parseInt(synoPeriod))
      e = (e + "> End of period is invalid.<br>")
  }
  // if 2 periods selected
  else if (numPeriods == "2")
  {
    
    if (parseInt(eFirst) < (parseInt(synoPeriod) - 600) || parseInt(eFirst) <= parseInt(sFirst))
      e = (e + "> End of first period is invalid.<br>");
    if (parseInt(sLast) < (parseInt(synoPeriod) - 600) || parseInt(sLast) <= parseInt(eFirst))
      e = (e + "> Start of last period is invalid.<br>");
    if (parseInt(eLast) < (parseInt(synoPeriod) - 600) || parseInt(eLast) <= parseInt(sLast) || parseInt(eLast) > parseInt(synoPeriod))
      e = (e + "> End of last period is invalid.<br>");
    
    if (checkBox)
    {
      synoPeriod += 2400;
      eFirst += 2400;
      sLast += 2400;
      eLast += 2400;
    }
    
    // check to see if break between periods is less than 15 minutes
    var hh_eFirst = eFirst.substr(0,2);
    var mm_eFirst = eFirst.substr(2,4);
    var hh_sLast = sLast.substr(0,2);
    var mm_sLast = sLast.substr(2,4);
    
    if (parseInt(mm_sLast) - 15 < 0)
    {
      mm_sLast = ""+parseInt(mm_sLast)+45+"";
      hh_sLast = ""+parseInt(hh_sLast)-1+"";
      if (hh_sLast.length == 1)
        hh_sLast = "0"+hh_sLast;
    }
    else mm_sLast = ""+parseInt(mm_sLast)-15+"";
    
    // if the break is less than 15 minutes...
    if (parseInt(mm_sLast) < parseInt(mm_eFirst) && parseInt(hh_eFirst) >= parseInt(hh_sLast))
    {
      // convert to one period...
      // change numPeriods = 1, set sLast and eLast = "",
      numPeriods = 1;
      eFirst = eLast;
      sLast = "";
      eLast = "";
      
      // change input tags inner html to reflect
      document.getElementById("numPeriods").value = 1;
      document.getElementById("eFirst").value = eFirst;
      document.getElementById("sLast").value = "";
      document.getElementById("eLast").value = "";
      // hide the lastPeriod container
      var lastPeriod = document.getElementById("lastPeriod");
      lastPeriod.setAttribute('class', "hidden");
      // alert the user of changes
      alert("Break between periods is less than 15 minues.\nConverted to one period.");      
    }    
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
// getRt()
//
//
//------------------------------------------------------------------------------
function getRt()
{
  start = sFirst;
  if (numPeriods == "2")
    end = eLast;
  else
    end = eFirst;
    
  // if precip occuring or within hour ( syno - start )
  if (end == synoPeriod || end > (synoPeriod - 100))
  {
    start = ""+start+"";
    hh_start = parseInt(start.substr(0,2));
    mm_start = parseInt(start.substr(2,4));
    
    end = ""+synoPeriod+"";
    hh_end = parseInt(end.substr(0,2));
    mm_end = parseInt(end.substr(2,4));
  }
  else // precip not occuring or within hour ( syno - end )
  {
    start = ""+end+"";
    hh_start = parseInt(start.substr(0,2));
    mm_start = parseInt(start.substr(2,4));
    
    end = ""+synoPeriod+"";
    hh_end = parseInt(end.substr(0,2));
    mm_end = parseInt(end.substr(2,4));
  }
  
  // get duration hours
  hh_dur = hh_end - hh_start;
  
  if (mm_end == 0 || mm_end < mm_start)
  {
    mm_end += 60;
    hh_dur -= 1;
  }
  // get duration minutes
  mm_dur = mm_end - mm_start;
  
  duration = ""+hh_dur+mm_dur+"";
  
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
  
  if (start < end && end <= synoPeriod)
  { 
    // if precip occuring or within hour ( syno - start )
    if (end == synoPeriod || end > (synoPeriod - 100))
    {
      start = ""+start+"";
      hh_start = parseInt(start.substr(0,2));
      mm_start = parseInt(start.substr(2,4));
      
      end = ""+synoPeriod+"";
      hh_end = parseInt(end.substr(0,2));
      mm_end = parseInt(end.substr(2,4));
    }
    else // precip not occuring or within hour ( syno - end )
    {
      start = ""+start+"";
      hh_start = parseInt(start.substr(0,2));
      mm_start = parseInt(start.substr(2,4));
      
      end = ""+end+"";
      hh_end = parseInt(end.substr(0,2));
      mm_end = parseInt(end.substr(2,4));
    }
    
    // get duration hours
    hh_dur = hh_end - hh_start;
    
    if (mm_end == 0 || mm_end < mm_start)
    {
      mm_end += 60;
      hh_dur -= 1;
    }
    // get duration minutes
    mm_dur = mm_end - mm_start;
    
    duration = ""+hh_dur+mm_dur+"";
  }
  else return -1;
  
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
  else return -1;
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
  document.getElementById("errors").innerHTML = "";

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
    lastPeriod.setAttribute('class', "formDiv visible");
  }
}
