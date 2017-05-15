# menus.py
#
# creates all of the different menus for navigating the application
# menus included for: prints, calculations, tools, etc

import os, sys
import prints

def main_banner():

  # welcome messages
  msg_0 = "Welcome to the Met Tools application suite."
  msg_1 = "Please select a menu item to begin."

  # top banner
  print "*" * 80
  print "**" + " " * 76 + "**"
  print "** " + "{: <75}".format(msg_0) + "**"
  print "** " + "{: <75}".format(msg_1) + "**"
  print "**" + " " * 76 + "**"
  print "*" * 80
  print ""

def main_menu():

  # clear the screen first
  os.system('clear')

  # print main banner to top of screen
  main_banner()

  # print menu specific header
  print "\tMain Menu"
  print "\t" + "=" * 60
  print ""

  # main menu selections
  print "\t1. " + "Printables"
  print "\t2. " + "Calculations"
  print "\t3. " + "Monitor Aid"
  print "\t4. " + ""

  msg_sets = "type 's' or 'settings' to configure user settings"
  msg_help = "type 'h' or 'help' to display a help screen"
  msg_quit = "type 'q' or 'quit' to exit the application"

  print "\t" + "*" * 60
  print "\t" + "{: <60}".format(msg_sets)
  print "\t" + "{: <60}".format(msg_help)
  print "\t" + "{: <60}".format(msg_quit)
  print "\t" + "*" * 60

  while True:

    i = raw_input("Selection >> ")

    # take appropriate action based on user input
    if i.strip() == "":
      print "Invalid input: Input left blank"
      continue
    else:
      if i.isdigit():
        if i == "1":
          print_menu()
        elif i == "2":
          pass
        elif i == "3":
          pass
        elif i == "4":
          pass
      else:
        print "Invalid input: Input is not digit"
        continue

def print_menu():

  # clear the screen first
  os.system('clear')

  # print main banner to top of screen
  main_banner()

  # print menu specific header
  print "\tPrint Menu"
  print "\t" + "=" * 60
  print ""

  # main menu selections
  print "\t1. " + "Print Traffic"
  print "\t2. " + "Print Forecast"
  print "\t3. " + "Print Charts"
  print "\t4. " + "Print Other"
  print ""

  while True:

    i = raw_input("Selection >> ")

    if i.strip() == "":

      # Input was left blank. Tell user the input was invalid
      # and prompt the user again.
      print "[error] input was left blank. try again."
      continue

    else:
      if i.isdigit():

        if i == "1":
          # gather traffic for the users station and display
          # a preview at the users request, or simply print.
          prints.get_traffic()

        elif i == "2":
          pass

        elif i == "3":
          pass

        elif i == "4":
          pass

      else:

        # Input is not a digit and is thus invalid. Tell user
        # and prompt again.
        print "[error] you must input an integer. try again."
        continue