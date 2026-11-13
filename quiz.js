// Викторина «Что мы помним?» — отдельный модуль. Тексты вопросов трёхъязычные (ru / be / en), чтобы не зависеть от словаря переводов.
// АРХИТЕКТУРА: все викторины лежат в реестре window.QUIZ.registry. Чтобы добавить викторину по папке «Слуцк», «Новогрудок» или «Минск»,
// достаточно вызвать QUIZ.register({id:'slutsk', ...}) (см. README, раздел «Как добавить викторину»); ничего в движке менять не нужно.
(function () {
  var S = window.SLED;
  if (!S) return;
  var $ = S.$;
  var wk = function (t) { return window.WIKI(t); };

  // ---------- интерфейсные подписи ----------
  var UI = {
    ru: { start: 'НАЧАТЬ', next: 'ДАЛЕЕ →', result: 'РЕЗУЛЬТАТ →', again: 'ПРОЙТИ ЗАНОВО', close: '✕ ЗАКРЫТЬ', cases: 'К ДЕЛАМ',
      qn: function (i, n) { return 'Вопрос ' + i + ' из ' + n; }, ok: 'Верно.', bad: 'Неверно.', right: 'Правильный ответ: ', src: 'Источники: ',
      score: function (a, n) { return a + ' из ' + n; }, hint: 'Выберите ответ — клавиши 1–4 тоже работают.', miss: 'Над чем стоит ещё подумать',
      noMiss: 'Ошибок нет: каждый ответ верный.', pick: 'Выберите викторину', qs: function (n) { return n + ' вопросов'; },
      tiers: ['Откройте картотеку и изучите дела: ответы на все вопросы есть в материалах проекта.', 'Хороший результат. Вернитесь к документам и картам, чтобы закрепить знания.', 'Вы хорошо знаете материалы проекта. Передайте эти знания дальше: память живёт, пока её передают.'] },
    be: { start: 'ПАЧАЦЬ', next: 'ДАЛЕЙ →', result: 'РЭЗУЛЬТАТ →', again: 'ПРАЙСЦІ НАНОВА', close: '✕ ЗАКРЫЦЬ', cases: 'ДА СПРАЎ',
      qn: function (i, n) { return 'Пытанне ' + i + ' з ' + n; }, ok: 'Правільна.', bad: 'Няправільна.', right: 'Правільны адказ: ', src: 'Крыніцы: ',
      score: function (a, n) { return a + ' з ' + n; }, hint: 'Абярыце адказ — клавішы 1–4 таксама працуюць.', miss: 'Над чым варта яшчэ падумаць',
      noMiss: 'Памылак няма: кожны адказ правільны.', pick: 'Абярыце віктарыну', qs: function (n) { return n + ' пытанняў'; },
      tiers: ['Адкрыйце картатэку і вывучыце справы: адказы на ўсе пытанні ёсць у матэрыялах праекта.', 'Добры вынік. Вярніцеся да дакументаў і карт, каб замацаваць веды.', 'Вы добра ведаеце матэрыялы праекта. Перадайце гэтыя веды далей: памяць жыве, пакуль яе перадаюць.'] },
    en: { start: 'START', next: 'NEXT →', result: 'RESULT →', again: 'TRY AGAIN', close: '✕ CLOSE', cases: 'TO THE CASES',
      qn: function (i, n) { return 'Question ' + i + ' of ' + n; }, ok: 'Correct.', bad: 'Not quite.', right: 'Correct answer: ', src: 'Sources: ',
      score: function (a, n) { return a + ' of ' + n; }, hint: 'Choose an answer — keys 1–4 work too.', miss: 'Worth another look',
      noMiss: 'No mistakes: every answer is correct.', pick: 'Choose a quiz', qs: function (n) { return n + ' questions'; },
      tiers: ['Open the card index and study the cases: the answers to all questions are in the project materials.', 'A good result. Go back to the documents and maps to consolidate what you learned.', 'You know the project materials well. Pass this knowledge on: memory lives as long as it is passed on.'] }
  };

  // ---------- данные: общая викторина ----------
  // Каждый вопрос: s — ключи источников из window.SRC (data.js) и/или {n,u}; o[0] — всегда правильный ответ (порядок перемешивается при показе).
  var WS = function (title) { return { n: 'Википедия: ' + title, u: wk(title) }; };
  var GENERAL = {
    id: 'general', order: 0,
    title: { ru: 'Что мы помним?', be: 'Што мы памятаем?', en: 'What do we remember?' },
    intro: {
      ru: 'Двенадцать вопросов по материалам проекта: события, документы, свидетельства и те, кто сохранил память. У каждого ответа есть пояснение и источник.',
      be: 'Дванаццаць пытанняў па матэрыялах праекта: падзеі, дакументы, сведчанні і тыя, хто захаваў памяць. У кожнага адказу ёсць тлумачэнне і крыніца.',
      en: 'Twelve questions based on the project materials: events, documents, testimonies and those who preserved memory. Every answer comes with an explanation and a source.' },
    questions: [
      { s: ['rcnt', WS('Минск')],
        ru: { q: 'Когда немецкие войска заняли Слуцк?', o: ['27 июня 1941 г.', '22 июня 1941 г.', '28 июня 1941 г.', '27 октября 1941 г.'], e: 'Слуцк был занят 27 июня 1941 г. Через сутки, 28 июня, был занят Минск. Массовая акция в Слуцке произошла позже — 27–28 октября 1941 г.' },
        be: { q: 'Калі нямецкія войскі занялі Слуцк?', o: ['27 чэрвеня 1941 г.', '22 чэрвеня 1941 г.', '28 чэрвеня 1941 г.', '27 кастрычніка 1941 г.'], e: 'Слуцк быў заняты 27 чэрвеня 1941 г. Праз суткі, 28 чэрвеня, быў заняты Мінск. Масавая акцыя ў Слуцку адбылася пазней — 27–28 кастрычніка 1941 г.' },
        en: { q: 'When did German troops occupy Slutsk?', o: ['27 June 1941', '22 June 1941', '28 June 1941', '27 October 1941'], e: 'Slutsk was occupied on 27 June 1941. Minsk fell a day later, on 28 June. The mass killing in Slutsk came later, on 27–28 October 1941.' } },
      { s: ['rcnt', 'sh1'],
        ru: { q: 'Где в октябре 1941 г. расстреливали жителей Слуцкого гетто?', o: ['В урочище Гореваха у д. Селище', 'В Хатыни', 'В урочище Благовщина под Минском', 'В Брестской крепости'], e: 'По публикации Слуцкого РЦНТ, колонны вели в урочище Гореваха; расстрелы продолжились 28 октября. Сегодня там стоит обелиск жертвам фашистского геноцида.' },
        be: { q: 'Дзе ў кастрычніку 1941 г. расстрэльвалі жыхароў Слуцкага гета?', o: ['Ва ўрочышчы Гареваха каля в. Сялішча', 'У Хатыні', 'Ва ўрочышчы Благаўшчына пад Мінскам', 'У Брэсцкай крэпасці'], e: 'Паводле публікацыі Слуцкага РЦНТ, калоны вялі ва ўрочышча Гареваха; расстрэлы працягнуліся 28 кастрычніка. Сёння там стаіць абеліск ахвярам фашысцкага генацыду.' },
        en: { q: 'Where were residents of the Slutsk ghetto shot in October 1941?', o: ['In the Gorevakha tract near Selishche village', 'In Khatyn', 'In the Blagovshchina tract near Minsk', 'In the Brest Fortress'], e: 'According to the Slutsk district centre’s publication, the columns were marched to the Gorevakha tract; the shootings continued on 28 October. An obelisk to the victims of the fascist genocide stands there today.' } },
      { s: ['rcnt'],
        ru: { q: 'Почему доклад коменданта Слуцка от 30 октября 1941 г. нужно читать критично?', o: ['Его автор — представитель оккупационной администрации, поэтому текст сопоставляют с воспоминаниями жителей и показаниями на суде', 'Потому что доклад — художественное произведение', 'Потому что в нём нет ни одной даты', 'Потому что его автор был жителем гетто'], e: 'В докладе говорится о жестокости литовских полицейских и о грабежах домов; командир батальона отказался отложить акцию. Автор — представитель оккупационной администрации, поэтому доклад читают рядом с воспоминаниями жителей и показаниями на суде 1977 г.' },
        be: { q: 'Чаму даклад каменданта Слуцка ад 30 кастрычніка 1941 г. трэба чытаць крытычна?', o: ['Яго аўтар — прадстаўнік акупацыйнай адміністрацыі, таму тэкст параўноўваюць з успамінамі жыхароў і паказаннямі на судзе', 'Таму што даклад — мастацкі твор', 'Таму што ў ім няма ніводнай даты', 'Таму што яго аўтар быў жыхаром гета'], e: 'У дакладзе гаворыцца пра жорсткасць літоўскіх паліцэйскіх і пра рабаванне дамоў; камандзір батальёна адмовіўся адкласці акцыю. Аўтар — прадстаўнік акупацыйнай адміністрацыі, таму даклад чытаюць побач з успамінамі жыхароў і паказаннямі на судзе 1977 г.' },
        en: { q: 'Why must the report of the commandant of Slutsk of 30 October 1941 be read critically?', o: ['Its author represented the occupation administration, so the text is compared with residents’ recollections and trial testimony', 'Because the report is a work of fiction', 'Because it contains no dates at all', 'Because its author was a ghetto resident'], e: 'The report speaks of the brutality of the Lithuanian policemen and of looted houses; the battalion commander refused to postpone the action. The author represented the occupation administration, so the report is read alongside residents’ recollections and the testimony at the 1977 trial.' } },
      { s: ['rcnt'],
        ru: { q: 'Чей материал о Слуцком гетто републиковал районный центр народного творчества в рубрике «Год исторической памяти»?', o: ['Краеведа Сергея Богдашича', 'Коменданта Слуцка', 'Журналиста газеты «Звязда»', 'Министерства образования'], e: 'Материал подготовил краевед Сергей Богдашич (2019–2020 гг.). Такие люди — звено «тех, кто сохранил» в цепочке памяти.' },
        be: { q: 'Чый матэрыял пра Слуцкае гета перавыдаў раённы цэнтр народнай творчасці ў рубрыцы «Год гістарычнай памяці»?', o: ['Краязнаўцы Сяргея Багдашыча', 'Каменданта Слуцка', 'Журналіста газеты «Звязда»', 'Міністэрства адукацыі'], e: 'Матэрыял падрыхтаваў краязнаўца Сяргей Багдашыч (2019–2020 гг.). Такія людзі — звяно «тых, хто захаваў» у ланцужку памяці.' },
        en: { q: 'Whose material on the Slutsk ghetto did the district folk art centre republish under “Year of Historical Memory”?', o: ['Local historian Sergei Bogdashich', 'The commandant of Slutsk', 'A journalist of the Zviazda newspaper', 'The Ministry of Education'], e: 'The material was prepared by the local historian Sergei Bogdashich (2019–2020). People like him are the link of “those who preserved it” in the chain of memory.' } },
      { s: ['rcnt'],
        ru: { q: 'Что произошло со Слуцким гетто 8 февраля 1943 г.?', o: ['Гетто сожгли', 'Гетто освободили советские войска', 'Гетто перенесли в Минск', 'В гетто открыли музей'], e: 'По публикации РЦНТ, 8 февраля 1943 г. гетто сожгли; ямы были подготовлены в д. Мохарты.' },
        be: { q: 'Што адбылося са Слуцкім гета 8 лютага 1943 г.?', o: ['Гета спалілі', 'Гета вызвалілі савецкія войскі', 'Гета перанеслі ў Мінск', 'У гета адкрылі музей'], e: 'Паводле публікацыі РЦНТ, 8 лютага 1943 г. гета спалілі; ямы былі падрыхтаваныя ў в. Махарты.' },
        en: { q: 'What happened to the Slutsk ghetto on 8 February 1943?', o: ['The ghetto was burned', 'The ghetto was liberated by Soviet troops', 'The ghetto was moved to Minsk', 'A museum was opened in the ghetto'], e: 'According to the district centre’s publication, the ghetto was burned on 8 February 1943; pits had been prepared in the village of Mokharty.' } },
      { s: ['vsa', 'ggau'],
        ru: { q: 'Откуда 10 ноября 1941 г. в Минск прибыл первый эшелон с евреями из Германии?', o: ['Из Гамбурга', 'Из Берлина', 'Из Мюнхена', 'Из Вены'], e: 'Белорусские источники называют отправной пункт — Гамбург — и дату 10 ноября 1941 г.; точный маршрут в них не описан. До конца ноября приходили эшелоны из Германии, Чехословакии и Австрии.' },
        be: { q: 'Адкуль 10 лістапада 1941 г. у Мінск прыбыў першы эшалон з яўрэямі з Германіі?', o: ['З Гамбурга', 'З Берліна', 'З Мюнхена', 'З Вены'], e: 'Беларускія крыніцы называюць пункт адпраўлення — Гамбург — і дату 10 лістапада 1941 г.; дакладны маршрут у іх не апісаны. Да канца лістапада прыходзілі эшалоны з Германіі, Чэхаславакіі і Аўстрыі.' },
        en: { q: 'Where did the first train carrying Jews from Germany, which reached Minsk on 10 November 1941, set out from?', o: ['Hamburg', 'Berlin', 'Munich', 'Vienna'], e: 'Belarusian sources name Hamburg as the point of departure and 10 November 1941 as the date; the exact route is not described. Until the end of November trains arrived from Germany, Czechoslovakia and Austria.' } },
      { s: ['vsa'],
        ru: { q: 'Какая оценка числа погибших в лагере смерти «Тростенец» приводится в источниках проекта?', o: ['Свыше 206,5 тысяч человек', 'Около 7000 человек', 'Около 40 000 человек', 'Около 600 человек'], e: 'В публикации Витебской академии ветеринарной медицины приводится оценка свыше 206,5 тыс. погибших; лагерь действовал с весны 1942 г. до лета 1944 г. Это оценка, а не точная цифра. Около 7000 — евреи из рейха в Минском гетто, около 600 — новогрудские евреи, пережившие войну.' },
        be: { q: 'Якая ацэнка колькасці загінулых у лагеры смерці «Трасцянец» прыводзіцца ў крыніцах праекта?', o: ['Звыш 206,5 тысячы чалавек', 'Каля 7000 чалавек', 'Каля 40 000 чалавек', 'Каля 600 чалавек'], e: 'У публікацыі Віцебскай акадэміі ветэрынарнай медыцыны прыводзіцца ацэнка звыш 206,5 тыс. загінулых; лагер дзейнічаў з вясны 1942 г. да лета 1944 г. Гэта ацэнка, а не дакладная лічба. Каля 7000 — яўрэі з рэйха ў Мінскім гета, каля 600 — навагрудскія яўрэі, якія перажылі вайну.' },
        en: { q: 'Which estimate of the number of people killed at the “Trostenets” death camp is given in the project’s sources?', o: ['More than 206,500', 'About 7,000', 'About 40,000', 'About 600'], e: 'The publication of the Vitebsk veterinary academy gives an estimate of more than 206,500 dead; the camp operated from spring 1942 to summer 1944. This is an estimate, not an exact figure. About 7,000 is the number of Jews from the Reich in the Minsk ghetto; about 600 is the number of Novogrudok Jews who survived the war.' } },
      { s: ['belta', 'wall'],
        ru: { q: 'Что позволило узникам Новогрудского гетто бежать в ночь на 26 сентября 1943 г.?', o: ['Тоннель, который скрытно копали несколько месяцев', 'Открытые ворота гетто', 'Помощь солдат вермахта', 'Подземная река'], e: 'Побег был совершён через тоннель, который скрытно копали несколько месяцев (БЕЛТА). Сегодня об этом рассказывают музей еврейского сопротивления и Стена памяти.' },
        be: { q: 'Што дапамагло вязням Навагрудскага гета ўцячы ў ноч на 26 верасня 1943 г.?', o: ['Тунэль, які таемна капалі некалькі месяцаў', 'Адчыненыя вароты гета', 'Дапамога салдат вермахта', 'Падземная рака'], e: 'Уцёкі адбыліся праз тунэль, які таемна капалі некалькі месяцаў (БЕЛТА). Сёння пра гэта расказваюць музей яўрэйскага супраціву і Сцяна памяці.' },
        en: { q: 'What made it possible for the prisoners of the Novogrudok ghetto to escape on the night of 26 September 1943?', o: ['A tunnel dug in secret over several months', 'Open ghetto gates', 'Help from Wehrmacht soldiers', 'An underground river'], e: 'They escaped through a tunnel that had been secretly dug for several months (BelTA). Today the museum of Jewish resistance and the Wall of Memory tell the story.' } },
      { s: ['belta'],
        ru: { q: 'Сколько человек, по сообщению БЕЛТА, бежало из Новогрудского гетто?', o: ['Свыше 200', 'Около 20', 'Около 600', 'Около 7000'], e: 'БЕЛТА называет «свыше 200 человек»; точное число в этом источнике не приводится. Около 600 — сколько евреев Новогрудка пережили войну, около семи тысяч — довоенная община.' },
        be: { q: 'Колькі чалавек, паводле паведамлення БЕЛТА, уцякло з Навагрудскага гета?', o: ['Звыш 200', 'Каля 20', 'Каля 600', 'Каля 7000'], e: 'БЕЛТА называе «звыш 200 чалавек»; дакладная колькасць у гэтай крыніцы не прыводзіцца. Каля 600 — колькі навагрудскіх яўрэяў перажылі вайну, каля сямі тысяч — даваенная абшчына.' },
        en: { q: 'According to BelTA, how many people escaped from the Novogrudok ghetto?', o: ['More than 200', 'About 20', 'About 600', 'About 7,000'], e: 'BelTA says “more than 200 people”; this source gives no exact number. About 600 is how many Novogrudok Jews survived the war; about seven thousand lived there before the war.' } },
      { s: ['adu'],
        ru: { q: 'Сколько человек погибло в Хатыни 22 марта 1943 г. и сколько среди них было детей?', o: ['149 человек, в том числе 75 детей', '44 человека, в том числе 29 детей', '206 500 человек, в том числе 75 детей', '149 человек, в том числе 29 детей'], e: 'В Хатыни погибли 149 человек, в том числе 75 детей. В Дальве 19 июня 1944 г. погибли 44 жителя, среди них 29 детей.' },
        be: { q: 'Колькі чалавек загінула ў Хатыні 22 сакавіка 1943 г. і колькі сярод іх было дзяцей?', o: ['149 чалавек, у тым ліку 75 дзяцей', '44 чалавекі, у тым ліку 29 дзяцей', '206 500 чалавек, у тым ліку 75 дзяцей', '149 чалавек, у тым ліку 29 дзяцей'], e: 'У Хатыні загінулі 149 чалавек, у тым ліку 75 дзяцей. У Дальве 19 чэрвеня 1944 г. загінулі 44 жыхары, сярод іх 29 дзяцей.' },
        en: { q: 'How many people died in Khatyn on 22 March 1943, and how many of them were children?', o: ['149 people, including 75 children', '44 people, including 29 children', '206,500 people, including 75 children', '149 people, including 29 children'], e: 'In Khatyn 149 people died, including 75 children. In Dalva, on 19 June 1944, 44 residents died, 29 of them children.' } },
      { s: ['adu', 'newsby'],
        ru: { q: 'Что известно о Николае Гириловиче, выжившем при сожжении деревни Дальва в 1944 г.?', o: ['Ему было 13 лет; позднее он добился создания мемориала', 'Он был комендантом Слуцка', 'Он бежал через тоннель из Новогрудка', 'Он автор доклада от 30 октября 1941 г.'], e: 'Дальву сожгли 19 июня 1944 г.: погибли 44 жителя. Выжил 13-летний Николай Гирилович; позднее он добился создания мемориала.' },
        be: { q: 'Што вядома пра Мікалая Гірыловіча, які выжыў пры спаленні вёскі Дальва ў 1944 г.?', o: ['Яму было 13 гадоў; пазней ён дамогся стварэння мемарыяла', 'Ён быў каменданцам Слуцка', 'Ён уцёк праз тунэль з Навагрудка', 'Ён аўтар дакладу ад 30 кастрычніка 1941 г.'], e: 'Дальву спалілі 19 чэрвеня 1944 г.: загінулі 44 жыхары. Выжыў 13-гадовы Мікалай Гірыловіч; пазней ён дамогся стварэння мемарыяла.' },
        en: { q: 'What is known about Nikolai Girilovich, who survived the burning of the village of Dalva in 1944?', o: ['He was 13; later he secured the creation of a memorial', 'He was the commandant of Slutsk', 'He escaped through the tunnel in Novogrudok', 'He wrote the report of 30 October 1941'], e: 'Dalva was burned on 19 June 1944: 44 residents died. The 13-year-old Nikolai Girilovich survived; later he secured the creation of a memorial.' } },
      { s: [WS('Минск')],
        ru: { q: 'Когда был освобождён Минск?', o: ['3 июля 1944 г.', '28 июня 1944 г.', '23 июня 1944 г.', '29 августа 1944 г.'], e: 'Минск освобождён 3 июля 1944 г. в ходе операции «Багратион» (23 июня — 29 августа 1944 г.). Немцы заняли Минск 28 июня 1941 г.' },
        be: { q: 'Калі быў вызвалены Мінск?', o: ['3 ліпеня 1944 г.', '28 чэрвеня 1944 г.', '23 чэрвеня 1944 г.', '29 жніўня 1944 г.'], e: 'Мінск вызвалены 3 ліпеня 1944 г. у ходзе аперацыі «Баграціён» (23 чэрвеня — 29 жніўня 1944 г.). Немцы занялі Мінск 28 чэрвеня 1941 г.' },
        en: { q: 'When was Minsk liberated?', o: ['3 July 1944', '28 June 1944', '23 June 1944', '29 August 1944'], e: 'Minsk was liberated on 3 July 1944 during Operation “Bagration” (23 June – 29 August 1944). The Germans had occupied Minsk on 28 June 1941.' } }
    ]
  };

  // ---------- движок ----------
  var registry = {}, cur = null, run = null, open = false, keyOn = false;
  function lang() { var l = (window.LANGNOW && window.LANGNOW()) || 'ru'; return UI[l] ? l : 'ru'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t } return a }
  function T(s) { return window.T ? window.T(s) : s }
  function srcLinks(list) {
    var L = lang();
    return list.map(function (x) {
      var n, u;
      if (typeof x === 'string') { n = window.SRC[x].n; u = window.SRC[x].u } else { n = x.n; u = x.u }
      return '<a href="' + u + '" target="_blank" rel="noopener">' + esc(L === 'ru' ? n : T(n)) + '</a>';
    }).join('; ');
  }

  function register(def) { registry[def.id] = def; return def }
  function list() { return Object.keys(registry).map(function (k) { return registry[k] }).sort(function (a, b) { return (a.order || 0) - (b.order || 0) }) }

  function newRun(def) {
    run = { def: def, i: 0, order: shuffle(def.questions.map(function (_, i) { return i })), answers: [], picked: null, view: 'intro' };
  }
  function title() { return cur ? cur.title[lang()] : '' }

  function thread() {
    var n = run.order.length, h = '<div class="qth" aria-hidden="true">';
    for (var k = 0; k < n; k++) {
      var a = run.answers[k], cls = a === undefined ? (k === run.i && run.view === 'q' ? 'cur' : '') : (a ? 'good' : 'bad');
      h += (k ? '<u class="' + (run.answers[k - 1] !== undefined ? 'd' : '') + '"></u>' : '') + '<i class="' + cls + '">' + (a === false ? '✕' : '') + '</i>';
    }
    return h + '</div>';
  }

  function foot(btns) { $('#mf').innerHTML = btns; }
  function setTitle() { var t = $('#mt'); if (t) t.textContent = title(); }

  function renderIntro() {
    var U = UI[lang()], d = run.def, L = lang();
    var rows = '';
    $('#mb').innerHTML = '<div class="qz" data-nt><div class="qhero"><div class="qbig">?</div><p class="qlead">' + esc(d.intro[L]) + '</p><p class="qsmall">' + esc(U.qs(d.questions.length)) + '</p></div></div>';
    foot('<button class="sec" id="qc">' + U.close + '</button><button id="qs">' + U.start + '</button>');
    $('#qc').onclick = S.close; $('#qs').onclick = function () { run.view = 'q'; render(); };
    $('#md').innerHTML = '';
  }

  function renderQuestion() {
    var U = UI[lang()], L = lang(), def = run.def, qi = run.order[run.i], Q = def.questions[qi], D = Q[L], n = run.order.length;
    if (!run.opts || run.optFor !== run.i) { run.opts = shuffle(D.o.map(function (_, i) { return i })); run.optFor = run.i; run.picked = null; }
    var ans = run.picked !== null;
    var h = '<div class="qz" data-nt>' + thread() + '<div class="qcard' + (run.fresh ? ' qin' : '') + '"><div class="qn">' + esc(U.qn(run.i + 1, n)) + '</div><h3 class="qq">' + esc(D.q) + '</h3><div class="qo">';
    run.opts.forEach(function (oi, pos) {
      var c = 'qb';
      if (ans) { if (oi === 0) c += ' right'; else if (oi === run.picked) c += ' wrong'; else c += ' dim' }
      h += '<button class="' + c + '" data-o="' + oi + '"' + (ans ? ' disabled' : '') + '><span class="qk">' + (pos + 1) + '</span><span class="qt">' + esc(D.o[oi]) + '</span></button>';
    });
    h += '</div>';
    if (ans) {
      var ok = run.picked === 0;
      h += '<div class="qx show"><b class="' + (ok ? 'qg' : 'qr') + '">' + (ok ? U.ok : U.bad) + '</b> ' + (ok ? '' : esc(U.right) + '<b>' + esc(D.o[0]) + '</b>. ') + esc(D.e) + '<div class="qsrc">' + esc(U.src) + srcLinks(Q.s) + '</div></div>';
    } else h += '<div class="qhint">' + esc(U.hint) + '</div>';
    h += '</div></div>';
    $('#mb').innerHTML = h; run.fresh = false;
    $('#md').innerHTML = '';
    foot('<button class="sec" id="qc">' + U.close + '</button>' + (ans ? '<button id="qn">' + (run.i === n - 1 ? U.result : U.next) + '</button>' : '<span></span>'));
    $('#qc').onclick = S.close;
    if (ans) $('#qn').onclick = advance;
    [].forEach.call(document.querySelectorAll('.qb'), function (b) { b.onclick = function () { pick(+b.dataset.o) } });
    if (ans) { var x = document.querySelector('.qx'); if (x && x.scrollIntoView) setTimeout(function () { x.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }, 60) }
  }

  function pick(oi) {
    if (!run || run.view !== 'q' || run.picked !== null) return;
    run.picked = oi; run.answers[run.i] = (oi === 0); render();
  }
  function advance() {
    if (run.picked === null) return;
    if (run.i < run.order.length - 1) { run.i++; run.picked = null; run.fresh = true; render(); } else { run.view = 'r'; render(); }
  }

  function renderResult() {
    var U = UI[lang()], L = lang(), n = run.order.length, a = run.answers.filter(Boolean).length;
    var tier = a >= Math.ceil(n * .8) ? 2 : a >= Math.ceil(n * .5) ? 1 : 0;
    var miss = '';
    run.answers.forEach(function (ok, k) { if (!ok) { var Q = run.def.questions[run.order[k]][L]; miss += '<li><b>' + esc(Q.q) + '</b><br><span>' + esc(U.right) + esc(Q.o[0]) + '</span></li>' } });
    $('#mb').innerHTML = '<div class="qz" data-nt>' + thread() + '<div class="qres"><div class="qscore"><span>' + a + '</span><small>/ ' + n + '</small></div><p class="qlead">' + esc(U.tiers[tier]) + '</p><h4>' + esc(miss ? U.miss : U.noMiss) + '</h4>' + (miss ? '<ul class="qmiss">' + miss + '</ul>' : '') + '</div></div>';
    $('#md').innerHTML = '';
    foot('<button class="sec" id="qc">' + U.close + '</button><button class="sec" id="qk">' + U.cases + '</button><button id="qa">' + U.again + '</button>');
    $('#qc').onclick = S.close; $('#qk').onclick = S.close;
    $('#qa').onclick = function () { newRun(cur); run.view = 'q'; run.fresh = true; render(); };
  }

  function render() {
    if (!open || !run) return;
    setTitle();
    var m = $('#mod'); if (m) m.classList.add('dk');
    if (run.view === 'intro') renderIntro(); else if (run.view === 'q') renderQuestion(); else renderResult();
    var b = $('#mb'); if (b && run.view !== 'q') b.scrollTop = 0;
  }

  function openHub() {
    var U = UI[lang()], L = lang(), h = '<div class="qz" data-nt><p class="qlead">' + esc(U.pick) + '</p><div class="qhub">';
    list().forEach(function (d) { h += '<button class="qh" data-q="' + d.id + '"><b>' + esc(d.title[L]) + '</b><small>' + esc(U.qs(d.questions.length)) + '</small></button>' });
    $('#mb').innerHTML = h + '</div></div>';
    [].forEach.call(document.querySelectorAll('.qh'), function (b) { b.onclick = function () { start(b.dataset.q) } });
    foot('<button class="sec" id="qc">' + U.close + '</button><span></span>'); $('#qc').onclick = S.close;
  }

  function start(id) {
    cur = registry[id]; newRun(cur); open = true;
    S.modal(title(), '', '', '', true); document.getElementById('mod').classList.add('dk');
    render(); bindKeys();
  }
  function openQuiz(id) {
    var l = list();
    if (id && registry[id]) return start(id);
    if (l.length === 1) return start(l[0].id);
    open = true; cur = null; run = null;
    S.modal({ ru: 'Викторины', be: 'Віктарыны', en: 'Quizzes' }[lang()], '', '', '', true); document.getElementById('mod').classList.add('dk');
    openHub(); bindKeys();
  }

  function bindKeys() {
    if (keyOn) return; keyOn = true;
    document.addEventListener('keydown', function (e) {
      if (!open || !run) return;
      if (!document.getElementById('panel').classList.contains('show')) { open = false; return }
      if (run.view === 'q') {
        var n = parseInt(e.key, 10);
        if (n >= 1 && n <= 4 && run.opts && run.picked === null) { pick(run.opts[n - 1]); e.preventDefault(); }
        else if ((e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') && run.picked !== null) { advance(); e.preventDefault(); }
      } else if (run.view === 'intro' && e.key === 'Enter') { run.view = 'q'; render(); e.preventDefault(); }
    });
  }
  // закрытие окна снаружи (Esc, ✕, фон) сбрасывает флаг: следим за классом панели
  var pn = document.getElementById('panel');
  if (pn && window.MutationObserver) new MutationObserver(function () { if (!pn.classList.contains('show')) open = false; }).observe(pn, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('sled-lang', function () { if (!open) return; if (run) render(); else if (!cur) { setTitle(); openHub(); } });

  register(GENERAL);
  window.QUIZ = { open: openQuiz, register: register, registry: registry, list: list };
})();
