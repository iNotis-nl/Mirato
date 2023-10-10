import { initEvents } from '$utils/events';
import { initForm } from '$utils/formBuilder';
import { Output } from '$utils/output';
import { Form } from '$utils/form';
import {version} from '../package.json';


window.Webflow ||= [];
window.Form = new Form();
window.Output = new Output();
window.Webflow.push(():void => {
  console.log('Mirato Tool Startup ' + version);
  document.getElementsByTagName('h1')[0].dataset['version'] = version;
  initForm();
  initEvents();
});
