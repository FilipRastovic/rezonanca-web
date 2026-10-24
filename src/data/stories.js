// "Прича": the history behind each work - who the formula is named after, when, why the name,
// and a nature parallel only where a real one exists (Filip, 2026-10-24). Plain, precise, sr + en.
export const STORIES = {
  // ---- Атрактори
  tomas: {
    sr: 'Белгијски биолог Рене Томас објавио је ове једначине 1999, проучавајући повратне спреге у живим ћелијама: ген који кочи други ген, који кочи трећи. Назвао их је „хаос лавиринта“. Три синуса у кругу и један параметар трења b: што је b мањи, путања дубље лута.',
    en: 'Belgian biologist René Thomas published these equations in 1999 while studying feedback loops in living cells: one gene holding back another, which holds back a third. He called it "labyrinth chaos". Three sines in a circle and one friction parameter b: the smaller b, the deeper the path wanders.',
  },
  halvorsen: {
    sr: 'Систем носи име по Арнеу Халворсену, а у уџбенике хаоса ушао је преко каталога физичара Џулијена Спрота. Свака променљива гура следећу у кругу, x на y, y на z, z назад на x, па облик има троструку симетрију, као лист детелине.',
    en: "Named after Arne Halvorsen, the system reached chaos textbooks through physicist Julien Sprott's catalogue. Each variable pushes the next in a circle, x on y, y on z, z back on x, so the shape has threefold symmetry, like a clover leaf.",
  },
  'klifordov-veo': {
    sr: 'Пресликавање носи име по Клифорду Пиковеру, истраживачу у IBM-у и писцу који је математичке слике приближио читаоцима. Објавио га је 1994. у књизи „Chaos in Wonderland“. Две једначине, четири броја: свака тачка рачуна се из претходне, милионима пута, а светлост је број тачака које падну на исто место.',
    en: 'The map is named after Clifford Pickover, an IBM researcher and writer who brought mathematical pictures to a wide audience. He published it in his 1994 book Chaos in Wonderland. Two equations, four numbers: each point is computed from the last, millions of times, and the light is how many points land in the same place.',
  },
  'de-zong': {
    sr: 'Пресликавање Питера де Жонга рођак је Клифордовог: исте две једначине од синуса и косинуса, са другим знаковима. Постало је познато крајем 1980-их, кад су читаоци научних часописа цртали атракторе на кућним рачунарима. Мало помери један од четири броја и облик постаје сасвим други.',
    en: "Peter de Jong's map is a cousin of Clifford's: the same two equations of sines and cosines, with different signs. It became known in the late 1980s, when readers of science magazines drew attractors on home computers. Move one of the four numbers slightly and the shape becomes a different one.",
  },
  lorenc: {
    sr: 'Метеоролог Едвард Лоренц је 1963. на MIT-у свео модел атмосфере на три једначине: топао ваздух се диже, хлади и пада, исто кретање које лети гради олујне облаке. Две године раније, кад је један број заокружио на три децимале, прогноза је испала сасвим друга. Отуд ефекат лептира.',
    en: 'In 1963 at MIT, meteorologist Edward Lorenz reduced a model of the atmosphere to three equations: warm air rises, cools and falls, the same motion that builds storm clouds in summer. Two years earlier, rounding one number to three decimals had given him a completely different forecast. Hence the butterfly effect.',
  },
  aizava: {
    sr: 'Систем носи име по јапанском физичару Јоџију Аизави. Путања кружи по површини сфере, пролази кроз цев у средини и враћа се горе, увек у истом облику, никад истим путем. Шест параметара, овде од a = 0,95 до f = 0,1.',
    en: 'The system is named after Japanese physicist Yoji Aizawa. The path circles the surface of a sphere, drops through the tube in the middle and comes back up, always in the same shape, never along the same route. Six parameters, here from a = 0.95 to f = 0.1.',
  },
  resler: {
    sr: 'Немачки биохемичар Ото Реслер тражио је 1976. најједноставнији могући хаос. Идеју је нашао у машини која развлачи и савија карамелу: истегни, пресавиј, понови. Систем има само једну нелинеарну чланицу, z·x, и то је довољно.',
    en: 'In 1976 German biochemist Otto Rössler went looking for the simplest possible chaos. He found the idea in a taffy-pulling machine: stretch, fold, repeat. The system has a single nonlinear term, z·x, and that is enough.',
  },
  sprot: {
    sr: 'Физичар Џулијен Спрот пустио је 1994. рачунар да претражи милионе једначина и нашао деветнаест најједноставнијих хаотичних система, обележених словима од A до S. Сваки има само пет или шест чланова. Облик подсећа на медузу: звоно и талас кроз средину.',
    en: 'In 1994 physicist Julien Sprott had a computer search millions of equations and found nineteen of the simplest chaotic systems, labelled A to S. Each has only five or six terms. The shape recalls a jellyfish: a bell with a wave through the middle.',
  },
  'cetiri-krila': {
    sr: 'Три једначине, свака са производом друге две променљиве: yz, xz, xy. Путања прелази из једног вртлога у други, а четири вртлога стоје два и два у огледалу, као крила лептира.',
    en: "Three equations, each with the product of the other two variables: yz, xz, xy. The path crosses from one vortex to the next, and the four vortices sit in mirrored pairs, like a butterfly's wings.",
  },
  dadras: {
    sr: 'Сара Дадрас и Хамид Реза Момени објавили су 2009. систем који, зависно од параметара, прави два, три или четири вртлога. Овај рад користи параметре при којима се трака светлости пресавија у средини.',
    en: 'Sara Dadras and Hamid Reza Momeni published the system in 2009. Depending on its parameters it makes two, three or four scrolls. This piece uses parameters where the ribbon of light folds in the middle.',
  },
  cen: {
    sr: 'Гуанронг Чен и Тецуши Уета објавили су систем 1999, истражујући како се хаос може намерно створити, а не само укротити. Личи на Лоренцов, али није исти: ова два атрактора не могу се глатко претворити један у други.',
    en: "Guanrong Chen and Tetsushi Ueta published the system in 1999 while studying how to create chaos on purpose rather than tame it. It resembles Lorenz's, but it is not the same: the two attractors cannot be smoothly deformed into each other.",
  },
  rabinovic: {
    sr: 'Михаил Рабинович и Анатолиј Фабрикант описали су систем 1979, моделујући таласе у неравнотежним срединама попут плазме. Иста појава постоји и у таласима на води: мали поремећај расте, разбија се и враћа. Систем се тешко рачуна: мала грешка у кораку и путања побегне.',
    en: 'Mikhail Rabinovich and Anatoly Fabrikant described the system in 1979, modelling waves in non-equilibrium media such as plasma. The same effect appears in waves on water: a small disturbance grows, breaks and returns. The system is hard to compute: a small error in the step and the path escapes.',
  },

  // ---- Манделброт
  'mandelbrotov-skup': {
    sr: 'Прву слику скупа објавили су 1978. Роберт Брукс и Питер Метелски, исписану словима на штампачу. Беноа Манделброт је 1980. у IBM-у направио оштрије слике и скуп је добио његово име. Цео скуп стане у круг полупречника 2, а ово је поглед на целину.',
    en: 'Robert Brooks and Peter Matelski published the first picture of the set in 1978, typed out in characters on a printer. In 1980 Benoit Mandelbrot made sharper images at IBM, and the set took his name. The whole set fits inside a circle of radius 2, and this is the view of all of it.',
  },
  'dolina-morskih-konjica': {
    sr: 'Долина морских коњица је процеп између главне кардиоиде и највећег круга скупа, око тачке −0,745 + 0,113i. Име је добила по спиралама које личе на увијен реп морског коњица. Што дубље увеличаваш, свака спирала се дели на нове спирале.',
    en: "Seahorse Valley is the cleft between the main cardioid and the largest disc of the set, around −0.745 + 0.113i. It is named after spirals that look like a seahorse's curled tail. The deeper you zoom, the more each spiral splits into new ones.",
  },
  spirala: {
    sr: 'Спирала лежи у истој долини, још дубље, са 1.400 корака по тачки. Што је тачка ближа граници скупа, спорије бежи, па програм мора дуже да рачуна. Сличан завој праве пужеве кућице и млади листови папрати док се одмотавају.',
    en: 'The Spiral lies in the same valley, deeper still, at 1,400 steps per point. The closer a point is to the edge of the set, the slower it escapes, so the program has to compute for longer. Snail shells and young fern fronds unrolling make a similar curl.',
  },
  'mali-mandelbrot': {
    sr: 'Близу −1,757 на реалној оси седи умањена копија целог скупа. Таквих копија има бесконачно много, а све су повезане са главним скупом. Да је скуп повезан у једну целину, доказали су 1982. Адријен Дуади и Џон Хабард.',
    en: 'Near −1.757 on the real axis sits a shrunken copy of the whole set. There are infinitely many such copies, all joined to the main set. Adrien Douady and John Hubbard proved in 1982 that the set is connected in one piece.',
  },
  vitica: {
    sr: 'Витице расту са горњег дела скупа, око тачке −0,101 + 0,956i. Свака грана се дели на мање гране истог облика, као витица винове лозе или лист папрати. Граница скупа има ту особину на сваком увећању.',
    en: 'The tendrils grow from the top of the set, around −0.101 + 0.956i. Each branch splits into smaller branches of the same shape, like a vine tendril or a fern frond. The edge of the set has this property at every magnification.',
  },
  'morska-zvezda': {
    sr: 'Звезда од спирала око тачке −0,374 + 0,660i, са 1.500 корака по тачки. Број кракова на граници скупа није случајан: антена кружног пупољка периода n грана се у n кракова. Морске звезде најчешће имају пет кракова, из сасвим другог разлога.',
    en: 'A star of spirals around −0.374 + 0.660i, at 1,500 steps per point. The number of arms on the edge of the set is not chance: the antenna of a period-n bulb branches into n arms. Starfish usually have five arms, for a completely different reason.',
  },

  // ---- Пламен
  perje: {
    sr: 'Перје нема наметнуту симетрију: облик долази само од правила и случаја. Скот Дрејвс, који је 1992. осмислио фрактални пламен, покренуо је 1999. Electric Sheep, чувар екрана на ком хиљаде рачунара заједно рачунају пламенове.',
    en: 'Feathers has no imposed symmetry: the shape comes from the rules and chance alone. Scott Draves, who invented the fractal flame in 1992, launched Electric Sheep in 1999, a screensaver on which thousands of computers render flames together.',
  },
  dim: {
    sr: 'Троструку симетрију даје правило ротације за 120°: свака тачка добија још две копије око средишта. Дрејвсов пламен боји сваку тачку по историји правила која су је довела ту, па сваки крак дима носи своју нијансу.',
    en: 'A rotation rule of 120° gives the threefold symmetry: every point gets two more copies around the centre. Draves\'s flame colours each point by the history of rules that brought it there, so each arm of smoke carries its own shade.',
  },
  ruza: {
    sr: 'Петоструку симетрију дају ротације за 72°. Пет латица има и дивља ружа, као и јабука, шљива и јагода: биљке из породице ружа најчешће цветају у петицама.',
    en: 'Rotations of 72° give the fivefold symmetry. A wild rose has five petals, and so do apple, plum and strawberry: plants of the rose family usually flower in fives.',
  },
  vetrenjaca: {
    sr: 'Четири крака дају ротације за 90°. Светлина расте са логаритмом броја тачака које падну на пиксел, па и ретки трагови остају видљиви поред светлог средишта. Без логаритма би се видело само језгро.',
    en: 'Rotations of 90° give the four arms. Brightness grows with the logarithm of how many points land on a pixel, so even faint trails stay visible beside the bright centre. Without the logarithm you would see only the core.',
  },

  // ---- Структура
  predajnik: {
    sr: 'Сто седамдесет зрака из једног језгра. Правило гласи: нацртај блок, па понови мало даље и мало заокренуто. Програм стаје на 14.000 блокова, а дужину сваког зрака одређује збир неколико синусних таласа.',
    en: 'One hundred and seventy rays from a single core. The rule says: draw a block, then repeat a little further on and turned a little. The program stops at 14,000 blocks, and the length of each ray is set by a sum of a few sine waves.',
  },
  galaksija: {
    sr: 'Иста правила као код Предајника, уз једну измену: сваки нови блок заокрене се још мало у истом смеру. Сто двадесет зрака се тако савије у кракове спирале. Праве спиралне галаксије, као Млечни пут, своје кракове дугују таласима густине.',
    en: "The same rules as Transmitter, with one change: each new block turns a little further in the same direction. A hundred and twenty rays bend into spiral arms this way. Real spiral galaxies, like the Milky Way, owe their arms to density waves.",
  },
  'drvo-signala': {
    sr: 'Петнаест зрака који се гранају: правило рађа нове гране уместо једне праве линије. Тако је биолог Аристид Линденмајер 1968. описао раст алги, а касније и дрвећа: свака грана понавља облик целог стабла.',
    en: 'Fifteen rays that branch: the rule grows new branches instead of a single straight line. This is how biologist Aristid Lindenmayer described the growth of algae in 1968, and later of trees: every branch repeats the shape of the whole tree.',
  },
  'dvojna-zvezda': {
    sr: 'Два језгра, сто деведесет зрака. Свако језгро гради своје зраке по истим правилима, а где се зраци сретну, блокови се гомилају и светле. Двојне звезде нису реткост: отприлике половина звезда сличних Сунцу има пратиоца.',
    en: 'Two cores, one hundred and ninety rays. Each core builds its rays by the same rules, and where the rays meet, blocks pile up and glow. Binary stars are not rare: roughly half of all Sun-like stars have a companion.',
  },
  'dajsonova-sfera': {
    sr: 'Физичар Фримен Дајсон предложио је 1960. да се напредне цивилизације траже по топлоти: љуска око звезде хватала би њену светлост и зрачила инфрацрвено. Овде осамдесет зрака гради прстенове око језгра уместо правих линија.',
    en: 'In 1960 physicist Freeman Dyson suggested looking for advanced civilisations by their heat: a shell around a star would capture its light and glow in infrared. Here eighty rays build rings around the core instead of straight lines.',
  },
  supernova: {
    sr: 'Исто језгро и исти број зрака као Предајник, са другим сигналом. Кинески астрономи су 1054. забележили „звезду госта“ видљиву и дању: супернову која је иза себе оставила Ракову маглину.',
    en: 'The same core and the same number of rays as Transmitter, with a different signal. In 1054 Chinese astronomers recorded a "guest star" visible even by day: a supernova that left the Crab Nebula behind.',
  },

  // ---- Ток
  aurora: {
    sr: 'Поларна светлост настаје кад честице са Сунца ударе у горњу атмосферу: кисеоник светли зелено, азот љубичасто. Завесе се увијају по линијама магнетног поља Земље, као ова трака од 150 нити.',
    en: "Auroras form when particles from the Sun hit the upper atmosphere: oxygen glows green, nitrogen violet. The curtains twist along the lines of Earth's magnetic field, like this ribbon of 150 threads.",
  },
  'dvostruka-spirala': {
    sr: 'Џејмс Вотсон и Френсис Крик објавили су 1953. модел ДНК као двоструке завојнице, на основу рендгенских снимака Розалинд Френклин. Овде су две траке од укупно 180 нити, уплетене једна око друге.',
    en: "In 1953 James Watson and Francis Crick published the model of DNA as a double helix, based on Rosalind Franklin's X-ray images. Here two ribbons of 180 threads in total wind around each other.",
  },
  horizont: {
    sr: 'Трака развучена водоравно: попречни пресек се окреће док путује дуж криве, а угао окретања прати сигнал. За око на висини човека, хоризонт на мору удаљен је тек око пет километара.',
    en: 'A ribbon stretched horizontally: the cross-section turns as it travels along the curve, and the angle follows the signal. For an eye at human height, the sea horizon is only about five kilometres away.',
  },
  beskonacnost: {
    sr: 'Осмица је лемниската. Јакоб Бернули описао ју је 1694. и назвао по латинској речи за траку, lemniscus. Знак ∞ за бесконачност увео је Џон Волис 1655.',
    en: 'The figure eight is a lemniscate. Jacob Bernoulli described it in 1694 and named it after the Latin word for ribbon, lemniscus. John Wallis introduced the ∞ sign for infinity in 1655.',
  },
  vodopad: {
    sr: 'Три траке, 210 нити, свака са својим фазним помаком. Млаз воде у почетку пада гладак, па се распадне у капи: та појава зове се Плато-Рејлијева нестабилност.',
    en: 'Three ribbons, 210 threads, each with its own phase shift. A stream of water falls smooth at first, then breaks into drops: this is called the Plateau-Rayleigh instability.',
  },
  svila: {
    sr: 'Свилена буба испреде чауру од једне непрекидне нити, дугачке и до километра. Ова трака има 150 нити и спорији сигнал од Ауроре, па се мање увија.',
    en: 'A silkworm spins its cocoon from a single unbroken thread, up to a kilometre long. This ribbon has 150 threads and a slower signal than Aurora, so it twists less.',
  },

  // ---- Град
  metropola: {
    sr: 'Први спектрографи за звук направљени су у Беловим лабораторијама током 1940-их, да говор учине видљивим. Овде је спектрограм мрежа 26 × 26: 676 кула, свака висока колико је јака једна фреквенција у једном тренутку.',
    en: 'The first sound spectrographs were built at Bell Labs in the 1940s to make speech visible. Here the spectrogram is a 26 × 26 grid: 676 towers, each as tall as one frequency is strong at one moment.',
  },
  'orbitalni-grad': {
    sr: 'Исти спектрограм намотан у круг: време иде око трга, фреквенција од средишта ка ивици, 716 кула. Свемирску станицу у облику точка описао је 1928. словеначки инжењер Херман Поточник.',
    en: 'The same spectrogram wound into a circle: time runs around the plaza, frequency from the centre outwards, 716 towers. A wheel-shaped space station was described in 1928 by Slovenian engineer Herman Potočnik.',
  },
  kanjon: {
    sr: 'Седамсто осамдесет четири куле, поређане тако да средина остане ниска. Прави кањони настају кад река годинама спушта дно, а стене са стране остају.',
    en: 'Seven hundred and eighty-four towers, arranged so the middle stays low. Real canyons form when a river lowers the floor year after year while the rock on either side stays.',
  },
  kula: {
    sr: 'Мрежа 34 × 34, 1.156 кула. Једна фреквенција је много јача од осталих, па њена кула надвисује град. Тако изгледа чист тон у спектру: један врх, као звиждук или камертон.',
    en: 'A 34 × 34 grid, 1,156 towers. One frequency is far stronger than the rest, so its tower rises above the city. This is what a pure tone looks like in a spectrum: one peak, like a whistle or a tuning fork.',
  },
  talas: {
    sr: 'Девесто кула, а висине прати талас који путује кроз мрежу. Тако у спектрограму изгледа звук чији тон расте и пада, попут сирене.',
    en: 'Nine hundred towers, their heights following a wave that travels through the grid. This is how a sound whose pitch rises and falls, like a siren, looks in a spectrogram.',
  },
  ponoc: {
    sr: 'Најгушћи град серије: мрежа 44 × 44, 1.936 кула. Што је мрежа гушћа, спектрограм раздваја ближе фреквенције, као микроскоп са већим увећањем.',
    en: 'The densest city in the series: a 44 × 44 grid, 1,936 towers. The finer the grid, the closer the frequencies the spectrogram can tell apart, like a microscope at higher magnification.',
  },

  // ---- Гребени
  'prvi-signal': {
    sr: 'Први рад Резонанце, 56 линија. Свака линија је носећи талас чију висину обликују две обвојнице, као гласноћа тона који се појача и утихне.',
    en: "Rezonanca's first piece, 56 lines. Each line is a carrier wave whose height is shaped by two envelopes, like the volume of a note that swells and fades.",
  },
  'tiha-oluja': {
    sr: 'Шездесет две линије, а Перлинов шум овде има већи удео него сигнал, па се облик планине губи у треперењу. Перлин је шум осмислио 1983, кад му је рачунарска слика у филму „Трон“ изгледала превише глатко.',
    en: 'Sixty-two lines, with Perlin noise outweighing the signal, so the mountain shape dissolves into flicker. Perlin invented his noise in 1983, after computer images for the film Tron looked too smooth to him.',
  },
  'severni-signal': {
    sr: 'Четрдесет шест линија, свака мало померена у страну у односу на претходну, па се венац савија. Слојеви леда у глечеру савијају се исто: споро, под сопственом тежином.',
    en: "Forty-six lines, each shifted slightly sideways from the one before, so the range bends. Layers of ice in a glacier fold the same way: slowly, under their own weight.",
  },
  magla: {
    sr: 'Сто четири линије, скоро двоструко више него на Првом сигналу. Кад су линије толико близу, око их више не броји, већ види површину. Магла у долини је исто: милиони капљица, а видиш један вео.',
    en: 'One hundred and four lines, almost twice as many as First Signal. When lines sit this close, the eye stops counting them and sees a surface. Fog in a valley is the same: millions of droplets, seen as one veil.',
  },
  blizanci: {
    sr: 'Две обвојнице, на 30% и 70% ширине, дају два врха исте висине. Исти сигнал, подељен на два гласа.',
    en: 'Two envelopes, at 30% and 70% of the width, give two peaks of the same height. One signal, split into two voices.',
  },
  svitanje: {
    sr: 'Тридесет осам линија, најмање у серији, са врховима скупљеним у средини. Свака линија је мало виша од претходне, као брда која се одвајају од равнице кад сване.',
    en: 'Thirty-eight lines, the fewest in the series, with the peaks gathered in the middle. Each line sits a little higher than the last, like hills separating from the plain at first light.',
  },

  // ---- Орбита
  'nulta-orbita': {
    sr: 'Други рад Резонанце, 40 прстенова. Две обвојнице, на 198° и 138°, одређују где се прстенови највише надимају. Поларне координате, угао и удаљеност од средишта, разрадио је Јакоб Бернули 1691.',
    en: "Rezonanca's second piece, 40 rings. Two envelopes, at 198° and 138°, set where the rings swell most. Polar coordinates, angle and distance from the centre, were worked out by Jacob Bernoulli in 1691.",
  },
  'prsten-tisine': {
    sr: 'Педесет прстенова, а шум је јак, па прстенови личе на изохипсе, линије исте висине на топографској карти. Брда која цртају не постоје нигде.',
    en: 'Fifty rings with strong noise, so they read like contour lines on a topographic map. The hills they draw exist nowhere.',
  },
  magnetar: {
    sr: 'Магнетар је неутронска звезда са најјачим познатим магнетним пољем, око хиљаду билиона пута јачим од Земљиног. Овде се 40 прстенова кида у лукове, са две уске обвојнице.',
    en: "A magnetar is a neutron star with the strongest magnetic field known, around a million billion times stronger than Earth's. Here 40 rings break into arcs, with two narrow envelopes.",
  },
  pomracenje: {
    sr: 'Сунце је око 400 пута веће од Месеца и око 400 пута даље, па су на небу исте величине. Зато Месец може да га покрије тачно, док остане само обод. Овде 34 прстена и једна обвојница.',
    en: 'The Sun is about 400 times larger than the Moon and about 400 times further away, so the two look the same size in the sky. That is why the Moon can cover it exactly, leaving only the rim. Here 34 rings and one envelope.',
  },
  crvotocina: {
    sr: 'Алберт Ајнштајн и Натан Розен описали су 1935. мост кроз простор-време, касније назван црвоточина. Овде 64 прстена, највише у серији, сабијају се ка средини и дају утисак дубине.',
    en: 'In 1935 Albert Einstein and Nathan Rosen described a bridge through spacetime, later called a wormhole. Here 64 rings, the most in the series, crowd towards the centre and give a sense of depth.',
  },
  oreol: {
    sr: 'Ореол око месеца настаје кад се светлост прелама кроз ледене кристале у високим облацима, увек под углом од 22°. Овде само 15 прстенова, најмање у серији, и три обвојнице.',
    en: 'A halo around the moon forms when light refracts through ice crystals in high clouds, always at an angle of 22°. Here only 15 rings, the fewest in the series, and three envelopes.',
  },

  // ---- Хопф
  snop: {
    sr: 'Хајнц Хопф је 1931. показао да се тросфера, сфера у четири димензије, може поделити на кругове од којих је сваки уланчан са сваким другим. Стереографска пројекција их спушта у наш простор, где леже на угнежђеним торусима.',
    en: 'In 1931 Heinz Hopf showed that the 3-sphere, a sphere in four dimensions, can be divided into circles that are each linked with every other. Stereographic projection brings them down into our space, where they lie on nested tori.',
  },
  dvojstvo: {
    sr: 'Исти кругови, груписани око два средишта. Исте 1931. Пол Дирак је описао магнетни монопол, а касније се показало да његова математика крије управо Хопфов сноп.',
    en: "The same circles, gathered around two centres. In the same year, 1931, Paul Dirac described the magnetic monopole, and it later turned out that his mathematics hides exactly the Hopf fibration.",
  },
  vrtlog: {
    sr: 'Овде програм бира тачке на сфери по спирали, па се њихови кругови у пројекцији увлаче ка средини. Сваки круг и даље пролази кроз сваки други, ма колико се спирала збила.',
    en: 'Here the program picks points on the sphere along a spiral, so their circles draw inwards in the projection. Every circle still passes through every other, however tightly the spiral winds.',
  },
  caura: {
    sr: 'Исти сноп гледан са стране, па се торуси издужују у чауру. Свилена буба плете чауру од једне нити, а овде је сваки прстен засебан круг из четврте димензије.',
    en: 'The same fibration seen from the side, so the tori stretch into a cocoon. A silkworm spins its cocoon from one thread; here every ring is a separate circle from the fourth dimension.',
  },

  // ---- Објекти
  stanica: {
    sr: 'Сфера се не може покрити само шестоугловима: увек треба тачно дванаест петоуглова, као на фудбалској лопти. То правило важи и за Голдбергове полиедре из 1937. и за љуске многих вируса.',
    en: 'A sphere cannot be covered with hexagons alone: it always takes exactly twelve pentagons, as on a football. The rule holds for Goldberg polyhedra of 1937 and for the shells of many viruses.',
  },
  anomalija: {
    sr: 'Слика је сабрана од милиона честица, као ефекат „Генезис“ из филма „Звездане стазе II“ (1982), за који је Вилијам Ривс осмислио системе честица. Нишан и подаци око планете су слој инструмента: показују шта систем мери.',
    en: 'The picture is built from millions of particles, like the Genesis effect in Star Trek II (1982), for which William Reeves invented particle systems. The reticle and data around the planet are the instrument layer: they show what the system is measuring.',
  },
};
