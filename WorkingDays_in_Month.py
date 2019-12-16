# saturday and sunday are off days
# x represents seconds since jan 1980 till the start of the given month
# jan 1980 was Tuesday

def countWork(day, days):
    count = 0

    i = 0
    while i < days:
        temp = (day+i) % 7

        # is a work day
        if(temp == 0 or temp == 1 or temp == 2 or temp == 3 or temp == 6):
            count = count + 1
        
        i = i + 1
    
    return count

def noWorkDays(x):
    y = int(x/86400) # number of days
    day = y%7 # day of the week
    year = int(y/365) # after how many years
    month = round(y/30.44 % 12)

    workDays = -1
    if month == 1:
        if year % 4 == 0:
            workDays = countWork(day, 29)
        else:
            workDays = countWork(day, 28)
    elif month == 0 or month == 2 or month == 4 or month == 6 or month == 7 or month == 9 or month == 11:
        workDays = countWork(day, 31)
    else:
        workDays = countWork(day, 30)
            
    print("Year:", 1980 + year)
    print("Month:", month + 1)
    print("Working days:", workDays)
    

# march 1980
# x = 5184000

# feb 1985
# x = 160531200

# june 1990
# x = 328665600

# july 1995
# x = 489024000

# november 1997
# x = 562809600

# march 2003
# x = 730944000

# feb 2016
# x = 1138752000

# dec 2008
# x = 912556800

# jan 1980
# x = 0

# feb 1984
x = 128908800

noWorkDays(x)
