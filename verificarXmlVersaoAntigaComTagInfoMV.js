import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import { DOMParser } from 'xmldom';

const pastaZips = 'C:\\Users\\gabriel.meira\\Documents\\xml\\ITAIGARA';

function verificaEvtDeslig(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  const evtDeslig = xmlDoc.getElementsByTagName('evtDeslig')[0];
  if (!evtDeslig) return false;

  const infoMV = evtDeslig.getElementsByTagName('infoMV')[0];
  return !!infoMV;
}

function procurarXMLComInfoMV() {
  const arquivosZip = fs.readdirSync(pastaZips).filter(arq => arq.endsWith('.zip'));

  for (const nomeZip of arquivosZip) {
    const caminhoZip = path.join(pastaZips, nomeZip);

    console.log(`Abrindo ZIP: ${nomeZip}`);

    const zip = new AdmZip(caminhoZip);

    try {
      const entradas = zip.getEntries();

      for (const entrada of entradas) {
        if (entrada.entryName.endsWith('.xml')) {
          const xmlString = entrada.getData().toString('utf8');

          if (verificaEvtDeslig(xmlString)) {
            console.log('Encontrado!');
            console.log(`ZIP: ${nomeZip}`);
            console.log(`XML: ${entrada.entryName}`);

            zip.deleteFile(entrada.entryName);
            return;
          }
        }
      }
    } catch (err) {
      console.error(`Erro ao processar ${nomeZip}:`, err.message);
    } finally {
      zip.entries = [];
      global.gc?.(); // Força GC se o Node for iniciado com --expose-gc
    }

    console.log(`Finalizado e liberado da memória: ${nomeZip}`);
  }

  console.log('Nenhum arquivo com <evtDeslig> e <infoMV> foi encontrado.');
}

procurarXMLComInfoMV();
