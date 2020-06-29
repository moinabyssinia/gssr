# -*- coding: utf-8 -*-
"""
Created on Mon Jun 29 11:27:02 2020

Prepare files for webmap

@author: WahlInstall
"""

import os 
from functools import reduce

os.chdir("E:\\webmap\\metadata")


twcr = pd.read_csv('20cr_Validation.csv')
era20c = pd.read_csv('era20c_Validation.csv')
eraint = pd.read_csv('eraint_Validation.csv')
merra = pd.read_csv('merra_Validation.csv')


df = [twcr, era20c, eraint, merra]

df_merged = reduce(lambda  left,right: pd.merge(left,right,on=['tg'],
                                            how='outer'), df)