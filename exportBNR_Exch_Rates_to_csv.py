import sys
import requests
from datetime import datetime
import bs4 as bs
import os
import csv

TARGET_CURR = "RON"
FIELDS_LIST = ["DATE_OF_RETRIEVAL", "DAY_OF_WEEK", "SOURCE_CURR", "RON_AMOUNT", "EURO_AMOUNT"]

DESTINATION_FOLDER = "C:\\Users\\mihai.gafencu\\Downloads"
DESTINATION_FILE_PREFIX = "ExchRates_"
DESTINATION_FILE_SUFFIX = ".csv"


def retrieve_rates(api_endpoint, file_date):
    file_name = DESTINATION_FILE_PREFIX + file_date + DESTINATION_FILE_SUFFIX
    response = requests.get(api_endpoint)
    if response.status_code != 200:
        print("ERROR: " + response.status_code + " returned by BNR API: " + api_endpoint)
        sys.exit(1)

    soup = bs.BeautifulSoup(response.text, 'xml')
    day_of_exch = soup.find_all('Cube')

    with open(file_name, 'w') as csv_file:
        # create csv with headers, like a dictionary
        csv_writer = csv.DictWriter(csv_file, fieldnames=FIELDS_LIST)

        csv_writer.writeheader()
        for each_day in day_of_exch:
            current_date = each_day.attrs['date']
            row_dict = {}
            ron_to_eur_value = float(each_day.findChildren('Rate', {'currency': 'EUR'})[0].text)
            for each_rate in each_day.findChildren('Rate'):
                row_dict["DATE_OF_RETRIEVAL"] = current_date
                # get day of the week using isoweekday method
                row_dict["DAY_OF_WEEK"] = datetime.strptime(current_date, "%Y-%m-%d").isoweekday()
                row_dict["SOURCE_CURR"] = each_rate.attrs['currency']
                if "multiplier" in each_rate.attrs.keys():
                    ron_amount = float(each_rate.text)/float(each_rate.attrs["multiplier"])
                else:
                    ron_amount = float(each_rate.text)
                row_dict["RON_AMOUNT"] = format(ron_amount, '.4f')
                row_dict["EURO_AMOUNT"] = format(ron_amount/ron_to_eur_value, '.4f')
                csv_writer.writerow(row_dict)


# MAIN ------------------------------

os.chdir(DESTINATION_FOLDER)
if len(sys.argv) == 2:
    # check if second parameter is a number -  that would represent the year
    print("Retrieving BNR rates for " + sys.argv[1] + ": " + (datetime.now()).isoformat())
    if sys.argv[1].isdigit():
        retrieve_rates("https://www.bnr.ro/files/xml/years/nbrfxrates" + sys.argv[1] + ".xml", sys.argv[1])
    elif sys.argv[1].lower() == "10days":
        # retrieve exchange for the last 10 days
        retrieve_rates("https://www.bnr.ro/nbrfxrates10days.xml", sys.argv[1])
    else:
        print("Usage: " + sys.argv[0] + " [year|10days]")
        sys.exit(1)
else:
    print("Retrieving BNR rates for " + datetime.date(datetime.now()).isoformat() + ": " + (datetime.now()).isoformat())
    # get exchange rate for the current day
    # strftime convert current date in string of a specified format
    retrieve_rates("https://www.bnr.ro/nbrfxrates.xml", (datetime.now()).strftime("%Y-%m-%d"))

print("Processes finished successfully: " + (datetime.now().isoformat()))
