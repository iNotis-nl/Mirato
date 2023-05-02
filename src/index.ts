/*import { greetUser } from '$utils/greet';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'John Doe';
  greetUser(name);
});*/

//Testing the script in here
const metrageEmployeesIn = document.getElementById('metrageEmployeesIn');
const metrageOccupancyIn = document.getElementById('metrageOccupancyIn');
const metrageGrowthIn = document.getElementById('metrageGrowthIn');
const metrageOfficesIn = document.getElementById('metrageOfficesIn');

metrageEmployeesIn.onkeyup = function () {
  document.getElementById('metrageWorkplacesOut').innerHTML = metrageEmployeesIn.value * 6;
  document.getElementById('metrageMeetingsOut').innerHTML = metrageEmployeesIn.value * 2.9;
  document.getElementById('metrageCallroomsOut').innerHTML = metrageEmployeesIn.value * 0.5;
  document.getElementById('metrageLandingzonesOut').innerHTML = metrageEmployeesIn.value * 1.5;
};

metrageOccupancyIn.onkeyup = function () {
  document.getElementById('metrageWorkplacesOut').innerHTML =
    metrageEmployeesIn.value * 6 * (metrageOccupancyIn.value / 100);
};

metrageGrowthIn.onkeyup = function () {
  document.getElementById('metrageWorkplacesOut').innerHTML =
    metrageEmployeesIn.value * 6 + (metrageEmployeesIn.value / 100) * metrageGrowthIn.value;
};

metrageOfficesIn.onkeyup = function () {
  document.getElementById('metrageOfficesOut').innerHTML = metrageOfficesIn.value * 6;
};

$(document).ready(function () {
  $('#metrageLunchIn').click(function () {
    document.getElementById('metrageLunchOut').innerHTML = numberOfWorkplaces.value * 3;
  });
});
