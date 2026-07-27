import React from 'react';
import Designer from './Designer';
import { DesignerProps, Size } from '@spursjp/pdfme-common';
import { ZOOM } from './constants';

class DesignerV extends Designer {
  override bgSize?: Size;
  override tonboSize?: Size;
  override specification: string;

  constructor(props: DesignerProps) {
    super(props);
    this.bgSize = { width: 251 * ZOOM, height: 204 * ZOOM };
    this.tonboSize = { width: 28 * ZOOM, height: 28 * ZOOM };
    this.specification = 'v';
  }

  public setSpecification(s: string) {
    this.specification = s;
  }
}

export default DesignerV;

/**
 * this.bgSize = { width: 953.8, height: 775.2 };
    this.tonboSize = { width: 106.4, height: 106.4 };
 */
