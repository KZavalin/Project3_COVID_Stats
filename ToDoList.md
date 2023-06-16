Information to look up:

Lockdown data over time for different countries or based on another regional division. 

We need to see what is most readily available.

Population density data based on region. 

We will have to match our COVID data based on whatever regional division we used for infection incidence

--------------------------------------------------------------------------------------

To-Do (June 16-19)
1.	Search for lock down restrictions data (All)
2.	Try to pull api from https://covid19.who.int/data (Madi)
3.	Pull Vaccination csv files and start cleaning data (Kirill)
4.	Implement the SQLite code  (Madi or anyone)



--------------------------------------------------------------------------------------

Project Information:

Scrape from:
https://covid19.who.int/data

https://www.worldometers.info/coronavirus/



CSV files from:
https://covid19.who.int/data



API from:
https://covid-api.com/api
who api


--------------------------------------------------------------------------------------


Code to import csv file to SQLite:
import pandas as pd
from sqlalchemy import create_engine
# Export PostgreSQL Data with pgAdmin
# Make sure to export the PostgreSQL data using pgAdmin and save it as a backup file.
# Importing PostgreSQL Data into SQLite
# Create an SQLite engine
engine_sqlite = create_engine('sqlite:///your_database.sqlite')
# Read the PostgreSQL backup file into a pandas DataFrame
df = pd.read_csv('path/to/your/postgresql/backup/file.csv')
# Write the DataFrame to SQLite
df.to_sql('your_table', engine_sqlite, if_exists='replace', index=False)




