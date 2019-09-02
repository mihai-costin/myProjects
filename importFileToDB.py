import xlsxwriter
from datetime import datetime
import random

ROW_HEADER = 0
NO_ROWS = 10

LIST_OF_HEADERS = ["CRT_DATE", "NUMBER", "DESCRIPTION"]
LOCAL_FOLDER = "C:\\Users\\Mihai-Costin\\Downloads\\"

# ==============================================================================================================


def generate_xls(file_name, crt_date, values):
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


# create data to be added to excel - dummy data
values = []
crt_date = datetime.strftime(datetime.now(), '%Y-%m-%d')

for i in range(0, NO_ROWS):
    values.append([])  # append new array
    values[i].append(crt_date)
    values[i].append(random.randint(1000000, 3000000))
    values[i].append('')

generate_xls(LOCAL_FOLDER + "book1_" + crt_date + ".xlsx", crt_date, values)
