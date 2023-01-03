import requests
from bs4 import BeautifulSoup
import json
url = 'https://page.kakao.com/landing/ranking/11' ## 카카오
# url = 'https://ridibooks.com/category/bestsellers/6050/' ## Ridi

res = requests.get(url)

html = res.text

soup = BeautifulSoup(html, 'html.parser')

next_data = soup.select('#__NEXT_DATA__')

book_list = []

for i in next_data:
    a = i.text
    book_list.append(json.loads(a))
    
with open('kakao.json', 'w', encoding='utf-8') as file:
    json.dump(book_list, file, ensure_ascii=False, indent="\t")

