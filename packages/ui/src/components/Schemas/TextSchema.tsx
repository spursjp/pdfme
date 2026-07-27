import React, { useContext, forwardRef, Ref, useState, useEffect } from 'react';
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_ALIGNMENT,
  DEFAULT_LINE_HEIGHT,
  DEFAULT_CHARACTER_SPACING,
  DEFAULT_FONT_COLOR,
  TextSchema,
  calculateDynamicFontSize,
} from '@spursjp/pdfme-common';
import { SchemaUIProps } from './SchemaUI';
import { ZOOM } from '../../constants';
import { FontContext } from '../../contexts';


type Props = SchemaUIProps & { schema: TextSchema };

const TextSchemaUI = (
  { schema, editable, placeholder, tabIndex, onChange }: Props,
  ref: Ref<HTMLTextAreaElement>
) => {
  const font = useContext(FontContext);


  const [dynamicFontSize, setDynamicFontSize] = useState<number | undefined>(undefined);

  const [data, setData] = useState<string | null>(null);
  const [dummy, setDummy] = useState<string | null>(null);

  useEffect(() => {
    if (schema.dynamicFontSize && schema.data) {
      calculateDynamicFontSize({ textSchema: schema, font, input: schema.data }).then(setDynamicFontSize)
    } else {
      setDynamicFontSize(undefined);
    }
  }, [schema.data, schema.width, schema.fontName, schema.fontSize, schema.dynamicFontSize, schema.dynamicFontSize?.max, schema.dynamicFontSize?.min, schema.characterSpacing, font]);

  useEffect(() => {
    if(schema.data){
      const split_data = schema.data.split("|")
      setData(split_data[0])
      if(split_data.length > 0 ){
        setDummy(split_data[1])
      }else{
        setDummy(split_data[0])
      }
    }
    
  }, [schema.data])


  const style: React.CSSProperties = {
    padding: 0,
    resize: 'none',
    position: 'absolute',
    fontFamily: schema.fontName ? `'${schema.fontName}'` : 'inherit',
    height: schema.height * ZOOM,
    width: schema.width * ZOOM,
    textAlign: schema.alignment ?? DEFAULT_ALIGNMENT,
    fontSize: `${dynamicFontSize ?? schema.fontSize ?? DEFAULT_FONT_SIZE}pt`,
    letterSpacing: `${schema.characterSpacing ?? DEFAULT_CHARACTER_SPACING}pt`,
    lineHeight: `${schema.lineHeight ?? DEFAULT_LINE_HEIGHT}em`,
    whiteSpace: 'pre-line',
    wordBreak: 'break-word',
    border: 'none',
    color: schema.fontColor ? schema.fontColor : DEFAULT_FONT_COLOR,
    backgroundColor:
      schema.data && schema.backgroundColor ? schema.backgroundColor : 'rgb(242 244 255 / 75%)',
  };
  const style_text: React.CSSProperties = {
    padding: 0,
    resize: 'none',
    fontFamily: schema.fontName ? `'${schema.fontName}'` : 'inherit',
    height: schema.height * ZOOM,
    width: schema.width * ZOOM,
    textAlign: schema.alignment ?? DEFAULT_ALIGNMENT,
    fontSize: `${dynamicFontSize ?? schema.fontSize ?? DEFAULT_FONT_SIZE}pt`,
    letterSpacing: `${schema.characterSpacing ?? DEFAULT_CHARACTER_SPACING}pt`,
    lineHeight: `${schema.lineHeight ?? DEFAULT_LINE_HEIGHT}em`,
    whiteSpace: 'pre-line',
    wordBreak: 'break-word',
    border: 'none',
    color: schema.fontColor ? schema.fontColor : DEFAULT_FONT_COLOR,
    backgroundColor:
      schema.data && schema.backgroundColor ? schema.backgroundColor : 'rgb(242 244 255 / 75%)',
  };

  const changeHandler = (e:any) => {
    //onChange(e.target.value)
  }

  return editable ? (
    <textarea
      ref={ref}
      placeholder={placeholder}
      tabIndex={tabIndex}
      style={style_text}
      onChange={(e) => changeHandler(e) }
      value={schema.data}
    ></textarea>
  ) : (
    <div className="dummy_padding">
       <div style={style} className="pdfme-item-over-wrap pdfme-dummy" id={"pefme-text-" + schema.name}>
      {/*  Set the letterSpacing of the last character to 0. */}
      {dummy ? dummy.split('').map((l:any, i:any) => (
        <span
          key={i}
          style={{
            letterSpacing: String(dummy).length === i + 1 ? 0 : 'inherit',
          }}
        >
          {l}
        </span>
      )): null}
    </div>

    <div style={style} className="pdfme-item-over-wrap" id={"real-pefme-text-" + schema.name}>
      {/*  Set the letterSpacing of the last character to 0. */}
      {data ? data.split('').map((l:any, i:any) => (
        <span
          key={i}
          style={{
            letterSpacing: String(schema.data).length === i + 1 ? 0 : 'inherit',
          }}
        >
          {l}
        </span>
      )): null}
    </div>


    </div>
    
    
  );
};

export default forwardRef<HTMLTextAreaElement, Props>(TextSchemaUI);
