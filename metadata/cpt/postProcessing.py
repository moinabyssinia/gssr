import pandas as pd


def firstStep():
    twcr = pd.read_csv("twcrRecordLengthComparisonPlotter.csv")
    twcr = twcr[['tg', 'lon', 'lat', 'visual_inspection', 'recordLength', 'recordSign', 
        'obsRecordLength', 'numYearsGained', 'yrGainedSign']]
    twcr.columns = ['tg', 'lon', 'lat', 'twcr_vi', 'twcr_recLen', 'twcr_recSign', 
        'obsRecordLength', 'twcr_yrsGained', 'twcr_yrsGainedSign']
    era20c = pd.read_csv("era20cRecordLengthComparisonPlotter.csv")
    era20c = era20c[['tg', 'lon', 'lat', 'visual_inspection', 'recordLength', 'recordSign', 
        'obsRecordLength', 'numYearsGained', 'yrGainedSign']]
    era20c.columns = ['tg', 'lon', 'lat', 'era20c_vi', 'era20c_recLen', 'era20c_recSign', 
        'obsRecordLength', 'era20c_yrsGained', 'era20c_yrsGainedSign']

    print(twcr)
    print(era20c)


    twcr_era20c = pd.merge(era20c, twcr, on='tg', how="outer")
    twcr_era20c.to_csv('twcr_era20c_cpt.csv')



dat = pd.read_csv("twcr_era20c_cpt.csv")
print(dat)


removeExt = lambda x: x.split('.csv')[0]

dat['tg'] = pd.DataFrame(list(map(removeExt, dat['tg'])))

# print(dat['twcr_vi'][27] == "discard ")

dat = dat[~((dat['era20c_vi'] == "discard") & (dat['twcr_vi'] == "discard "))]

print(dat)

dat.to_csv('twcr_era20c_cpt.csv')


# firstStep()