import urllib.request as req
import json
import re
import pathvalidate
import pathlib

url = 'https://bing.com/HPImageArchive.aspx?format=js&idx=0&n=1'

# try:
res = req.urlopen(url)
res = res.read().decode('utf-8')

api = json.loads(res)

api = api['images']
downloadURL = "https://bing.com" + api[0]['urlbase'] + "_UHD.jpg"
dateTime = api[0]['startdate']
copyright = api[0]['copyright'] # 获取版权信息

filename = pathvalidate.sanitize_filename("{0}{1}{2}.jpg".format(dateTime, '@', copyright))
filenameMeta = pathvalidate.sanitize_filename("{}.json".format(dateTime))

year = dateTime[0:4]

folder = "./Wallpaper/{}".format(year)

pathlib.Path(folder).mkdir(parents=True, exist_ok=True)

req.urlretrieve(downloadURL, "{0}/{1}".format(folder, filename))
req.urlretrieve(url, "{0}/{1}".format(folder, filenameMeta))

# except:
#     print("Error.")
