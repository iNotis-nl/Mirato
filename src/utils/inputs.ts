/**
 * List of all "Fixed" Inputs used in the tool
 * Every method here, returns the value of that tool
 */

export const officeLayoutIn = () => {
  return document.getElementById('metrageLayoutIn') as HTMLSelectElement;
};

export const getOfficeLayoutChoice = (): string => {
  let index: number = officeLayoutIn().options.selectedIndex;
  let option: HTMLOptionElement | null = officeLayoutIn().options.item(Math.max(1,index));
  return option?.innerText ?? '';
};

export const toggleModeDepartments = () => {
  return document.getElementById('metrage-tab-item-department') as HTMLAnchorElement;
};

export const toggleModeGlobal = () => {
  return document.getElementById('metrage-tab-item-global') as HTMLAnchorElement;
};