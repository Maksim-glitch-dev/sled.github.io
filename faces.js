// Галерея «Лица памяти» — отдельный модуль. Люди, названные в материалах проекта; карточки открываются по мере изучения дел.
// ПРАВИЛА ДОСТОВЕРНОСТИ: в карточку попадает только то, что есть в источниках проекта (ссылки у каждой карточки).
// Фотографии НЕ выдумываются и не заменяются заглушками-портретами. Если у человека нет подлинной фотографии с подтверждёнными правами,
// поле photo остаётся null, и карточка честно сообщает об этом. Чтобы добавить фото, см. README («Как добавить фотографию в «Лица памяти»»).
(function () {
  var S = window.SLED;
  if (!S) return;
  var $ = S.$;

  var UI = {
    ru: { title: 'Лица памяти', lead: 'Люди, названные в материалах проекта. Карточка открывается, когда вы доходите до нужного этапа дела или открываете карту.',
      search: 'Поиск по имени', all: 'Все', opened: function (a, n) { return 'Открыто: ' + a + ' из ' + n }, locked: 'Закрыто', unlockHdr: 'Откроется:',
      years: 'Годы жизни', about: 'Справка', event: 'Связь с событием', srcs: 'Источники сведений', photoSrc: 'Примечание к изображению', illustrationAlt: 'условная ИИ-иллюстрация, не архивное фото', noPhoto: 'Подлинная фотография не найдена в проверенных источниках проекта. Изображение намеренно не подставлено.',
      none: 'Никого не найдено.', back: '← КО ВСЕМ', close: '✕ ЗАКРЫТЬ', goStage: 'ОТКРЫТЬ ДОКУМЕНТ', goMap: 'ПОКАЗАТЬ НА КАРТЕ', role: { witness: 'Свидетель', keeper: 'Тот, кто сохранил', survivor: 'Выживший' },
      unlockStage: function (c, st) { return 'этап «' + st + '» дела «' + c + '»' }, unlockMap: 'карта на стене', yearsNo: 'не указаны в использованных источниках' },
    be: { title: 'Твары памяці', lead: 'Людзі, названыя ў матэрыялах праекта. Картка адкрываецца, калі вы даходзіце да патрэбнага этапу справы або адкрываеце карту.',
      search: 'Пошук па імені', all: 'Усе', opened: function (a, n) { return 'Адкрыта: ' + a + ' з ' + n }, locked: 'Закрыта', unlockHdr: 'Адкрыецца:',
      years: 'Гады жыцця', about: 'Даведка', event: 'Сувязь з падзеяй', srcs: 'Крыніцы звестак', photoSrc: 'Заўвага да выявы', illustrationAlt: 'умоўная ІІ-ілюстрацыя, не архіўнае фота', noPhoto: 'Сапраўдны фотаздымак не знойдзены ў правераных крыніцах праекта. Выява наўмысна не падстаўлена.',
      none: 'Нікога не знойдзена.', back: '← ДА ЎСІХ', close: '✕ ЗАКРЫЦЬ', goStage: 'АДКРЫЦЬ ДАКУМЕНТ', goMap: 'ПАКАЗАЦЬ НА КАРЦЕ', role: { witness: 'Сведка', keeper: 'Той, хто захаваў', survivor: 'Ацалелы' },
      unlockStage: function (c, st) { return 'этап «' + st + '» справы «' + c + '»' }, unlockMap: 'карта на сцяне', yearsNo: 'не ўказаны ў выкарыстаных крыніцах' },
    en: { title: 'Faces of Memory', lead: 'People named in the project materials. A card opens when you reach the right stage of a case or open the map.',
      search: 'Search by name', all: 'All', opened: function (a, n) { return 'Opened: ' + a + ' of ' + n }, locked: 'Locked', unlockHdr: 'Opens at:',
      years: 'Years of life', about: 'Background', event: 'Connection to the event', srcs: 'Sources of the information', photoSrc: 'Image note', illustrationAlt: 'fictional AI illustration, not an archival photo', noPhoto: 'No authentic photograph was found in the project’s verified sources. No image has been substituted on purpose.',
      none: 'No one found.', back: '← ALL FACES', close: '✕ CLOSE', goStage: 'OPEN THE DOCUMENT', goMap: 'SHOW ON THE MAP', role: { witness: 'Witness', keeper: 'Preserver of memory', survivor: 'Survivor' },
      unlockStage: function (c, st) { return 'the “' + st + '” stage of the “' + c + '” case' }, unlockMap: 'the map on the wall', yearsNo: 'not given in the sources used' }
  };
  var CASE = {
    slutsk: { ru: 'Слуцк', be: 'Слуцк', en: 'Slutsk' },
    novogrudok: { ru: 'Новогрудок', be: 'Навагрудак', en: 'Novogrudok' },
    dalva: { ru: 'Дальва', be: 'Дальва', en: 'Dalva' }
  };
  var STG = [{ ru: 'Тогда', be: 'Тады', en: 'Then' }, { ru: 'Свидетельство', be: 'Сведчанне', en: 'Testimony' }, { ru: 'Сохранение', be: 'Захаванне', en: 'Preservation' }, { ru: 'Память сегодня', be: 'Памяць сёння', en: 'Memory today' }, { ru: 'Дальше', be: 'Далей', en: 'What next' }];

  var JNS = { n: 'JNS: Digging history: documentary details Holocaust escape, unearths buried tunnel', u: 'https://www.jns.org/antisemitism/digging-history-documentary-details-holocaust-escape-unearths-buried-tunnel' };
  var JPOST = { n: 'The Jerusalem Post: Jack Kagan – the passing of a courageous survivor', u: 'https://m.jpost.com/opinion/a-personal-tribute-478926' };

  // Иллюстрации ниже созданы ИИ как условные образы; они не являются историческими фотографиями или портретными реконструкциями.
  // Полноразмерные копии лежат рядом с файлами карточек и открываются по клику.
  var PEOPLE = [
    { id: 'falevich', cs: 'slutsk', role: 'witness', unlock: { c: 'slutsk', s: 1 }, photo: { file: 'img/faces/falevich.jpg', full: 'img/faces/falevich-full.jpg', credit: { ru: 'Иллюстрация создана ИИ для этого проекта.', be: 'Ілюстрацыя створана ШІ для гэтага праекта.', en: 'AI-generated illustration created for this project.' }, license: { ru: 'Условный вымышленный образ; не архивная фотография и не достоверное изображение Бориса Фалевича.', be: 'Умоўны выдуманы вобраз; не архіўны фотаздымак і не сапраўднае выяўленне Барыса Фалевіча.', en: 'Fictional illustrative image; not an archival photograph or a likeness of Boris Falevich.' } }, link: { kind: 'stage', c: 'slutsk', s: 1 }, src: ['rcnt'],
      name: { ru: 'Борис Фалевич', be: 'Барыс Фалевіч', en: 'Boris Falevich' },
      years: null,
      bio: { ru: 'Очевидец событий в Слуцке. В 1941 г. ему было 12 лет. Его воспоминания публикует Слуцкий районный центр народного творчества рядом с докладом коменданта.',
        be: 'Відавочца падзей у Слуцку. У 1941 г. яму было 12 гадоў. Яго ўспаміны публікуе Слуцкі раённы цэнтр народнай творчасці побач з дакладам каменданта.',
        en: 'An eyewitness of the events in Slutsk. He was 12 years old in 1941. His recollections are published by the Slutsk district folk art centre alongside the commandant’s report.' },
      ev: { ru: 'Слуцк, 27–28 октября 1941 г.', be: 'Слуцк, 27–28 кастрычніка 1941 г.', en: 'Slutsk, 27–28 October 1941' } },
    { id: 'novik', cs: 'slutsk', role: 'witness', unlock: { c: 'slutsk', s: 1 }, photo: { file: 'img/faces/novik.jpg', full: 'img/faces/novik-full.jpg', credit: { ru: 'Иллюстрация создана ИИ для этого проекта.', be: 'Ілюстрацыя створана ШІ для гэтага праекта.', en: 'AI-generated illustration created for this project.' }, license: { ru: 'Условный вымышленный образ; не архивная фотография и не достоверное изображение Алексея Новика.', be: 'Умоўны выдуманы вобраз; не архіўны фотаздымак і не сапраўднае выяўленне Аляксея Новіка.', en: 'Fictional illustrative image; not an archival photograph or a likeness of Alexei Novik.' } }, link: { kind: 'stage', c: 'slutsk', s: 1 }, src: ['rcnt'],
      name: { ru: 'Алексей Новик', be: 'Аляксей Новік', en: 'Alexei Novik' },
      years: null,
      bio: { ru: 'Очевидец событий в Слуцке. Его воспоминания публикует Слуцкий районный центр народного творчества рядом с докладом коменданта. Других сведений о нём в использованных источниках нет: читайте текст воспоминаний по ссылке.',
        be: 'Відавочца падзей у Слуцку. Яго ўспаміны публікуе Слуцкі раённы цэнтр народнай творчасці побач з дакладам каменданта. Іншых звестак пра яго ў выкарыстаных крыніцах няма: чытайце тэкст успамінаў па спасылцы.',
        en: 'An eyewitness of the events in Slutsk. His recollections are published by the Slutsk district folk art centre alongside the commandant’s report. The sources used give no other information about him: read the text of the recollections at the link.' },
      ev: { ru: 'Слуцк, 27–28 октября 1941 г.', be: 'Слуцк, 27–28 кастрычніка 1941 г.', en: 'Slutsk, 27–28 October 1941' } },
    { id: 'satsuk', cs: 'slutsk', role: 'witness', unlock: { c: 'slutsk', s: 1 }, photo: { file: 'img/faces/satsuk.jpg', full: 'img/faces/satsuk-full.jpg', credit: { ru: 'Иллюстрация создана ИИ для этого проекта.', be: 'Ілюстрацыя створана ШІ для гэтага праекта.', en: 'AI-generated illustration created for this project.' }, license: { ru: 'Условный вымышленный образ; не архивная фотография и не достоверное изображение Луизы Сацук-Большаковой.', be: 'Умоўны выдуманы вобраз; не архіўны фотаздымак і не сапраўднае выяўленне Луізы Сацук-Бальшаковай.', en: 'Fictional illustrative image; not an archival photograph or a likeness of Louisa Satsuk-Bolshakova.' } }, link: { kind: 'stage', c: 'slutsk', s: 1 }, src: ['rcnt'],
      name: { ru: 'Луиза Сацук-Большакова', be: 'Луіза Сацук-Бальшакова', en: 'Louisa Satsuk-Bolshakova' },
      years: null,
      bio: { ru: 'Очевидец событий в Слуцке. Её воспоминания публикует Слуцкий районный центр народного творчества рядом с докладом коменданта. Других сведений о ней в использованных источниках нет: читайте текст воспоминаний по ссылке.',
        be: 'Відавочца падзей у Слуцку. Яе ўспаміны публікуе Слуцкі раённы цэнтр народнай творчасці побач з дакладам каменданта. Іншых звестак пра яе ў выкарыстаных крыніцах няма: чытайце тэкст успамінаў па спасылцы.',
        en: 'An eyewitness of the events in Slutsk. Her recollections are published by the Slutsk district folk art centre alongside the commandant’s report. The sources used give no other information about her: read the text of the recollections at the link.' },
      ev: { ru: 'Слуцк, 27–28 октября 1941 г.', be: 'Слуцк, 27–28 кастрычніка 1941 г.', en: 'Slutsk, 27–28 October 1941' } },
    { id: 'bogdashich', cs: 'slutsk', role: 'keeper', unlock: { c: 'slutsk', s: 2 }, photo: { file: 'img/faces/bogdashich.jpg', full: 'img/faces/bogdashich-full.jpg', credit: { ru: 'Иллюстрация создана ИИ для этого проекта.', be: 'Ілюстрацыя створана ШІ для гэтага праекта.', en: 'AI-generated illustration created for this project.' }, license: { ru: 'Условный вымышленный образ; не архивная фотография и не достоверное изображение Сергея Богдашича.', be: 'Умоўны выдуманы вобраз; не архіўны фотаздымак і не сапраўднае выяўленне Сяргея Багдашыча.', en: 'Fictional illustrative image; not an archival photograph or a likeness of Sergei Bogdashich.' } }, link: { kind: 'stage', c: 'slutsk', s: 2 }, src: ['rcnt'],
      name: { ru: 'Сергей Богдашич', be: 'Сяргей Багдашыч', en: 'Sergei Bogdashich' },
      years: null,
      bio: { ru: 'Краевед. Подготовил материал о трагедии Слуцкого гетто (kurjer.info, 2019–2020 гг.); районный центр народного творчества републиковал его в рубрике «Год исторической памяти».',
        be: 'Краязнаўца. Падрыхтаваў матэрыял пра трагедыю Слуцкага гета (kurjer.info, 2019–2020 гг.); раённы цэнтр народнай творчасці перавыдаў яго ў рубрыцы «Год гістарычнай памяці».',
        en: 'A local historian. He prepared the material on the tragedy of the Slutsk ghetto (kurjer.info, 2019–2020); the district folk art centre republished it under the heading “Year of Historical Memory”.' },
      ev: { ru: 'Сохранение памяти о Слуцком гетто', be: 'Захаванне памяці пра Слуцкае гета', en: 'Preserving the memory of the Slutsk ghetto' } },
    { id: 'kagan', cs: 'novogrudok', role: 'survivor', unlock: { c: 'novogrudok', s: 1 }, photo: { file: 'img/faces/kagan.jpg', full: 'img/faces/kagan-full.jpg', credit: { ru: 'Иллюстрация создана ИИ для этого проекта.', be: 'Ілюстрацыя створана ШІ для гэтага праекта.', en: 'AI-generated illustration created for this project.' }, license: { ru: 'Условный вымышленный образ; не архивная фотография и не достоверное изображение Джека Кагана.', be: 'Умоўны выдуманы вобраз; не архіўны фотаздымак і не сапраўднае выяўленне Джэка Кагана.', en: 'Fictional illustrative image; not an archival photograph or a likeness of Jack Kagan.' } }, link: { kind: 'stage', c: 'novogrudok', s: 1 }, src: ['wall', JNS, JPOST],
      name: { ru: 'Джек (Идель) Каган', be: 'Джэк (Ідэль) Каган', en: 'Jack (Idel) Kagan' },
      years: { ru: '1929–2016 (родился 7 апреля 1929 г. в Новогрудке; умер 18 декабря 2016 г. в Лондоне)', be: '1929–2016 (нарадзіўся 7 красавіка 1929 г. у Навагрудку; памёр 18 снежня 2016 г. у Лондане)', en: '1929–2016 (born 7 April 1929 in Novogrudok; died 18 December 2016 in London)' },
      bio: { ru: 'Участник побега из Новогрудского гетто в ночь на 26 сентября 1943 г. На открытии Стены памяти в Новогрудке звучала его история: ему было 13–14 лет, и он остался единственным из семьи в живых. Позднее Джек Каган добивался создания музея на месте побега и памятных знаков на могилах убитых евреев Новогрудка (по JNS). В выступлении на открытии Стены памяти отмечено, что музей продолжает жить и развиваться.',
        be: 'Удзельнік уцёкаў з Навагрудскага гета ў ноч на 26 верасня 1943 г. На адкрыцці Сцяны памяці ў Навагрудку прагучала яго гісторыя: яму было 13–14 гадоў, і ён застаўся адзіным з сям’і ў жывых. Пазней Джэк Каган дамагаўся стварэння музея на месцы ўцёкаў і памятных знакаў на магілах забітых яўрэяў Навагрудка (паводле JNS). У выступленні на адкрыцці Сцяны памяці адзначана, што музей працягвае жыць і развівацца.',
        en: 'A participant in the escape from the Novogrudok ghetto on the night of 26 September 1943. His story was told at the opening of the Wall of Memory in Novogrudok: he was 13–14 years old and the only one of his family to survive. Later Jack Kagan worked to create a museum at the escape site and memorial markers on the graves of the murdered Jews of Novogrudok (according to JNS). A speech at the opening of the Wall of Memory noted that the museum goes on living and developing.' },
      ev: { ru: 'Побег из Новогрудского гетто, 26 сентября 1943 г.', be: 'Уцёкі з Навагрудскага гета, 26 верасня 1943 г.', en: 'Escape from the Novogrudok ghetto, 26 September 1943' } },
    { id: 'girilovich', cs: 'dalva', role: 'survivor', unlock: { map: true }, photo: { file: 'img/faces/girilovich.jpg', full: 'img/faces/girilovich-full.jpg', credit: { ru: 'Иллюстрация создана ИИ для этого проекта.', be: 'Ілюстрацыя створана ШІ для гэтага праекта.', en: 'AI-generated illustration created for this project.' }, license: { ru: 'Условный вымышленный образ; не архивная фотография и не достоверное изображение Николая Гириловича.', be: 'Умоўны выдуманы вобраз; не архіўны фотаздымак і не сапраўднае выяўленне Мікалая Гірыловіча.', en: 'Fictional illustrative image; not an archival photograph or a likeness of Nikolai Girilovich.' } }, link: { kind: 'map', date: 'jun19', obj: 'dalva' }, src: ['adu', 'newsby'],
      name: { ru: 'Николай Гирилович', be: 'Мікалай Гірыловіч', en: 'Nikolai Girilovich' },
      years: null,
      bio: { ru: 'Выжил при сожжении деревни Дальва в Логойском районе 19 июня 1944 г.: тогда каратели сожгли 44 жителей, среди них 29 детей. Ему было 13 лет. Позднее он добился создания мемориала.',
        be: 'Выжыў пры спаленні вёскі Дальва ў Лагойскім раёне 19 чэрвеня 1944 г.: тады карнікі спалілі 44 жыхары, сярод іх 29 дзяцей. Яму было 13 гадоў. Пазней ён дамогся стварэння мемарыяла.',
        en: 'He survived the burning of the village of Dalva in the Logoisk district on 19 June 1944, when punitive units burned 44 residents, 29 of them children. He was 13 years old. Later he secured the creation of a memorial.' },
      ev: { ru: 'Деревня Дальва, 19 июня 1944 г.', be: 'Вёска Дальва, 19 чэрвеня 1944 г.', en: 'The village of Dalva, 19 June 1944' } }
  ];

  var state = { q: '', f: 'all', sel: null, open: false };
  function lang() { var l = (window.LANGNOW && window.LANGNOW()) || 'ru'; return UI[l] ? l : 'ru'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function T(s) { return window.T ? window.T(s) : s }
  function unlocked(p) {
    var u = p.unlock; if (u.map) return !!S.st.mapOpened;
    var r = S.st.reach && S.st.reach[u.c]; return r !== undefined && r >= u.s;
  }
  function srcHtml(list) {
    var L = lang();
    return list.map(function (x) {
      var n, u; if (typeof x === 'string') { n = window.SRC[x].n; u = window.SRC[x].u } else { n = x.n; u = x.u }
      return '<a href="' + u + '" target="_blank" rel="noopener">' + esc(L === 'ru' ? n : T(n)) + '</a>';
    }).join('; ');
  }
  function foot(h) { $('#mf').innerHTML = h }

  function lockHint(p, U, L) {
    var u = p.unlock;
    return u.map ? U.unlockMap : U.unlockStage(CASE[u.c][L], STG[u.s][L]);
  }

  function grid() {
    var U = UI[lang()], L = lang(), q = state.q.trim().toLowerCase(), n = 0, h = '';
    var cards = PEOPLE.filter(function (p) { return state.f === 'all' || p.cs === state.f; }).filter(function (p) {
      if (!q) return true; if (!unlocked(p)) return false;
      return ['ru', 'be', 'en'].some(function (l) { return p.name[l].toLowerCase().indexOf(q) >= 0 });
    });
    PEOPLE.forEach(function (p) { if (unlocked(p)) n++ });
    var chips = '<button class="fchip' + (state.f === 'all' ? ' on' : '') + '" data-f="all">' + esc(U.all) + '</button>' + Object.keys(CASE).map(function (k) { return '<button class="fchip' + (state.f === k ? ' on' : '') + '" data-f="' + k + '">' + esc(CASE[k][L]) + '</button>' }).join('');
    h += '<div class="fz" data-nt><p class="flead">' + esc(U.lead) + '</p><div class="fbar"><input id="fq" type="search" autocomplete="off" placeholder="' + esc(U.search) + '" value="' + esc(state.q) + '"><div class="fchips">' + chips + '</div><span class="fcnt">' + esc(U.opened(n, PEOPLE.length)) + '</span></div><div class="fgrid">';
    cards.forEach(function (p, i) {
      var ok = unlocked(p);
      h += '<button class="fcard ' + (ok ? 'open' : 'lock') + '" data-p="' + p.id + '" style="animation-delay:' + (i * 0.06) + 's"' + (ok ? '' : ' aria-disabled="true"') + '>' +
        '<span class="ffr">' + (ok ? (p.photo ? '<img src="' + p.photo.file + '" alt="' + esc(p.name[L] + ' — ' + U.illustrationAlt) + '">' : '<em>' + esc(UI[L].role[p.role]) + '</em>') : '<em>' + esc(U.locked) + '</em>') + '</span>' +
        '<b class="fname">' + (ok ? esc(p.name[L]) : '· · ·') + '</b>' +
        '<small class="fsub">' + (ok ? esc(CASE[p.cs][L]) + (p.years ? ' · ' + esc(p.years[L].split(' ')[0]) : '') : esc(U.unlockHdr) + ' ' + esc(lockHint(p, U, L))) + '</small></button>';
    });
    if (!cards.length) h += '<p class="fnone">' + esc(U.none) + '</p>';
    h += '</div></div>';
    $('#mb').innerHTML = h;
    foot('<span></span><button class="sec" id="fcx">' + U.close + '</button>');
    $('#fcx').onclick = S.close;
    var qi = $('#fq');
    qi.oninput = function () { state.q = qi.value; var pos = qi.selectionStart; grid(); var n2 = $('#fq'); n2.focus(); try { n2.setSelectionRange(pos, pos) } catch (e) { } };
    [].forEach.call(document.querySelectorAll('.fchip'), function (b) { b.onclick = function () { state.f = b.dataset.f; grid() } });
    [].forEach.call(document.querySelectorAll('.fcard.open'), function (b) { b.onclick = function () { detail(b.dataset.p, b) } });
  }

  function detail(id, from) {
    var p = PEOPLE.filter(function (x) { return x.id === id })[0]; if (!p) return;
    state.sel = id; var U = UI[lang()], L = lang();
    var photo = p.photo
      ? '<figure class="fph"><img src="' + p.photo.file + '" data-full="' + (p.photo.full || p.photo.file) + '" title="' + esc(T('Нажмите, чтобы увеличить')) + '" alt="' + esc(p.name[L] + ' — ' + U.illustrationAlt) + '"></figure>'
      : '<div class="fph fnp"><span>' + esc(U.noPhoto) + '</span></div>';
    var h = '<div class="fd" id="fd" data-nt>' + photo + '<div class="ftx"><div class="frole">' + esc(U.role[p.role]) + '</div><h3>' + esc(p.name[L]) + '</h3>' +
      '<dl><dt>' + esc(U.years) + '</dt><dd>' + esc(p.years ? p.years[L] : U.yearsNo) + '</dd><dt>' + esc(U.about) + '</dt><dd>' + esc(p.bio[L]) + '</dd><dt>' + esc(U.event) + '</dt><dd>' + esc(p.ev[L]) + '</dd><dt>' + esc(U.srcs) + '</dt><dd>' + srcHtml(p.src) + '</dd>' + (p.photo ? '' : '') + '</dl>' +
      '<p><button id="fcgo">' + (p.link.kind === 'map' ? U.goMap : U.goStage) + '</button></p></div></div>';
    var mb = $('#mb'), f = $('#fd');
    mb.innerHTML = h; mb.scrollTop = 0;
    var d = $('#fd');
    try { // раскрытие из положения карточки
      var a = from.getBoundingClientRect(), b = mb.getBoundingClientRect();
      var t = Math.max(0, a.top - b.top), l = Math.max(0, a.left - b.left), r = Math.max(0, b.right - a.right), bt = Math.max(0, b.bottom - a.bottom);
      d.style.clipPath = 'inset(' + t + 'px ' + r + 'px ' + bt + 'px ' + l + 'px round 6px)'; d.style.opacity = '.2';
      requestAnimationFrame(function () { requestAnimationFrame(function () { d.style.transition = 'clip-path .6s cubic-bezier(.4,.1,.2,1),opacity .5s'; d.style.clipPath = 'inset(0 0 0 0 round 0px)'; d.style.opacity = '1'; }); });
    } catch (e) { }
    foot('<button class="sec" id="fcb">' + U.back + '</button><button class="sec" id="fcx">' + U.close + '</button>');
    $('#fcb').onclick = function () { state.sel = null; grid() }; $('#fcx').onclick = S.close;
    $('#fcgo').onclick = function () { go(p) };
  }

  function go(p) {
    if (p.link.kind === 'stage') S.openStage(p.link.c, p.link.s);
    else S.openMap(p.link);
  }

  function render() {
    if (!state.open) return;
    var t = $('#mt'); if (t) t.textContent = UI[lang()].title;
    var m = $('#mod'); if (m) m.classList.add('dk');
    if (state.sel) detail(state.sel, $('#mb')); else grid();
  }
  function open() {
    state.open = true; state.sel = null; state.q = ''; state.f = 'all';
    S.modal(UI[lang()].title, '', '', '', true); document.getElementById('mod').classList.add('dk'); grid();
  }
  var pn = document.getElementById('panel');
  if (pn && window.MutationObserver) new MutationObserver(function () { if (!pn.classList.contains('show')) state.open = false; }).observe(pn, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('sled-lang', function () { if (state.open) render(); });
  window.FACES = { open: open, people: PEOPLE };
})();
