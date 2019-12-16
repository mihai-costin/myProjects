import sys
import xlsxwriter
import xlrd
from datetime import datetime
import random
import keyring
import mysql.connector

ROW_HEADER = 0
NO_ROWS = 10  # to write in xls file

USER = "root"
PASS = keyring.get_password("mysql", USER)
HOST = "127.0.0.1"
DATABASE = "myDB"

SQL_INSERT_STATEMANT = '''
INSERT INTO myTB VALUES (%s,%s,%s)
'''
SQL_DELETE_STATEMANT = '''
DELETE FROM myTB
WHERE CRT_DATE = CAST(NOW() AS DATE)
'''


def str_is_date(string):
    try:
        datetime.strptime(string, "%Y-%m-%d")
    except ValueError as err:
        print("Wrong date format : " + string)
        print(err)
        return None
    return True


VALUES_ORDER = {0: str_is_date, 1: float, 2: str}

LIST_OF_HEADERS = ["CRT_DATE", "NUMBER", "DESCRIPTION"]
LOCAL_FOLDER = "C:\\Users\\Mihai\\Downloads\\"

# ==============================================================================================================


def check_if_table_exists_in_db(table_name):
    # check DB_TABLE_NAME exists in database
    check_cursor = cnx.cursor()
    check_cursor.execute("SELECT * FROM information_schema.tables WHERE table_schema='mydb' AND table_name='" +
                         table_name + "';")

    if check_cursor.fetchone() is None:
        print("Table was not found in database: " + table_name)
        sys.exit(1)
    check_cursor.close()


def check_list_order(list_rec):
    new_list_rec = []
    for idx in range(len(list_rec)):
        if VALUES_ORDER[idx](list_rec[idx]) and type(list_rec[idx]) == str:
            new_list_rec.append(datetime.strptime(list_rec[idx], "%Y-%m-%d"))
        elif type(list_rec[idx]) == VALUES_ORDER[idx]:
            new_list_rec.append(VALUES_ORDER[idx](list_rec[idx]))
        else:
            return None
    return new_list_rec


def load_data_to_db(file_name):
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
        new_list_records = check_list_order(list_records)
        if new_list_records:
            insert_cursor.execute(SQL_INSERT_STATEMANT, new_list_records)
            print("Inserted " + str(list_records))
        else:
            print("List of records to be loaded to database is not in the correct order!")
            sys.exit(1)
    insert_cursor.close()
    cnx.commit()


def generate_xls(file_name, crt_date, values_to_write):
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
        for col_idx in range(0, len(LIST_OF_HEADERS)):
            if col_idx == 0:  # is a date column
                out_sheet.write(row_idx, col_idx, values_to_write[row_idx - ROW_HEADER - 1][col_idx], format_date)
            else:
                out_sheet.write(row_idx, col_idx, values_to_write[row_idx - ROW_HEADER - 1][col_idx])
                
    out_workbook.close()
    print("Excel file was created!\n")


# create data to be added to excel - dummy: data
try:
    cnx = mysql.connector.connect(user=USER, password=PASS, host=HOST,
                                  database=DATABASE, auth_plugin='mysql_native_password')
except ValueError as err:
    print(err)
    sys.exit(1)

print("Connected to the database!")
values = []
current_date = datetime.strftime(datetime.now(), '%Y-%m-%d')

for i in range(0, NO_ROWS):
    values.append([])  # append new array
    values[i].append(current_date)
    values[i].append(random.randint(1000000, 3000000))
    values[i].append('')

print("Starting Process " + (datetime.now().isoformat()) + "\n")

file_path = LOCAL_FOLDER + "book1_" + current_date + ".xlsx"
generate_xls(file_path, current_date, values)
check_if_table_exists_in_db("mytb")
load_data_to_db(file_path)

print("\nFinished Process " + (datetime.now().isoformat()))
cnx.close()
