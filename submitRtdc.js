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
  // check that the form was submitted and not
  // refreshed
  
  // inititalize empty up error string
  var errors = "";
  
  // check that all required input is not blank
  errors = confirmRequiredInput();
  if (errors != "")
  {
    document.getElementById("errors").innerHTML = errors;
    return false;
  }
  
  // store synoptic period and number of periods
  var synoPeriod = getOptionText("synoPeriod");
  var numPeriods = getOptionText("numPeriods");
  
  // check that all times are correctly input
  errors = confirmTimesValid(numPeriods);
  if (errors != "")
  {
    document.getElementById("errors").innerHTML = errors;
    return false;
  }
  
  // check that period(s) times are valid  
  errors = checkPeriodsValid(numPeriods);
  if (errors != "")
  {
    document.getElementById("errors").innerHTML = errors;
    return false;
  }
  
  // adjust synoptic period if "0000", adjust all but sFirst
  // if check box was selected, check if times are within synoptic
  // period, and show errors if any
  errors = confirmAdjustedTimes(synoPeriod, numPeriods);
  if (errors != "")
  {
    document.getElementById("errors").innerHTML = errors;
    return false;
  }
  
  // calculate Rt and Dc
  
  // show errors if any, or return successful

  document.getElementById("errors").innerHTML = "All good.";
  return false;
}

//==============================================================================
// checks to ensure all required input fields are not blank;
// displays any errors to the screen for the user to correct;
// and returns errors, breaking out of the function, ending further
// calculation;
//------------------------------------------------------------------------------
function confirmRequiredInput()
{
  // initialize local error container
  var errors = "";
  
  // get currently selected text of synoptic period option element
  var synoPeriod = getOptionText("synoPeriod");
  // check that syno period is not blank - or "--"
  if (synoPeriod == "--")
  {
    errors = (errors + "> Synoptic period is not selected.<br>");
  }
 
  // check that number of periods is not blank
  var numPeriods = getOptionText("numPeriods");
  // check that sFirst and eFirst are not blank
  if (numPeriods == "--")
  {
    errors = (errors + "> Number of periods is not selected.<br>");
  }
  
  // get text of start and end input of the first period
  var sFirst = document.getElementById("sFirst").value;
  var eFirst = document.getElementById("eFirst").value;
  // check that sFirst and eFirst are not blank
  if (sFirst == "" || eFirst == "")
  {
    errors = (errors + "> Start or End of first period is not entered.<br>");
  }
  
  // if number of periods is 2,
  if (numPeriods == "2")
  {
    // get text of start and end input of the first period
    var sLast = document.getElementById("sLast").value;
    var eLast = document.getElementById("eLast").value;
    // check that sFirst and eFirst are not blank
    if (sLast == "" || eLast == "")
    {
      errors = (errors + "> Start or End of last period is not entered.<br>");
    }
  }
  
  // return error string
  return errors;
}

//==============================================================================
// 
//------------------------------------------------------------------------------
function confirmTimesValid(n)
{
  // initialize local error container
  var errors = "";
  
  // get text of start and end input of the first period
  var sFirst = document.getElementById("sFirst").value;
  var eFirst = document.getElementById("eFirst").value;
  
  // check that sFirst and eFirst are valid
  e = checkTime(sFirst, "> Start of first period: ")
  if (e != "")
  {
    errors = (errors + e);
  }
  
  e = checkTime(eFirst, "> End of first period: ")
  if (e != "")
  {
    errors = (errors + e);
  }
  
  // if number of periods is 2,
  if (n == "2")
  {
    // get text of start and end input of the first period
    var sLast = document.getElementById("sLast").value;
    var eLast = document.getElementById("eLast").value;
    
    // check that sFirst and eFirst are valid
    e = checkTime(sLast, "> Start of last period: ")
    if (e != "")
    {
      errors = (errors + e);
    }
    e = checkTime(eLast, "> End of last period: ")
    if (e != "")
    {
      errors = (errors + e);
    }
  }
  // return error string
  return errors;
}

//==============================================================================
// check that each text input box is not empty, if 2 periods check
// last period text also; pack errors to error string, if any
//------------------------------------------------------------------------------
function checkTime(t, str)
{
  // initialize local error container
  errors = "";
  
  if (t.length != 4)
  {
    return (errors + str + "Invalid.<br>");
  }
  
  // check if text has non-digit characters
  found = 0;
  for (var i = 0; i < t.length; i++)
  {
    if (isNaN( parseInt( t.charAt(i) ) ))
    {
      found++;
    }    
  }
  if (found != 0)
  {
    return (errors + str + "Contains non-digit characters.<br>");
  }
  
  // check time > 0 and < 2400
  if (!(parseInt( parseInt(t.substr(0,2)) ) < 24 && parseInt( parseInt(t.substr(2,4)) ) < 60))
  {
    return (errors + str + "Time Invalid.<br>");
  }
  
  return errors;
}

//==============================================================================
// checks to see if periods are valid, if start time is less than end
// and if second period start greater - by 15 minutes - than first
// period end
// then checks if both periods are within the selected synoptic period 
//------------------------------------------------------------------------------
function checkPeriodsValid(n)
{
  // initialize local error container
  var errors = "";
  
  // get sFirst and eFirst
  var sFirst = document.getElementById("sFirst").value;
  var eFirst = document.getElementById("eFirst").value;
  
  // check if checkbox is selected, if so, add 2400 to eFirst
  checkBox = document.getElementById("chkbx").value;
  if (checkBox == "on") {
    eFirst = (parseInt(eFirst) + 2400);
  }
  
  if (parseInt(eFirst) <= parseInt(sFirst))
  {
    errors = (errors + "> Start or End of first period is invalid.<br>");
  }  
  
  // if periods == 2, get sLast and eLast
  if (n == "2")
  {
    var sLast = document.getElementById("sLast").value;
    var eLast = document.getElementById("eLast").value;
    
    if (parseInt(eLast) <= parseInt(sLast))
    {
      errors = (errors + "> Start or End of first period is invalid.<br>");
    }
  }

  return errors;  
}
 
//==============================================================================
// add appropriate sections of below function into...checkPeriodsValid()
//------------------------------------------------------------------------------
function confirmAdjustedTimes(synoPeriod, numPeriods)
{
  // initialize local error container
  var errors = "";
  
  // get start and end values of first period
  var sFirst = document.getElementById("sFirst").value;
  var eFirst = document.getElementById("eFirst").value;
  
  if (numPeriods == "2")
  {
    var sLast = document.getElementById("sLast").value;
    var eLast = document.getElementById("eLast").value;
  }
  
  // adjust synoptic period if equals "0000", switch to "2400"
  if (synoPeriod == "0000")
  {
    // adjust synoptic period if equals "0000", switch to "2400"
    if (numPeriods == "2" && eLast == "0000")
    {
      eLast = "2400";
    }
    else if (eFirst == "0000")
    {
      eFirst = "2400";
    } 
    synoPeriod = "2400";
  }
  
  // convert to integers
  synoPeriod = parseInt(synoPeriod);
  sFirst = parseInt(sFirst);
  eFirst = parseInt(eFirst);
  
  
  if (numPeriods == "2")
  { 
    sLast = parseInt(sLast);
    eLast = parseInt(eLast);
  }

  // check if check box is selected, if so adjust times by adding
  // 1 day or 2400 to each of the times except sFirst
  checkBox = document.getElementById("chkbx").value;
  alert(checkBox);
  if (checkBox == "on")
  {
    synoPeriod = synoPeriod + 2400;
    eFirst = eFirst + 2400;
    
    if (numPeriods == "2")
    {
      sLast = sLast + 2400;
      eLast = eLast + 2400;
    }
  }
  
  // check that times are within synoptic period
  if (sFirst >= eFirst)                                                                                                                          
  {
    errors = (errors + "> Start first: Invalid.<br>");
  }
  if ((synoPeriod - 600) > eFirst)
  {
    errors = (errors + "> End first: Invalid.<br>");
  }
  
  if (numPeriods == "2")
  {
    if ((synoPeriod - 600) > sLast)
    {
      errors = (errors + "> Start last: Invalid.<br>");
    }
    else if ((synoPeriod - 600) > eLast)
    {
      errors = (errors + "> End last: Invalid.<br>");
    }
  }
  alert(errors);
  return errors;
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
