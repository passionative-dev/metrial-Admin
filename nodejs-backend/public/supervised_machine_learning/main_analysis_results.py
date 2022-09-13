from kd_tree import Kdtree, printPreorder
from read_files import *
from xnn import *
import json

import sys

# databases = ['appendicitis', 'haberman', 'pima', 'led7digit', 'monk-2', 'heart', 'wdbc', 'phoneme', 'iris', 'ecoli', 'banana']
databases = ["drug200"]

# k = 5
# k = int(sys.argv[1])
# databases = [sys.argv[2]]
parameter = sys.argv[1]
filename = [sys.argv[2]]  

# print("Quantidades de vizinhos próximos calculados: ", parameter)
# print("Filename ", filename)

catId = sys.argv[3]
param1 = sys.argv[4]
param2 = sys.argv[5]
param3 = sys.argv[6]
param4 = sys.argv[7]
param5 = sys.argv[8]
param6 = sys.argv[9]
param7 = sys.argv[10]

# print(param1)
# print(param2)
# print(param3)
# print(param4)
# print(param5)
# print(param6)
# print(param7)

if(param1 == 0) or (param1 == "0"):
    output = {"results": [], "success": False,
              "error_message": "Python Script Error see logs for more details"}
else:
    output = {"results": [{"catId": "3", "output1": "168", "output2": 8.2, "output3": 168, "output4": 1001018.70174764, "output5": 1677, "output6": 767, "output7": "Cap"}, {"catId": "3", "output1": "168", "output2": 8.2, "output3": 168, "output4": 1001018.70174764, "output5": 1677, "output6": 767, "output7": "Polo"},
                          {"catId": "3", "output1": "168", "output2": 8.2, "output3": 168, "output4": 1001018.70174764, "output5": 1677, "output6": 767, "output7": "Belt"}, {
                              "catId": "3", "output1": "168", "output2": 8.2, "output3": 168, "output4": 1001018.70174764, "output5": 1677, "output6": 767, "output7": "Single"},
                          {"catId": "3", "output1": "168", "output2": 8.2, "output3": 168, "output4": 1001018.70174764, "output5": 1677, "output6": 767, "output7": "Sports Kids"}, {"catId": "3", "output1": "168", "output2": 8.2, "output3": 168, "output4": 1001018.70174764, "output5": 1677, "output6": 767, "output7": "T-Shirt"}],
              "success": True, "message": ""}
print(json.dumps(output))
# Disable after tested the current state
# print("98%")
# print("98%")
# print("98%")

# d = {"column1": [1, 2, 3, "test", 5, 6, 7, 100, 123.00], "column2": [2, 4, 6, "string", 6 ,7, 9, 0.18, 24.6], "column3": [2, 4, 6, "8", 6 ,7, 9, 23, 6],"column4": [2, 4, 6, "text2", 6 ,7, 9, 45.6, 78.9],"column5": [2, 4, "strong", 8, 6 ,7, 9, 78.8, 56.9]}
# df = pd.DataFrame(d)
# print(df)

# need to add above dataframe into postgres

# Column1 column2 column3 column4 column5
#    add first row
#   add second row
#  until entire dataframe
