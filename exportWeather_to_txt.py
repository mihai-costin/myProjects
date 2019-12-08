import requests
import bs4 as bs
import os

URL_PREFIX = "https://www.wrh.noaa.gov/forecast/xml/xml.php?interval="
INTERVAL = 6

DESTINATION_FOLDER = "C:\\Users\\LazyTurtle\\Downloads\\"
DESTINATION_FILE = "Forecast_For_Next_7_days.txt"

CITIES_LAT_LON = {
    "SAN JOSE": {"LAT": 37.2902544,
                 "LON": 121.8760113},
    "LOS ANGELES": {"LAT": 34.052235,
                    "LON": -118.243683}
}

# check if file exists
if os.path.exists(DESTINATION_FOLDER + DESTINATION_FILE):
    os.remove(DESTINATION_FOLDER + DESTINATION_FILE)

# get forecast for all cities
with open(DESTINATION_FOLDER + DESTINATION_FILE, 'a') as file:
    for city_name, city in CITIES_LAT_LON.items():
        file.write('*' + city_name.upper() + "\n")
        r = requests.get(URL_PREFIX + str(INTERVAL) + "&lat=" + str(city["LAT"]) + "&lon="
                         + str(city["LON"]))

        soup = bs.BeautifulSoup(r.text, 'xml')
        # get forecast day
        forecast_day = soup.find_all('forecastDay')

        for day in forecast_day:
            # get date
            file.write("-- " + day.findChildren('validDate')[0].text + "\n")
            # get diff periods forecast
            periods = day.findChildren('period')
            for period in periods:
                file.write("\t Hour: " + period.find('validTime', {'timezone': 'UTC'}).text + ";\n")  # hour
                # Fahrenheit
                f = float(period.find('temperature', {'units': 'degrees F'}).text)
                file.write("\t Temperature: " + str(f) + " F degrees;\n")
                # Celsius
                c = round((f - 32)/1.8000, 2)
                file.write("\t Temperature: " + str(c) + " C degrees;\n")
            file.write("\n")
        r.close()
