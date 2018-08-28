var obj = ["Hello Wêreld!", "Përshendetje Botë!", "ሰላም ልዑል!", "Բարեւ աշխարհ!", "Salam dünya!", "Kaixo Mundua!",
  "Прывітанне Сусвет!", "ওহে বিশ্ব!", "Zdravo svijet!", "Здравей свят!", "Hola món!", "Hello World!",
  "Moni Dziko Lapansi!", "你好，世界!", "Hello World!", "Pozdrav svijete!", "Ahoj světe!",
  "Hej Verden!", "Hallo Wereld!", "Hello World!", "Saluton Mondo!", "Tere maailm!", "Hello World!",
  "Hei maailma!", "Bonjour le monde!", "Hallo wrâld!", "¡Hola Mundo!", "გამარჯობა მსოფლიო!",
  "Hallo Welt!", "Γειά σου Κόσμε!", "હેલો વર્લ્ડ!", "Alo Mondyal!", "Sannu Duniya!", "Aloha World!",
  "नमस्ते दुनिया!", "Nyob zoo ntiaj teb!", "Helló Világ!", "Halló heimur!", "Ndewo Ụwa!", "Halo Dunia!", "Dia duit Domhanda!",
  "Ciao mondo!", "こんにちは世界!", "Hello World!", "ಹಲೋ ವರ್ಲ್ಡ್!", "Сәлем Әлем!", "សួស្តី​ពិភពលោក!",
  "안녕하세요!", "Hello World!", "Салам дүйнө!", "ສະ​ບາຍ​ດີ​ຊາວ​ໂລກ!", "Orbis Terrarum salve!",
  "Sveika pasaule!", "Labas pasauli!", "Moien Welt!", "Здраво свету!", "Hello World!",
  "Hai dunia!", "ഹലോ വേൾഡ്!", "Hello dinja!", "Hello World!", "हॅलो वर्ल्ड!", "Сайн уу!",
  "မင်္ဂလာပါကမ္ဘာလောက!", "नमस्कार संसार!", "Hei Verden!", "Witaj swiecie!", "Olá Mundo!", "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਦੁਨਿਆ!", "Salut Lume!", "Привет мир!", "Talofa le Lalolagi!", "Hàlo a Shaoghail!", "Здраво Свете!",
  "Lefatše Lumela!", "Hello World!", "හෙලෝ වර්ල්ඩ්!", "Hello World!", "Pozdravljen, svet!",
  "Hello World!", "Hola Mundo!", "Halo Dunya!", "Salamu, Dunia!", "Hej världen!",
  "Салом Ҷаҳон!", "வணக்கம்!", "హలో వరల్డ్!", "สวัสดีชาวโลก!", "Selam Dünya!", "Привіт Світ!",
  "Salom Dunyo!", "Chào thế giới!", "Helo Byd!", "Molo Lizwe!", "Mo ki O Ile Aiye!",
  "Sawubona Mhlaba!"
]; // array for the hello in every language

//randomize language
function rand() {
  var rdn = Math.floor(Math.random() * obj.length);
  var h = document.getElementById("hi"); // the hello
  var v = document.getElementById("sel"); // drop-down list
  h.innerHTML = obj[rdn];

  var h1 = document.getElementById("lan"); // the language
  h1.innerHTML = v.options[rdn].text;

}

// binarySearch to search for a language when the user wants to search by typing
function binarySearch(value) {
  var v = document.getElementById("sel");
  value = value.toLowerCase();

  var first = 0,
    last = obj.length - 1;
  var mid = Math.floor((first + last) / 2);
  var check = false;

  do {
    if (value === v.options[mid].text.toLowerCase()) check = true;

    else {

      if (value.localeCompare(v.options[mid].text.toLowerCase()) === 1) first = mid + 1;
      else last = mid - 1;

      mid = Math.floor((first + last) / 2);
    }
  } while (!check && first <= last);

  if (check) return mid;

  return -1;

}

// change language
function change() {
  var v = document.getElementById("sel");
  var index = v.value;

  var h = document.getElementById("hi");
  h.innerHTML = obj[index];

  var h1 = document.getElementById("lan");
  h1.innerHTML = v.options[index].text;
}

// for search field -- trigger the search when Enter key is pressed
function enterKey() {
  var ser = document.getElementById("serc");
  serc.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13)
      document.getElementById("btn").click(); // click the button search
  });
}

// search a language by typing
function search() {
  var v = document.getElementById("sel");
  var h = document.getElementById("hi");
  var h1 = document.getElementById("lan");
  var ser = document.getElementById("serc"); // search field -- id for text input

  var result = binarySearch(ser.value);

  if (result > -1) {
    h.innerHTML = obj[result];
    h1.innerHTML = v.options[result].text;
  } else alert("The language wasn't found! Try again!");
}