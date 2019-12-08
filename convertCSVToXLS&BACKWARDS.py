import os
import sys
import csv
import xlsxwriter
import xlrd
from datetime import datetime

DESTINATION_FOLDER = "C:\\Users\\LazyTurtle\\Downloads\\myprojects"
ROW_HEADER_XLS = 0


def convert_xls_to_csv(file_name):
    workbook = xlrd.open_workbook(file_name)
    sheet = workbook.sheet_by_index(0)

    # find starting position of extension, in order to replace it with csv
    if file_name.find(".xls") > -1:
        pos_ext = file_name.find(".xls")
    else:
        pos_ext = file_name.find(".xlsx")
    with open(file_name[:pos_ext] + ".csv", 'w') as csv_file:
        csv_writer = csv.writer(csv_file)

        for row_num in range(0, sheet.nrows):
            csv_writer.writerow(sheet.row_values(row_num))


def convert_csv_to_xls(file_name):
    # eliminate last 4 characters, which represents the extension of the file
    out_workbook = xlsxwriter.Workbook(file_name[:-4] + ".xlsx", {'in_memory': True})
    out_sheet = out_workbook.add_worksheet('Sheet1')

    with open(file_name, 'rt') as csv_file:
        csv_reader = csv.reader(csv_file)
        row_num = ROW_HEADER_XLS
        for line in csv_reader:
            for col_num in range(0, len(line)):
                out_sheet.write(row_num, col_num, line[col_num])
            if len(line) > 1:
                row_num += 1
    out_workbook.close()

# MAIN -----------------------


if len(sys.argv) < 3:
    print("Usage: " + sys.argv[0] + " <filename> -toxls|-tocsv")
    sys.exit(1)
elif sys.argv[1].find(".csv") == -1 and sys.argv[1].find(".xls") == -1 and sys.argv[1].find(".xlsx") == -1:
    print("File has no extension in name!")
    sys.exit(1)

os.chdir(DESTINATION_FOLDER)
if sys.argv[2] == "-toxls":
    print("Starting converting " + sys.argv[1] + " into xls file: " + (datetime.now()).isoformat())
    convert_csv_to_xls(sys.argv[1])
    print("Conversion finished successfully: " + (datetime.now()).isoformat())
elif sys.argv[2] == "-tocsv":
    print("Starting converting " + sys.argv[1] + " into csv file: " + (datetime.now()).isoformat())
    convert_xls_to_csv(sys.argv[1])
    print("Conversion finished successfully: " + (datetime.now()).isoformat())
else:
    print("Usage: " + sys.argv[0] + " <filename> -toxls|-tocsv")
    sys.exit(1)
