import React from 'react';
import Designer from './Designer';
import { DesignerProps, Size } from '@spursjp/pdfme-common';
import { ZOOM } from './constants';

class DesignerZ extends Designer {
  override bgSize?: Size;
  override tonboSize?: Size;
  override specification: string;

  constructor(props: DesignerProps) {
    super(props);

    this.bgSize = { width: 346 * ZOOM, height: 204 * ZOOM };
    this.tonboSize = { width: 28 * ZOOM, height: 28 * ZOOM };
    this.specification = 'z';
  }

  public setSpecification(s: string) {
    this.specification = s;
  }
}

export default DesignerZ;
