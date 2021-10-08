import os
import pandas as pd

dirHome = "./data"
os.chdir(dirHome)

csvList = os.listdir()

colNames = {"era20c_1900_95thPercTrends" : 'e95_1900',
            "era20c_1900_99thPercTrends" : 'e99_1900',
            "era20c_1950_95thPercTrends" : 'e95_1950',
            "era20c_1950_99thPercTrends" : 'e99_1950',
            "twcr_1875_95thPercTrends" : 't95_1875',
            "twcr_1875_99thPercTrends" : 't99_1875',
            "twcr_1900_95thPercTrends" : 't95_1900',
            "twcr_1900_99thPercTrends" : 't99_1900',
            "twcr_1950_95thPercTrends" : 't95_1950',
            "twcr_1950_99thPercTrends" : 't99_1950'
            }

isFirst = True

for csv in csvList:
    print(csv)

    cname = colNames[csv.split('_reg_95CI_modifiedMK_HAC.csv')[0]]

    dat = pd.read_csv(csv)

    dat = dat[dat['regSig']]

    if isFirst:
        dat = dat[['tg', 'lon', 'lat', 'trend_mm_year_reg']]
        dat.columns = ['tg', 'lon', 'lat', cname]
        df = dat.copy()
        isFirst = False
    else:
        dat = dat[['tg', 'lon', 'lat', 'trend_mm_year_reg']]
        dat.columns = ['tg', 'lon', 'lat', cname]

        df = pd.merge(df, dat, on='tg', how='outer')

    print(df)

# remove csv extension
removeExt = lambda x: x.split(".csv")[0]
df['tg'] = pd.DataFrame(list(map(removeExt, df['tg'])))
print(df)

os.chdir("/")
print(os.getcwd())
df.to_csv("allTrends.csv")

