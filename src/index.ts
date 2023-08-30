import { initEvents } from '$utils/events';
import { initForm } from '$utils/formBuilder';
import { Output } from '$utils/output';
import { Form } from '$utils/form';

window.Webflow ||= [];
window.Form = new Form();
window.Output = new Output();
window.Webflow.push(():void => {
  console.log('Mirato Tool Startup');
  initForm();
  initEvents();
});
