// Product catalogue - single source of truth for the shop and for scripts/render-assets.mjs.
// `style` + `variant` + `palette` + `seed` reproduce each artwork exactly in ../waveform-poster.

export const SERIES = [
  { key: 'attractor', slug: 'atraktori' },
  { key: 'mandelbrot', slug: 'mandelbrot' },
  { key: 'flame', slug: 'plamen' },
  { key: 'structure', slug: 'struktura' },
  { key: 'flux', slug: 'tok' },
  { key: 'city', slug: 'grad' },
  { key: 'ridges', slug: 'grebeni' },
  { key: 'orbit', slug: 'orbita' },
  { key: 'hopf', slug: 'hopf' },
  { key: 'object', slug: 'objekti' },
];

const p = (slug, style, seed, variant, palette, sr, en, lineSr, lineEn) =>
  ({ slug, style, seed, variant, palette, name: { sr, en }, line: { sr: lineSr, en: lineEn } });
// pa(): artwork rendered by explore/apstrakt/apstrakt.html instead of the poster generator.
const pa = (slug, style, seed, variant, palette, render, sr, en, lineSr, lineEn) => ({ ...p(slug, style, seed, variant, palette, sr, en, lineSr, lineEn), render });

export const PRODUCTS = [
  // ---- Структура
  p('predajnik', 'structure', 2, 'burst', 'cyan', 'Предајник', 'Transmitter',
    'Хиљаде зрака из једног језгра - сигнал који емитује у свим правцима одједном.',
    'Thousands of rays from a single core - a signal broadcasting in every direction at once.'),
  p('galaksija', 'structure', 4, 'spiral', 'violet', 'Галаксија', 'Galaxy',
    'Сваки зрак се увија у истом смеру, док се звук не претвори у спиралну галаксију.',
    'Every ray curls the same way, until the sound becomes a spiral galaxy.'),
  p('drvo-signala', 'structure', 4, 'tree', 'aurora', 'Дрво сигнала', 'Signal Tree',
    'Из једног корена, сигнал расте и грана се као живо биће од светлости.',
    'From a single root, the signal grows and branches like a living thing made of light.'),
  p('dvojna-zvezda', 'structure', 7, 'twin', 'cyan', 'Двојна звезда', 'Binary Star',
    'Два језгра, једна фреквенција. Поља силе што их вежу једно за друго.',
    'Two cores, one frequency. Field lines binding them to each other.'),
  p('dajsonova-sfera', 'structure', 4, 'shell', 'ember', 'Дајсонова сфера', 'Dyson Sphere',
    'Прстенови светлости саграђени око звезде - архитектура цивилизације која слуша.',
    'Rings of light built around a star - the architecture of a civilisation that listens.'),
  p('supernova', 'structure', 8, 'burst', 'ice', 'Супернова', 'Supernova',
    'Тренутак пре тишине. Сребрни бљесак замрзнут у милисекунди експлозије.',
    'The instant before silence. A silver flash frozen in the millisecond of the blast.'),

  // ---- Ток
  p('aurora', 'flux', 5, 'column', 'aurora', 'Аурора', 'Aurora',
    'Поларна светлост ухваћена у покрету - завеса таласа што се спушта кроз ноћ.',
    'Polar light caught in motion - a curtain of waves falling through the night.'),
  p('dvostruka-spirala', 'flux', 4, 'helix', 'cyan', 'Двострука спирала', 'Double Helix',
    'Две нити сигнала уплетене једна око друге - ДНК звука.',
    'Two strands of signal wound around each other - the DNA of sound.'),
  p('horizont', 'flux', 4, 'horizon', 'violet', 'Хоризонт', 'Horizon',
    'Трака светлости развучена преко целог неба, као линија где звук додирује тишину.',
    'A ribbon of light stretched across the sky, where sound meets silence.'),
  p('beskonacnost', 'flux', 4, 'loop', 'ice', 'Бесконачност', 'Infinity',
    'Сигнал који се враћа сам у себе. Осмица без почетка и краја.',
    'A signal that returns to itself. A figure eight with no beginning and no end.'),
  p('vodopad', 'flux', 4, 'cascade', 'cyan', 'Водопад', 'Waterfall',
    'Три тока светлости падају упоредо, свака у свом ритму.',
    'Three streams of light falling side by side, each in its own rhythm.'),
  p('svila', 'flux', 9, 'column', 'ember', 'Свила', 'Silk',
    'Ћилибарна нит кроз плаву ноћ - топлина звука у хладном простору.',
    'An amber thread through a blue night - the warmth of sound in cold space.'),

  // ---- Град
  p('metropola', 'city', 3, 'grid', 'cyan', 'Метропола', 'Metropolis',
    'Спектрограм претворен у град.',
    'A spectrogram turned into a city.'),
  p('orbitalni-grad', 'city', 4, 'round', 'violet', 'Орбитални град', 'Orbital City',
    'Кружни град око тихог трга и једне куле у средишту - станица у орбити.',
    'A circular city around a quiet plaza and one central spire - a station in orbit.'),
  p('kanjon', 'city', 4, 'canyon', 'aurora', 'Кањон', 'Canyon',
    'Два зида звука и долина између њих која води право ка теби.',
    'Two walls of sound and the valley between them, leading straight to you.'),
  p('kula', 'city', 4, 'spire', 'ember', 'Кула', 'Tower',
    'Једна фреквенција надвисује све остале и светли изнад града.',
    'One frequency towers over the rest and shines above the city.'),
  p('talas', 'city', 4, 'wave', 'cyan', 'Талас', 'Wave',
    'Град који се таласа као звук - улице што се дижу и спуштају у ритму.',
    'A city that ripples like sound - streets rising and falling in rhythm.'),
  p('ponoc', 'city', 6, 'dense', 'ice', 'Поноћ', 'Midnight',
    'Хиљаде малих зграда у сребрној тишини. Град у три ујутру.',
    'Thousands of small buildings in silver silence. The city at 3 a.m.'),

  // ---- Атрактори
  p('lorenc', 'attractor', 1, 'lorenz', 'cyan', 'Лоренц', 'Lorenz',
    'Лептир који је изазвао олују. Три једначине за атмосферу, и ниједна путања се никад не понови.',
    'The butterfly that started a storm. Three equations for the atmosphere, and no path ever repeats.'),
  p('aizava', 'attractor', 1, 'aizawa', 'violet', 'Аизава', 'Aizawa',
    'Сфера исплетена из једне нити, пробијена цеви кроз средину. Кретање које никад не стаје на исто место.',
    'A sphere woven from a single thread, pierced by a tube through its heart. Motion that never lands in the same place.'),
  p('tomas', 'attractor', 2, 'thomas', 'aurora', 'Томас', 'Thomas',
    'Честица у лавиринту синусних таласа. Најједноставније могуће једначине, најсложенији могући пут.',
    'A particle in a labyrinth of sine waves. The simplest possible equations, the most tangled possible path.'),
  p('halvorsen', 'attractor', 2, 'halvorsen', 'ember', 'Халворсен', 'Halvorsen',
    'Три крила савијена једно око другог, симетрија која се руши сваког тренутка.',
    'Three wings folded around each other, a symmetry breaking in every instant.'),
  p('klifordov-veo', 'attractor', 1, 'clifford', 'ice', 'Клифордов вео', "Clifford's Veil",
    'Милиони тачака, свака израчуната из претходне. Заједно цртају тканину коју нико није дизајнирао.',
    'Millions of points, each computed from the last. Together they draw a fabric no one designed.'),
  p('de-zong', 'attractor', 3, 'dejong', 'cyan', 'Де Жонг', 'De Jong',
    'Четири броја и две једначине. Петља светлости која се враћа, а никад не затвара.',
    'Four numbers and two equations. A loop of light that keeps returning but never closes.'),

  // ---- Манделброт
  p('mandelbrotov-skup', 'mandelbrot', 1, 'full', 'cyan', 'Манделбротов скуп', 'The Mandelbrot Set',
    'z² + c. Најпознатији облик у математици, бесконачна обала око једног острва.',
    'z² + c. The most famous shape in mathematics, an infinite coastline around a single island.'),
  p('dolina-morskih-konjica', 'mandelbrot', 1, 'seahorse', 'violet', 'Долина морских коњица', 'Seahorse Valley',
    'Хиљаду пута увеличано. Спирале које се увијају у спирале, док се не изгубиш.',
    'Magnified a thousand times. Spirals curling into spirals until you lose your way.'),
  p('spirala', 'mandelbrot', 1, 'spiral', 'aurora', 'Спирала', 'Spiral',
    'Дубоко у пукотини скупа, вртлог који никад не стиже до дна.',
    'Deep in a crack of the set, a whirlpool that never reaches the bottom.'),
  p('mali-mandelbrot', 'mandelbrot', 1, 'minibrot', 'ember', 'Мали Манделброт', 'Minibrot',
    'На крају дугачке антене, савршена копија целог скупа. Бесконачност у малом.',
    'At the end of the long antenna, a perfect copy of the whole set. Infinity in miniature.'),
  p('vitica', 'mandelbrot', 1, 'tendril', 'ice', 'Витица', 'Tendril',
    'Танке гране леда што расту из севера скупа, свака са истим обликом као цела.',
    'Thin branches of ice growing from the north of the set, each one shaped like the whole.'),
  p('morska-zvezda', 'mandelbrot', 1, 'starfish', 'cyan', 'Морска звезда', 'Starfish',
    'Увеличано четиристо пута. Звезда од спирала, рођена из једне једначине.',
    'Magnified four hundred times. A star made of spirals, born from a single equation.'),

  // ---- Гребени (first signals)
  p('prvi-signal', 'ridges', 3, 'classic', 'cyan', 'Први сигнал', 'First Signal',
    'Рад број један. Где је Резонанца почела - планински венац звука у плавој ноћи.',
    'Piece number one. Where Rezonanca began - a mountain range of sound in a blue night.'),
  p('tiha-oluja', 'ridges', 12, 'storm', 'cyan', 'Тиха олуја', 'Silent Storm',
    'Олуја што се види, али не чује. Шум преплављује сваку линију, од ивице до ивице.',
    'A storm you can see but not hear. Noise floods every line, edge to edge.'),
  p('severni-signal', 'ridges', 14, 'drift', 'ice', 'Северни сигнал', 'Northern Signal',
    'Пријем са далеког севера - линије савијене као слојеви леда под притиском.',
    'A transmission from the far north - lines bent like layers of ice under pressure.'),
  p('magla', 'ridges', 4, 'dense', 'violet', 'Магла', 'Fog',
    'Стотину линија тако густих да постају магла - пејзаж који се назире.',
    'A hundred lines so dense they become fog - a landscape just coming into view.'),
  p('blizanci', 'ridges', 4, 'twin', 'aurora', 'Близанци', 'Twin Peaks',
    'Два врха, два гласа, исти сигнал. Дует у светлости.',
    'Two peaks, two voices, one signal. A duet in light.'),
  p('svitanje', 'ridges', 5, 'horizon', 'ember', 'Свитање', 'Dawn',
    'Врхови се дижу из ниске равнице док прво светло пада на хоризонт.',
    'Peaks rise from a low plain as the first light falls on the horizon.'),

  // ---- Орбита (first signals)
  p('nulta-orbita', 'orbit', 3, 'classic', 'cyan', 'Нулта орбита', 'Orbit Zero',
    'Други рад икада. Прстен таласа око празнине - око које гледа назад.',
    'The second piece ever. A ring of waves around the void - an eye that looks back.'),
  p('prsten-tisine', 'orbit', 16, 'turbulent', 'ice', 'Прстен тишине', 'Ring of Silence',
    'Прстенови изобличени шумом у топографску мапу тишине - земља које нема ни на једној карти.',
    'Rings warped by noise into a topographic map of silence - land found on no chart.'),
  p('magnetar', 'orbit', 21, 'shatter', 'cyan', 'Магнетар', 'Magnetar',
    'Поље толико јако да кида сопствене прстенове у лукове светлости.',
    'A field so strong it tears its own rings into arcs of light.'),
  p('pomracenje', 'orbit', 4, 'eclipse', 'ember', 'Помрачење', 'Eclipse',
    'Тренутак када сунце нестане, а остане само ватрени обод.',
    'The moment the sun disappears and only a fiery rim remains.'),
  p('crvotocina', 'orbit', 4, 'tunnel', 'violet', 'Црвоточина', 'Wormhole',
    'Прстенови што се увлаче у дубину - пролаз ка другом месту у свемиру.',
    'Rings receding into depth - a passage to somewhere else in the universe.'),
  p('oreol', 'orbit', 5, 'halo', 'aurora', 'Ореол', 'Halo',
    'Неколико светлих прстенова, мирних као ореол око месеца.',
    'A few bright rings, calm as a halo around the moon.'),
  // Rendered by explore/apstrakt/apstrakt.html (render: [mode, seed, pal]), not by waveform-poster.
  pa('resler', 'attractor', 1, 'sistem', 'aurora', ['atraktor', 1, 'aurora'], 'Реслер', 'Rössler',
    'Спирала која се увија у пераје, најједноставнији хаос: само једна нелинеарна чланица у три једначине.',
    'A spiral that curls into a fin, the simplest chaos: a single non-linear term in three equations.'),
  pa('cen', 'attractor', 2, 'sistem', 'ember', ['atraktor', 2, 'zar'], 'Чен', 'Chen',
    'Оштра крила која се савијају једно око другог, рођак Лоренцовог атрактора.',
    'Sharp wings folding around each other, a cousin of the Lorenz attractor.'),
  pa('dadras', 'attractor', 3, 'sistem', 'aurora', ['atraktor', 3, 'aurora'], 'Дадрас', 'Dadras',
    'Вртлог који се на средини пресавија, као трака светлости ухваћена у ветру.',
    'A vortex that folds in the middle, like a ribbon of light caught in the wind.'),
  pa('sprot', 'attractor', 4, 'sistem', 'violet', ['atraktor', 4, 'ponoc'], 'Спрот', 'Sprott',
    'Облик медузе са таласом кроз средину, из каталога најједноставнијих хаотичних система.',
    'A jellyfish shape with a wave through its middle, from a catalogue of the simplest chaotic systems.'),
  pa('rabinovic', 'attractor', 5, 'sistem', 'ember', ['atraktor', 5, 'zar'], 'Рабинович', 'Rabinovich',
    'Шкољка од хиљада петљи, систем Рабиновича и Фабриканта из физике плазме.',
    'A shell of thousands of loops, the Rabinovich-Fabrikant system from plasma physics.'),
  pa('cetiri-krila', 'attractor', 6, 'sistem', 'aurora', ['atraktor', 6, 'aurora'], 'Четири крила', 'Four Wings',
    'Четири вртлога која се преплићу у једну фигуру, као лептир у огледалу.',
    'Four vortices woven into one figure, like a butterfly in a mirror.'),
  pa('snop', 'hopf', 3, 'snop', 'ember', ['hopf', 3, 'zar'], 'Сноп', 'Fibration',
    'Угнежђени торуси од хиљада кругова, где сваки круг пролази кроз сваки други.',
    'Nested tori of thousands of circles, where every circle passes through every other.'),
  pa('dvojstvo', 'hopf', 2, 'snop', 'aurora', ['hopf', 2, 'aurora'], 'Двојство', 'Duality',
    'Два вртлога спојена једним снопом кругова, слика из четврте димензије.',
    'Two vortices joined by one bundle of circles, an image from the fourth dimension.'),
  pa('vrtlog', 'hopf', 4, 'snop', 'violet', ['hopf', 4, 'ponoc'], 'Вртлог', 'Vortex',
    'Спирала кругова која се увлачи у своју средину, мирна као цвет који се отвара.',
    'A spiral of circles drawn into its own centre, calm as a flower opening.'),
  pa('caura', 'hopf', 6, 'snop', 'aurora', ['hopf', 6, 'aurora'], 'Чаура', 'Cocoon',
    'Усправна чаура од светлих прстенова, сваки прстен један круг из четврте димензије.',
    'An upright cocoon of bright rings, each ring one circle from the fourth dimension.'),
  pa('perje', 'flame', 1, 'plamen', 'aurora', ['plamen', 1, 'aurora'], 'Перје', 'Feathers',
    'Светлост која се шири као перје, израчуната из неколико правила која се бирају насумично.',
    'Light that spreads like feathers, computed from a few rules chosen at random.'),
  pa('dim', 'flame', 3, 'plamen', 'ember', ['plamen', 3, 'zar'], 'Дим', 'Smoke',
    'Троструки облак дима око светлог средишта, са симетријом троугла.',
    'A threefold cloud of smoke around a bright core, with the symmetry of a triangle.'),
  pa('ruza', 'flame', 4, 'plamen', 'violet', ['plamen', 4, 'ponoc'], 'Ружа', 'Rose',
    'Латице од милиона тачака око топлог језгра, са петоструком симетријом.',
    'Petals of millions of points around a warm core, with fivefold symmetry.'),
  pa('vetrenjaca', 'flame', 6, 'plamen', 'aurora', ['plamen', 6, 'aurora'], 'Ветрењача', 'Pinwheel',
    'Четири крака светлости која се окрећу око средишта, као ветрењача у тами.',
    'Four arms of light turning around a centre, like a pinwheel in the dark.'),
  // Објекти: particle worlds rendered by explore/kiber/kiber.html (mode=objekat), not by waveform-poster.
  p('stanica', 'object', 8, 'objekat', 'ember', 'Станица', 'Station',
    'Хексагонални свет у плавом сјају, са ћилибарним прстеном прашине и месецима на ивици орбите.',
    'A hexagonal world in blue light, with an amber ring of dust and moons at the edge of its orbit.'),
  p('anomalija', 'object', 10, 'objekat', 'violet', 'Аномалија', 'Anomaly',
    'Неонска планета у прстену магенте, ухваћена у нишан инструмента док сигнал трепери.',
    'A neon planet inside a magenta ring, caught in an instrument\'s reticle while the signal flickers.'),
];

// Print boost per piece (0 = as rendered, up to 1.5); highlights are rolled off so nothing blows out: brightens + saturates the art for paper.
// Already-bright pieces get a light touch; the darkest get the most.
const BOOST = {
  predajnik: 0.35, galaksija: 0.5, 'drvo-signala': 0.85, 'dvojna-zvezda': 0.6, 'dajsonova-sfera': 0.5, supernova: 0.85,
  aurora: 0.6, 'dvostruka-spirala': 0.35, horizont: 0.6, beskonacnost: 0.8, vodopad: 0.5, svila: 0.7,
  metropola: 0.35, 'orbitalni-grad': 0.6, kanjon: 0.45, kula: 0.6, talas: 0.35, ponoc: 0.9,
  'prvi-signal': 0.6, 'tiha-oluja': 0.6, 'severni-signal': 0.85, magla: 0.6, blizanci: 0.7, svitanje: 0.6,
  'nulta-orbita': 0.6, 'prsten-tisine': 0.85, magnetar: 0.7, pomracenje: 1.25, crvotocina: 1.2, oreol: 1.3,
  lorenc: 0.5, aizava: 0.55, tomas: 0.55, halvorsen: 0.5, 'klifordov-veo': 0.6, 'de-zong': 0.75,
  'mandelbrotov-skup': 0.6, 'dolina-morskih-konjica': 0.55, spirala: 0.55, 'mali-mandelbrot': 0.65, vitica: 0.6, 'morska-zvezda': 0.6,
};
for (const x of PRODUCTS) x.boost = BOOST[x.slug] ?? 0.6;

// Colourways offered next to the original (generator ?tone=, see waveform-poster TONES).
// Skipped where the colourway doesn't work: fine ridge meshes turn to haze, thin single lines vanish.
// roza = deep rose ground (2026-10-11); tus = Туш, black ink on white paper (2026-10-21, light rebrand).
export const TONES = ['roza', 'tus'];
const NO_TONE = {
  roza: ['resler', 'cen', 'dadras', 'sprot', 'rabinovic', 'cetiri-krila', 'snop', 'dvojstvo', 'vrtlog', 'caura', 'perje', 'dim', 'ruza', 'vetrenjaca', 'stanica', 'anomalija', 'prvi-signal', 'tiha-oluja', 'severni-signal', 'magla', 'de-zong', 'crvotocina'],
  tus: ['magla', 'nulta-orbita', 'pomracenje', 'oreol', 'crvotocina'], // weak on white paper (Filip 2026-10-21)
};
for (const x of PRODUCTS) x.tones = TONES.filter((t) => !NO_TONE[t].includes(x.slug));
// Image file key for a product in a colourway ('' = original).
export const imgKey = (slug, tone) => (tone ? `${slug}-${tone}` : slug);

// Display order within a series (overrides definition order).
const ORDER = {
  attractor: ['tomas', 'halvorsen', 'klifordov-veo', 'de-zong', 'lorenc', 'aizava', 'resler', 'sprot', 'cetiri-krila', 'dadras', 'cen', 'rabinovic'],
};
// Which 4 pieces the homepage shows per series (default: the first 4).
const HOME_PICKS = {
  mandelbrot: ['vitica', 'dolina-morskih-konjica', 'spirala', 'morska-zvezda'],
};

export const productsBySeries = (key) => {
  const list = PRODUCTS.filter((x) => x.style === key);
  const order = ORDER[key];
  return order ? [...list].sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug)) : list;
};
export const homePicks = (key) => (HOME_PICKS[key] ? HOME_PICKS[key].map(findProduct) : productsBySeries(key).slice(0, 4));
export const seriesOf = (product) => SERIES.find((s) => s.key === product.style);
export const findProduct = (slug) => PRODUCTS.find((x) => x.slug === slug);
export const pad = (n) => String(n).padStart(5, '0');
