# prints

# defines all of the functions required to gather, format and display
# or print the selected bulletins

import os, sys
import datetime

def get_date():
  date  = datetime.datetime.now()
  return date

def get_traffic():

  # change to retrieve the station id
  # for now, hard code cyqq for ease
  stn_id = "CYQQ"
  syn_id = "71893"

  # get metars/specials and synos for the specified station.
  print "retrieving metars and specials for cyqq"

  date  = get_date()
  year  = int(date.year)
  month = int(date.month)
  day   = int(date.day)
  hour  = int(date.hour)

  # clear the screen
  os.system('clear')

  # get sas
  command = "amsas .a{1}{2}{3}0610 .sa60 .b24 .ft0 .e6 .t\
             {0} .x".format(stn_id, year, month, day-1)

  os.system(command + ">> ./tmp_file")

  view = raw_input("See preview [Y/n]? ")

  if view in ["Y", "y"]:
    print "Preview Selected"
    print metars
  elif view in ["N", "n"]:
    print "No preview Selected"
    print "Print [Y/n]? "
