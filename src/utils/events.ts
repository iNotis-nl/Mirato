/**
 * Events and Event Handlers
 */
import {MODE_DEPARTMENT, MODE_GLOBAL, OfficeLayout} from '$utils/variables';
import {officeLayoutIn, toggleModeDepartments, toggleModeGlobal} from '$utils/inputs';
import {ucFirst} from "$utils/helpers";

/**
 * Setup events on 'fixed' items
 */
export const initEvents = () => {
  officeLayoutIn().value = 'LayoutBasic';
  officeLayoutIn().onchange = () => {
    if (officeLayoutIn().value === '') {
      officeLayoutIn().value = 'LayoutBasic';
    }
    // @ts-ignore
    window.Form.officeLayout = new OfficeLayout(ucFirst(officeLayoutIn().value));
  };
  // @ts-ignore
  if(window.Output.mode === MODE_GLOBAL) {
    toggleModeGlobal().click();
  } else {
    toggleModeDepartments().click();
  }

  toggleModeDepartments().onclick = () => {
    // @ts-ignore
    window.Output.mode = MODE_DEPARTMENT;
  }
  toggleModeGlobal().onclick = () => {
    // @ts-ignore
    window.Output.mode = MODE_GLOBAL;
  }
};

