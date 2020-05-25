import csv
import collections
import json
import requests
from bs4 import BeautifulSoup




def shortest_path(p1, p2, g):
    shortest_paths = {p1: (None, 0)}
    current_node = p1
    visited = set()

    while current_node != p2:
        visited.add(current_node)
        destinations = g[current_node]
        weight_to_current_node = shortest_paths[current_node][1]

        for next_node in destinations:
            weight = 1 + weight_to_current_node
            if next_node not in shortest_paths:
                shortest_paths[next_node] = (current_node, weight)
            else:
                current_shortest_weight = shortest_paths[next_node][1]
                if current_shortest_weight > weight:
                    shortest_paths[next_node] = (current_node, weight)
        
        next_destinations = {node: shortest_paths[node] for node in shortest_paths if node not in visited}

        if not next_destinations:
            return "NO CONNECTION FOUND"
        
        current_node = min(next_destinations, key=lambda k: next_destinations[k][1])

    path = []
    while current_node is not None:
        path.append(get_plyr_from_prof(current_node))
        next_node = shortest_paths[current_node][0]
        current_node = next_node
    return path[::-1]

def adj_list(filenames):
    adj_lst = collections.defaultdict(set)
    for filename in filenames:
        i = 1
        with open(filename) as csv_file:
            reader = csv.reader(csv_file, delimiter='\n')
            i = 0
            for row in reader:
                if i != 0:
                    players = row[0].split(",")[2:]
                    set_plyrs = set()
                    for p in players:
                        set_plyrs.add(p.replace("\"", "").replace(" ", ""))
                    
                    for x in set_plyrs:
                        for y in set_plyrs:
                            if x != y:
                                adj_lst[x].add(y)
                                adj_lst[y].add(x)
                i += 1
    
    for x in adj_lst:
        adj_lst[x] = list(adj_lst[x])
    return adj_lst

def plyr_adj_list(filenames):
    ret = []
    adj_lst = collections.defaultdict(set)
    for filename in filenames:
        i = 1
        with open(filename, encoding="ISO-8859-1") as csv_file:
            reader = csv.reader(csv_file, delimiter='\n')
            i = 0
            for row in reader:
                if i != 0:
                    dat = row[0].replace('\"', '').split(",")
                    ret.append({'name': dat[1], 'from': int(dat[2]), 'to': int(dat[3]), 'prof': dat[4]})
                i += 1
    
    return ret

rosters = ['rosters/' + str(x) + 'rosters.csv' for x in range(1950, 2021)]
plyrs = ['players/' + chr(x) + 'players.csv' for x in range(97, 123)]
temp = plyr_adj_list(plyrs)
g_rosters = adj_list(rosters)
g_plyrs = []
for plyr in temp:
    if plyr['prof'] in g_rosters:
        g_plyrs.append(plyr)
with open('plyrtoinfo.json', 'w', encoding='utf-8') as fp:
    json.dump(g_plyrs, fp)
with open('plyrmap.json', 'w') as fp:
    json.dump(g_rosters, fp)
# print(shortest_path('/players/h/heinsto01.html', '/players/b/brownja02.html', g))