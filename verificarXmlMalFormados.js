import AdmZip from "adm-zip";

const caminhoZip = "./competencias.zip";

function verificarTextoForaDeTags(xml) {
  const regex = /<\/[^>]+>([^<\s][^<]*)</g;

  const erros = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const textoFora = match[1].trim();
    if (textoFora) {
      erros.push(textoFora);
    }
  }

  return erros;
}

function verificarXmlsMalformados(caminhoZip) {
  const zip = new AdmZip(caminhoZip);
  const entries = zip.getEntries();

  for (const entry of entries) {
    if (!entry.entryName.endsWith(".xml")) continue;

    const conteudo = zip.readAsText(entry);
    const erros = verificarTextoForaDeTags(conteudo);

    if (erros.length > 0) {
      console.log(`Erros encontrados em: ${entry.entryName}`);
      erros.forEach(e => console.log(`Texto fora de tag: "${e}"`));
    } else {
      console.log(`${entry.entryName} está bem formado (nenhum texto solto detectado).`);
    }
  }
}

verificarXmlsMalformados(caminhoZip);
