import { PDFDocument } from '@pdfme/pdf-lib';
import * as fontkit from 'fontkit';
import type {
  Font,
  GenerateProps,
  SchemaInputs,
  Template,
} from '@spursjp/pdfme-common';
import {
  getDefaultFont,
  getFallbackFontName,
  checkGenerateProps,
} from '@spursjp/pdfme-common';
import {
  getEmbeddedPagesAndEmbedPdfBoxes,
  drawInputByTemplateSchema,
  drawEmbeddedPage,
  embedAndGetFontObj,
  InputImageCache,
} from './helper.js';
import { TOOL_NAME } from './constants.js';

const preprocessing = async (arg: { inputs: SchemaInputs[]; template: Template; font: Font }) => {
  const { template, font } = arg;
  const { basePdf } = template;
  const fallbackFontName = getFallbackFontName(font);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const pdfFontObj = await embedAndGetFontObj({ pdfDoc, font });

  const pagesAndBoxes = await getEmbeddedPagesAndEmbedPdfBoxes({ pdfDoc, basePdf });
  const { embeddedPages, embedPdfBoxes } = pagesAndBoxes;

  return { pdfDoc, pdfFontObj, fallbackFontName, embeddedPages, embedPdfBoxes };
};



const preprocessing_s = async (arg: {pdfDoc:PDFDocument, template: Template}) => {
  const { template, pdfDoc } = arg;
  const { basePdf } = template;

  const pagesAndBoxes = await getEmbeddedPagesAndEmbedPdfBoxes({ pdfDoc, basePdf });
  const { embeddedPages, embedPdfBoxes } = pagesAndBoxes;

  return { embeddedPages, embedPdfBoxes };
};


const postProcessing = (pdfDoc: PDFDocument) => {
  pdfDoc.setProducer(TOOL_NAME);
  pdfDoc.setCreator(TOOL_NAME);
};

const generate = async (props: GenerateProps) => {
  checkGenerateProps(props);
  const { inputs, template, options = {} } = props;
  const { font = getDefaultFont() } = options;
  const {sub_page} = options
  const { schemas } = template;



  const preRes = await preprocessing({ inputs, template, font });
  
  const { pdfDoc, pdfFontObj, fallbackFontName, embeddedPages, embedPdfBoxes } = preRes;
  var  preRe_s = null
  if(sub_page){
    preRe_s = await preprocessing_s({ pdfDoc, template:sub_page });
  }


  const inputImageCache: InputImageCache = {};
  for (let i = 0; i < inputs.length; i += 1) {
    const inputObj = inputs[i];
    const keys = Object.keys(inputObj);
    for (let j = 0; j < embeddedPages.length; j += 1) {
      const embeddedPage = embeddedPages[j];
      const { width: pageWidth, height: pageHeight } = embeddedPage;
      const embedPdfBox = embedPdfBoxes[j];

      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      drawEmbeddedPage({ page, embeddedPage, embedPdfBox });
      for (let l = 0; l < keys.length; l += 1) {
        const key = keys[l];
        const schema = schemas ? schemas[j] : null;
        const templateSchema = schema ? schema[key] : null;
        const input = inputObj[key];
        const fontSetting = { font, pdfFontObj, fallbackFontName };

        await drawInputByTemplateSchema({
          input,
          templateSchema,
          pdfDoc,
          page,
          pageHeight,
          fontSetting,
          inputImageCache,
        });
      }
      if(sub_page && preRe_s){

       
      const { embeddedPages, embedPdfBoxes } = preRe_s;  
      const embeddedPage = embeddedPages[j];
      const { width: pageWidth, height: pageHeight } = embeddedPage;
      const embedPdfBox = embedPdfBoxes[j];

      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      drawEmbeddedPage({ page, embeddedPage, embedPdfBox });

        const sub_schema = sub_page.schemas

        for (let l = 0; l < keys.length; l += 1) {
          const key = keys[l];
          const schema = sub_schema ? sub_schema[j] : null;
          const templateSchema = schema ? schema[key] : null;
          const input = inputObj[key];
          const fontSetting = { font, pdfFontObj, fallbackFontName };
  
          await drawInputByTemplateSchema({
            input,
            templateSchema,
            pdfDoc,
            page,
            pageHeight,
            fontSetting,
            inputImageCache,
          });
        }
      }
    }
  }

  postProcessing(pdfDoc);

  return pdfDoc.save();
};



export default generate;
