import React, { MutableRefObject, ReactNode, useContext } from 'react';
import { SchemaForUI, Size, getFallbackFontName } from '@spursjp/pdfme-common';
import { FontContext } from '../contexts';
import { ZOOM, RULER_HEIGHT } from '../constants';

const Paper = (porps: {
  paperRefs: MutableRefObject<HTMLDivElement[]>;
  scale: number;
  size: Size;
  schemasList: SchemaForUI[][];
  pageSizes: Size[];
  bgSize: Size;
  tonboSize: Size;
  backgrounds: string[];
  specification: string;
  renderPaper?: (arg: { index: number; paperSize: Size }) => ReactNode;
  renderSchema: (arg: { index: number; schema: SchemaForUI }) => ReactNode;
}) => {
  const {
    paperRefs,
    scale,
    size,
    schemasList,
    pageSizes,
    backgrounds,
    bgSize,
    tonboSize,
    specification,
    renderPaper,
    renderSchema,
  } = porps;
  const font = useContext(FontContext);

  if (pageSizes.length !== backgrounds.length || pageSizes.length !== schemasList.length) {
    return null;
  }

  const getDividerClass = () => {
    if (specification === 'z1') {
      return 'divied-line line-z';
    } else if (specification === 'z2') {
      return 'divied-line line-z';
    } else {
      if (specification === 'v1') {
        return 'divied-line line-v1';
      }
      return 'divied-line line-v2';
    }
  };

  const getNorishiroClass = () => {
    if (specification === 'z1') {
      return 'norishiro norishiro-z1';
    } else if (specification === 'z2') {
      return 'norishiro norishiro-z2';
    } else {
      if (specification === 'v1') {
        return 'norishiro norishiro-v1';
      }
      return 'norishiro norishiro-v2';
    }
  };

  return (
    <div
      style={{
        /** transform: `scale(${scale})`, **/
        transformOrigin: 'center top',
      }}
    >
      {backgrounds.map((background, paperIndex) => {
        //const pageSize = pageSizes[paperIndex];
        const paperSize = bgSize
          ? { width: bgSize.width, height: bgSize.height }
          : pageSizes[paperIndex];
        const pageSize = {
          width: paperSize.width - 2 * tonboSize.width,
          height: paperSize.height - 2 * tonboSize.height,
        };
        const top = tonboSize ? -1 * tonboSize.height : 0;
        const left = tonboSize ? -1 * tonboSize.width : 0;
        const adjust_h = pageSize.height;
        const adjust_w = pageSize.width;
        return (
          <div
            key={paperIndex}
            style={{
              width: `${adjust_w}px`,
              height: `${adjust_h}px`,
              position: 'relative',
              margin: '0 auto',
              overflow: 'hidden',
            }}
          >
            <div
              id={`@pdfme/ui-paper${paperIndex}`}
              key={paperIndex + JSON.stringify(paperSize)}
              ref={(e) => {
                if (e) {
                  paperRefs.current[paperIndex] = e;
                }
              }}
              onClick={(e) => {
                if (
                  e.currentTarget === e.target &&
                  document &&
                  document.hasFocus() &&
                  document.activeElement instanceof HTMLElement
                ) {
                  document.activeElement.blur();
                }
              }}
              style={{
                fontFamily: `'${getFallbackFontName(font)}'`,
                top: `${top}px`,
                left: `${left}px`,
                position: 'absolute',
                backgroundImage: `url(${background})`,
                backgroundSize: `${paperSize.width}px ${paperSize.height}px`,
                ...paperSize,
              }}
            >
              {renderPaper && renderPaper({ paperSize, index: paperIndex })}
              {schemasList[paperIndex].map((schema, schemaIndex) => {
                return (
                  <div key={schema.id}>
                    {renderSchema({
                      schema,
                      index:
                        paperIndex === 0
                          ? schemaIndex
                          : schemaIndex + schemasList[paperIndex - 1].length,
                    })}
                  </div>
                );
              })}
            </div>
            <div className={getNorishiroClass()}>
              <div>印刷不可</div>
              <div className="uniqid-box"></div>
            </div>
            <div className={getDividerClass()}></div>
          </div>
        );
      })}
    </div>
  );
};

export default Paper;
