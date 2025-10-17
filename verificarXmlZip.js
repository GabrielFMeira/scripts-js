import AdmZip from "adm-zip";
import { parseStringPromise } from "xml2js";

const caminhoZip = "./competencias.zip";
const tagProcurada = "evtPgtos";

function buscarTag(obj, tag) {
  if (typeof obj !== "object" || obj === null) return null;

  if (obj.hasOwnProperty(tag)) {
    return obj[tag];
  }

  for (const key of Object.keys(obj)) {
    const resultado = buscarTag(obj[key], tag);
    if (resultado) return resultado;
  }

  return null;
}

async function verificarXmlsNoZip(caminhoZip, tag) {
  const zip = new AdmZip(caminhoZip);
  const entries = zip.getEntries();

  for (const entry of entries) {
    if (!entry.entryName.endsWith(".xml")) continue;

    const conteudo = zip.readAsText(entry);

    try {
      const xmlObj = await parseStringPromise(conteudo);
      const resultado = buscarTag(xmlObj, tag);

      if (resultado) {
        const valor = Array.isArray(resultado) ? resultado[0] : resultado;

        if (typeof valor === "string") {
            console.log(valor);
            const regex = /^[a-z]+$/;

            if (regex.test(valor)) {
                console.log(`Valor "${valor}" é lower case.`);
            }

        } else {
            console.log(`Tag <${tag}> contém subtags ou não é texto simples.`);
        }
      } else {
        console.log(`Tag <${tag}> NÃO encontrada em: ${entry.entryName}`);
      }
    } catch (err) {
      console.error(`Erro ao ler ${entry.entryName}:`, err.message);
    }
  }
  console.log("Verificação concluída.");
}

verificarXmlsNoZip(caminhoZip, tagProcurada);
