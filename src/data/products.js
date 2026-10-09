// Product catalogue - single source of truth for the shop and for scripts/render-assets.mjs.
// `style` + `variant` + `palette` + `seed` reproduce each artwork exactly in ../waveform-poster.

export const SERIES = [
  { key: 'structure', slug: 'struktura' },
  { key: 'flux', slug: 'tok' },
  { key: 'city', slug: 'grad' },
  { key: 'ridges', slug: 'grebeni' },
  { key: 'orbit', slug: 'orbita' },
];

const p = (slug, style, seed, variant, palette, sr, en, lineSr, lineEn) =>
  ({ slug, style, seed, variant, palette, name: { sr, en }, line: { sr: lineSr, en: lineEn } });

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
    'Спектрограм претворен у град. Свака кула је фреквенција, свако светло - тренутак.',
    'A spectrogram turned into a city. Every tower a frequency, every light a moment.'),
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
];

export const productsBySeries = (key) => PRODUCTS.filter((x) => x.style === key);
export const seriesOf = (product) => SERIES.find((s) => s.key === product.style);
export const findProduct = (slug) => PRODUCTS.find((x) => x.slug === slug);
export const pad = (n) => String(n).padStart(5, '0');
