import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const publicUrl = 'https://daviddevxpe.github.io/';
const projectDemos = [
    ['Pokédex App', 'https://pokedex08.netlify.app/'],
    ['Rick and Morty App', 'https://rickandmorty99.netlify.app/'],
    ['ATMOS', 'https://atmos-clima.netlify.app/']
];
const errors = [];

const readProjectFile = (relativePath) =>
    readFile(path.join(projectRoot, relativePath), 'utf8');

const assert = (condition, message) => {
    if (!condition) errors.push(message);
};

const [indexHtml, notFoundHtml, css, mainJavaScript, robots, sitemap, readme] = await Promise.all([
    readProjectFile('index.html'),
    readProjectFile('404.html'),
    readProjectFile('css/styles.css'),
    readProjectFile('js/main.js'),
    readProjectFile('robots.txt'),
    readProjectFile('sitemap.xml'),
    readProjectFile('README.md')
]);

try {
    new vm.Script(mainJavaScript, { filename: 'js/main.js' });
} catch (error) {
    errors.push(`JavaScript inválido: ${error.message}`);
}

const structuredDataMatch = indexHtml.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
);

assert(structuredDataMatch, 'No se encontraron datos estructurados JSON-LD.');

if (structuredDataMatch) {
    try {
        const structuredData = JSON.parse(structuredDataMatch[1]);
        const types = structuredData['@graph']?.map((item) => item['@type']) ?? [];
        assert(types.includes('Person'), 'JSON-LD no contiene una entidad Person.');
        assert(types.includes('WebSite'), 'JSON-LD no contiene una entidad WebSite.');
    } catch (error) {
        errors.push(`JSON-LD inválido: ${error.message}`);
    }
}

assert(
    indexHtml.includes(`<link rel="canonical" href="${publicUrl}">`),
    'La URL canónica no coincide con la URL pública.'
);
assert(!indexHtml.includes('daviddevx.com'), 'index.html contiene el dominio anterior.');
assert(!robots.includes('daviddevx.com'), 'robots.txt contiene el dominio anterior.');
assert(!sitemap.includes('daviddevx.com'), 'sitemap.xml contiene el dominio anterior.');
assert(robots.includes(`${publicUrl}sitemap.xml`), 'robots.txt no enlaza el sitemap público.');
assert(sitemap.includes(`<loc>${publicUrl}</loc>`), 'sitemap.xml no contiene la URL pública.');
assert(sitemap.includes('<urlset'), 'sitemap.xml no contiene un elemento urlset.');

for (const [projectName, demoUrl] of projectDemos) {
    const indexOccurrences = indexHtml.split(demoUrl).length - 1;
    assert(
        indexOccurrences >= 2,
        `${projectName} debe enlazar su demo oficial desde la tarjeta y el caso de estudio.`
    );
    assert(
        readme.includes(`](${demoUrl})`),
        `README.md no enlaza la demo oficial de ${projectName}.`
    );
}

assert(
    !/\.vercel\.app/i.test(`${indexHtml}\n${readme}`),
    'El portafolio contiene un dominio antiguo de Vercel.'
);
assert(
    !/\bVercel(?: Functions)?\b/i.test(indexHtml),
    'index.html contiene referencias de despliegue antiguas a Vercel.'
);
assert(
    !/<div\b(?=[^>]*\baria-label=)(?![^>]*\brole=)[^>]*>/i.test(indexHtml),
    'index.html contiene un div con aria-label pero sin un rol semántico.'
);

for (const [name, document] of [
    ['index.html', indexHtml],
    ['404.html', notFoundHtml]
]) {
    const ids = [...document.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    assert(
        duplicateIds.length === 0,
        `${name} contiene IDs duplicados: ${[...new Set(duplicateIds)].join(', ')}`
    );
}

const localReferences = new Set();

for (const document of [indexHtml, notFoundHtml]) {
    for (const match of document.matchAll(/(?:src|href)="([^"]+)"/g)) {
        const reference = match[1];
        if (/^(?:https?:|mailto:|tel:|#)/.test(reference)) continue;

        const normalizedReference = reference
            .split(/[?#]/, 1)[0]
            .replace(/^\/+/, '');

        if (normalizedReference) localReferences.add(normalizedReference);
    }
}

for (const reference of localReferences) {
    try {
        await access(path.join(projectRoot, reference), constants.R_OK);
    } catch {
        errors.push(`Recurso local inexistente: ${reference}`);
    }
}

const openingBraces = (css.match(/\{/g) ?? []).length;
const closingBraces = (css.match(/\}/g) ?? []).length;
assert(openingBraces === closingBraces, 'Las llaves del archivo CSS no están balanceadas.');

if (errors.length > 0) {
    console.error('\nLa validación encontró problemas:\n');
    errors.forEach((error) => console.error(`  ✗ ${error}`));
    console.error('');
    process.exitCode = 1;
} else {
    console.log('✓ JavaScript válido');
    console.log('✓ SEO y datos estructurados correctos');
    console.log(`✓ ${projectDemos.length} demos oficiales configuradas en Netlify`);
    console.log(`✓ ${localReferences.size} recursos locales disponibles`);
    console.log('✓ IDs únicos y CSS balanceado');
    console.log('\nEl portafolio está listo para publicarse.');
}
