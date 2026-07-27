import React, { useContext } from 'react';
import { SchemaForUI } from '@spursjp/pdfme-common';
import { I18nContext } from '../../../../contexts';
import Divider from '../../../Divider';
import { SidebarProps } from '../index';
import TextPropEditor from './TextPropEditor';
import ExampleInputEditor from './ExampleInputEditor';
import PositionAndSizeEditor from './PositionAndSizeEditor';
import TypeAndKeyEditor from './TypeAndKeyEditor';

const DetailView = (
  props: Pick<SidebarProps, 'schemas' | 'pageSize' | 'changeSchemas' | 'activeElements' | 'tonboSize'> & {
    activeSchema: SchemaForUI;
  }
) => {
  const { activeSchema,tonboSize } = props;
  const i18n = useContext(I18nContext);

  return (
    <div>
      <div className="title-box"style={{ height: 40, display: 'flex', alignItems: 'center' }}>
        <span style={{ textAlign: 'center', width: '100%', fontWeight: 'bold' }}>
          {i18n('editField')}
        </span>
      </div>
      
      <div className="tool-box" style={{ fontSize: '0.9rem' }}>
        <Divider />
        <PositionAndSizeEditor {...props} />
        <Divider />
        {activeSchema.type === 'text' && (
          <>
            <TextPropEditor {...props} />
            <Divider />
          </>
        )}
        {/* <ExampleInputEditor {...props} /> */}
      </div>
    </div>
  );
};

export default DetailView;
