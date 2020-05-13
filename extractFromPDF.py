"""
-- TABLE CREATION IN SQL
CREATE TABLE TST_Owner.ATPCO_Opt_Scvs_Industry_Sub_Codes(
[ID] INT IDENTITY(1,1),
[SubCode] VARCHAR(5),
[Group] VARCHAR(50),
[SubGroup] VARCHAR(50),
[DESCRIPTION1] VARCHAR(100),
[DESCRIPTION2] VARCHAR(100),
[CommercialName] VARCHAR(100),
[RFIC] VARCHAR(15),
[FILE_NAME] VARCHAR(100),
[INSERED_EFFECTIVE_DT] DATE,
[PROCESSED_DTTM] DATETIME
);
"""

import pypyodbc
from datetime import datetime
import csv
import tabula


# all files should be in the same folder
# link to pdf file: https://www.atpco.net/sites/atpco-public/files/all_pdfs/Opt_Scvs_Industry_Sub_Codes_Online_C.pdf
FILE_NAME = 'Opt_Scvs_Industry_Sub_Codes_Online_C.pdf'
DB_TABLE_NAME = 'ATPCO_Opt_Scvs_Industry_Sub_Codes'
DATABASE_NAME = 'TST_Owner'
FIELDS_LIST = ['No.', 'Sub Code', 'Group', 'Sub Group', 'Description 1', 'Description 2', 'Commercial Name', 'RFIC']
INSERT_STATEMENT = '''INSERT INTO TST_Owner.ATPCO_Opt_Scvs_Industry_Sub_Codes
           ([SubCode]
           ,[Group]
           ,[SubGroup]
           ,[DESCRIPTION1]
           ,[DESCRIPTION2]
           ,[CommercialName]
           ,[RFIC]
           ,[FILE_NAME]
           ,[INSERED_EFFECTIVE_DT]
           ,[PROCESSED_DTTM])
     VALUES
           (?,?,?,?,?,?,?,?,?,?)'''


def load_csv_to_db(file):
    # audit fields
    proc_dttm = datetime.now()
    ied = proc_dttm.strftime("%Y-%m-%d")

    # read csv file
    with open(file, 'r') as cfile:
        reader = list(csv.reader(cfile, delimiter=','))

    # eliminate empty rows
    reader_new = [row for row in reader if row[2] != '']
    insert_cursor = db_connection.cursor()
    inserted = 0
    field_idx = {}
    for row in reader_new:
        if row[0] in FIELDS_LIST:
            for field in FIELDS_LIST:
                field_idx[field] = row.index(field)
            continue
        else:
            # [1:] to eliminate numbers
            value = [row[val] for val in field_idx.values()][1:]
            insert_cursor.execute(INSERT_STATEMENT, value + [file, ied, proc_dttm])
            inserted += 1

    print("Inserted: " + str(inserted))
    insert_cursor.close()
    db_connection.commit()


# -----------------------------------------------------------------------------------------------------------

db_host = r'DESKTOP-UL1N4CV\SQLEXPRESS'
db_connection = pypyodbc.connect("Driver={SQL Server Native Client 11.0};"
                                 "Server=" + db_host + ";Database=" + DATABASE_NAME + ";Trusted_Connection=yes;")

print("Getting data from pdf file: " + FILE_NAME + " " + (datetime.now()).isoformat())
csv_file = FILE_NAME.split('.')[0] + '.csv'
# convert all tables froim pdf with tabula into csv file
tabula.convert_into(FILE_NAME, csv_file, pages="all")
load_csv_to_db(csv_file)
print("File loaded to db: " + (datetime.now()).isoformat())

db_connection.close()
