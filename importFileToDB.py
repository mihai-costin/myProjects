import sys
import xlsxwriter
import xlrd
from datetime import datetime
import random
import keyring
import mysql.connector

ROW_HEADER = 0
NO_ROWS = 10

USER = "root"
PASS = keyring.get_password("mysql",USER)
HOST = "127.0.0.1"
DATABASE = "myDB"

SQL_INSERT_STATEMANT = '''
INSERT INTO myTB VALUES (%s,%s,%s)
'''
SQL_DELETE_STATEMANT = '''
DELETE FROM myTB
'''
VALUES_ORDER = {0: "date", 1: float, 2: str}

LIST_OF_HEADERS = ["CRT_DATE", "NUMBER", "DESCRIPTION"]
LOCAL_FOLDER = "C:\\Users\\Mihai-Costin\\Downloads\\"

# ==============================================================================================================


def check_list_order(list_rec):
    new_list_rec = []
    for idx in range(len(list_rec)):
        if VALUES_ORDER[idx] == "date":
            try:
                datetime.strptime(list_rec[idx], "%Y-%m-%d")
                new_list_rec.append(list_rec[idx])
            except ValueError as err:
                print("Second column needs to be a date: " + err)
                return None
        elif type(list_rec[idx]) == float:
            new_list_rec.append(int(list_rec[idx]))
        elif type(list_rec[idx]) == VALUES_ORDER[idx]:
            new_list_rec.append(list_rec[idx])
    return new_list_rec


def load_data_to_db(file_name, cnx):
    print("Loading file to database ...")
    workbook = xlrd.open_workbook(file_name)
    sheet = workbook.sheet_by_index(0)

    # clean the table first
    delete_cursor = cnx.cursor()
    delete_cursor.execute(SQL_DELETE_STATEMANT)
    delete_cursor.close()

    insert_cursor = cnx.cursor()
    for row in range(ROW_HEADER + 1, sheet.nrows):
        list_records = []  # records from excel file to be loaded
        for col in range(sheet.ncols):
            cell_value = sheet.cell(row,col).value
            list_records.append(cell_value)
        # check if we insert in the right order
        list_records = check_list_order(list_records)
        if list_records:
            insert_cursor.execute(SQL_INSERT_STATEMANT, list_records)
            print("Inserted " + str(list_records))
    insert_cursor.close()
    cnx.commit()


def generate_xls(file_name, crt_date, values, cnx):
    print("Generating excel file ...")
    out_workbook = xlsxwriter.Workbook(file_name, {'in_memory': True})
    out_sheet = out_workbook.add_worksheet('Sheet_' + crt_date)

    format_bold = out_workbook.add_format({'bold': True})
    format_date = out_workbook.add_format({'num_format': 'yyyy-m-d'})

    # set the header
    col = 0
    for head in LIST_OF_HEADERS:
        out_sheet.write(ROW_HEADER, col, head, format_bold)
        col = col + 1

    for row_idx in range(ROW_HEADER + 1, NO_ROWS):
        for col in range(0, len(LIST_OF_HEADERS)):
            if col == 0:  # is a date column
                out_sheet.write(row_idx, col, values[row_idx - 1][0], format_date)
            elif col == 1:  # is a col with a long number
                out_sheet.write_number(row_idx, col, values[row_idx - 1][1])
            else:
                out_sheet.write(row_idx, col, values[row_idx - 1][2])
                
    out_workbook.close()
    print("Excel file was created!")
    load_data_to_db(file_name, cnx)


# create data to be added to excel - dummy data
try:
    cnx = mysql.connector.connect(user=USER, password=PASS, host=HOST,
                                     database=DATABASE, auth_plugin='mysql_native_password')
except ValueError as err:
    print("Something went wrong when trying to connect to database: " + err)
    sys.exit(1)

print("Connected to the database!")
values = []
crt_date = datetime.strftime(datetime.now(), '%Y-%m-%d')

for i in range(0, NO_ROWS):
    values.append([])  # append new array
    values[i].append(crt_date)
    values[i].append(random.randint(1000000, 3000000))
    values[i].append('')

print("Starting Process " + (datetime.now().isoformat()))
generate_xls(LOCAL_FOLDER + "book1_" + crt_date + ".xlsx", crt_date, values, cnx)
print("Finished Process " + (datetime.now().isoformat()))
cnx.close()
