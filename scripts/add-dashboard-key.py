import re, os

path = r"C:\Users\Mi niña\Downloads\Claude\projects\qrwing\src\lib\i18n.ts"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

translations = {
    "ar": "عرض لوحة التحكم ←",
    "de": "Zum Dashboard →",
    "el": "Πίνακας ελέγχου →",
    "en": "View dashboard →",
    "es": "Ir al dashboard →",
    "fr": "Voir le tableau de bord →",
    "hi": "डैशबोर्ड देखें →",
    "id": "Lihat dasbor →",
    "it": "Vai alla dashboard →",
    "ja": "ダッシュボードを見る →",
    "ko": "대시보드 보기 →",
    "nl": "Bekijk dashboard →",
    "pl": "Zobacz panel →",
    "pt": "Ver dashboard →",
    "ro": "Vezi panoul de bord →",
    "ru": "Перейти в панель →",
    "sv": "Visa dashboard →",
    "th": "ดูแดชบอร์ด →",
    "tr": "Panoya git →",
    "uk": "Переглянути панель →",
    "vi": "Xem bảng điều khiển →",
    "zh-CN": "查看仪表盘 →",
    "zh-TW": "查看儀表板 →",
}

lang_pattern = re.compile(r'^\s+(?:"?(\w+(?:-\w+)?)"?:\s*\{)$')

lines = content.splitlines()
result = []
current_lang = None

for line in lines:
    result.append(line)
    m = lang_pattern.match(line)
    if m:
        current_lang = m.group(1)
    elif re.match(r'^\s+saved:', line) and current_lang in translations:
        indent = "    "
        result.append(f'{indent}viewDashboard: "{translations[current_lang]}",')

with open(path, "w", encoding="utf-8") as f:
    f.write(os.linesep.join(result))

print("Done")
