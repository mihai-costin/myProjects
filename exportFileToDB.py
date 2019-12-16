import os
import sys
import xlsxwriter
from datetime import datetime
import keyring
import mysql.connector

LOGIN_USER = "root"
PASS_USER = keyring.get_password("mysql", LOGIN_USER)  # get password from keyring

DB_TABLE_NAME = "mytb"
SQL_SELECT_STATEMENT = " SELECT CRT_DATE, NUMBER, DESCRIPTION FROM " + DB_TABLE_NAME + \
                       " WHERE CRT_DATE < CAST(NOW() AS DATE);"

LOCAL_DIRECTORY = "C:\\Users\\Mihai\\Downloads"
ROW_HEADER = 0  # from what row should the xls header start
DATE_FIELDS = [0]


def export_xls_from_db(crt_date):
    file_name = "Exported_" + crt_date + ".xlsx"
    db_cursor = cnx.cursor()
    db_cursor.execute(SQL_SELECT_STATEMENT)
    fields_list = db_cursor.column_names
    db_records = db_cursor.fetchall()
    db_cursor.close()

    workbook = xlsxwriter.Workbook(file_name, {'in_memory': True})
    sheet = workbook.add_worksheet('Sheet_' + crt_date)

    format_bold = workbook.add_format({'bold': True})
    format_date = workbook.add_format({'num_format': 'yyyy-m-d'})

    # set the header
    col = 0
    for field in fields_list:
        sheet.write(ROW_HEADER, col, field, format_bold)
        col = col + 1

    for row_idx in range(ROW_HEADER + 1, ROW_HEADER + len(db_records) + 1):
        for col_idx in range(0, len(fields_list)):
            if col_idx in DATE_FIELDS:  # is a date column
                sheet.write(row_idx, col_idx, db_records[row_idx - ROW_HEADER - 1][col_idx], format_date)
            else:
                sheet.write(row_idx, col_idx, db_records[row_idx - ROW_HEADER - 1][col_idx])
    workbook.close()


# ================================================================================

# connect to mysql using native password
cnx = mysql.connector.connect(user=LOGIN_USER, password=PASS_USER, host='localhost',
                              database='mydb', auth_plugin='mysql_native_password')

# check DB_TABLE_NAME exists in database
check_cursor = cnx.cursor()
check_cursor.execute("SELECT * FROM information_schema.tables WHERE table_schema='mydb' AND table_name='" +
                     DB_TABLE_NAME + "';")

if check_cursor.fetchone() is None:
    print("Table was not found in database: " + DB_TABLE_NAME)
    sys.exit(1)
check_cursor.close()

print("Connected to the database!")
print("Starting to export xls file to database : " + (datetime.now().isoformat()))
os.chdir(LOCAL_DIRECTORY)
export_xls_from_db(datetime.now().strftime("%Y-%m-%d"))
print("Process finished successfully : " + (datetime.now().isoformat()))
cnx.close()
