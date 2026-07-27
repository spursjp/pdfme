import React from 'react';
import ReactDOM from 'react-dom';
import { Template, DesignerProps, checkDesignerProps, checkTemplate,Size } from '@spursjp/pdfme-common';
import { BaseUIClass } from './class';
import { DESTROYED_ERR_MSG } from './constants';
import { I18nContext, FontContext } from './contexts';
import DesignerComponent from './components/Designer/index';
import { cloneDeep } from './helper';


class Designer extends BaseUIClass {
  private onSaveTemplateCallback?: (template: Template) => void;
  private onChangeTemplateCallback?: (template: Template) => void;
  private timeoutID?:ReturnType<typeof setTimeout> ;
  bgSize?:Size;
  tonboSize?:Size
  specification:string = ""
  svg?:Object


  constructor(props: DesignerProps) {
    
    super(props);

    checkDesignerProps(props);
   
    this.render();
  }

  public saveTemplate() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    if (this.onSaveTemplateCallback) {
      this.onSaveTemplateCallback(this.template);
    }
  }

  public updateTemplate(template: Template) {
    checkTemplate(template);
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.template = cloneDeep(template);
    if (this.onChangeTemplateCallback) {
      //this.onChangeTemplateCallback(template);
    }
    this.render();
  }

  public updateHorizontalGuidelines(horizontalGuidelines: number[]) {
   
    //TODO ここで比較して違ったら、Render
    if(!this.horizontalGuidelines.every((num) => horizontalGuidelines.includes(num))){

      this.horizontalGuidelines = horizontalGuidelines
      this.render();
    }
   
  }

  public updateVerticalGuidelines(verticalGuidelines: number[]) {

     //TODO ここで比較して違ったら、Render
     if(!this.verticalGuidelines.every((num) => verticalGuidelines.includes(num))){
      this.verticalGuidelines = verticalGuidelines
      this.render();
    }
  }


  public onSaveTemplate(cb: (template: Template) => void) {
    this.onSaveTemplateCallback = cb;
  }

  public onChangeTemplate(cb: (template: Template) => void) {
    this.onChangeTemplateCallback = cb;
  }

  public changeHandler(template:Template)  {
    const p:Designer = this 
    if(this.timeoutID)
      clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(
     () => {

        p.template = template;
        if (p.onChangeTemplateCallback) {
          p.onChangeTemplateCallback(template);
        } 
     }, 1000
    )

    
  }
  protected render() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
  
    ReactDOM.render(
      <I18nContext.Provider value={this.getI18n()}>
        <FontContext.Provider value={this.getFont()}>
 
          <DesignerComponent
            template={this.template}
            bgSize={this.bgSize  ? this.bgSize : {width:1170, height:637}}
            specification = {this.specification }
            tonboSize={this.tonboSize ? this.tonboSize : {width:70, height:70}}
            horizontalGuidelines = {this.horizontalGuidelines}
            verticalGuidelines = {this.verticalGuidelines}
            onSaveTemplate={(template) => {
              this.template = template;
              if (this.onSaveTemplateCallback) {
                this.onSaveTemplateCallback(template);
              }
            }}
            onChangeTemplate={(template) => {
              //console.log("change")
              this.changeHandler(template)
            }}
            size={this.size}
          />
        </FontContext.Provider>
      </I18nContext.Provider>,
      this.domContainer
    );
  }
}

export default Designer;
