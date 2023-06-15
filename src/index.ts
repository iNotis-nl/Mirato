import { initEvents } from '$utils/events';
import { initForm } from '$utils/formBuilder';
import { Output } from '$utils/output';
import { Form } from '$utils/form';

window.Webflow ||= [];
window.Output = new Output();
window.Form = new Form();
window.Webflow.push(() => {
  console.log('Mirato Tool Startup');
  initForm();
  initEvents();
});
