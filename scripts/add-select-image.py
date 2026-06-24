path = r"C:\Users\Mi niña\Downloads\Claude\projects\qrwing\src\lib\i18n.ts"
with open(path, "rb") as f:
    raw = f.read()
normalized = raw.replace(b"\r\n", b"\n").replace(b"\r", b"")
text = normalized.decode("utf-8")
lines = text.split("\n")
if lines and lines[-1] == "":
    lines.pop()

select_image = [
    'selectImage: "اختيار صورة",',
    'selectImage: "Bild auswählen",',
    'selectImage: "Επιλογή εικόνας",',
    'selectImage: "Select image",',
    'selectImage: "Seleccionar imagen",',
    'selectImage: "Sélectionner une image",',
    'selectImage: "छवि चुनें",',
    'selectImage: "Pilih gambar",',
    'selectImage: "Seleziona immagine",',
    'selectImage: "画像を選択",',
    'selectImage: "이미지 선택",',
    'selectImage: "Afbeelding selecteren",',
    'selectImage: "Wybierz obraz",',
    'selectImage: "Selecionar imagem",',
    'selectImage: "Selectați imaginea",',
    'selectImage: "Выберите изображение",',
    'selectImage: "Välj bild",',
    'selectImage: "เลือกรูปภาพ",',
    'selectImage: "Resim seç",',
    'selectImage: "Виберіть зображення",',
    'selectImage: "Chọn hình ảnh",',
    'selectImage: "选择图片",',
    'selectImage: "選擇圖片",',
]

# Find logoHelp lines and insert selectImage after each
logo_help_indices = [i for i, l in enumerate(lines) if l.strip().startswith("logoHelp:")]
print(f"Found {len(logo_help_indices)} logoHelp entries")

for pos in sorted(logo_help_indices, reverse=True):
    line = lines[pos]
    indent = line[:len(line) - len(line.lstrip())]
    lang_idx = logo_help_indices.index(pos)
    lines.insert(pos + 1, "")
    lines.insert(pos + 2, f"{indent}{select_image[lang_idx]}")

result = "\n".join(lines) + "\n"
with open(path, "w", encoding="utf-8") as f:
    f.write(result)

print(f"Added {len(logo_help_indices)} selectImage keys")
