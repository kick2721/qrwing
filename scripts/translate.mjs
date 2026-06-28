import { readFileSync, writeFileSync } from "fs";

const BASEDIR = "C:\\Users\\MINIA~1\\DOWNLO~1\\Claude\\projects\\qrwing";

const LANG_CODES = ["ar","de","el","en","es","fr","hi","id","it","ja","ko","nl","pl","pt","ro","ru","sv","th","tr","uk","vi","zh-CN","zh-TW"];

const TRANS = {
  ar: {
    qrTypeWhatsapp: "واتساب", qrTypePhone: "هاتف", qrTypeSms: "رسالة نصية", qrTypeLocation: "موقع", qrTypeCalendar: "حدث", qrTypeYoutube: "يوتيوب", qrTypeAppstore: "متجر التطبيقات", qrTypeTelegram: "تيليجرام",
    typeWhatsappDesc: "يفتح محادثة واتساب عند المسح", typePhoneDesc: "يتصل برقم هاتف عند المسح", typeSmsDesc: "يفتح تطبيق الرسائل النصية برسالة جاهزة", typeLocationDesc: "يفتح موقعًا في خرائط جوجل", typeCalendarDesc: "يضيف حدثًا إلى التقويم", typeYoutubeDesc: "رابط لفيديو يوتيوب", typeAppstoreDesc: "رابط لتطبيقك في متجر التطبيقات أو جوجل بلاي", typeTelegramDesc: "يفتح محادثة تيليجرام عند المسح",
    placeWhatsappPhone: "رقم الهاتف (مع مفتاح الدولة)", placeWhatsappMsg: "الرسالة (اختياري)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "اكتب رسالتك...", placeLocation: "العنوان أو الإحداثيات (مثال: 40.7128,-74.0060)", placeCalendarTitle: "عنوان الحدث", placeCalendarDate: "التاريخ والوقت (مثال: 2026-12-25 18:00)", placeCalendarLocation: "الموقع (اختياري)", placeCalendarDesc: "الوصف (اختياري)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "رابط متجر التطبيقات (iOS)", placeAppstoreAndroid: "رابط جوجل بلاي (أندرويد)", placeTelegramUser: "اسم المستخدم (مثال: user)", placeTelegramMsg: "الرسالة (اختياري)",
    gradient: "تدرج", gradientLinear: "خطي", gradientRadial: "قطري", dotStyle: "نمط النقاط", dotSquare: "مربع", dotDots: "دوائر", dotRounded: "مدور", dotExtraRounded: "مدور جدًا", dotClassy: "كلاسيكي", dotClassyRounded: "كلاسيكي مدور", cornerSquareStyle: "نمط الزوايا المربعة", cornerDotStyle: "نمط نقاط الزوايا", cornerSquare: "مربع", cornerDot: "نقطة", cornerRounded: "مدور",
  },
  de: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "Telefon", qrTypeSms: "SMS", qrTypeLocation: "Standort", qrTypeCalendar: "Ereignis", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "Öffnet einen WhatsApp-Chat beim Scannen", typePhoneDesc: "Ruft eine Telefonnummer an", typeSmsDesc: "Öffnet SMS-App mit vorausgefüllter Nachricht", typeLocationDesc: "Öffnet einen Ort in Google Maps", typeCalendarDesc: "Fügt ein Ereignis zum Kalender hinzu", typeYoutubeDesc: "Link zu einem YouTube-Video", typeAppstoreDesc: "Link zu Ihrer App im App Store oder Google Play", typeTelegramDesc: "Öffnet einen Telegram-Chat",
    placeWhatsappPhone: "Telefonnummer (mit Ländervorwahl)", placeWhatsappMsg: "Nachricht (optional)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "Geben Sie Ihre Nachricht ein...", placeLocation: "Adresse oder Koordinaten (z.B. 40.7128,-74.0060)", placeCalendarTitle: "Ereignistitel", placeCalendarDate: "Datum und Uhrzeit (z.B. 2026-12-25 18:00)", placeCalendarLocation: "Ort (optional)", placeCalendarDesc: "Beschreibung (optional)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "App Store URL (iOS)", placeAppstoreAndroid: "Google Play URL (Android)", placeTelegramUser: "Benutzername (z.B. user)", placeTelegramMsg: "Nachricht (optional)",
    gradient: "Farbverlauf", gradientLinear: "Linear", gradientRadial: "Radial", dotStyle: "Punktstil", dotSquare: "Quadratisch", dotDots: "Kreise", dotRounded: "Abgerundet", dotExtraRounded: "Extra abgerundet", dotClassy: "Klassisch", dotClassyRounded: "Klassisch abgerundet", cornerSquareStyle: "Stil der Eckenquadrate", cornerDotStyle: "Stil der Eckpunkte", cornerSquare: "Quadrat", cornerDot: "Punkt", cornerRounded: "Abgerundet",
  },
  el: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "Τηλέφωνο", qrTypeSms: "SMS", qrTypeLocation: "Τοποθεσία", qrTypeCalendar: "Συμβάν", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "Ανοίγει συνομιλία WhatsApp κατά τη σάρωση", typePhoneDesc: "Καλεί έναν αριθμό τηλεφώνου", typeSmsDesc: "Ανοίγει την εφαρμογή SMS με προγεμισμένο μήνυμα", typeLocationDesc: "Ανοίγει μια τοποθεσία στους Χάρτες Google", typeCalendarDesc: "Προσθέτει ένα συμβάν στο ημερολόγιο", typeYoutubeDesc: "Σύνδεσμος σε βίντεο YouTube", typeAppstoreDesc: "Σύνδεσμος προς την εφαρμογή σας στο App Store ή το Google Play", typeTelegramDesc: "Ανοίγει συνομιλία Telegram",
    placeWhatsappPhone: "Αριθμός τηλεφώνου (με κωδικό χώρας)", placeWhatsappMsg: "Μήνυμα (προαιρετικό)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "Πληκτρολογήστε το μήνυμά σας...", placeLocation: "Διεύθυνση ή συντεταγμένες (π.χ. 40.7128,-74.0060)", placeCalendarTitle: "Τίτλος συμβάντος", placeCalendarDate: "Ημερομηνία και ώρα (π.χ. 2026-12-25 18:00)", placeCalendarLocation: "Τοποθεσία (προαιρετικό)", placeCalendarDesc: "Περιγραφή (προαιρετικό)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "URL App Store (iOS)", placeAppstoreAndroid: "URL Google Play (Android)", placeTelegramUser: "Όνομα χρήστη (π.χ. user)", placeTelegramMsg: "Μήνυμα (προαιρετικό)",
    gradient: "Διαβάθμιση", gradientLinear: "Γραμμική", gradientRadial: "Ακτινική", dotStyle: "Στυλ κουκκίδων", dotSquare: "Τετράγωνο", dotDots: "Κύκλοι", dotRounded: "Στρογγυλεμένο", dotExtraRounded: "Πολύ στρογγυλεμένο", dotClassy: "Κλασικό", dotClassyRounded: "Κλασικό στρογγυλεμένο", cornerSquareStyle: "Στυλ γωνιακών τετραγώνων", cornerDotStyle: "Στυλ γωνιακών κουκκίδων", cornerSquare: "Τετράγωνο", cornerDot: "Κουκκίδα", cornerRounded: "Στρογγυλεμένο",
  },
  es: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "Teléfono", qrTypeSms: "SMS", qrTypeLocation: "Ubicación", qrTypeCalendar: "Evento", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "Abre un chat de WhatsApp al escanear", typePhoneDesc: "Llama a un número telefónico", typeSmsDesc: "Abre la app de SMS con mensaje predefinido", typeLocationDesc: "Abre una ubicación en Google Maps", typeCalendarDesc: "Añade un evento al calendario", typeYoutubeDesc: "Enlace a un video de YouTube", typeAppstoreDesc: "Enlace a tu app en App Store o Google Play", typeTelegramDesc: "Abre un chat de Telegram",
    placeWhatsappPhone: "Número telefónico (con código de país)", placeWhatsappMsg: "Mensaje (opcional)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "Escribe tu mensaje...", placeLocation: "Dirección o coordenadas (ej. 40.7128,-74.0060)", placeCalendarTitle: "Título del evento", placeCalendarDate: "Fecha y hora (ej. 2026-12-25 18:00)", placeCalendarLocation: "Ubicación (opcional)", placeCalendarDesc: "Descripción (opcional)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "URL de App Store (iOS)", placeAppstoreAndroid: "URL de Google Play (Android)", placeTelegramUser: "Nombre de usuario (ej. user)", placeTelegramMsg: "Mensaje (opcional)",
    gradient: "Degradado", gradientLinear: "Lineal", gradientRadial: "Radial", dotStyle: "Estilo de punto", dotSquare: "Cuadrado", dotDots: "Círculos", dotRounded: "Redondeado", dotExtraRounded: "Extra redondeado", dotClassy: "Elegante", dotClassyRounded: "Elegante redondeado", cornerSquareStyle: "Estilo de esquina cuadrada", cornerDotStyle: "Estilo de punto de esquina", cornerSquare: "Cuadrado", cornerDot: "Punto", cornerRounded: "Redondeado",
  },
  fr: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "Téléphone", qrTypeSms: "SMS", qrTypeLocation: "Lieu", qrTypeCalendar: "Événement", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "Ouvre une discussion WhatsApp lors du scan", typePhoneDesc: "Appelle un numéro de téléphone", typeSmsDesc: "Ouvre l'application SMS avec un message prérempli", typeLocationDesc: "Ouvre un lieu dans Google Maps", typeCalendarDesc: "Ajoute un événement au calendrier", typeYoutubeDesc: "Lien vers une vidéo YouTube", typeAppstoreDesc: "Lien vers votre app sur l'App Store ou Google Play", typeTelegramDesc: "Ouvre une discussion Telegram",
    placeWhatsappPhone: "Numéro de téléphone (avec indicatif)", placeWhatsappMsg: "Message (facultatif)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "Tapez votre message...", placeLocation: "Adresse ou coordonnées (ex: 40.7128,-74.0060)", placeCalendarTitle: "Titre de l'événement", placeCalendarDate: "Date et heure (ex: 2026-12-25 18:00)", placeCalendarLocation: "Lieu (facultatif)", placeCalendarDesc: "Description (facultatif)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "URL App Store (iOS)", placeAppstoreAndroid: "URL Google Play (Android)", placeTelegramUser: "Nom d'utilisateur (ex: user)", placeTelegramMsg: "Message (facultatif)",
    gradient: "Dégradé", gradientLinear: "Linéaire", gradientRadial: "Radial", dotStyle: "Style de point", dotSquare: "Carré", dotDots: "Cercles", dotRounded: "Arrondi", dotExtraRounded: "Extra arrondi", dotClassy: "Élégant", dotClassyRounded: "Élégant arrondi", cornerSquareStyle: "Style des coins carrés", cornerDotStyle: "Style des points de coin", cornerSquare: "Carré", cornerDot: "Point", cornerRounded: "Arrondi",
  },
  hi: {
    qrTypeWhatsapp: "व्हाट्सएप", qrTypePhone: "फ़ोन", qrTypeSms: "एसएमएस", qrTypeLocation: "स्थान", qrTypeCalendar: "ईवेंट", qrTypeYoutube: "यूट्यूब", qrTypeAppstore: "ऐप स्टोर", qrTypeTelegram: "टेलीग्राम",
    typeWhatsappDesc: "स्कैन करने पर व्हाट्सएप चैट खोलता है", typePhoneDesc: "फ़ोन नंबर पर कॉल करता है", typeSmsDesc: "पूर्व-भरे संदेश के साथ SMS ऐप खोलता है", typeLocationDesc: "Google Maps में स्थान खोलता है", typeCalendarDesc: "कैलेंडर में ईवेंट जोड़ता है", typeYoutubeDesc: "YouTube वीडियो का लिंक", typeAppstoreDesc: "App Store या Google Play पर आपके ऐप का लिंक", typeTelegramDesc: "टेलीग्राम चैट खोलता है",
    placeWhatsappPhone: "फ़ोन नंबर (देश कोड के साथ)", placeWhatsappMsg: "संदेश (वैकल्पिक)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "अपना संदेश लिखें...", placeLocation: "पता या निर्देशांक (जैसे 40.7128,-74.0060)", placeCalendarTitle: "ईवेंट शीर्षक", placeCalendarDate: "दिनांक और समय (जैसे 2026-12-25 18:00)", placeCalendarLocation: "स्थान (वैकल्पिक)", placeCalendarDesc: "विवरण (वैकल्पिक)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "App Store URL (iOS)", placeAppstoreAndroid: "Google Play URL (Android)", placeTelegramUser: "उपयोगकर्ता नाम (जैसे user)", placeTelegramMsg: "संदेश (वैकल्पिक)",
    gradient: "ग्रेडिएंट", gradientLinear: "रैखिक", gradientRadial: "त्रिज्यीय", dotStyle: "बिंदु शैली", dotSquare: "वर्गाकार", dotDots: "वृत्त", dotRounded: "गोल", dotExtraRounded: "अतिरिक्त गोल", dotClassy: "शानदार", dotClassyRounded: "शानदार गोल", cornerSquareStyle: "कोने वर्ग शैली", cornerDotStyle: "कोने बिंदु शैली", cornerSquare: "वर्ग", cornerDot: "बिंदु", cornerRounded: "गोल",
  },
  id: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "Telepon", qrTypeSms: "SMS", qrTypeLocation: "Lokasi", qrTypeCalendar: "Acara", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "Membuka chat WhatsApp saat dipindai", typePhoneDesc: "Menelpon nomor telepon", typeSmsDesc: "Membuka aplikasi SMS dengan pesan terisi", typeLocationDesc: "Membuka lokasi di Google Maps", typeCalendarDesc: "Menambahkan acara ke kalender", typeYoutubeDesc: "Tautan ke video YouTube", typeAppstoreDesc: "Tautan ke aplikasi Anda di App Store atau Google Play", typeTelegramDesc: "Membuka chat Telegram",
    placeWhatsappPhone: "Nomor telepon (dengan kode negara)", placeWhatsappMsg: "Pesan (opsional)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "Ketik pesan Anda...", placeLocation: "Alamat atau koordinat (mis. 40.7128,-74.0060)", placeCalendarTitle: "Judul acara", placeCalendarDate: "Tanggal dan waktu (mis. 2026-12-25 18:00)", placeCalendarLocation: "Lokasi (opsional)", placeCalendarDesc: "Deskripsi (opsional)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "URL App Store (iOS)", placeAppstoreAndroid: "URL Google Play (Android)", placeTelegramUser: "Nama pengguna (mis. user)", placeTelegramMsg: "Pesan (opsional)",
    gradient: "Gradien", gradientLinear: "Linear", gradientRadial: "Radial", dotStyle: "Gaya titik", dotSquare: "Kotak", dotDots: "Lingkaran", dotRounded: "Membulat", dotExtraRounded: "Ekstra membulat", dotClassy: "Klasik", dotClassyRounded: "Klasik membulat", cornerSquareStyle: "Gaya sudut kotak", cornerDotStyle: "Gaya titik sudut", cornerSquare: "Kotak", cornerDot: "Titik", cornerRounded: "Membulat",
  },
  it: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "Telefono", qrTypeSms: "SMS", qrTypeLocation: "Posizione", qrTypeCalendar: "Evento", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "Apre una chat WhatsApp quando scansionato", typePhoneDesc: "Chiama un numero di telefono", typeSmsDesc: "Apri l'app SMS con messaggio precompilato", typeLocationDesc: "Apre una posizione in Google Maps", typeCalendarDesc: "Aggiunge un evento al calendario", typeYoutubeDesc: "Link a un video YouTube", typeAppstoreDesc: "Link alla tua app su App Store o Google Play", typeTelegramDesc: "Apre una chat Telegram",
    placeWhatsappPhone: "Numero di telefono (con prefisso)", placeWhatsappMsg: "Messaggio (opzionale)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "Scrivi il tuo messaggio...", placeLocation: "Indirizzo o coordinate (es. 40.7128,-74.0060)", placeCalendarTitle: "Titolo evento", placeCalendarDate: "Data e ora (es. 2026-12-25 18:00)", placeCalendarLocation: "Luogo (opzionale)", placeCalendarDesc: "Descrizione (opzionale)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "URL App Store (iOS)", placeAppstoreAndroid: "URL Google Play (Android)", placeTelegramUser: "Nome utente (es. user)", placeTelegramMsg: "Messaggio (opzionale)",
    gradient: "Sfumatura", gradientLinear: "Lineare", gradientRadial: "Radiale", dotStyle: "Stile punto", dotSquare: "Quadrato", dotDots: "Cerchi", dotRounded: "Arrotondato", dotExtraRounded: "Extra arrotondato", dotClassy: "Elegante", dotClassyRounded: "Elegante arrotondato", cornerSquareStyle: "Stile angolo quadrato", cornerDotStyle: "Stile punto d'angolo", cornerSquare: "Quadrato", cornerDot: "Punto", cornerRounded: "Arrotondato",
  },
  ja: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "電話", qrTypeSms: "SMS", qrTypeLocation: "場所", qrTypeCalendar: "イベント", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "スキャン時にWhatsAppチャットを開く", typePhoneDesc: "電話番号に発信する", typeSmsDesc: "事前入力されたメッセージでSMSアプリを開く", typeLocationDesc: "Googleマップで場所を開く", typeCalendarDesc: "カレンダーにイベントを追加", typeYoutubeDesc: "YouTube動画へのリンク", typeAppstoreDesc: "App StoreまたはGoogle Playのアプリへのリンク", typeTelegramDesc: "Telegramチャットを開く",
    placeWhatsappPhone: "電話番号（国コード付き）", placeWhatsappMsg: "メッセージ（オプション）", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "メッセージを入力...", placeLocation: "住所または座標（例: 40.7128,-74.0060）", placeCalendarTitle: "イベントタイトル", placeCalendarDate: "日時（例: 2026-12-25 18:00）", placeCalendarLocation: "場所（オプション）", placeCalendarDesc: "説明（オプション）", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "App Store URL（iOS）", placeAppstoreAndroid: "Google Play URL（Android）", placeTelegramUser: "ユーザー名（例: user）", placeTelegramMsg: "メッセージ（オプション）",
    gradient: "グラデーション", gradientLinear: "線形", gradientRadial: "放射状", dotStyle: "ドットスタイル", dotSquare: "四角", dotDots: "円", dotRounded: "角丸", dotExtraRounded: "超角丸", dotClassy: "クラシー", dotClassyRounded: "クラシー角丸", cornerSquareStyle: "角の四角スタイル", cornerDotStyle: "角のドットスタイル", cornerSquare: "四角", cornerDot: "ドット", cornerRounded: "角丸",
  },
  ko: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "전화", qrTypeSms: "SMS", qrTypeLocation: "위치", qrTypeCalendar: "이벤트", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "스캔 시 WhatsApp 채팅 열기", typePhoneDesc: "전화번호로 통화", typeSmsDesc: "메시지가 미리 입력된 SMS 앱 열기", typeLocationDesc: "Google Maps에서 위치 열기", typeCalendarDesc: "캘린더에 이벤트 추가", typeYoutubeDesc: "YouTube 동영상 링크", typeAppstoreDesc: "App Store 또는 Google Play의 앱 링크", typeTelegramDesc: "Telegram 채팅 열기",
    placeWhatsappPhone: "전화번호 (국가 코드 포함)", placeWhatsappMsg: "메시지 (선택사항)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "메시지를 입력하세요...", placeLocation: "주소 또는 좌표 (예: 40.7128,-74.0060)", placeCalendarTitle: "이벤트 제목", placeCalendarDate: "날짜 및 시간 (예: 2026-12-25 18:00)", placeCalendarLocation: "장소 (선택사항)", placeCalendarDesc: "설명 (선택사항)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "App Store URL (iOS)", placeAppstoreAndroid: "Google Play URL (Android)", placeTelegramUser: "사용자 이름 (예: user)", placeTelegramMsg: "메시지 (선택사항)",
    gradient: "그라데이션", gradientLinear: "선형", gradientRadial: "방사형", dotStyle: "점 스타일", dotSquare: "사각형", dotDots: "원", dotRounded: "둥근", dotExtraRounded: "매우 둥근", dotClassy: "클래시", dotClassyRounded: "클래시 둥근", cornerSquareStyle: "모서리 사각형 스타일", cornerDotStyle: "모서리 점 스타일", cornerSquare: "사각형", cornerDot: "점", cornerRounded: "둥근",
  },
  nl: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "Telefoon", qrTypeSms: "SMS", qrTypeLocation: "Locatie", qrTypeCalendar: "Gebeurtenis", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "Opent een WhatsApp-gesprek bij scannen", typePhoneDesc: "Bel een telefoonnummer", typeSmsDesc: "Opent SMS-app met vooringevuld bericht", typeLocationDesc: "Opent een locatie in Google Maps", typeCalendarDesc: "Voegt een gebeurtenis toe aan de kalender", typeYoutubeDesc: "Link naar een YouTube-video", typeAppstoreDesc: "Link naar uw app in de App Store of Google Play", typeTelegramDesc: "Opent een Telegram-gesprek",
    placeWhatsappPhone: "Telefoonnummer (met landcode)", placeWhatsappMsg: "Bericht (optioneel)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "Typ uw bericht...", placeLocation: "Adres of coördinaten (bijv. 40.7128,-74.0060)", placeCalendarTitle: "Gebeurtenistitel", placeCalendarDate: "Datum en tijd (bijv. 2026-12-25 18:00)", placeCalendarLocation: "Locatie (optioneel)", placeCalendarDesc: "Beschrijving (optioneel)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "App Store URL (iOS)", placeAppstoreAndroid: "Google Play URL (Android)", placeTelegramUser: "Gebruikersnaam (bijv. user)", placeTelegramMsg: "Bericht (optioneel)",
    gradient: "Verloop", gradientLinear: "Lineair", gradientRadial: "Radiaal", dotStyle: "Puntstijl", dotSquare: "Vierkant", dotDots: "Cirkels", dotRounded: "Afgerond", dotExtraRounded: "Extra afgerond", dotClassy: "Stijlvol", dotClassyRounded: "Stijlvol afgerond", cornerSquareStyle: "Hoek vierkant stijl", cornerDotStyle: "Hoek punt stijl", cornerSquare: "Vierkant", cornerDot: "Punt", cornerRounded: "Afgerond",
  },
  pl: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "Telefon", qrTypeSms: "SMS", qrTypeLocation: "Lokalizacja", qrTypeCalendar: "Wydarzenie", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "Otwiera czat WhatsApp po zeskanowaniu", typePhoneDesc: "Dzwoni na numer telefonu", typeSmsDesc: "Otwiera aplikację SMS z wypełnioną wiadomością", typeLocationDesc: "Otwiera lokalizację w Google Maps", typeCalendarDesc: "Dodaje wydarzenie do kalendarza", typeYoutubeDesc: "Link do filmu na YouTube", typeAppstoreDesc: "Link do aplikacji w App Store lub Google Play", typeTelegramDesc: "Otwiera czat Telegram",
    placeWhatsappPhone: "Numer telefonu (z kierunkiem)", placeWhatsappMsg: "Wiadomość (opcjonalnie)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "Wpisz swoją wiadomość...", placeLocation: "Adres lub współrzędne (np. 40.7128,-74.0060)", placeCalendarTitle: "Tytuł wydarzenia", placeCalendarDate: "Data i czas (np. 2026-12-25 18:00)", placeCalendarLocation: "Miejsce (opcjonalnie)", placeCalendarDesc: "Opis (opcjonalnie)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "URL App Store (iOS)", placeAppstoreAndroid: "URL Google Play (Android)", placeTelegramUser: "Nazwa użytkownika (np. user)", placeTelegramMsg: "Wiadomość (opcjonalnie)",
    gradient: "Gradient", gradientLinear: "Liniowy", gradientRadial: "Promienisty", dotStyle: "Styl kropek", dotSquare: "Kwadrat", dotDots: "Koła", dotRounded: "Zaokrąglone", dotExtraRounded: "Bardzo zaokrąglone", dotClassy: "Klasyczny", dotClassyRounded: "Klasyczny zaokrąglony", cornerSquareStyle: "Styl narożnych kwadratów", cornerDotStyle: "Styl narożnych kropek", cornerSquare: "Kwadrat", cornerDot: "Kropka", cornerRounded: "Zaokrąglone",
  },
  pt: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "Telefone", qrTypeSms: "SMS", qrTypeLocation: "Local", qrTypeCalendar: "Evento", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "Abre um chat do WhatsApp ao escanear", typePhoneDesc: "Liga para um número de telefone", typeSmsDesc: "Abre o app de SMS com mensagem preenchida", typeLocationDesc: "Abre um local no Google Maps", typeCalendarDesc: "Adiciona um evento ao calendário", typeYoutubeDesc: "Link para um vídeo do YouTube", typeAppstoreDesc: "Link para seu app na App Store ou Google Play", typeTelegramDesc: "Abre um chat do Telegram",
    placeWhatsappPhone: "Número de telefone (com código do país)", placeWhatsappMsg: "Mensagem (opcional)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "Digite sua mensagem...", placeLocation: "Endereço ou coordenadas (ex: 40.7128,-74.0060)", placeCalendarTitle: "Título do evento", placeCalendarDate: "Data e hora (ex: 2026-12-25 18:00)", placeCalendarLocation: "Local (opcional)", placeCalendarDesc: "Descrição (opcional)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "URL da App Store (iOS)", placeAppstoreAndroid: "URL do Google Play (Android)", placeTelegramUser: "Nome de usuário (ex: user)", placeTelegramMsg: "Mensagem (opcional)",
    gradient: "Gradiente", gradientLinear: "Linear", gradientRadial: "Radial", dotStyle: "Estilo do ponto", dotSquare: "Quadrado", dotDots: "Círculos", dotRounded: "Arredondado", dotExtraRounded: "Extra arredondado", dotClassy: "Elegante", dotClassyRounded: "Elegante arredondado", cornerSquareStyle: "Estilo do quadrado do canto", cornerDotStyle: "Estilo do ponto do canto", cornerSquare: "Quadrado", cornerDot: "Ponto", cornerRounded: "Arredondado",
  },
  ro: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "Telefon", qrTypeSms: "SMS", qrTypeLocation: "Locație", qrTypeCalendar: "Eveniment", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "Deschide un chat WhatsApp la scanare", typePhoneDesc: "Sună un număr de telefon", typeSmsDesc: "Deschide aplicația SMS cu mesaj precompletat", typeLocationDesc: "Deschide o locație în Google Maps", typeCalendarDesc: "Adaugă un eveniment în calendar", typeYoutubeDesc: "Link către un videoclip YouTube", typeAppstoreDesc: "Link către aplicația ta pe App Store sau Google Play", typeTelegramDesc: "Deschide un chat Telegram",
    placeWhatsappPhone: "Număr de telefon (cu prefix)", placeWhatsappMsg: "Mesaj (opțional)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "Scrie mesajul tău...", placeLocation: "Adresă sau coordonate (ex: 40.7128,-74.0060)", placeCalendarTitle: "Titlu eveniment", placeCalendarDate: "Data și ora (ex: 2026-12-25 18:00)", placeCalendarLocation: "Locație (opțional)", placeCalendarDesc: "Descriere (opțional)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "URL App Store (iOS)", placeAppstoreAndroid: "URL Google Play (Android)", placeTelegramUser: "Nume utilizator (ex: user)", placeTelegramMsg: "Mesaj (opțional)",
    gradient: "Gradient", gradientLinear: "Liniar", gradientRadial: "Radial", dotStyle: "Stil punct", dotSquare: "Pătrat", dotDots: "Cercuri", dotRounded: "Rotunjit", dotExtraRounded: "Foarte rotunjit", dotClassy: "Clasic", dotClassyRounded: "Clasic rotunjit", cornerSquareStyle: "Stil colț pătrat", cornerDotStyle: "Stil colț punct", cornerSquare: "Pătrat", cornerDot: "Punct", cornerRounded: "Rotunjit",
  },
  ru: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "Телефон", qrTypeSms: "SMS", qrTypeLocation: "Местоположение", qrTypeCalendar: "Событие", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "Открывает чат WhatsApp при сканировании", typePhoneDesc: "Звонит по номеру телефона", typeSmsDesc: "Открывает приложение SMS с готовым сообщением", typeLocationDesc: "Открывает местоположение в Google Картах", typeCalendarDesc: "Добавляет событие в календарь", typeYoutubeDesc: "Ссылка на видео YouTube", typeAppstoreDesc: "Ссылка на ваше приложение в App Store или Google Play", typeTelegramDesc: "Открывает чат Telegram",
    placeWhatsappPhone: "Номер телефона (с кодом страны)", placeWhatsappMsg: "Сообщение (необязательно)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "Введите ваше сообщение...", placeLocation: "Адрес или координаты (например, 40.7128,-74.0060)", placeCalendarTitle: "Название события", placeCalendarDate: "Дата и время (например, 2026-12-25 18:00)", placeCalendarLocation: "Место (необязательно)", placeCalendarDesc: "Описание (необязательно)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "URL App Store (iOS)", placeAppstoreAndroid: "URL Google Play (Android)", placeTelegramUser: "Имя пользователя (например, user)", placeTelegramMsg: "Сообщение (необязательно)",
    gradient: "Градиент", gradientLinear: "Линейный", gradientRadial: "Радиальный", dotStyle: "Стиль точек", dotSquare: "Квадрат", dotDots: "Круги", dotRounded: "Скруглённые", dotExtraRounded: "Сильно скруглённые", dotClassy: "Классический", dotClassyRounded: "Классический скруглённый", cornerSquareStyle: "Стиль угловых квадратов", cornerDotStyle: "Стиль угловых точек", cornerSquare: "Квадрат", cornerDot: "Точка", cornerRounded: "Скруглённый",
  },
  sv: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "Telefon", qrTypeSms: "SMS", qrTypeLocation: "Plats", qrTypeCalendar: "Händelse", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "Öppnar en WhatsApp-chatt vid skanning", typePhoneDesc: "Ringer ett telefonnummer", typeSmsDesc: "Öppnar SMS-appen med ifyllt meddelande", typeLocationDesc: "Öppnar en plats i Google Maps", typeCalendarDesc: "Lägger till en händelse i kalendern", typeYoutubeDesc: "Länk till en YouTube-video", typeAppstoreDesc: "Länk till din app i App Store eller Google Play", typeTelegramDesc: "Öppnar en Telegram-chatt",
    placeWhatsappPhone: "Telefonnummer (med landskod)", placeWhatsappMsg: "Meddelande (valfritt)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "Skriv ditt meddelande...", placeLocation: "Adress eller koordinater (t.ex. 40.7128,-74.0060)", placeCalendarTitle: "Händelsetitel", placeCalendarDate: "Datum och tid (t.ex. 2026-12-25 18:00)", placeCalendarLocation: "Plats (valfritt)", placeCalendarDesc: "Beskrivning (valfritt)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "App Store URL (iOS)", placeAppstoreAndroid: "Google Play URL (Android)", placeTelegramUser: "Användarnamn (t.ex. user)", placeTelegramMsg: "Meddelande (valfritt)",
    gradient: "Gradient", gradientLinear: "Linjär", gradientRadial: "Radiell", dotStyle: "Punktstil", dotSquare: "Fyrkant", dotDots: "Cirklar", dotRounded: "Rundad", dotExtraRounded: "Extra rundad", dotClassy: "Klassisk", dotClassyRounded: "Klassisk rundad", cornerSquareStyle: "Hörnfyrkantsstil", cornerDotStyle: "Hörnpunktsstil", cornerSquare: "Fyrkant", cornerDot: "Punkt", cornerRounded: "Rundad",
  },
  th: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "โทรศัพท์", qrTypeSms: "SMS", qrTypeLocation: "สถานที่", qrTypeCalendar: "กิจกรรม", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "เปิดแชท WhatsApp เมื่อสแกน", typePhoneDesc: "โทรไปยังหมายเลขโทรศัพท์", typeSmsDesc: "เปิดแอป SMS พร้อมข้อความที่เตรียมไว้", typeLocationDesc: "เปิดสถานที่ใน Google Maps", typeCalendarDesc: "เพิ่มกิจกรรมในปฏิทิน", typeYoutubeDesc: "ลิงก์ไปยังวิดีโอ YouTube", typeAppstoreDesc: "ลิงก์ไปยังแอปของคุณใน App Store หรือ Google Play", typeTelegramDesc: "เปิดแชท Telegram",
    placeWhatsappPhone: "หมายเลขโทรศัพท์ (พร้อมรหัสประเทศ)", placeWhatsappMsg: "ข้อความ (ไม่บังคับ)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "พิมพ์ข้อความของคุณ...", placeLocation: "ที่อยู่หรือพิกัด (เช่น 40.7128,-74.0060)", placeCalendarTitle: "ชื่อกิจกรรม", placeCalendarDate: "วันที่และเวลา (เช่น 2026-12-25 18:00)", placeCalendarLocation: "สถานที่ (ไม่บังคับ)", placeCalendarDesc: "คำอธิบาย (ไม่บังคับ)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "URL App Store (iOS)", placeAppstoreAndroid: "URL Google Play (Android)", placeTelegramUser: "ชื่อผู้ใช้ (เช่น user)", placeTelegramMsg: "ข้อความ (ไม่บังคับ)",
    gradient: "การไล่สี", gradientLinear: "เชิงเส้น", gradientRadial: "รัศมี", dotStyle: "สไตล์จุด", dotSquare: "สี่เหลี่ยม", dotDots: "วงกลม", dotRounded: "มน", dotExtraRounded: "มนพิเศษ", dotClassy: "คลาสซี", dotClassyRounded: "คลาสซีมน", cornerSquareStyle: "สไตล์มุมสี่เหลี่ยม", cornerDotStyle: "สไตล์มุมจุด", cornerSquare: "สี่เหลี่ยม", cornerDot: "จุด", cornerRounded: "มน",
  },
  tr: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "Telefon", qrTypeSms: "SMS", qrTypeLocation: "Konum", qrTypeCalendar: "Etkinlik", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "Tarandığında WhatsApp sohbeti açar", typePhoneDesc: "Bir telefon numarasını arar", typeSmsDesc: "Önceden doldurulmuş mesajla SMS uygulamasını açar", typeLocationDesc: "Google Haritalar'da konum açar", typeCalendarDesc: "Takvime etkinlik ekler", typeYoutubeDesc: "YouTube videosuna bağlantı", typeAppstoreDesc: "App Store veya Google Play'deki uygulamanıza bağlantı", typeTelegramDesc: "Telegram sohbeti açar",
    placeWhatsappPhone: "Telefon numarası (ülke kodu ile)", placeWhatsappMsg: "Mesaj (isteğe bağlı)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "Mesajınızı yazın...", placeLocation: "Adres veya koordinatlar (ör. 40.7128,-74.0060)", placeCalendarTitle: "Etkinlik başlığı", placeCalendarDate: "Tarih ve saat (ör. 2026-12-25 18:00)", placeCalendarLocation: "Konum (isteğe bağlı)", placeCalendarDesc: "Açıklama (isteğe bağlı)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "App Store URL (iOS)", placeAppstoreAndroid: "Google Play URL (Android)", placeTelegramUser: "Kullanıcı adı (ör. user)", placeTelegramMsg: "Mesaj (isteğe bağlı)",
    gradient: "Degrade", gradientLinear: "Doğrusal", gradientRadial: "Dairesel", dotStyle: "Nokta stili", dotSquare: "Kare", dotDots: "Daireler", dotRounded: "Yuvarlak", dotExtraRounded: "Çok yuvarlak", dotClassy: "Klasik", dotClassyRounded: "Klasik yuvarlak", cornerSquareStyle: "Köşe kare stili", cornerDotStyle: "Köşe nokta stili", cornerSquare: "Kare", cornerDot: "Nokta", cornerRounded: "Yuvarlak",
  },
  uk: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "Телефон", qrTypeSms: "SMS", qrTypeLocation: "Місцезнаходження", qrTypeCalendar: "Подія", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "Відкриває чат WhatsApp при скануванні", typePhoneDesc: "Телефонує за номером", typeSmsDesc: "Відкриває SMS із заповненим повідомленням", typeLocationDesc: "Відкриває місце в Google Картах", typeCalendarDesc: "Додає подію до календаря", typeYoutubeDesc: "Посилання на відео YouTube", typeAppstoreDesc: "Посилання на ваш додаток в App Store або Google Play", typeTelegramDesc: "Відкриває чат Telegram",
    placeWhatsappPhone: "Номер телефону (з кодом країни)", placeWhatsappMsg: "Повідомлення (необов'язково)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "Введіть ваше повідомлення...", placeLocation: "Адреса або координати (напр. 40.7128,-74.0060)", placeCalendarTitle: "Назва події", placeCalendarDate: "Дата та час (напр. 2026-12-25 18:00)", placeCalendarLocation: "Місце (необов'язково)", placeCalendarDesc: "Опис (необов'язково)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "URL App Store (iOS)", placeAppstoreAndroid: "URL Google Play (Android)", placeTelegramUser: "Ім'я користувача (напр. user)", placeTelegramMsg: "Повідомлення (необов'язково)",
    gradient: "Градієнт", gradientLinear: "Лінійний", gradientRadial: "Радіальний", dotStyle: "Стиль точок", dotSquare: "Квадрат", dotDots: "Кола", dotRounded: "Заокруглені", dotExtraRounded: "Сильно заокруглені", dotClassy: "Класичний", dotClassyRounded: "Класичний заокруглений", cornerSquareStyle: "Стиль кутових квадратів", cornerDotStyle: "Стиль кутових точок", cornerSquare: "Квадрат", cornerDot: "Точка", cornerRounded: "Заокруглений",
  },
  vi: {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "Điện thoại", qrTypeSms: "SMS", qrTypeLocation: "Vị trí", qrTypeCalendar: "Sự kiện", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "Mở chat WhatsApp khi quét", typePhoneDesc: "Gọi đến số điện thoại", typeSmsDesc: "Mở ứng dụng SMS với tin nhắn soạn sẵn", typeLocationDesc: "Mở vị trí trong Google Maps", typeCalendarDesc: "Thêm sự kiện vào lịch", typeYoutubeDesc: "Liên kết đến video YouTube", typeAppstoreDesc: "Liên kết đến ứng dụng của bạn trên App Store hoặc Google Play", typeTelegramDesc: "Mở chat Telegram",
    placeWhatsappPhone: "Số điện thoại (kèm mã quốc gia)", placeWhatsappMsg: "Tin nhắn (không bắt buộc)", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "Nhập tin nhắn của bạn...", placeLocation: "Địa chỉ hoặc tọa độ (vd: 40.7128,-74.0060)", placeCalendarTitle: "Tiêu đề sự kiện", placeCalendarDate: "Ngày và giờ (vd: 2026-12-25 18:00)", placeCalendarLocation: "Địa điểm (không bắt buộc)", placeCalendarDesc: "Mô tả (không bắt buộc)", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "URL App Store (iOS)", placeAppstoreAndroid: "URL Google Play (Android)", placeTelegramUser: "Tên người dùng (vd: user)", placeTelegramMsg: "Tin nhắn (không bắt buộc)",
    gradient: "Chuyển màu", gradientLinear: "Tuyến tính", gradientRadial: "Xuyên tâm", dotStyle: "Kiểu chấm", dotSquare: "Vuông", dotDots: "Hình tròn", dotRounded: "Bo tròn", dotExtraRounded: "Bo tròn nhiều", dotClassy: "Lịch lãm", dotClassyRounded: "Lịch lãm bo tròn", cornerSquareStyle: "Kiểu góc vuông", cornerDotStyle: "Kiểu chấm góc", cornerSquare: "Vuông", cornerDot: "Chấm", cornerRounded: "Bo tròn",
  },
  "zh-CN": {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "电话", qrTypeSms: "短信", qrTypeLocation: "位置", qrTypeCalendar: "事件", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "扫描后打开 WhatsApp 聊天", typePhoneDesc: "拨打一个电话号码", typeSmsDesc: "打开短信应用并预填消息", typeLocationDesc: "在 Google 地图中打开位置", typeCalendarDesc: "向日历添加事件", typeYoutubeDesc: "链接到 YouTube 视频", typeAppstoreDesc: "链接到您的应用（App Store 或 Google Play）", typeTelegramDesc: "打开 Telegram 聊天",
    placeWhatsappPhone: "电话号码（含国家代码）", placeWhatsappMsg: "消息（可选）", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "输入您的消息...", placeLocation: "地址或坐标（例如 40.7128,-74.0060）", placeCalendarTitle: "事件标题", placeCalendarDate: "日期和时间（例如 2026-12-25 18:00）", placeCalendarLocation: "位置（可选）", placeCalendarDesc: "描述（可选）", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "App Store 链接（iOS）", placeAppstoreAndroid: "Google Play 链接（Android）", placeTelegramUser: "用户名（例如 user）", placeTelegramMsg: "消息（可选）",
    gradient: "渐变", gradientLinear: "线性", gradientRadial: "径向", dotStyle: "点样式", dotSquare: "方形", dotDots: "圆形", dotRounded: "圆角", dotExtraRounded: "超圆角", dotClassy: "优雅", dotClassyRounded: "优雅圆角", cornerSquareStyle: "角落方形样式", cornerDotStyle: "角落点样式", cornerSquare: "方形", cornerDot: "点", cornerRounded: "圆角",
  },
  "zh-TW": {
    qrTypeWhatsapp: "WhatsApp", qrTypePhone: "電話", qrTypeSms: "簡訊", qrTypeLocation: "位置", qrTypeCalendar: "事件", qrTypeYoutube: "YouTube", qrTypeAppstore: "App Store", qrTypeTelegram: "Telegram",
    typeWhatsappDesc: "掃描後打開 WhatsApp 聊天", typePhoneDesc: "撥打一個電話號碼", typeSmsDesc: "打開簡訊應用程式並預填訊息", typeLocationDesc: "在 Google 地圖中打開位置", typeCalendarDesc: "將事件加入行事曆", typeYoutubeDesc: "YouTube 影片連結", typeAppstoreDesc: "連結到您的應用程式（App Store 或 Google Play）", typeTelegramDesc: "打開 Telegram 聊天",
    placeWhatsappPhone: "電話號碼（含國碼）", placeWhatsappMsg: "訊息（選填）", placePhone: "+1234567890", placeSmsPhone: "+1234567890", placeSmsMsg: "輸入您的訊息...", placeLocation: "地址或坐標（例如 40.7128,-74.0060）", placeCalendarTitle: "事件標題", placeCalendarDate: "日期和時間（例如 2026-12-25 18:00）", placeCalendarLocation: "位置（選填）", placeCalendarDesc: "描述（選填）", placeYoutubeUrl: "https://youtube.com/watch?v=...", placeAppstoreIos: "App Store 連結（iOS）", placeAppstoreAndroid: "Google Play 連結（Android）", placeTelegramUser: "使用者名稱（例如 user）", placeTelegramMsg: "訊息（選填）",
    gradient: "漸層", gradientLinear: "線性", gradientRadial: "放射狀", dotStyle: "點樣式", dotSquare: "方形", dotDots: "圓形", dotRounded: "圓角", dotExtraRounded: "超圓角", dotClassy: "優雅", dotClassyRounded: "優雅圓角", cornerSquareStyle: "角落方形樣式", cornerDotStyle: "角落點樣式", cornerSquare: "方形", cornerDot: "點", cornerRounded: "圓角",
  },
};

const NEW_KEYS = {
  qrTypeWhatsapp: 'WhatsApp', qrTypePhone: 'Phone', qrTypeSms: 'SMS', qrTypeLocation: 'Location', qrTypeCalendar: 'Event', qrTypeYoutube: 'YouTube', qrTypeAppstore: 'App Store', qrTypeTelegram: 'Telegram',
  typeWhatsappDesc: 'Opens a WhatsApp chat when scanned', typePhoneDesc: 'Calls a phone number when scanned', typeSmsDesc: 'Opens SMS app with pre-filled message', typeLocationDesc: 'Opens a location in Google Maps', typeCalendarDesc: 'Adds an event to the calendar', typeYoutubeDesc: 'Link to a YouTube video', typeAppstoreDesc: 'Link to your app on the App Store or Google Play', typeTelegramDesc: 'Opens a Telegram chat when scanned',
  placeWhatsappPhone: 'Phone number (with country code)', placeWhatsappMsg: 'Message (optional)', placePhone: '+1234567890', placeSmsPhone: '+1234567890', placeSmsMsg: 'Type your message...', placeLocation: 'Address or coordinates (e.g. 40.7128,-74.0060)', placeCalendarTitle: 'Event title', placeCalendarDate: 'Date and time (e.g. 2026-12-25 18:00)', placeCalendarLocation: 'Location (optional)', placeCalendarDesc: 'Description (optional)', placeYoutubeUrl: 'https://youtube.com/watch?v=...', placeAppstoreIos: 'App Store URL (iOS)', placeAppstoreAndroid: 'Google Play URL (Android)', placeTelegramUser: 'Username (e.g. user)', placeTelegramMsg: 'Message (optional)',
  gradient: 'Gradient', gradientLinear: 'Linear', gradientRadial: 'Radial', dotStyle: 'Dot style', dotSquare: 'Square', dotDots: 'Circles', dotRounded: 'Rounded', dotExtraRounded: 'Extra rounded', dotClassy: 'Classy', dotClassyRounded: 'Classy rounded', cornerSquareStyle: 'Corner square style', cornerDotStyle: 'Corner dot style', cornerSquare: 'Square', cornerDot: 'Dot', cornerRounded: 'Rounded',
};

const INSERT_GROUPS = [
  { anchor: 'qrTypeImage', keys: ['qrTypeWhatsapp','qrTypePhone','qrTypeSms','qrTypeLocation','qrTypeCalendar','qrTypeYoutube','qrTypeAppstore','qrTypeTelegram'] },
  { anchor: 'typeImageDesc', keys: ['typeWhatsappDesc','typePhoneDesc','typeSmsDesc','typeLocationDesc','typeCalendarDesc','typeYoutubeDesc','typeAppstoreDesc','typeTelegramDesc'] },
  { anchor: 'placeImageUrl', keys: ['placeWhatsappPhone','placeWhatsappMsg','placePhone','placeSmsPhone','placeSmsMsg','placeLocation','placeCalendarTitle','placeCalendarDate','placeCalendarLocation','placeCalendarDesc','placeYoutubeUrl','placeAppstoreIos','placeAppstoreAndroid','placeTelegramUser','placeTelegramMsg'] },
  { anchor: 'removeLogo', keys: ['gradient','gradientLinear','gradientRadial','dotStyle','dotSquare','dotDots','dotRounded','dotExtraRounded','dotClassy','dotClassyRounded','cornerSquareStyle','cornerDotStyle','cornerSquare','cornerDot','cornerRounded'] },
];

function esc(s) { return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"'); }

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Helper: match lang block opening (quoted or unquoted)
function langBlockOpen(lang) {
  const e = escapeRegex(lang);
  return `  ("?)${e}\\1: \\{`;
}

// --- MAIN ---
const filePath = BASEDIR + "\\src\\lib\\i18n.ts";
let text = readFileSync(filePath, { encoding: "utf-8" }).replace(/\r/g, "");
const hasCR = text.includes("\r\n");

// 1. Find present and missing language blocks (handle both quoted and unquoted keys)
const presentLangs = LANG_CODES.filter(l => {
  const e = escapeRegex(l);
  return new RegExp(`  ("?)${e}\\1: \\{`).test(text);
});
const missingLangs = LANG_CODES.filter(l => !presentLangs.includes(l));
console.log("Present:", presentLangs.length, "Missing:", missingLangs.length > 0 ? missingLangs.join(", ") : "none");

// 2. Insert missing keys: global regex replace for each anchor group
let totalInserted = 0;
for (const group of INSERT_GROUPS) {
  const keysToInsert = group.keys.filter(k => !text.includes(`    ${k}: `));
  if (keysToInsert.length === 0) continue;
  const insertStr = "\n" + keysToInsert.map(k => `    ${k}: "${esc(NEW_KEYS[k])}",`).join("\n");
  const re = new RegExp(`(    ${escapeRegex(group.anchor)}: "[^"]*",)`, "g");
  const matchCount = (text.match(re) || []).length;
  text = text.replace(re, (m) => m + insertStr);
  totalInserted += keysToInsert.length * matchCount;
  console.log(`  Inserted ${keysToInsert.length} keys after "${group.anchor}" (${matchCount} blocks)`);
}
console.log("Inserted total:", totalInserted, "key lines");

// 3. Apply translations per language block
let totalTranslated = 0;
for (const lang of LANG_CODES) {
  if (lang === "en" || !TRANS[lang]) continue;
  const openRe = `  "?${escapeRegex(lang)}"?`;
  if (!new RegExp(openRe + `: \\{`).test(text)) continue;
  const blockRe = new RegExp(`(${openRe}: \\{)([\\s\\S]*?)(\\n  \\},\\n|\\n\\};)`);
  text = text.replace(blockRe, (match, open, body, close) => {
    for (const [key, val] of Object.entries(TRANS[lang])) {
      const keyRe = new RegExp(`(    ${escapeRegex(key)}: )"[^"]*"`, "g");
      const beforeLen = body.length;
      body = body.replace(keyRe, `$1"${esc(val)}"`);
      if (body.length !== beforeLen) totalTranslated++;
    }
    return open + body + close;
  });
}
console.log("Translated:", totalTranslated, "keys");

// 4. Add missing language blocks (zh-CN, zh-TW)
if (missingLangs.length > 0) {
  const enBlockRe = /  en: \{\n([\s\S]*?)\n  \},/;
  const enMatch = text.match(enBlockRe);
  if (!enMatch) { console.error("Cannot find en block"); process.exit(1); }
  const enBlockContent = enMatch[1];
  for (const lang of missingLangs) {
    let blockContent = enBlockContent;
    if (TRANS[lang]) {
      for (const [key, val] of Object.entries(TRANS[lang])) {
        blockContent = blockContent.replace(
          new RegExp(`(    ${escapeRegex(key)}: )"[^"]*"`, "m"),
          `$1"${esc(val)}"`
        );
      }
    }
    text = text.replace(/\n\};/, `\n  ${lang}: {\n${blockContent}\n  },\n};`);
    console.log(`Added ${lang} block`);
  }
}

// Write
const output = hasCR ? text.replace(/\n/g, "\r\n") : text;
writeFileSync(filePath, output, { encoding: "utf-8" });
console.log("Written", output.length, "bytes to", filePath);
