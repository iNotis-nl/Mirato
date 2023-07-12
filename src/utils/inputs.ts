/**
 * List of all "Fixed" Inputs used in the tool
 * Every method here, returns the value of that tool
 */

export const officeLayoutIn = () => {
  return document.getElementById('metrageLayoutIn') as HTMLInputElement;
};

export const toggleModeDepartments = () => {
  return document.getElementById('metrage-tab-item-department') as HTMLAnchorElement;
};

export const toggleModeGlobal = () => {
  return document.getElementById('metrage-tab-item-global') as HTMLAnchorElement;
};