# Daily guide queue

The daily job takes the first unchecked line, writes that guide, publishes it and checks the line with the date and the URL.
Format: slug | target searches (Etsy tag where it came from) | pieces to show (product slugs) | angle.
Rules: one guide = one search intent. Never write a topic an existing guide already answers (see `GUIDES` in src/data/guides.ts). Skip a line (mark `SKIPPED: reason`) if its pieces no longer exist or the angle would repeat another guide.
Claude may add new lines at the end from Search Console queries (positions 5-30 with impressions and no matching page).

## Queue
- [x] sound-wave-art | sound wave art, spectrogram, music wall art, gift for musician (Etsy) | tiha-oluja, nulta-orbita, metropola | waveform vs spectrogram, harmonics, envelope - DONE 2026-11-14 https://rezonanca.art/guide/sound-wave-art/
- [ ] clifford-attractor | clifford attractor, clifford attractor equation, strange attractor (Etsy) | klifordov-veo, de-zong | the two-line map, what a b c d do, link to /play/ to try it live (Show HN 17-18 Nov)
- [ ] double-pendulum | double pendulum, double pendulum chaos, chaos theory art (Etsy) | chaos-1, chaos-2, chaos-3 | why two linked pendulums are chaotic, the equations, sensitivity to start; series has no guide yet, use series: 'chaos'
- [ ] lorenz-attractor | lorenz attractor, lorenz system equations, butterfly effect | lorenc | sigma rho beta, what each does, how it is plotted; deeper than the strange attractor guide section
- [ ] algorithmic-art | algorithmic art (Etsy), algorithmic art history, art made with code | drvo-signala, aurora, metropola | Vera Molnar, Frieder Nake, Manfred Mohr, plotters; what an algorithm adds; never say "generative"
- [ ] gifts-for-programmers | gift for programmer (Etsy), gifts for software engineers, gifts for developers | klifordov-veo, drvo-signala, metropola, lorenc | art whose code is printed on the product page; desk and office angle; different from math-gifts (which covers mathematicians broadly), link to it
- [ ] circle-inversion | circle inversion, inversion geometry art | inversion-1, inversion-2, inversion-3 | what inverting in a circle does, lines to circles; series has no guide yet, use series: 'inversion'
- [ ] chaos-theory-art | chaos theory art (Etsy), chaos theory poster, chaos art | lorenc, chaos-1, tomas | what makes art "chaotic" in the maths sense, three kinds of chaos we draw (flows, maps, pendulum); link to the strange attractor guide for theory
- [ ] flow-field-art | flow field art (Etsy), flow field, vector field art | aurora, svila, vodopad | vector field, particles following it, noise-driven fields; link to Perlin noise guide
- [ ] de-jong-attractor | peter de jong attractor, de jong attractor | de-zong, klifordov-veo | the map, parameters, how it differs from Clifford
- [ ] physics-posters | physics poster (Etsy), physics wall art, physics art | lorenc, chaos-1, snop, metropola | real physics behind each: convection, pendulum, 3-sphere, sound
- [ ] cyberpunk-wall-art | cyberpunk art, cyberpunk city (Etsy), cyberpunk wall art | metropola, orbitalni-grad, ponoc, predajnik, galaksija | neon on dark, city skylines from spectrograms; how to style a room
- [ ] butterfly-effect | butterfly effect, butterfly effect meaning, butterfly effect chaos | lorenc, chaos-2 | Lorenz 1972 talk, sensitivity, Lyapunov in plain words, misconceptions
- [ ] aizawa-attractor | aizawa attractor, aizawa attractor equations | aizava | the six parameters, sphere-with-tube shape
- [ ] math-wall-art | math wall art, math poster (Etsy), math art print (Etsy) | brot (mandelbrotov-skup), lorenc, snop, perje | choosing maths art for a home or office: which kinds, sizes, colours
- [ ] recursive-art | recursive art (Etsy), recursion art, L-system | drvo-signala, predajnik, galaksija | Lindenmayer rules, recursion explained with one rule; series structure
- [ ] julia-set | julia set, julia set vs mandelbrot set | mandelbrotov-skup, dolina-morskih-konjica | fixed c vs varying c, the map between them
- [ ] abstract-line-art | abstract line art (Etsy), line art poster (Etsy), abstract line art print | aurora, dvostruka-spirala, beskonacnost, horizont | lines from equations, why thin lines read as light
- [ ] gifts-for-physicists | gift for physicist (Etsy), gifts for physics teachers | lorenc, chaos-1, snop, metropola | gift angle only, link physics-posters + math-gifts
- [ ] thomas-attractor | thomas attractor, thomas cyclically symmetric attractor | tomas | René Thomas, b parameter, labyrinth chaos
- [ ] space-wall-art | space wall art (Etsy), sci fi wall art (Etsy), sci fi poster | stanica, anomalija, supernova, dvojna-zvezda, crvotocina | sci-fi and space drawn from maths, not photos
- [ ] dark-wall-art | dark wall art (Etsy), dark aesthetic wall art | ponoc, lorenc, dim, oreol | why dark grounds make glowing lines work; styling a dark wall
- [ ] fractal-dimension | fractal dimension, box counting dimension | vitica, lorenc, perje | how a shape can have dimension 1.26 or 2.06, box counting
- [ ] halvorsen-attractor | halvorsen attractor | halvorsen | the cyclic equations, three-lobed shape
- [ ] lyapunov-exponent | lyapunov exponent, lyapunov exponent explained | lorenc, tomas | how we measure it while drawing, numbers from src/data/math
- [ ] chaos-game | chaos game, sierpinski triangle chaos game | perje, dim | random jumps that draw a fractal; leads into fractal flames guide
- [ ] seahorse-valley | seahorse valley mandelbrot | dolina-morskih-konjica | where it is, coordinates, why spirals form
- [ ] rossler-attractor | rossler attractor | resler | simplest chaotic flow, one nonlinear term
- [ ] office-wall-art | office wall art (Etsy), home office art | metropola, lorenc, svila | art for desks and video calls, size by wall
- [ ] four-dimensional-art | 4d art, 4d geometry art, 3-sphere | snop, dvojstvo, vrtlog, caura | seeing 4D through projections; link Hopf guide
- [ ] stereographic-projection | stereographic projection | snop, inversion-2 | the projection that maps a sphere to a plane, used in Hopf and inversion
- [ ] fourier-transform | fourier transform explained, fourier series | metropola, tiha-oluja | sine waves adding up; link sound-wave-art
- [ ] complex-numbers-mandelbrot | complex numbers explained, complex plane | mandelbrotov-skup, spirala | the arithmetic behind z² + c
- [ ] barnsley-fern | barnsley fern, iterated function system | perje, ruza | four affine maps draw a fern
- [ ] edward-lorenz | edward lorenz | lorenc | the man, the 1963 paper, the rounding error story
- [ ] benoit-mandelbrot | benoit mandelbrot | mandelbrotov-skup | life, IBM, the 1982 book
- [ ] chen-attractor | chen attractor | cen | dual of Lorenz
- [ ] dadras-attractor | dadras attractor | dadras | (Search Console query, position 7)
- [ ] sprott-attractor | sprott attractor | sprot | Sprott's search for the simplest chaotic flows
- [ ] rabinovich-fabrikant | rabinovich fabrikant equations | rabinovic | plasma waves model
- [ ] four-wing-attractor | four wing attractor | cetiri-krila | four-scroll chaos
- [ ] runge-kutta | runge kutta method explained, rk4 | lorenc, tomas | how we follow a path accurately; coder audience
- [ ] poster-size-guide | poster sizes, what size poster for wall | any 4 bestsellers | our sizes in cm and inches, wall width rules; sizes from src/config.ts only
- [ ] gifts-for-musicians | gift for musician (Etsy) | tiha-oluja, nulta-orbita, metropola | gift angle; link sound-wave-art
- [ ] gifts-for-engineers | gift for engineer (Etsy) | metropola, drvo-signala, lorenc | gift angle; link math-gifts
- [ ] koch-snowflake | koch snowflake | vitica | the first fractal curve, perimeter vs area
